{/* Payment */}
<div className="rounded-xl border border-border bg-card p-6">
  <h2 className="mb-4 text-base font-semibold">Payment</h2>

  <div className="grid gap-3 md:grid-cols-2">

    {/* Crypto */}
    <div className="flex items-center gap-3 rounded-lg border border-primary bg-primary/10 p-4">
      <Bitcoin className="h-5 w-5 text-primary" />
      <div>
        <p className="text-sm font-medium">Crypto</p>
        <p className="text-xs text-muted-foreground">
          BTC, ETH, USDT, LTC and more via NOWPayments
        </p>
      </div>
    </div>

    {/* PayPal */}
    <button
      type="button"
      onClick={() =>
        window.open(
          "https://discord.com/sTvRtUZBxR",
          "_blank"
        )
      }
      className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-left transition hover:border-primary"
    >
      <div className="flex h-5 w-5 items-center justify-center font-bold">
        💳
      </div>
      <div>
        <p className="text-sm font-medium">PayPal</p>
        <p className="text-xs text-muted-foreground">
          Create ticket in Discord
        </p>
      </div>
    </button>

  </div>

  <p className="mt-3 text-xs text-muted-foreground">
    You'll be redirected to NOWPayments to complete your payment securely.
  </p>
</div>