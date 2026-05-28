export async function createPayment({
  price,
  orderId,
}: {
  price: number;
  orderId: string;
}) {
  const res = await fetch("https://api.nowpayments.io/v1/invoice", {
    method: "POST",
    headers: {
      "x-api-key": process.env.NOWPAYMENTS_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      price_amount: price,
      price_currency: "usd",
      order_id: orderId,
      ipn_callback_url:
        "https://hardduckmarket.xyz/api/webhooks/nowpayments",
      success_url: "https://hardduckmarket.xyz/order-success",
      cancel_url: "https://hardduckmarket.xyz/cart",
    }),
  });

  const data = await res.json();
  return data;
}