import { Suspense } from "react";
import OrderSuccessContent from "./content";

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <OrderSuccessContent />
    </Suspense>
  );
}