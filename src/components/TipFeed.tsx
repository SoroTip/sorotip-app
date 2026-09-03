import { formatUSDC, timeAgo, truncateAddress, type Tip } from "@sorotip/sdk";

function TipFeedSkeleton() {
  return (
    <ul className="flex flex-col gap-2">
      {[0, 1, 2].map((i) => (
        <li key={i} className="skeleton h-14 w-full" />
      ))}
    </ul>
  );
}

/** Scrollable list of recent tips. */
export default function TipFeed({ tips, isLoading }: { tips: Tip[] | undefined; isLoading: boolean }) {
  if (isLoading) return <TipFeedSkeleton />;

  if (!tips || tips.length === 0) {
    return <p className="py-6 text-center text-sm text-stone-500">No tips yet.</p>;
  }

  return (
    <ul className="flex max-h-96 flex-col gap-2 overflow-y-auto">
      {tips.map((tip) => (
        <li
          key={tip.id}
          className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-tip-card px-4 py-3"
        >
          <div className="min-w-0">
            <p className="truncate text-sm text-white">
              <span className="font-mono text-stone-400">{truncateAddress(tip.from)}</span> tipped{" "}
              <span className="font-semibold text-tip-gold">{formatUSDC(BigInt(tip.amount))}</span>
            </p>
            {tip.messageIpfs ? <p className="truncate text-xs text-stone-500">{tip.messageIpfs}</p> : null}
          </div>
          <span className="shrink-0 text-xs text-stone-500">{timeAgo(tip.timestamp)}</span>
        </li>
      ))}
    </ul>
  );
}
