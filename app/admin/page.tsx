"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { products } from "@/config/products";

interface StockItem {
  productId: string;
  optionName: string;
  _count: { key: number };
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id ?? "");
  const [selectedOption, setSelectedOption] = useState(products[0]?.options[0]?.name ?? "");
  const [keysInput, setKeysInput] = useState("");
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [testOrderId, setTestOrderId] = useState("");
  const [testLoading, setTestLoading] = useState(false);
  const [testMessage, setTestMessage] = useState("");

  const currentProduct = products.find((p) => p.id === selectedProduct);

  const fetchStock = async (key: string) => {
    const res = await fetch("/api/admin/keys", {
      headers: { "x-admin-key": key },
    });
    if (res.ok) {
      const data = await res.json();
      setStock(data.stock);
    }
  };

  const handleAuth = async () => {
    const res = await fetch("/api/admin/keys", {
      headers: { "x-admin-key": adminKey },
    });
    if (res.ok) {
      setAuthed(true);
      const data = await res.json();
      setStock(data.stock);
    } else {
      setMessage("❌ Wrong admin key");
    }
  };

  const handleAddKeys = async () => {
    const keys = keysInput.split("\n").map((k) => k.trim()).filter(Boolean);
    if (!keys.length) { setMessage("No keys entered"); return; }

    setLoading(true);
    setMessage("");
    const res = await fetch("/api/admin/keys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey,
      },
      body: JSON.stringify({ productId: selectedProduct, optionName: selectedOption, keys }),
    });
    const data = await res.json();
    setMessage(`✅ Added ${data.added} keys, skipped ${data.skipped} duplicates`);
    setKeysInput("");
    fetchStock(adminKey);
    setLoading(false);
  };

  const handleTestFulfill = async () => {
    if (!testOrderId.trim()) { setTestMessage("❌ Enter an order ID"); return; }
    setTestLoading(true);
    setTestMessage("");
    const res = await fetch("/api/admin/fulfill", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey,
      },
      body: JSON.stringify({ orderId: testOrderId.trim() }),
    });
    const data = await res.json();
    if (res.ok) {
      setTestMessage(`✅ Order fulfilled! Email sent to ${data.email}`);
      fetchStock(adminKey);
    } else {
      setTestMessage(`❌ ${data.error}`);
    }
    setTestLoading(false);
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="cyber-card w-full max-w-sm space-y-4 p-8">
          <h1 className="text-xl font-bold text-center">Admin Access</h1>
          <div className="space-y-2">
            <Label>Admin Key</Label>
            <Input
              type="password"
              placeholder="Enter admin key"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAuth()}
            />
          </div>
          {message && <p className="text-sm text-destructive">{message}</p>}
          <Button className="w-full" onClick={handleAuth}>Enter</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl font-bold">🔑 License Key Manager</h1>

        {/* Stock overview */}
        <div className="cyber-card">
          <h2 className="mb-4 text-lg font-semibold">Current Stock</h2>
          {stock.length === 0 ? (
            <p className="text-sm text-muted-foreground">No keys in stock yet.</p>
          ) : (
            <div className="space-y-2">
              {stock.map((item) => (
                <div key={`${item.productId}-${item.optionName}`}
                  className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                  <span className="text-muted-foreground">
                    {products.find((p) => p.id === item.productId)?.name ?? item.productId}
                    {" — "}{item.optionName}
                  </span>
                  <span className={`font-bold ${item._count.key < 5 ? "text-red-400" : "text-green-400"}`}>
                    {item._count.key} keys left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Manual fulfill */}
        <div className="cyber-card space-y-4">
          <h2 className="text-lg font-semibold">🧪 Manual Fulfillment</h2>
          <p className="text-sm text-muted-foreground">
            Manually fulfill an order — assigns keys and sends the email instantly. Use this to test without waiting for a real payment, or to manually process an order.
          </p>
          <div className="space-y-2">
            <Label>Order ID</Label>
            <Input
              placeholder="e.g. cmpq186i100013s3s1zvmdvt5"
              value={testOrderId}
              onChange={(e) => setTestOrderId(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Find order IDs in Vercel logs or on the order confirmed page (the part after #).
            </p>
          </div>
          {testMessage && (
            <p className="text-sm font-medium" style={{ color: testMessage.startsWith("✅") ? "#4ade80" : "#f87171" }}>
              {testMessage}
            </p>
          )}
          <Button onClick={handleTestFulfill} disabled={testLoading} variant="outline" className="w-full">
            {testLoading ? "Fulfilling..." : "Fulfill Order & Send Email"}
          </Button>
        </div>

        {/* Add keys */}
        <div className="cyber-card space-y-4">
          <h2 className="text-lg font-semibold">Add Keys</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Product</Label>
              <select
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
                value={selectedProduct}
                onChange={(e) => {
                  setSelectedProduct(e.target.value);
                  const p = products.find((p) => p.id === e.target.value);
                  setSelectedOption(p?.options[0]?.name ?? "");
                }}
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Option</Label>
              <select
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                {currentProduct?.options.map((o) => (
                  <option key={o.name} value={o.name}>{o.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Keys (one per line)</Label>
            <textarea
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground font-mono min-h-[150px]"
              placeholder={"XXXX-XXXX-XXXX-XXXX\nYYYY-YYYY-YYYY-YYYY\nZZZZ-ZZZZ-ZZZZ-ZZZZ"}
              value={keysInput}
              onChange={(e) => setKeysInput(e.target.value)}
            />
          </div>
          {message && <p className="text-sm text-green-400">{message}</p>}
          <Button onClick={handleAddKeys} disabled={loading} className="w-full">
            {loading ? "Adding..." : "Add Keys"}
          </Button>
        </div>
      </div>
    </div>
  );
}