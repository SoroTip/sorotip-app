"use client";

import { useState } from "react";
import { useWallet, truncateAddress } from "@sorotip/sdk";

/** Connect/disconnect button for the Freighter wallet, showing a truncated address once connected. */
export default function WalletConnect() {
  const { publicKey, connect, disconnect, isConnected } = useWallet();
  const [error, setError] = useState<string | undefined>(undefined);

  const handleConnect = () => {
    setError(undefined);
    connect().catch((err: unknown) => {
      setError(err instanceof Error ? err.message : "Failed to connect wallet.");
    });
  };

  if (isConnected && publicKey) {
    return (
      <button
        type="button"
        onClick={disconnect}
        className="rounded-full border border-white/10 bg-tip-card px-4 py-2 text-sm font-medium text-white transition hover:border-tip-orange/50"
        title="Disconnect wallet"
      >
        {truncateAddress(publicKey)}
      </button>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleConnect}
        className="rounded-full bg-tip-orange px-4 py-2 text-sm font-semibold text-black transition hover:bg-tip-orange/90"
      >
        Connect Wallet
      </button>
      {error ? <p className="max-w-[16rem] text-right text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
