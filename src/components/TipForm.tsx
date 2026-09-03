"use client";

import { useState } from "react";
import { useWallet, type SoroTipClient } from "@sorotip/sdk";

const PRESET_AMOUNTS = ["1", "5", "10", "25"];

interface TipFormProps {
  client: SoroTipClient;
  recipient: string;
  onSuccess?: (result: { txHash: string }) => void;
}

/** Amount selector + message input for tipping (one-time or monthly) a creator. */
export default function TipForm({ client, recipient, onSuccess }: TipFormProps) {
  const { isConnected, connect } = useWallet();
  const [amount, setAmount] = useState("5");
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [message, setMessage] = useState("");
  const [isMonthly, setIsMonthly] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState(false);

  const effectiveAmount = isCustom ? customAmount : amount;

  const handleSubmit = async () => {
    setError(undefined);
    setSuccess(false);

    const numeric = Number(effectiveAmount);
    if (!effectiveAmount || Number.isNaN(numeric) || numeric <= 0) {
      setError("Enter a valid amount greater than 0.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (!isConnected) {
        await connect();
      }
      const result = isMonthly
        ? await client.subscribe({ to: recipient, amountPerMonth: effectiveAmount })
        : await client.tip({ to: recipient, amount: effectiveAmount, messageIpfs: message });
      setSuccess(true);
      onSuccess?.(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-tip-card p-5">
      <div className="flex rounded-full bg-black/30 p-1 text-sm">
        <button
          type="button"
          onClick={() => setIsMonthly(false)}
          className={`flex-1 rounded-full py-1.5 font-medium transition ${
            !isMonthly ? "bg-tip-orange text-black" : "text-stone-400"
          }`}
        >
          One-time
        </button>
        <button
          type="button"
          onClick={() => setIsMonthly(true)}
          className={`flex-1 rounded-full py-1.5 font-medium transition ${
            isMonthly ? "bg-tip-orange text-black" : "text-stone-400"
          }`}
        >
          Monthly
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {PRESET_AMOUNTS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => {
              setAmount(preset);
              setIsCustom(false);
            }}
            className={`rounded-lg border py-2 text-sm font-semibold transition ${
              !isCustom && amount === preset
                ? "border-tip-orange bg-tip-orange/10 text-tip-orange"
                : "border-white/10 text-stone-300 hover:border-white/30"
            }`}
          >
            ${preset}
          </button>
        ))}
      </div>

      <input
        type="number"
        min="0"
        step="0.01"
        placeholder="Custom amount"
        value={customAmount}
        onFocus={() => setIsCustom(true)}
        onChange={(e) => {
          setCustomAmount(e.target.value);
          setIsCustom(true);
        }}
        className={`w-full rounded-lg border bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-stone-500 ${
          isCustom ? "border-tip-orange" : "border-white/10"
        }`}
      />

      <textarea
        placeholder="Add a message (optional)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={2}
        className="w-full resize-none rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-stone-500"
      />

      <button
        type="button"
        onClick={() => void handleSubmit()}
        disabled={isSubmitting}
        className="rounded-full bg-tip-orange py-2.5 text-sm font-semibold text-black transition hover:bg-tip-orange/90 disabled:opacity-50"
      >
        {isSubmitting ? "Processing…" : isMonthly ? `Subscribe $${effectiveAmount || "0"}/mo` : `Tip $${effectiveAmount || "0"}`}
      </button>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {success ? <p className="text-sm text-tip-gold">Sent! Thank you for supporting this creator.</p> : null}
    </div>
  );
}
