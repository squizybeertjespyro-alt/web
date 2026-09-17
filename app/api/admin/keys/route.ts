import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// In-memory rate limiter — tracks failed attempts per IP
const failedAttempts = new Map<string, { count: number; lockedUntil: number }>();

function getIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function checkRateLimit(ip: string): { blocked: boolean; minutesLeft: number } {
  const record = failedAttempts.get(ip);
  if (!record) return { blocked: false, minutesLeft: 0 };

  if (record.lockedUntil > Date.now()) {
    const minutesLeft = Math.ceil((record.lockedUntil - Date.now()) / 60000);
    return { blocked: true, minutesLeft };
  }

  return { blocked: false, minutesLeft: 0 };
}

function recordFailure(ip: string) {
  const record = failedAttempts.get(ip) ?? { count: 0, lockedUntil: 0 };
  record.count += 1;

  if (record.count >= 3) {
    // Lock for 1 hour after 3 failed attempts
    record.lockedUntil = Date.now() + 60 * 60 * 1000;
    record.count = 0;
  }

  failedAttempts.set(ip, record);
}

function clearFailures(ip: string) {
  failedAttempts.delete(ip);
}

export async function GET(req: NextRequest) {
  const ip = getIP(req);
  const { blocked, minutesLeft } = checkRateLimit(ip);

  if (blocked) {
    return NextResponse.json(
      { error: `Too many failed attempts. Try again in ${minutesLeft} minute${minutesLeft !== 1 ? "s" : ""}.` },
      { status: 429 }
    );
  }

  const adminKey = req.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_SECRET) {
    recordFailure(ip);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  clearFailures(ip);

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const optionName = searchParams.get("optionName");

  const where: { productId?: string; optionName?: string; used: boolean } = { used: false };
  if (productId) where.productId = productId;
  if (optionName) where.optionName = optionName;

  const counts = await prisma.licenseKey.groupBy({
    by: ["productId", "optionName"],
    where: { used: false },
    _count: { key: true },
  });

  return NextResponse.json({ stock: counts });
}

export async function POST(req: NextRequest) {
  const ip = getIP(req);
  const { blocked, minutesLeft } = checkRateLimit(ip);

  if (blocked) {
    return NextResponse.json(
      { error: `Too many failed attempts. Try again in ${minutesLeft} minute${minutesLeft !== 1 ? "s" : ""}.` },
      { status: 429 }
    );
  }

  const adminKey = req.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_SECRET) {
    recordFailure(ip);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  clearFailures(ip);

  const { productId, optionName, keys } = await req.json();

  if (!productId || !optionName || !keys?.length) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  let added = 0;
  let skipped = 0;

  for (const key of keys) {
    const trimmed = key.trim();
    if (!trimmed) continue;
    try {
      await prisma.licenseKey.create({
        data: { productId, optionName, key: trimmed },
      });
      added++;
    } catch {
      skipped++;
    }
  }

  return NextResponse.json({ added, skipped });
}