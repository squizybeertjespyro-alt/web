import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { siteConfig } from "@/config/site";

const resend = new Resend(process.env.RESEND_API_KEY ?? "placeholder");

const ALLOWED_FROM_EMAILS = [
  "co-owner",
  "orders",
  "support",
  "noreply",
  "owner",
  "marketing",
];

export async function POST(req: NextRequest) {
  const adminKey = req.headers.get("x-admin-key");
  
  // Accept either ADMIN_SECRET or STAFF_SECRET
  const isAdmin = adminKey === process.env.ADMIN_SECRET;
  const isStaff = adminKey === process.env.STAFF_SECRET;
  
  if (!isAdmin && !isStaff) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { to, subject, message, fromAlias } = await req.json();

  if (!to || !subject || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const alias = ALLOWED_FROM_EMAILS.includes(fromAlias) ? fromAlias : "orders";
  const domain = process.env.EMAIL_DOMAIN ?? "hardduckmarket.xyz";
  const fromEmail = `${siteConfig.name} <${alias}@${domain}>`;

  const emails = to.split("\n").map((e: string) => e.trim()).filter(Boolean);
  if (!emails.length) {
    return NextResponse.json({ error: "No valid emails" }, { status: 400 });
  }

  let sent = 0;
  let failed = 0;

  for (const email of emails) {
    try {
      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject,
        html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="margin:0; padding:0; background:#0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color:#fff;">
          <div style="max-width:560px; margin:40px auto; padding:0 20px;">
            <div style="margin-bottom:32px;">
              <h1 style="font-size:24px; font-weight:700; margin:0 0 4px;">
                ${siteConfig.name.slice(0, -6)}<span style="color:#b100ff;">${siteConfig.name.slice(-6)}</span>
              </h1>
              <p style="margin:0; color:#aaa; font-size:12px;">From: ${alias}@${domain}</p>
            </div>
            <div style="background:#111; border:1px solid #222; border-radius:12px; padding:32px; margin-bottom:24px;">
              <div style="font-size:15px; line-height:1.7; color:#ddd; white-space:pre-wrap;">${message}</div>
            </div>
            <p style="margin-top:32px; color:#555; font-size:12px; text-align:center;">
              ${siteConfig.name} · <a href="https://discord.gg/hardduckmarket" style="color:#aaa;">Discord</a>
            </p>
          </div>
        </body>
        </html>
        `,
      });
      sent++;
    } catch {
      failed++;
    }
  }

  return NextResponse.json({ sent, failed });
}
