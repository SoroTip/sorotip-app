"use client";

import { useState } from "react";
import { formatSubscriptionAmount, truncateAddress, type Subscription } from "@sorotip/sdk";

interface SubscriptionCardProps {
  subscription: Subscription;
  /** Which address to display as the "counterparty" — the other side of the subscription. */
  counterparty: "supporter" | "creator";
  onCancel?: (subscriptionId: string) => Promise<void>;
}

/** A single subscription's details, with an optional cancel action. */
export default function SubscriptionCard({ subscription, counterparty, onCancel }: SubscriptionCardProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const address = counterparty === "supporter" ? subscription.supporter : subscription.creator;

  const handleCancel = async () => {
    if (!onCancel) return;
    setError(undefined);
    setIsCancelling(true);
    try {
      await onCancel(subscription.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel subscription.");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-white/5 bg-tip-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-mono text-sm text-white">{truncateAddress(address)}</p>
        <p className="text-xs text-stone-500">
          {formatSubscriptionAmount(subscription.amountPerMonth)} · next charge{" "}
          {subscription.nextChargeDate.toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {subscription.active ? (
          <span className="rounded-full bg-tip-gold/20 px-2 py-0.5 text-xs font-medium text-tip-gold">Active</span>
        ) : (
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-stone-400">Cancelled</span>
        )}
        {onCancel && subscription.active ? (
          <button
            type="button"
            onClick={() => void handleCancel()}
            disabled={isCancelling}
            className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-stone-300 transition hover:border-red-400/50 hover:text-red-400 disabled:opacity-50"
          >
            {isCancelling ? "Cancelling…" : "Cancel"}
          </button>
        ) : null}
      </div>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
