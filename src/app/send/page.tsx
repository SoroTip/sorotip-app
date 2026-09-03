"use client";

import { useState } from "react";
import { sorotipClient } from "@/lib/sorotip";
import ContractNotConfigured from "@/components/ContractNotConfigured";

const STELLAR_ADDRESS_RE = /^G[A-Z2-7]{55}$/;

export default function SendPage() {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  if (!sorotipClient) {
    return <ContractNotConfigured />;
  }
  const client = sorotipClient;

  const addressValid = STELLAR_ADDRESS_RE.test(address.trim());
  const amountValid = Number(amount) > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setSuccess(undefined);

    if (!addressValid) {
      setError("Enter a valid Stellar address (starts with G, 56 characters).");
      return;
    }
    if (!amountValid) {
      setError("Enter a valid amount greater than 0.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { txHash } = await client.tip({ to: address.trim(), amount, messageIpfs: message });
      setSuccess(`Tip sent! Transaction: ${txHash}`);
      setAmount("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send tip.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-center text-2xl font-bold text-white">Send a quick tip</h1>
      <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-tip-card p-5">
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-400" htmlFor="send-address">
            Stellar address
          </label>
          <input
            id="send-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="G..."
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 font-mono text-sm text-white outline-none placeholder:text-stone-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-400" htmlFor="send-amount">
            Amount (USDC)
          </label>
          <input
            id="send-amount"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="5.00"
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-stone-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-400" htmlFor="send-message">
            Message (optional)
          </label>
          <textarea
            id="send-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-stone-500"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-tip-orange py-2.5 text-sm font-semibold text-black transition hover:bg-tip-orange/90 disabled:opacity-50"
        >
          {isSubmitting ? "Sending…" : "Send Tip"}
        </button>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        {success ? <p className="break-all text-sm text-tip-gold">{success}</p> : null}
      </form>
    </div>
  );
}
