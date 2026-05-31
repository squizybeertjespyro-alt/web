"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, LogOut, User } from "lucide-react";
import { siteConfig } from "@/config/site";

interface OrderItem {
  id: string;
  productName: string;
  optionName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  status: string;
  total: number;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
}

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetch("/api/orders")
        .then((r) => r.json())
        .then((d) => setOrders(d.orders ?? []))
        .finally(() => setOrdersLoading(false));
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex items-center justify-center py-32">
          <p className="text-muted-foreground">Loading…</p>
        </main>
        <Footer />
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    paid: "bg-green-500/20 text-green-400",
    pending: "bg-yellow-500/20 text-yellow-400",
    failed: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Account</h1>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* User info */}
        <div className="mb-8 flex items-center gap-4 rounded-xl border border-border bg-card p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold">{user.name ?? "Customer"}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {/* Orders */}
        <h2 className="mb-4 text-lg font-semibold">Order History</h2>

        {ordersLoading ? (
          <p className="text-muted-foreground text-sm">Loading orders…</p>
        ) : orders.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-10 text-center">
            <Package className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
            <p className="mb-4 text-muted-foreground">You haven't placed any orders yet.</p>
            <Button asChild><Link href="/shop">Browse Shop</Link></Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-xl border border-border bg-card p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="font-mono text-sm font-semibold">
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                      {order.paymentMethod === "stripe" ? "Card" : "Crypto"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium capitalize ${
                        statusColors[order.status] ?? "bg-muted text-muted-foreground"
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="font-semibold text-primary">
                      {siteConfig.currency}{order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  {order.items.map((item) => (
                    <p key={item.id} className="text-sm text-muted-foreground">
                      {item.productName} — {item.optionName} × {item.quantity}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
