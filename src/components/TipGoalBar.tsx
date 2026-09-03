import { formatUSDC, type TipGoal } from "@sorotip/sdk";

/** Progress bar for a creator's active funding goal. */
export default function TipGoalBar({ goal }: { goal: TipGoal }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-tip-card p-5">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <p className="font-semibold text-white">{goal.description}</p>
        {goal.completed ? (
          <span className="rounded-full bg-tip-gold/20 px-2 py-0.5 text-xs font-semibold text-tip-gold">
            Reached
          </span>
        ) : null}
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-tip-orange to-tip-gold transition-all"
          style={{ width: `${goal.progressPercent}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-stone-400">
        <span>
          {formatUSDC(BigInt(goal.currentAmount))} raised of {formatUSDC(BigInt(goal.goalAmount))}
        </span>
        <span>{goal.progressPercent.toFixed(0)}%</span>
      </div>
    </div>
  );
}
