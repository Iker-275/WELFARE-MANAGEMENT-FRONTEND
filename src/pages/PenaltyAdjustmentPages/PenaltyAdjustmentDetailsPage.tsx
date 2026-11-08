
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import { usePenaltyAdjustmentContext } from "../../hooks/usePenaltyAdjustments";

import { PenaltyAdjustment } from "../../types/PenaltyAdjustmentType";

const formatAmount = (
  amount: string | number,
  currency?: string,
) => {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return `${currency || ""} ${amount}`;
  }

  return `${currency ? `${currency} ` : ""}${numericAmount.toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  )}`;
};

const formatDate = (date?: string | null) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleString();
};

const getUserName = (
  user?: PenaltyAdjustment["createdBy"],
) => {
  if (!user) return "—";

  return `${user.firstName} ${user.lastName}`.trim();
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case "WAIVER":
      return "Waiver";
    case "REDUCTION":
      return "Reduction";
    case "INCREASE":
      return "Increase";
    default:
      return type;
  }
};

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div>
    <p className="text-sm text-gray-500 dark:text-gray-400">
      {label}
    </p>

    <p className="mt-1 break-words text-sm font-medium text-gray-800 dark:text-white/90">
      {value || "—"}
    </p>
  </div>
);

const PenaltyAdjustmentDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    selectedAdjustment,
    loading,
    message,
    fetchAdjustment,
    approveAdjustment,
    clearMessage,
    clearSelectedAdjustment,
  } = usePenaltyAdjustmentContext();

  const [adjustment, setAdjustment] =
    useState<PenaltyAdjustment | null>(null);

  const [approving, setApproving] = useState(false);

  useEffect(() => {
    if (!id) return;

    let mounted = true;

    const loadAdjustment = async () => {
      const result = await fetchAdjustment(id);

      if (mounted) {
        setAdjustment(result);
      }
    };

    setAdjustment(null);
    loadAdjustment();

    return () => {
      mounted = false;
      clearSelectedAdjustment();
    };
  }, [id, fetchAdjustment, clearSelectedAdjustment]);

  const handleApprove = async () => {
    if (!adjustment || adjustment.approvedById || approving) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to approve this penalty adjustment?",
    );

    if (!confirmed) return;

    clearMessage();
    setApproving(true);

    try {
      const success = await approveAdjustment(adjustment.id);

      if (success) {
        const updatedAdjustment = await fetchAdjustment(adjustment.id);

        setAdjustment(updatedAdjustment);
      }
    } finally {
      setApproving(false);
    }
  };

  if (loading && !adjustment) {
    return (
      <>
        <PageMeta
          title="Penalty Adjustment Details | Budgeti"
          description="View penalty adjustment details."
        />

        <PageBreadcrumb pageTitle="Penalty Adjustment Details" />

        <div className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
          Loading adjustment details...
        </div>
      </>
    );
  }

  if (!adjustment) {
    return (
      <>
        <PageMeta
          title="Penalty Adjustment Details | Budgeti"
          description="View penalty adjustment details."
        />

        <PageBreadcrumb pageTitle="Penalty Adjustment Details" />

        <ComponentCard title="Adjustment Not Found">
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {message || "The requested penalty adjustment could not be found."}
            </p>

            <button
              type="button"
              onClick={() => navigate("/penalty-adjustments")}
              className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
            >
              Back to Adjustments
            </button>
          </div>
        </ComponentCard>
      </>
    );
  }

  const penalty = adjustment.penalty;
  const approved = Boolean(adjustment.approvedById);

  return (
    <>
      <PageMeta
        title="Penalty Adjustment Details | Budgeti"
        description="View penalty adjustment details."
      />

      <PageBreadcrumb pageTitle="Penalty Adjustment Details" />

      <div className="space-y-6">
        {/* Header */}
        <ComponentCard title="Penalty Adjustment Details">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Adjustment ID
              </p>

              <p className="mt-1 break-all text-sm font-semibold text-gray-800 dark:text-white/90">
                {adjustment.id}
              </p>
            </div>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                approved
                  ? "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400"
                  : "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400"
              }`}
            >
              {approved ? "Approved" : "Pending Approval"}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <DetailItem
              label="Adjustment Type"
              value={getTypeLabel(adjustment.type)}
            />

            <DetailItem
              label="Adjustment Amount"
              value={formatAmount(
                adjustment.amount,
                penalty?.currency,
              )}
            />

            <DetailItem
              label="Created At"
              value={formatDate(adjustment.createdAt)}
            />

            <DetailItem
              label="Last Updated"
              value={formatDate(adjustment.updatedAt)}
            />

            <DetailItem
              label="Created By"
              value={getUserName(adjustment.createdBy)}
            />

            <DetailItem
              label="Requester Email"
              value={adjustment.createdBy?.email || "—"}
            />
          </div>

          <div className="mt-6 border-t border-gray-200 pt-5 dark:border-gray-800">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Adjustment Reason
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-400">
              {adjustment.reason}
            </p>
          </div>
        </ComponentCard>

        {/* Related penalty */}
        <ComponentCard title="Related Penalty">
          {penalty ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              <DetailItem
                label="Penalty ID"
                value={penalty.id}
              />

              <DetailItem
                label="Member ID"
                value={penalty.memberId}
              />

              <DetailItem
                label="Contribution ID"
                value={penalty.memberContributionId || "—"}
              />

              <DetailItem
                label="Penalty Rule ID"
                value={penalty.penaltyRuleId || "—"}
              />

              <DetailItem
                label="Penalty Type"
                value={penalty.type}
              />

              <DetailItem
                label="Penalty Source"
                value={penalty.source}
              />

              <DetailItem
                label="Penalty Status"
                value={penalty.status}
              />

              <DetailItem
                label="Base Amount"
                value={formatAmount(
                  penalty.baseAmount,
                  penalty.currency,
                )}
              />

              <DetailItem
                label="Penalty Amount"
                value={formatAmount(
                  penalty.amount,
                  penalty.currency,
                )}
              />

              <DetailItem
                label="Percentage"
                value={
                  penalty.percentage !== null
                    ? `${penalty.percentage}%`
                    : "—"
                }
              />

              <DetailItem
                label="Penalty Created"
                value={formatDate(penalty.createdAt)}
              />

              <DetailItem
                label="Penalty Reason"
                value={penalty.reason || "—"}
              />
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Penalty information was not included in this response.
            </p>
          )}
        </ComponentCard>

        {/* Approval information */}
        <ComponentCard title="Approval Information">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <DetailItem
              label="Approval Status"
              value={approved ? "Approved" : "Pending Approval"}
            />

            <DetailItem
              label="Approved By"
              value={getUserName(adjustment.approvedBy)}
            />

            <DetailItem
              label="Approver Email"
              value={adjustment.approvedBy?.email || "—"}
            />

            <DetailItem
              label="Approver ID"
              value={adjustment.approvedById || "—"}
            />
          </div>
        </ComponentCard>

        {/* API message */}
        {message && (
          <div className="rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            {message}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/penalty-adjustments")}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Back to Adjustments
          </button>

          {!approved && (
            <button
              type="button"
              onClick={handleApprove}
              disabled={approving || loading}
              className="rounded-lg bg-success-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-success-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {approving ? "Approving..." : "Approve Adjustment"}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default PenaltyAdjustmentDetailsPage;
