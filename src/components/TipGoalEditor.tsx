"use client";

import { useState } from "react";
import type { SoroTipClient, TipGoal } from "@sorotip/sdk";

interface TipGoalEditorProps {
  client: SoroTipClient;
  goal?: TipGoal;
  onSaved?: (goal: TipGoal) => void;
  onCancel?: () => void;
}

/** Form for publishing or replacing a creator's funding goal. */
export default function TipGoalEditor({ client, goal, onSaved, onCancel }: TipGoalEditorProps) {
  const [goalAmount, setGoalAmount] = useState(goal?.goalAmount ?? "");
  const [description, setDescription] = useState(goal?.description ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numeric = Number(goalAmount);
    if (!goalAmount || Number.isNaN(numeric) || numeric <= 0) {
      setError("Enter a goal amount greater than 0.");
      return;
    }
    if (!description.trim()) {
      setError("Description is required.");
      return;
    }
    setError(undefined);
    setIsSaving(true);
    try {
      const trimmedDescription = description.trim();
      const { goalId } = await client.setTipGoal({ goalAmount, description: trimmedDescription });
      onSaved?.({
        id: goalId,
        creator: "",
        goalAmount,
        currentAmount: goal?.currentAmount ?? "0",
        description: trimmedDescription,
        completed: false,
        progressPercent: goal
          ? Math.min(100, (Number(goal.currentAmount) / numeric) * 100)
          : 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save goal.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-tip-card p-5"
    >
      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-400" htmlFor="goal-amount">
          Target amount (USDC)
        </label>
        <input
          id="goal-amount"
          type="number"
          min="0"
          step="0.01"
          value={goalAmount}
          onChange={(e) => setGoalAmount(e.target.value)}
          placeholder="500"
          className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-stone-500"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-400" htmlFor="goal-description">
          What is this goal for?
        </label>
        <textarea
          id="goal-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="New microphone for the podcast"
          className="w-full resize-none rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-stone-500"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSaving}
          className="flex-1 rounded-full bg-tip-orange py-2.5 text-sm font-semibold text-black transition hover:bg-tip-orange/90 disabled:opacity-50"
        >
          {isSaving ? "Saving…" : goal ? "Update goal" : "Set goal"}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-white/10 px-4 py-2.5 text-sm font-medium text-stone-300 transition hover:border-white/30"
          >
            Cancel
          </button>
        ) : null}
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </form>
  );
}
