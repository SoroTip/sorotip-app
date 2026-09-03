"use client";

import { useProtocolStats, formatUSDC, type SoroTipClient } from "@sorotip/sdk";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-6 py-4 text-center">
      <span className="text-2xl font-bold text-white sm:text-3xl">{value}</span>
      <span className="text-xs uppercase tracking-wide text-stone-400">{label}</span>
    </div>
  );
}

function StatSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-4">
      <div className="skeleton h-7 w-16" />
      <div className="skeleton h-3 w-20" />
    </div>
  );
}

/** Live, protocol-wide stats — total tips, volume, and creators. */
export default function StatsBar({ client }: { client: SoroTipClient }) {
  const { stats, isLoading, error } = useProtocolStats(client);

  if (error) {
    return <p className="text-center text-sm text-red-400">Couldn&apos;t load protocol stats.</p>;
  }

  return (
    <div className="flex flex-wrap items-center justify-center divide-x divide-white/10 rounded-2xl border border-white/10 bg-tip-card">
      {isLoading || !stats ? (
        <>
          <StatSkeleton />
          <StatSkeleton />
          <StatSkeleton />
        </>
      ) : (
        <>
          <Stat label="Tips Sent" value={stats.totalTips.toLocaleString()} />
          <Stat label="USDC Tipped" value={formatUSDC(BigInt(stats.totalVolume))} />
          <Stat label="Creators" value={stats.totalCreators.toLocaleString()} />
        </>
      )}
    </div>
  );
}
