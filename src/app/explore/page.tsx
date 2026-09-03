"use client";

import { useMemo, useState } from "react";
import { useTopCreators, type SoroTipClient } from "@sorotip/sdk";
import { sorotipClient } from "@/lib/sorotip";
import ContractNotConfigured from "@/components/ContractNotConfigured";
import CreatorCard from "@/components/CreatorCard";

const PAGE_SIZE = 12;

function ExploreSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="skeleton h-32 w-full" />
      ))}
    </div>
  );
}

function ExploreContent({ client }: { client: SoroTipClient }) {
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const { creators, isLoading, error } = useTopCreators(client, limit);

  const filtered = useMemo(() => {
    if (!creators) return undefined;
    const q = query.trim().toLowerCase();
    if (!q) return creators;
    return creators.filter((c) => c.name.toLowerCase().includes(q) || c.wallet.toLowerCase().includes(q));
  }, [creators, query]);

  return (
    <div className="flex flex-col gap-6">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search creators by name or address"
        className="w-full rounded-xl border border-white/10 bg-tip-card px-4 py-3 text-sm text-white outline-none placeholder:text-stone-500"
      />

      {error ? (
        <p className="text-center text-sm text-red-400">Couldn&apos;t load creators.</p>
      ) : isLoading || !filtered ? (
        <ExploreSkeleton />
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-stone-500">No creators match your search.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((creator) => (
              <CreatorCard key={creator.wallet} creator={creator} />
            ))}
          </div>
          {creators && creators.length >= limit && !query ? (
            <button
              type="button"
              onClick={() => setLimit((l) => l + PAGE_SIZE)}
              className="mx-auto rounded-full border border-white/10 px-6 py-2 text-sm font-medium text-stone-300 transition hover:border-white/30"
            >
              Load more
            </button>
          ) : null}
        </>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-center text-2xl font-bold text-white">Explore creators</h1>
      {sorotipClient ? <ExploreContent client={sorotipClient} /> : <ContractNotConfigured />}
    </div>
  );
}
