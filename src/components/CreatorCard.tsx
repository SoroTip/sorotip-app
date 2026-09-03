import Link from "next/link";
import { formatUSDC, truncateAddress } from "@sorotip/sdk";

export interface CreatorCardData {
  wallet: string;
  name: string;
  bio?: string;
  totalReceived: string;
  tipCount: number;
}

/** A creator summary card linking to their public tip page. */
export default function CreatorCard({ creator }: { creator: CreatorCardData }) {
  return (
    <Link
      href={`/tip/${creator.wallet}`}
      className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-tip-card p-5 transition hover:border-tip-orange/40"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-tip-orange/20 text-lg font-bold text-tip-orange">
          {creator.name.charAt(0).toUpperCase() || "?"}
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-white">{creator.name || truncateAddress(creator.wallet)}</p>
          <p className="text-xs text-stone-500">{truncateAddress(creator.wallet)}</p>
        </div>
      </div>
      {creator.bio ? <p className="line-clamp-2 text-sm text-stone-400">{creator.bio}</p> : null}
      <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-3 text-sm">
        <span className="font-semibold text-tip-gold">{formatUSDC(BigInt(creator.totalReceived))} received</span>
        <span className="text-stone-500">{creator.tipCount} tips</span>
      </div>
    </Link>
  );
}
