"use client";

import { useState } from "react";
import { useProfile, useTipGoal, useTipHistory, formatUSDC, truncateAddress, type SoroTipClient } from "@sorotip/sdk";
import { sorotipClient } from "@/lib/sorotip";
import ContractNotConfigured from "@/components/ContractNotConfigured";
import TipForm from "@/components/TipForm";
import TipGoalBar from "@/components/TipGoalBar";
import TipFeed from "@/components/TipFeed";

function ProfileSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <div className="skeleton h-20 w-20 rounded-full" />
      <div className="skeleton h-6 w-40" />
      <div className="skeleton h-4 w-64" />
    </div>
  );
}

function CreatorProfileContent({ client, address }: { client: SoroTipClient; address: string }) {
  const [copied, setCopied] = useState(false);
  const { profile, isLoading: profileLoading, error: profileError } = useProfile(client, address);
  const { goal } = useTipGoal(client, address);
  const { tips, isLoading: tipsLoading } = useTipHistory(client, address, 10);

  const handleShare = () => {
    const url = `${window.location.origin}/tip/${address}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (profileLoading) {
    return <ProfileSkeleton />;
  }

  if (profileError || !profile) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-2 py-16 text-center">
        <h1 className="text-xl font-semibold text-white">Creator not found</h1>
        <p className="text-sm text-stone-400">
          <span className="font-mono">{truncateAddress(address)}</span> hasn&apos;t registered a SoroTip profile yet.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8">
      <section className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-tip-orange/20 text-3xl font-bold text-tip-orange">
          {profile.name.charAt(0).toUpperCase() || "?"}
        </div>
        <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
        <p className="max-w-md text-sm text-stone-400">{profile.bio}</p>
        <div className="flex gap-6 text-sm text-stone-400">
          <span>
            <strong className="text-white">{formatUSDC(BigInt(profile.totalReceived))}</strong> received
          </span>
          <span>
            <strong className="text-white">{profile.tipCount}</strong> tips
          </span>
          <span>
            <strong className="text-white">{profile.subscriberCount}</strong> subscribers
          </span>
        </div>
        <button
          type="button"
          onClick={handleShare}
          className="rounded-full border border-white/10 px-4 py-1.5 text-xs font-medium text-stone-300 transition hover:border-white/30"
        >
          {copied ? "Link copied!" : "Share this page"}
        </button>
      </section>

      {goal ? <TipGoalBar goal={goal} /> : null}

      <TipForm client={client} recipient={address} />

      <section>
        <h2 className="mb-3 text-lg font-semibold text-white">Recent tips</h2>
        <TipFeed tips={tips} isLoading={tipsLoading} />
      </section>
    </div>
  );
}

export default function CreatorTipPage({ params }: { params: { address: string } }) {
  if (!sorotipClient) {
    return <ContractNotConfigured />;
  }
  return <CreatorProfileContent client={sorotipClient} address={params.address} />;
}
