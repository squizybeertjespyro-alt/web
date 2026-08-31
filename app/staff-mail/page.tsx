"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FROM_EMAILS = [
  { value: "orders", label: "orders@hardduckmarket.xyz" },
  { value: "support", label: "support@hardduckmarket.xyz" },
  { value: "noreply", label: "noreply@hardduckmarket.xyz" },
  { value: "owner", label: "owner@hardduckmarket.xyz" },
  { value: "marketing", label: "marketing@hardduckmarket.xyz" },
];

export default function StaffMailPage() {
  const [staffKey, setStaffKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");

  const [broadcastTo, setBroadcastTo] = useState("");
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastFrom, setBroadcastFrom] = useState("marketing");
  const [broadcastLoading, setBroadcastLoading] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState("");

  const handleAuth = async () => {
    // Test the staff key against the broadcast endpoint
    const res = await fetch("/api/admin/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": staffKey },
      body: JSON.stringify({ to: "test@test.com", subject: "test", message: "test", fromAlias: "marketing" }),
    });
    // 401 = wrong key, anything else = key works
    if (res.status !== 401) {
      setAuthed(true);
    } else {
      setAuthError("❌ Wrong staff key");
    }
  };

  const handleBroadcast = async () => {
    if (!broadcastTo.trim() || !broadcastSubject.trim() || !broadcastMessage.trim()) {
      setBroadcastResult("❌ Fill in all fields");
      return;
    }
    setBroadcastLoading(true);
    setBroadcastResult("");
    const res = await fetch("/api/admin/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": staffKey },
      body: JSON.stringify({
        to: broadcastTo,
        subject: broadcastSubject,
        message: broadcastMessage,
        fromAlias: broadcastFrom,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setBroadcastResult(`✅ Sent ${data.sent} emails${data.failed > 0 ? `, ${data.failed} failed` : ""}`);
      setBroadcastTo("");
      setBroadcastSubject("");
      setBroadcastMessage("");
    } else {
      setBroadcastResult(`❌ ${data.error}`);
    }
    setBroadcastLoading(false);
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="cyber-card w-full max-w-sm space-y-4 p-8">
          <h1 className="text-xl font-bold text-center">📧 Staff Mail</h1>
          <p className="text-sm text-muted-foreground text-center">Enter your staff key to access</p>
          <div className="space-y-2">
            <Label>Staff Key</Label>
            <Input
              type="password"
              placeholder="Enter staff key"
              value={staffKey}
              onChange={(e) => setStaffKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAuth()}
            />
          </div>
          {authError && <p className="text-sm text-destructive">{authError}</p>}
          <Button className="w-full" onClick={handleAuth}>Enter</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold">📧 Staff Mailing</h1>
        <p className="text-sm text-muted-foreground">Send promotional or announcement emails to customers.</p>

        <div className="cyber-card space-y-5">
          <div className="space-y-2">
            <Label>Send from</Label>
            <select
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
              value={broadcastFrom}
              onChange={(e) => setBroadcastFrom(e.target.value)}
            >
              {FROM_EMAILS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Recipients (one per line)</Label>
            <textarea
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground font-mono min-h-[120px]"
              placeholder={"customer1@example.com\ncustomer2@example.com"}
              value={broadcastTo}
              onChange={(e) => setBroadcastTo(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Subject</Label>
            <Input
              placeholder="e.g. 🔥 New products just dropped!"
              value={broadcastSubject}
              onChange={(e) => setBroadcastSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Message</Label>
            <textarea
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground min-h-[200px]"
              placeholder="Write your message here..."
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
            />
          </div>

          {broadcastResult && (
            <p className="text-sm font-medium" style={{ color: broadcastResult.startsWith("✅") ? "#4ade80" : "#f87171" }}>
              {broadcastResult}
            </p>
          )}

          <Button onClick={handleBroadcast} disabled={broadcastLoading} className="w-full" size="lg">
            {broadcastLoading ? "Sending..." : "Send Email"}
          </Button>
        </div>
      </div>
    </div>
  );
}
