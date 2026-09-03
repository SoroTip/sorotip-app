"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useWallet,
  useProfile,
  useTipHistory,
  useTipGoal,
  formatUSDC,
  type SoroTipClient,
  type Subscription,
  type TipGoal,
} from "@sorotip/sdk";
import { sorotipClient } from "@/lib/sorotip";
import ContractNotConfigured from "@/components/ContractNotConfigured";
import ProfileEditor from "@/components/ProfileEditor";
import TipGoalBar from "@/components/TipGoalBar";
import TipGoalEditor from "@/components/TipGoalEditor";
import TipFeed from "@/components/TipFeed";
import SubscriptionCard from "@/components/SubscriptionCard";

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="skeleton h-32 w-full" />
      <div className="skeleton h-24 w-full" />
      <div className="skeleton h-48 w-full" />
    </div>
  );
}

function DashboardContent({ client, wallet }: { client: SoroTipClient; wallet: string }) {
  const { profile, isLoading: profileLoading, refetch: refetchProfile } = useProfile(client, wallet);
  const { tips, isLoading: tipsLoading } = useTipHistory(client, wallet, 20);
  const { goal: fetchedGoal } = useTipGoal(client, wallet);
  const [goalOverride, setGoalOverride] = useState<TipGoal | undefined>(undefined);
  const goal = goalOverride ?? fetchedGoal;
  const [subscriptions, setSubscriptions] = useState<Subscription[] | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    client.getSubscriptionsByCreator(wallet).then((subs) => {
      if (!cancelled) setSubscriptions(subs);
    });
    return () => {
      cancelled = true;
    };
  }, [client, wallet]);

  const receivedThisMonth = useMemo(() => {
    if (!tips) return 0n;
    const now = new Date();
    return tips
      .filter((t) => t.to === wallet && t.timestamp.getMonth() === now.getMonth() && t.timestamp.getFullYear() === now.getFullYear())
      .reduce((sum, t) => sum + BigInt(t.amount), 0n);
  }, [tips, wallet]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/tip/${wallet}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (profileLoading) {
    return <DashboardSkeleton />;
  }

  if (!profile || isEditing) {
    return (
      <div className="mx-auto max-w-lg">
        <ProfileEditor
          client={client}
          profile={profile}
          onSaved={() => {
            setIsEditing(false);
            refetchProfile();
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-tip-card p-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-tip-orange/20 text-2xl font-bold text-tip-orange">
            {profile.name.charAt(0).toUpperCase() || "?"}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{profile.name}</h1>
            <p className="text-sm text-stone-400">{profile.bio}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="rounded-full border border-white/10 px-4 py-1.5 text-xs font-medium text-stone-300 transition hover:border-white/30"
          >
            {copied ? "Copied!" : "Copy tip link"}
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-full border border-white/10 px-4 py-1.5 text-xs font-medium text-stone-300 transition hover:border-white/30"
          >
            Edit profile
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total received", value: formatUSDC(BigInt(profile.totalReceived)) },
          { label: "This month", value: formatUSDC(receivedThisMonth) },
          { label: "Tips", value: profile.tipCount.toString() },
          { label: "Subscribers", value: profile.subscriberCount.toString() },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-white/10 bg-tip-card p-4 text-center">
            <p className="text-lg font-bold text-white">{stat.value}</p>
            <p className="text-xs text-stone-400">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-2">
        {isEditingGoal ? (
          <TipGoalEditor
            client={client}
            goal={goal}
            onCancel={() => setIsEditingGoal(false)}
            onSaved={(saved) => {
              setGoalOverride({ ...saved, creator: wallet });
              setIsEditingGoal(false);
            }}
          />
        ) : (
          <>
            {goal ? <TipGoalBar goal={goal} /> : <p className="text-sm text-stone-500">No funding goal set yet.</p>}
            <button
              type="button"
              onClick={() => setIsEditingGoal(true)}
              className="self-start rounded-full border border-white/10 px-4 py-1.5 text-xs font-medium text-stone-300 transition hover:border-white/30"
            >
              {goal ? "Edit goal" : "Set a goal"}
            </button>
          </>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-white">Active subscriptions</h2>
        {subscriptions === undefined ? (
          <div className="flex flex-col gap-2">
            <div className="skeleton h-14 w-full" />
            <div className="skeleton h-14 w-full" />
          </div>
        ) : subscriptions.length === 0 ? (
          <p className="text-sm text-stone-500">No active subscribers yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {subscriptions.map((sub) => (
              <SubscriptionCard key={sub.id} subscription={sub} counterparty="supporter" />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-white">Recent tips</h2>
        <TipFeed tips={tips} isLoading={tipsLoading} />
      </section>
    </div>
  );
}

function DashboardGate({ client }: { client: SoroTipClient }) {
  const { publicKey, isConnected, connect } = useWallet();

  if (!isConnected || !publicKey) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-white">Connect your wallet</h1>
        <p className="text-sm text-stone-400">Connect Freighter to view or set up your creator dashboard.</p>
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

  return <DashboardContent client={client} wallet={publicKey} />;
}

export default function DashboardPage() {
  if (!sorotipClient) {
    return <ContractNotConfigured />;
  }
  return <DashboardGate client={sorotipClient} />;
}
