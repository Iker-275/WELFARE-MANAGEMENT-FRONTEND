
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import { usePenaltyRules } from "../../hooks/usePenaltyRules";
import { PenaltyRule } from "../../types/PenaltyRuleType";

const formatDate = (value?: string | Date | null): string => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString();
};

const formatValue = (value?: string | number | null): string => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return String(value);
};

const formatLabel = (value?: string | null): string => {
  if (!value) return "—";

  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

interface DetailItemProps {
  label: string;
  value?: string | number | null;
}

const DetailItem = ({ label, value }: DetailItemProps) => (
  <div>
    <p className="text-sm text-gray-500 dark:text-gray-400">
      {label}
    </p>
    <p className="mt-1 text-sm font-medium text-gray-800 dark:text-white/90">
      {formatValue(value)}
    </p>
  </div>
);

const PenaltyRuleDetails = () => {
  const { penaltyRuleId } = useParams<{ penaltyRuleId: string }>();
  const navigate = useNavigate();

  const {
    fetchPenaltyRule,
    selectedPenaltyRule,
    loading,
    message,
    clearMessage,
  } = usePenaltyRules();

  const [rule, setRule] = useState<PenaltyRule | null>(null);

  useEffect(() => {
    if (!penaltyRuleId) {
      setRule(null);
      return;
    }

    let mounted = true;

    const loadPenaltyRule = async () => {
      clearMessage();

      const result = await fetchPenaltyRule(penaltyRuleId);

      if (mounted) {
        setRule(result);
      }
    };

    loadPenaltyRule();

    return () => {
      mounted = false;
    };
  }, [penaltyRuleId, fetchPenaltyRule, clearMessage]);

  const getScopeTarget = (penaltyRule: PenaltyRule): string => {
    switch (penaltyRule.scopeType) {
      case "REGION":
        return penaltyRule.region?.name || penaltyRule.regionId || "—";

      case "BRANCH":
        return penaltyRule.branch?.name || penaltyRule.branchId || "—";

      case "CHAPTER":
        return penaltyRule.chapter?.name || penaltyRule.chapterId || "—";

      case "GROUP":
        return penaltyRule.group?.name || penaltyRule.groupId || "—";

      case "MEMBER":
        return (
          penaltyRule.member?.membershipNumber ||
          penaltyRule.memberId ||
          "—"
        );

      case "GLOBAL":
        return "All members";

      default:
        return "—";
    }
  };

  const getPenaltyValue = (penaltyRule: PenaltyRule): string => {
    switch (penaltyRule.penaltyType) {
      case "FIXED":
        return penaltyRule.fixedAmount != null
          ? String(penaltyRule.fixedAmount)
          : "—";

      case "PERCENTAGE":
        return penaltyRule.percentage != null
          ? `${penaltyRule.percentage}%`
          : "—";

      case "TIERED":
        return `${penaltyRule.tiers?.length ?? 0} configured tiers`;

      default:
        return "—";
    }
  };

  if (loading && !rule) {
    return (
      <>
        <PageMeta
          title="Penalty Rule Details"
          description="View penalty rule details"
        />
        <PageBreadcrumb pageTitle="Penalty Rule Details" />

        <ComponentCard title="Penalty Rule Details">
          <div className="py-10 text-center text-gray-500">
            Loading penalty rule details...
          </div>
        </ComponentCard>
      </>
    );
  }

  if (!rule) {
    return (
      <>
        <PageMeta
          title="Penalty Rule Details"
          description="View penalty rule details"
        />
        <PageBreadcrumb pageTitle="Penalty Rule Details" />

        <ComponentCard title="Penalty Rule Details">
          <div className="py-8 text-center">
            <p className="text-sm text-red-500">
              {message || "Penalty rule not found."}
            </p>

            <button
              type="button"
              onClick={() => navigate("/penalty-rules")}
              className="mt-5 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              Back to Penalty Rules
            </button>
          </div>
        </ComponentCard>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="Penalty Rule Details"
        description="View penalty rule details"
      />

      <PageBreadcrumb pageTitle="Penalty Rule Details" />

      <div className="space-y-6">
        <ComponentCard title="Penalty Rule Details">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  {rule.name}
                </h3>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Rule Code: {rule.code}
                </p>
              </div>

              <span
                className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${
                  rule.isActive
                    ? "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-400"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {rule.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {/* Basic Information */}
            <section>
              <h4 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
                Basic Information
              </h4>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <DetailItem label="Rule Name" value={rule.name} />
                <DetailItem label="Rule Code" value={rule.code} />
                <DetailItem
                  label="Penalty Type"
                  value={formatLabel(rule.penaltyType)}
                />
                <DetailItem
                  label="Contribution Plan"
                  value={
                    rule.contributionPlan?.name ||
                    rule.contributionPlanId
                  }
                />
                <DetailItem
                  label="Description"
                  value={rule.description}
                />
                <DetailItem
                  label="Priority"
                  value={rule.priority}
                />
              </div>
            </section>

            <div className="border-t border-gray-200 dark:border-gray-800" />

            {/* Penalty Configuration */}
            <section>
              <h4 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
                Penalty Configuration
              </h4>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <DetailItem
                  label="Penalty Value"
                  value={getPenaltyValue(rule)}
                />

                {rule.penaltyType === "FIXED" && (
                  <DetailItem
                    label="Fixed Amount"
                    value={rule.fixedAmount}
                  />
                )}

                {rule.penaltyType === "PERCENTAGE" && (
                  <DetailItem
                    label="Percentage"
                    value={
                      rule.percentage != null
                        ? `${rule.percentage}%`
                        : "—"
                    }
                  />
                )}

                <DetailItem
                  label="Grace Period"
                  value={`${rule.gracePeriodDays} days`}
                />

                <DetailItem
                  label="Cap Amount"
                  value={rule.capAmount}
                />

                <DetailItem
                  label="Cap Percentage"
                  value={
                    rule.capPercentage != null
                      ? `${rule.capPercentage}%`
                      : "—"
                  }
                />
              </div>
            </section>

            <div className="border-t border-gray-200 dark:border-gray-800" />

            {/* Scope Information */}
            <section>
              <h4 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
                Scope Information
              </h4>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <DetailItem
                  label="Scope Type"
                  value={formatLabel(rule.scopeType)}
                />

                <DetailItem
                  label="Applicable To"
                  value={getScopeTarget(rule)}
                />
              </div>
            </section>

            <div className="border-t border-gray-200 dark:border-gray-800" />

            {/* Effective Period */}
            <section>
              <h4 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
                Effective Period
              </h4>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <DetailItem
                  label="Effective From"
                  value={formatDate(rule.effectiveFrom)}
                />

                <DetailItem
                  label="Effective To"
                  value={formatDate(rule.effectiveTo)}
                />

                <DetailItem
                  label="Created At"
                  value={formatDate(rule.createdAt)}
                />

                <DetailItem
                  label="Last Updated"
                  value={formatDate(rule.updatedAt)}
                />
              </div>
            </section>

            {/* Tiers */}
            {rule.penaltyType === "TIERED" && (
              <>
                <div className="border-t border-gray-200 dark:border-gray-800" />

                <section>
                  <h4 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
                    Penalty Tiers
                  </h4>

                  {rule.tiers && rule.tiers.length > 0 ? (
                    <pre className="overflow-x-auto rounded-lg bg-gray-50 p-4 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      {JSON.stringify(rule.tiers, null, 2)}
                    </pre>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No penalty tiers configured.
                    </p>
                  )}
                </section>
              </>
            )}

            {/* Actions */}
            <div className="flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
              <Link
                to="/penalty-rules"
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Back to Penalty Rules
              </Link>
            </div>
          </div>
        </ComponentCard>
      </div>
    </>
  );
};

export default PenaltyRuleDetails;
