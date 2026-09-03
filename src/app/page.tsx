"use client";

import Link from "next/link";
import { useTopCreators, type SoroTipClient } from "@sorotip/sdk";
import { sorotipClient } from "@/lib/sorotip";
import StatsBar from "@/components/StatsBar";
import CreatorCard from "@/components/CreatorCard";
import ContractNotConfigured from "@/components/ContractNotConfigured";

const HOW_IT_WORKS = [
  { title: "Register your wallet", description: "Create a public creator profile with your Stellar wallet — no sign-up form, no approval queue." },
  { title: "Share your link", description: "Get a sorotip.app/tip/<your-address> link and share it anywhere your audience already is." },
  { title: "Receive USDC instantly", description: "Tips and subscriptions move straight from supporter to you in one transaction — no platform in between." },
];

const WHY_SOROTIP = [
  { title: "No geographic restrictions", description: "If you have a Stellar wallet, you can get paid — no PayPal, no Stripe, no regional payout gatekeeping." },
  { title: "Zero platform custody", description: "SoroTip never holds your funds. It only routes payments and keeps the public record." },
  { title: "Near-zero fees", description: "Stellar's network fees are fractions of a cent — most of every tip reaches you." },
];

function FeaturedCreators({ client }: { client: SoroTipClient }) {
  const { creators, isLoading, error } = useTopCreators(client, 6);

  if (error) return null;

  if (isLoading || !creators) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton h-32 w-full" />
        ))}
      </div>
    );
  }

  if (creators.length === 0) {
    return <p className="text-center text-sm text-stone-500">No creators yet — be the first to register.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {creators.map((creator) => (
        <CreatorCard key={creator.wallet} creator={creator} />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      <section className="flex flex-col items-center gap-6 py-12 text-center sm:py-20">
        <h1 className="max-w-3xl text-balance text-4xl font-extrabold text-white sm:text-6xl">
          Monetize your creativity on <span className="text-tip-orange">Stellar</span>
        </h1>
        <p className="max-w-xl text-balance text-stone-400 sm:text-lg">
          No PayPal. No Stripe. No platform cut. Get tipped and subscribed to directly, wallet to wallet, from
          anywhere in the world.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-full bg-tip-orange px-6 py-3 text-sm font-semibold text-black transition hover:bg-tip-orange/90"
          >
            Create Your Page
          </Link>
          <Link
            href="/explore"
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40"
          >
            Explore Creators
          </Link>
        </div>
      </section>

      <section>{sorotipClient ? <StatsBar client={sorotipClient} /> : <ContractNotConfigured compact />}</section>

      <section className="flex flex-col gap-8">
        <h2 className="text-center text-2xl font-bold text-white">How it works</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={step.title} className="rounded-2xl border border-white/10 bg-tip-card p-6">
              <span className="text-sm font-bold text-tip-orange">Step {i + 1}</span>
              <h3 className="mt-2 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-stone-400">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="text-center text-2xl font-bold text-white">Why SoroTip</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {WHY_SOROTIP.map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-tip-card p-6">
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-stone-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="text-center text-2xl font-bold text-white">Featured creators</h2>
        {sorotipClient ? <FeaturedCreators client={sorotipClient} /> : <ContractNotConfigured compact />}
      </section>

      <footer className="flex flex-col items-center gap-2 border-t border-white/5 pt-8 text-center text-sm text-stone-500">
        <p>SoroTip — on-chain tipping and creator monetization on Stellar Soroban.</p>
        <p>Built for the Stellar Wave Program on Drips.</p>
      </footer>
    </div>
  );
}
