"use client";

import { useMemo, useState } from "react";
import { useWallet, useTipHistory, formatUSDC, type SoroTipClient } from "@sorotip/sdk";
import { sorotipClient } from "@/lib/sorotip";
import ContractNotConfigured from "@/components/ContractNotConfigured";
import TipFeed from "@/components/TipFeed";

type Tab = "sent" | "received";

function HistoryContent({ client, wallet }: { client: SoroTipClient; wallet: string }) {
  const [tab, setTab] = useState<Tab>("received");
  const { tips, isLoading } = useTipHistory(client, wallet, 50);

  const sent = useMemo(() => tips?.filter((t) => t.from === wallet) ?? [], [tips, wallet]);
  const received = useMemo(() => tips?.filter((t) => t.to === wallet) ?? [], [tips, wallet]);

  const totalSent = useMemo(() => sent.reduce((sum, t) => sum + BigInt(t.amount), 0n), [sent]);
  const totalReceived = useMemo(() => received.reduce((sum, t) => sum + BigInt(t.amount), 0n), [received]);

  const visible = tab === "sent" ? sent : received;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/10 bg-tip-card p-4 text-center">
          <p className="text-lg font-bold text-white">{formatUSDC(totalSent)}</p>
          <p className="text-xs text-stone-400">Total sent</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-tip-card p-4 text-center">
          <p className="text-lg font-bold text-white">{formatUSDC(totalReceived)}</p>
          <p className="text-xs text-stone-400">Total received</p>
        </div>
      </div>

      <div className="flex rounded-full bg-black/30 p-1 text-sm">
        <button
          type="button"
          onClick={() => setTab("received")}
          className={`flex-1 rounded-full py-1.5 font-medium transition ${
            tab === "received" ? "bg-tip-orange text-black" : "text-stone-400"
          }`}
        >
          Received
        </button>
        <button
          type="button"
          onClick={() => setTab("sent")}
          className={`flex-1 rounded-full py-1.5 font-medium transition ${
            tab === "sent" ? "bg-tip-orange text-black" : "text-stone-400"
          }`}
        >
          Sent
        </button>
      </div>

      <TipFeed tips={isLoading ? undefined : visible} isLoading={isLoading} />
    </div>
  );
}

function HistoryGate({ client }: { client: SoroTipClient }) {
  const { publicKey, isConnected, connect } = useWallet();

  if (!isConnected || !publicKey) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-white">Connect your wallet</h1>
        <p className="text-sm text-stone-400">Connect Freighter to view your tip history.</p>
        <button
          type="button"
          onClick={() => void connect()}
          className="rounded-full bg-tip-orange px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-tip-orange/90"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return <HistoryContent client={client} wallet={publicKey} />;
}

export default function HistoryPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-center text-2xl font-bold text-white">Your tip history</h1>
      {sorotipClient ? <HistoryGate client={sorotipClient} /> : <ContractNotConfigured />}
    </div>
  );
}
