/**
 * Shown wherever a page or section needs on-chain data but
 * `NEXT_PUBLIC_CONTRACT_ID` hasn't been set yet — e.g. a fresh clone of this
 * repo before a SoroTip contract has been deployed.
 */
export default function ContractNotConfigured({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="rounded-lg border border-white/10 bg-tip-card px-4 py-3 text-sm text-stone-400">
        No contract configured yet — set{" "}
        <code className="rounded bg-black/40 px-1 py-0.5 text-tip-gold">NEXT_PUBLIC_CONTRACT_ID</code>{" "}
        in your <code className="rounded bg-black/40 px-1 py-0.5 text-tip-gold">.env.local</code>.
      </p>
    );
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-3 rounded-2xl border border-white/10 bg-tip-card px-6 py-12 text-center">
      <h2 className="text-xl font-semibold text-white">No contract configured</h2>
      <p className="text-sm text-stone-400">
        This page needs a deployed SoroTip contract. Set{" "}
        <code className="rounded bg-black/40 px-1 py-0.5 text-tip-gold">NEXT_PUBLIC_CONTRACT_ID</code>{" "}
        (and optionally <code className="rounded bg-black/40 px-1 py-0.5 text-tip-gold">NEXT_PUBLIC_RPC_URL</code>)
        in <code className="rounded bg-black/40 px-1 py-0.5 text-tip-gold">.env.local</code>, then restart the dev
        server.
      </p>
    </div>
  );
}
