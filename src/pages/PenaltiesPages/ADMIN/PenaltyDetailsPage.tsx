
import { useCallback, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";

import { usePenaltyContext } from "../../../hooks/usePenalties";

import { Penalty } from "../../../types/PenaltyType";

const formatAmount = (
  amount?: number | string | null,
  currency?: string
) => {
  if (amount === undefined || amount === null) return "N/A";

  const value = Number(amount);

  if (!Number.isFinite(value)) return String(amount);

  return `${currency || ""} ${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`.trim();
};

const formatDate = (date?: string | null) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "N/A";

  return parsedDate.toLocaleString();
};

const formatLabel = (value?: string | null) => {
  if (!value) return "N/A";

  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <div>
    <p className="text-sm text-gray-500 dark:text-gray-400">
      {label}
    </p>
    <p className="mt-1 break-words text-sm font-medium text-gray-800 dark:text-white">
      {value ?? "N/A"}
    </p>
  </div>
);

const PenaltyDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    selectedPenalty,
    loading,
    message,
    fetchPenalty,
    activatePenalty,
    payPenalty,
    cancelPenalty,
    waivePenalty,
    clearSelectedPenalty,
    clearMessage,
  } = usePenaltyContext();

  const loadPenalty = useCallback(async () => {
    if (!id) return;

    await fetchPenalty(id);
  }, [id, fetchPenalty]);

  useEffect(() => {
    clearSelectedPenalty();
    clearMessage();

    loadPenalty();

    return () => {
      clearSelectedPenalty();
    };
  }, [loadPenalty, clearSelectedPenalty, clearMessage]);

  const handleActivate = async () => {
    if (!id || !window.confirm("Activate this penalty?")) return;

    await activatePenalty(id);
    await fetchPenalty(id);
  };

  const handlePay = async () => {
    if (!id || !window.confirm("Mark this penalty as paid?")) return;

    await payPenalty(id);
    await fetchPenalty(id);
  };

  const handleCancel = async () => {
    if (!id || !window.confirm("Cancel this penalty?")) return;

    await cancelPenalty(id);
    await fetchPenalty(id);
  };

  const handleWaive = async () => {
    if (!id) return;

    const waiverReason = window.prompt(
      "Enter the reason for waiving this penalty:"
    );

    if (!waiverReason?.trim()) return;

    const confirmed = window.confirm(
      "Are you sure you want to waive this penalty?"
    );

    if (!confirmed) return;

    await waivePenalty(id, {
      waiverReason: waiverReason.trim(),
    });

    await fetchPenalty(id);
  };

  const penalty: Penalty | null = selectedPenalty;

  const canActivate = penalty?.status === "PENDING";
  const canPay = penalty?.status === "ACTIVE";
  const canCancel =
    penalty?.status === "PENDING" ||
    penalty?.status === "ACTIVE";
  const canWaive =
    penalty?.status === "PENDING" ||
    penalty?.status === "ACTIVE";

  return (
    <>
      <PageMeta
        title="Penalty Details"
        description="View and manage penalty details"
      />

      <PageBreadcrumb pageTitle="Penalty Details" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            {/* <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Penalty Details
            </h2> */}

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View penalty information and manage its status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Back
          </button>
        </div>

        {/* Loading */}
        {loading && !penalty && (
          <ComponentCard title="Penalty Details">
            <div className="py-10 text-center text-sm text-gray-500">
              Loading penalty details...
            </div>
          </ComponentCard>
        )}

        {/* Not found */}
        {!loading && !penalty && (
          <ComponentCard title="Penalty Details">
            <div className="py-10 text-center">
              <p className="font-medium text-gray-800 dark:text-white">
                Penalty Not Found
              </p>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {message || "The requested penalty could not be found."}
              </p>

              <Link
                to="/penalties"
                className="mt-4 inline-block text-sm font-medium text-brand-500 hover:underline"
              >
                Back to Penalties
              </Link>
            </div>
          </ComponentCard>
        )}

        {/* Penalty details */}
        {penalty && (
          <>
            {/* General information */}
            <ComponentCard title="General Information">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <DetailItem
                  label="Penalty ID"
                  value={penalty.id}
                />

                <DetailItem
                  label="Penalty Type"
                  value={formatLabel(penalty.type)}
                />

                <DetailItem
                  label="Source"
                  value={formatLabel(penalty.source)}
                />

                <DetailItem
                  label="Status"
                  value={formatLabel(penalty.status)}
                />

                <DetailItem
                  label="Created At"
                  value={formatDate(penalty.createdAt)}
                />

                <DetailItem
                  label="Last Updated"
                  value={formatDate(penalty.updatedAt)}
                />
              </div>
            </ComponentCard>

            {/* Member information */}
            <ComponentCard title="Member Information">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <DetailItem
                  label="Member ID"
                  value={penalty.memberId}
                />

                <DetailItem
                  label="Membership Number"
                  value={penalty.member?.membershipNumber}
                />

                <DetailItem
                  label="Membership Status"
                  value={formatLabel(penalty.member?.status)}
                />
              </div>
            </ComponentCard>

            {/* Financial information */}
            <ComponentCard title="Penalty Amount">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <DetailItem
                  label="Penalty Amount"
                  value={formatAmount(
                    penalty.amount,
                    penalty.currency
                  )}
                />

                <DetailItem
                  label="Base Amount"
                  value={formatAmount(
                    penalty.baseAmount,
                    penalty.currency
                  )}
                />

                <DetailItem
                  label="Percentage"
                  value={
                    penalty.percentage !== undefined &&
                    penalty.percentage !== null
                      ? `${penalty.percentage}%`
                      : "N/A"
                  }
                />

                <DetailItem
                  label="Currency"
                  value={penalty.currency}
                />
              </div>
            </ComponentCard>

            {/* Rule information */}
            <ComponentCard title="Penalty Rule">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <DetailItem
                  label="Rule Name"
                  value={penalty.penaltyRule?.name}
                />

                <DetailItem
                  label="Rule Code"
                  value={penalty.penaltyRule?.code}
                />

                <DetailItem
                  label="Rule Type"
                  value={formatLabel(
                    penalty.penaltyRule?.penaltyType
                  )}
                />

                <DetailItem
                  label="Rule Scope"
                  value={formatLabel(
                    penalty.penaltyRule?.scopeType
                  )}
                />

                <DetailItem
                  label="Penalty Rule ID"
                  value={penalty.penaltyRuleId}
                />
              </div>
            </ComponentCard>

            {/* Contribution information */}
            <ComponentCard title="Related Contribution">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <DetailItem
                  label="Member Contribution ID"
                  value={penalty.memberContributionId}
                />

                <DetailItem
                  label="Contribution Amount Due"
                  value={
                    penalty.memberContribution?.amountDue !== undefined
                      ? formatAmount(
                          penalty.memberContribution.amountDue,
                          penalty.memberContribution.currency
                        )
                      : "N/A"
                  }
                />

                <DetailItem
                  label="Contribution Amount Paid"
                  value={
                    penalty.memberContribution?.amountPaid !== undefined
                      ? formatAmount(
                          penalty.memberContribution.amountPaid,
                          penalty.memberContribution.currency
                        )
                      : "N/A"
                  }
                />

                <DetailItem
                  label="Contribution Status"
                  value={formatLabel(
                    penalty.memberContribution?.status
                  )}
                />
              </div>
            </ComponentCard>

            {/* Reason */}
            <ComponentCard title="Penalty Reason">
              <p className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                {penalty.reason || "No reason provided."}
              </p>
            </ComponentCard>

            {/* Waiver information */}
            {(penalty.waivedAt ||
              penalty.waiverReason ||
              penalty.waivedById) && (
              <ComponentCard title="Waiver Information">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <DetailItem
                    label="Waived At"
                    value={formatDate(penalty.waivedAt)}
                  />

                  <DetailItem
                    label="Waived By"
                    value={penalty.waivedById}
                  />

                  <DetailItem
                    label="Waiver Reason"
                    value={penalty.waiverReason}
                  />
                </div>
              </ComponentCard>
            )}

            {/* Actions */}
            <ComponentCard title="Penalty Actions">
              <div className="flex flex-wrap gap-3">
                {canActivate && (
                  <button
                    type="button"
                    onClick={handleActivate}
                    disabled={loading}
                    className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
                  >
                    Activate Penalty
                  </button>
                )}

                {canPay && (
                  <button
                    type="button"
                    onClick={handlePay}
                    disabled={loading}
                    className="rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    Mark as Paid
                  </button>
                )}

                {canWaive && (
                  <button
                    type="button"
                    onClick={handleWaive}
                    disabled={loading}
                    className="rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-50"
                  >
                    Waive Penalty
                  </button>
                )}

                {canCancel && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    Cancel Penalty
                  </button>
                )}

                {!canActivate &&
                  !canPay &&
                  !canWaive &&
                  !canCancel && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No further actions are available for this penalty.
                    </p>
                  )}
              </div>

              {message && (
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  {message}
                </p>
              )}
            </ComponentCard>
          </>
        )}
      </div>
    </>
  );
};

export default PenaltyDetailsPage;
