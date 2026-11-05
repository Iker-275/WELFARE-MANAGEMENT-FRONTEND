
import { MemberContribution } from "../../types/MemberContributionType";

interface MemberContributionActionsProps {
  contribution: MemberContribution;
  loading?: boolean;

  onPay?: (contribution: MemberContribution) => void;
  onMarkOverdue?: (contribution: MemberContribution) => void;
  onWaive?: (contribution: MemberContribution) => void;
  onCancel?: (contribution: MemberContribution) => void;
}

const MemberContributionActions = ({
  contribution,
  loading = false,
  onPay,
  onMarkOverdue,
  onWaive,
  onCancel,
}: MemberContributionActionsProps) => {
  const handleConfirmAction = (
    action: "overdue" | "cancel",
    callback: (contribution: MemberContribution) => void
  ) => {
    const actionLabels = {
      overdue: "mark this contribution as overdue",
      cancel: "cancel this contribution",
    };

    const confirmed = window.confirm(
      `Are you sure you want to ${actionLabels[action]}?`
    );

    if (!confirmed) return;

    callback(contribution);
  };

  const hasActions = onPay || onMarkOverdue || onWaive || onCancel;

  if (!hasActions) {
    return (
      <span className="text-xs text-gray-400">
        No actions
      </span>
    );
  }

  return (
    <div className="flex min-w-[100px] flex-col items-start gap-2">
      {onPay && (
        <button
          type="button"
          disabled={loading}
          onClick={() => onPay(contribution)}
          className="text-xs font-medium text-green-600 transition hover:text-green-800 disabled:cursor-not-allowed disabled:opacity-50 dark:text-green-400"
        >
          Pay
        </button>
      )}

      {onMarkOverdue && (
        <button
          type="button"
          disabled={loading}
          onClick={() =>
            handleConfirmAction("overdue", onMarkOverdue)
          }
          className="text-xs font-medium text-yellow-600 transition hover:text-yellow-800 disabled:cursor-not-allowed disabled:opacity-50 dark:text-yellow-400"
        >
          Mark Overdue
        </button>
      )}

      {onWaive && (
        <button
          type="button"
          disabled={loading}
          onClick={() => onWaive(contribution)}
          className="text-xs font-medium text-purple-600 transition hover:text-purple-800 disabled:cursor-not-allowed disabled:opacity-50 dark:text-purple-400"
        >
          Waive
        </button>
      )}

      {onCancel && (
        <button
          type="button"
          disabled={loading}
          onClick={() =>
            handleConfirmAction("cancel", onCancel)
          }
          className="text-xs font-medium text-red-600 transition hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400"
        >
          Cancel
        </button>
      )}
    </div>
  );
};

export default MemberContributionActions;
