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

const FROM_EMAILS = [
  { value: "orders", label: "orders@hardduckmarket.xyz" },
  { value: "support", label: "support@hardduckmarket.xyz" },
  { value: "noreply", label: "noreply@hardduckmarket.xyz" },
  { value: "owner", label: "owner@hardduckmarket.xyz" },
  { value: "marketing", label: "marketing@hardduckmarket.xyz" },
];

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id ?? "");
  const [selectedOption, setSelectedOption] = useState(products[0]?.options[0]?.name ?? "");
  const [keysInput, setKeysInput] = useState("");
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [fulfillOrderId, setFulfillOrderId] = useState("");
  const [fulfillLoading, setFulfillLoading] = useState(false);
  const [fulfillMessage, setFulfillMessage] = useState("");

  const [testEmail, setTestEmail] = useState("");
  const [testProduct, setTestProduct] = useState(products[0]?.id ?? "");
  const [testOption, setTestOption] = useState(products[0]?.options[0]?.name ?? "");
  const [testLoading, setTestLoading] = useState(false);
  const [testMessage, setTestMessage] = useState("");

  const [broadcastTo, setBroadcastTo] = useState("");
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastFrom, setBroadcastFrom] = useState("marketing");
  const [broadcastLoading, setBroadcastLoading] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState("");

  const currentProduct = products.find((p) => p.id === selectedProduct);
  const currentTestProduct = products.find((p) => p.id === testProduct);

  const fetchStock = async (key: string) => {
    const res = await fetch("/api/admin/keys", { headers: { "x-admin-key": key } });
    if (res.ok) { const data = await res.json(); setStock(data.stock); }
  };

  const handleAuth = async () => {
    const res = await fetch("/api/admin/keys", { headers: { "x-admin-key": adminKey } });
    if (res.ok) { setAuthed(true); const data = await res.json(); setStock(data.stock); }
    else setMessage("❌ Wrong admin key");
  };

  const handleAddKeys = async () => {
    const keys = keysInput.split("\n").map((k) => k.trim()).filter(Boolean);
    if (!keys.length) { setMessage("No keys entered"); return; }
    setLoading(true); setMessage("");
    const res = await fetch("/api/admin/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({ productId: selectedProduct, optionName: selectedOption, keys }),
    });
    const data = await res.json();
    setMessage(`✅ Added ${data.added} keys, skipped ${data.skipped} duplicates`);
    setKeysInput(""); fetchStock(adminKey); setLoading(false);
  };

  const handleFulfill = async () => {
    if (!fulfillOrderId.trim()) { setFulfillMessage("❌ Enter an order ID"); return; }
    setFulfillLoading(true); setFulfillMessage("");
    const res = await fetch("/api/admin/fulfill", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({ orderId: fulfillOrderId.trim() }),
    });
    const data = await res.json();
    if (res.ok) { setFulfillMessage(`✅ Done! Email sent to ${data.email}`); fetchStock(adminKey); }
    else setFulfillMessage(`❌ ${data.error}`);
    setFulfillLoading(false);
  };

  const handleTestOrder = async () => {
    if (!testEmail.trim()) { setTestMessage("❌ Enter an email"); return; }
    setTestLoading(true); setTestMessage("");
    const orderRes = await fetch("/api/admin/test-order", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({ productId: testProduct, optionName: testOption, email: testEmail }),
    });
    const orderData = await orderRes.json();
    if (!orderRes.ok) { setTestMessage(`❌ ${orderData.error}`); setTestLoading(false); return; }
    const fulfillRes = await fetch("/api/admin/fulfill", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({ orderId: orderData.orderId }),
    });
    const fulfillData = await fulfillRes.json();
    if (fulfillRes.ok) { setTestMessage(`✅ Test email sent to ${testEmail}!`); fetchStock(adminKey); }
    else setTestMessage(`❌ ${fulfillData.error}`);
    setTestLoading(false);
  };

  const handleBroadcast = async () => {
    if (!broadcastTo.trim() || !broadcastSubject.trim() || !broadcastMessage.trim()) {
      setBroadcastResult("❌ Fill in all fields"); return;
    }
    setBroadcastLoading(true); setBroadcastResult("");
    const res = await fetch("/api/admin/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({ to: broadcastTo, subject: broadcastSubject, message: broadcastMessage, fromAlias: broadcastFrom }),
    });
    const data = await res.json();
    if (res.ok) setBroadcastResult(`✅ Sent ${data.sent} emails${data.failed > 0 ? `, ${data.failed} failed` : ""}`);
    else setBroadcastResult(`❌ ${data.error}`);
    setBroadcastLoading(false);
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="cyber-card w-full max-w-sm space-y-4 p-8">
          <h1 className="text-xl font-bold text-center">Admin Access</h1>
          <div className="space-y-2">
            <Label>Admin Key</Label>
            <Input type="password" placeholder="Enter admin key" value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAuth()} />
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
        <h1 className="text-2xl font-bold"> License Key Manager</h1>

        {/* Stock */}
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
                    {products.find((p) => p.id === item.productId)?.name ?? item.productId} — {item.optionName}
                  </span>
                  <span className={`font-bold ${item._count.key < 5 ? "text-red-400" : "text-green-400"}`}>
                    {item._count.key} keys left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Test email */}
        <div className="cyber-card space-y-4" style={{ border: "1px solid rgba(160,0,255,0.5)" }}>
          <h2 className="text-lg font-semibold"> Send Test Email (Free)</h2>
          <p className="text-sm text-muted-foreground">Creates a fake order and sends the email with a key instantly — no payment needed.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Product</Label>
              <select className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
                value={testProduct} onChange={(e) => { setTestProduct(e.target.value); const p = products.find((p) => p.id === e.target.value); setTestOption(p?.options[0]?.name ?? ""); }}>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Option</Label>
              <select className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
                value={testOption} onChange={(e) => setTestOption(e.target.value)}>
                {currentTestProduct?.options.map((o) => <option key={o.name} value={o.name}>{o.name}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Send test email to</Label>
            <Input type="email" placeholder="your@email.com" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} />
          </div>
          {testMessage && <p className="text-sm font-medium" style={{ color: testMessage.startsWith("✅") ? "#4ade80" : "#f87171" }}>{testMessage}</p>}
          <Button onClick={handleTestOrder} disabled={testLoading} className="w-full">
            {testLoading ? "Sending..." : "Send Test Email"}
          </Button>
        </div>

        {/* Manual fulfill */}
        <div className="cyber-card space-y-4">
          <h2 className="text-lg font-semibold"> Manually Fulfill Real Order</h2>
          <p className="text-sm text-muted-foreground">If a customer paid but didn't get their email, paste their order ID here to resend it.</p>
          <div className="space-y-2">
            <Label>Order ID</Label>
            <Input placeholder="e.g. cmpq186i100013s3s1zvmdvt5" value={fulfillOrderId} onChange={(e) => setFulfillOrderId(e.target.value)} />
          </div>
          {fulfillMessage && <p className="text-sm font-medium" style={{ color: fulfillMessage.startsWith("✅") ? "#4ade80" : "#f87171" }}>{fulfillMessage}</p>}
          <Button onClick={handleFulfill} disabled={fulfillLoading} variant="outline" className="w-full">
            {fulfillLoading ? "Fulfilling..." : "Fulfill & Send Email"}
          </Button>
        </div>

        {/* Broadcast */}
        <div className="cyber-card space-y-4" style={{ border: "1px solid rgba(160,0,255,0.5)" }}>
          <h2 className="text-lg font-semibold"> Send Broadcast Email</h2>
          <p className="text-sm text-muted-foreground">Send a promotional or announcement email. One email address per line.</p>
          <div className="space-y-2">
            <Label>Send from</Label>
            <select className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
              value={broadcastFrom} onChange={(e) => setBroadcastFrom(e.target.value)}>
              {FROM_EMAILS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Recipients (one per line)</Label>
            <textarea
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground font-mono min-h-[100px]"
              placeholder={"customer1@example.com\ncustomer2@example.com"}
              value={broadcastTo} onChange={(e) => setBroadcastTo(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Subject</Label>
            <Input placeholder="for example: New products just dropped!" value={broadcastSubject} onChange={(e) => setBroadcastSubject(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Message</Label>
            <textarea
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground min-h-[150px]"
              placeholder="Write your message here..."
              value={broadcastMessage} onChange={(e) => setBroadcastMessage(e.target.value)} />
          </div>
          {broadcastResult && <p className="text-sm font-medium" style={{ color: broadcastResult.startsWith("✅") ? "#4ade80" : "#f87171" }}>{broadcastResult}</p>}
          <Button onClick={handleBroadcast} disabled={broadcastLoading} className="w-full">
            {broadcastLoading ? "Sending..." : "Send Email"}
          </Button>
        </div>

        {/* Add keys */}
        <div className="cyber-card space-y-4">
          <h2 className="text-lg font-semibold">Add Keys</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Product</Label>
              <select className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
                value={selectedProduct} onChange={(e) => { setSelectedProduct(e.target.value); const p = products.find((p) => p.id === e.target.value); setSelectedOption(p?.options[0]?.name ?? ""); }}>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Option</Label>
              <select className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
                value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                {currentProduct?.options.map((o) => <option key={o.name} value={o.name}>{o.name}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Keys (one per line)</Label>
            <textarea
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground font-mono min-h-[150px]"
              placeholder={"XXXX-XXXX-XXXX-XXXX\nYYYY-YYYY-YYYY-YYYY"}
              value={keysInput} onChange={(e) => setKeysInput(e.target.value)} />
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