export async function sendOrderNotification({
  orderId,
  customerEmail,
  items,
  total,
  currency = "$",
}: {
  orderId: string;
  customerEmail: string;
  items: { productName: string; optionName: string; quantity: number; price: number }[];
  total: number;
  currency?: string;
}) {
  const webhookUrl = process.env.DISCORD_ORDER_WEBHOOK;
  if (!webhookUrl) return;

  const itemLines = items
    .map((i) => `• ${i.productName} (${i.optionName}) x${i.quantity} — ${currency}${(i.price * i.quantity).toFixed(2)}`)
    .join("\n");

  const embed = {
    title: "🛒 New Order!",
    color: 0x7a1fff,
    fields: [
      { name: "Order ID", value: `#${orderId.slice(-8).toUpperCase()}`, inline: true },
      { name: "Customer", value: customerEmail, inline: true },
      { name: "Total", value: `${currency}${total.toFixed(2)}`, inline: true },
      { name: "Items", value: itemLines },
    ],
    timestamp: new Date().toISOString(),
    footer: { text: "HardDuckMarket" },
  };

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ embeds: [embed] }),
  });
}