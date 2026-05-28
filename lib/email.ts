import { Resend } from "resend";
import { siteConfig } from "@/config/site";

const resend = new Resend(process.env.RESEND_API_KEY ?? "placeholder");

interface OrderItem {
  productName: string;
  optionName: string;
  quantity: number;
  price: number;
}

interface SendOrderEmailParams {
  to: string;
  orderId: string;
  items: OrderItem[];
  total: number;
  productContent?: string; // the actual product delivered (key, link, etc.)
}

export async function sendOrderConfirmationEmail({
  to,
  orderId,
  items,
  total,
  productContent,
}: SendOrderEmailParams) {
  const itemRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #222;">${item.productName} — ${item.optionName}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #222; text-align:center;">${item.quantity}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #222; text-align:right;">${siteConfig.currency}${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    )
    .join("");

  const productSection = productContent
    ? `
    <div style="margin-top:32px; padding:24px; background:#111; border:1px solid #333; border-radius:8px;">
      <h2 style="margin:0 0 12px; font-size:16px; color:#fff;">Your Product</h2>
      <pre style="margin:0; font-family:monospace; color:#a3e635; white-space:pre-wrap; word-break:break-all;">${productContent}</pre>
    </div>`
    : `
    <div style="margin-top:32px; padding:24px; background:#111; border:1px solid #333; border-radius:8px;">
      <p style="margin:0; color:#aaa;">Your product will be sent to you shortly. If you have any questions, contact us on Discord.</p>
    </div>`;

  await resend.emails.send({
    from: `${siteConfig.name} <orders@${process.env.EMAIL_DOMAIN ?? "yourdomain.com"}>`,
    to,
    subject: `Order Confirmed — #${orderId.slice(-8).toUpperCase()}`,
    html: `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0; padding:0; background:#0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color:#fff;">
      <div style="max-width:560px; margin:40px auto; padding:0 20px;">
        
        <div style="margin-bottom:32px;">
          <h1 style="font-size:24px; font-weight:700; margin:0 0 4px;">${siteConfig.name}</h1>
          <p style="margin:0; color:#aaa; font-size:14px;">Order Confirmation</p>
        </div>

        <div style="background:#111; border:1px solid #222; border-radius:12px; padding:32px; margin-bottom:24px;">
          <h2 style="margin:0 0 8px; font-size:18px;">Thanks for your order! 🎉</h2>
          <p style="margin:0; color:#aaa; font-size:14px;">Order ID: <span style="color:#fff; font-family:monospace;">#${orderId.slice(-8).toUpperCase()}</span></p>
        </div>

        <div style="background:#111; border:1px solid #222; border-radius:12px; padding:32px; margin-bottom:24px;">
          <h2 style="margin:0 0 20px; font-size:16px;">Order Summary</h2>
          <table style="width:100%; border-collapse:collapse; font-size:14px;">
            <thead>
              <tr style="color:#aaa; font-size:12px; text-transform:uppercase; letter-spacing:0.05em;">
                <th style="padding-bottom:12px; text-align:left; border-bottom:1px solid #333;">Product</th>
                <th style="padding-bottom:12px; text-align:center; border-bottom:1px solid #333;">Qty</th>
                <th style="padding-bottom:12px; text-align:right; border-bottom:1px solid #333;">Price</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
          </table>
          <div style="margin-top:16px; padding-top:16px; border-top:1px solid #333; display:flex; justify-content:space-between; font-size:16px; font-weight:700;">
            <span>Total</span>
            <span>${siteConfig.currency}${total.toFixed(2)}</span>
          </div>
        </div>

        ${productSection}

        <p style="margin-top:32px; color:#555; font-size:12px; text-align:center;">
          ${siteConfig.name} · Questions? Join our <a href="${siteConfig.socials.discord}" style="color:#aaa;">Discord</a>
        </p>
      </div>
    </body>
    </html>
    `,
  });
}
