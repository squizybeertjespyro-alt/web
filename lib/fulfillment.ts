import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { sendOrderNotification } from "@/lib/discord";

/**
 * Marks an order paid, hands out license keys and emails them.
 *
 * Safe to call any number of times for the same order (payment providers
 * retry and send several events): only the first call that flips the order to
 * "paid" assigns keys, and each key is claimed with an atomic update so two
 * orders can never receive the same key.
 */
export async function fulfillOrder(orderId: string, fallbackEmail?: string | null) {
  // Atomic claim: only one caller can move the order to "paid".
  const claimed = await prisma.order.updateMany({
    where: { id: orderId, status: { not: "paid" } },
    data: { status: "paid" },
  });

  if (claimed.count === 1) {
    const toAssign = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { licenseKeys: true } } },
    });

    for (const item of toAssign?.items ?? []) {
      const missing = item.quantity - item.licenseKeys.length;
      for (let i = 0; i < missing; i++) {
        for (let attempt = 0; attempt < 5; attempt++) {
          const candidate = await prisma.licenseKey.findFirst({
            where: { productId: item.productId, optionName: item.optionName, used: false },
          });
          if (!candidate) {
            console.error(`No keys available for ${item.productName} (${item.optionName})`);
            break;
          }
          // Atomic: succeeds only if nobody else took this key in the meantime.
          const taken = await prisma.licenseKey.updateMany({
            where: { id: candidate.id, used: false },
            data: { used: true, usedAt: new Date(), orderItemId: item.id },
          });
          if (taken.count === 1) break;
        }
      }
    }
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { licenseKeys: true } }, user: true },
  });
  if (!order) return;

  const customerEmail = order.guestEmail ?? order.user?.email ?? fallbackEmail ?? null;
  if (!customerEmail || order.emailSent) return;

  // Claim the email so duplicate webhook deliveries don't send it twice.
  const emailClaim = await prisma.order.updateMany({
    where: { id: orderId, emailSent: false },
    data: { emailSent: true },
  });
  if (emailClaim.count !== 1) return;

  const productContent = order.items
    .map((item) => {
      const keys = item.licenseKeys.map((k) => k.key);
      while (keys.length < item.quantity) {
        keys.push("NO KEY AVAILABLE - Contact support on Discord");
      }
      return `${item.productName} — ${item.optionName}:\n${keys.join("\n")}`;
    })
    .join("\n\n");

  try {
    await sendOrderConfirmationEmail({
      to: customerEmail,
      orderId: order.id,
      items: order.items,
      total: order.total,
      productContent,
    });
  } catch (err) {
    console.error("Email failed:", err);
    // Release the claim so the next webhook retry can try again.
    await prisma.order.update({ where: { id: orderId }, data: { emailSent: false } }).catch(() => {});
    return;
  }

  try {
    await sendOrderNotification({
      orderId: order.id,
      customerEmail,
      items: order.items,
      total: order.total,
    });
  } catch (err) {
    console.error("Discord notification failed:", err);
  }
}