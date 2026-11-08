import { FormEvent, useEffect, useState } from "react";

import type {
  CreatePenaltyRuleDto,
  PenaltyRule,
  PenaltyRuleTier,
  PenaltyType,
  PenaltyScopeType,
} from "../../types/PenaltyRuleType";

import ContributionPlanDropdown from "../customDropdowns/ContributionPlanDropdown";
import PenaltyRuleScopeDropdown from "../customDropdowns/PenaltyRuleScopeDropdown";
import RegionDropdown from "../customDropdowns/RegionDropdown";

interface PenaltyRuleFormProps {
  onSubmit: (data: CreatePenaltyRuleDto) => void | Promise<void>;
  loading?: boolean;
  initialData?: PenaltyRule | null;
}

interface PenaltyRuleFormState {
  name: string;
  code: string;
  description: string;
  penaltyType: PenaltyType | "";
  contributionPlanId: string;
  scopeType: PenaltyScopeType | "";
  regionId: string;
  branchId: string;
  chapterId: string;
  groupId: string;
  memberId: string;
  fixedAmount: string;
  percentage: string;
  gracePeriodDays: string;
  capAmount: string;
  capPercentage: string;
  effectiveFrom: string;
  effectiveTo: string;
  priority: string;
  isActive: boolean;
  tiers: string;
}

const getInitialFormState = (
  initialData?: PenaltyRule | null
): PenaltyRuleFormState => ({
  name: initialData?.name ?? "",
  code: initialData?.code ?? "",
  description: initialData?.description ?? "",
  penaltyType: initialData?.penaltyType ?? "",
  contributionPlanId: initialData?.contributionPlanId ?? "",
  scopeType: initialData?.scopeType ?? "",
  regionId: initialData?.regionId ?? "",
  branchId: initialData?.branchId ?? "",
  chapterId: initialData?.chapterId ?? "",
  groupId: initialData?.groupId ?? "",
  memberId: initialData?.memberId ?? "",
  fixedAmount:
    initialData?.fixedAmount !== null &&
    initialData?.fixedAmount !== undefined
      ? String(initialData.fixedAmount)
      : "",
  percentage:
    initialData?.percentage !== null &&
    initialData?.percentage !== undefined
      ? String(initialData.percentage)
      : "",
  gracePeriodDays: String(initialData?.gracePeriodDays ?? 0),
  capAmount:
    initialData?.capAmount !== null &&
    initialData?.capAmount !== undefined
      ? String(initialData.capAmount)
      : "",
  capPercentage:
    initialData?.capPercentage !== null &&
    initialData?.capPercentage !== undefined
      ? String(initialData.capPercentage)
      : "",
  effectiveFrom: initialData?.effectiveFrom
    ? initialData.effectiveFrom.substring(0, 10)
    : "",
  effectiveTo: initialData?.effectiveTo
    ? initialData.effectiveTo.substring(0, 10)
    : "",
  priority: String(initialData?.priority ?? 0),
  isActive: initialData?.isActive ?? true,
  tiers: initialData?.tiers
    ? JSON.stringify(initialData.tiers, null, 2)
    : "[]",
});

const inputClassName =
  "h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white";

const labelClassName =
  "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300";

const PenaltyRuleForm = ({
  onSubmit,
  loading = false,
  initialData,
}: PenaltyRuleFormProps) => {
  const [formData, setFormData] = useState<PenaltyRuleFormState>(
    () => getInitialFormState(initialData)
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(getInitialFormState(initialData));
    setErrors({});
    setFormError(null);
  }, [initialData]);

  const updateField = <K extends keyof PenaltyRuleFormState>(
    field: K,
    value: PenaltyRuleFormState[K]
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));

    setFormError(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Penalty rule name is required.";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Penalty rule code is required.";
    }

    if (!formData.penaltyType) {
      newErrors.penaltyType = "Select a penalty type.";
    }

    if (!formData.contributionPlanId) {
      newErrors.contributionPlanId = "Select a contribution plan.";
    }

    if (!formData.scopeType) {
      newErrors.scopeType = "Select a penalty scope.";
    }

    if (
      formData.scopeType === "REGION" &&
      !formData.regionId
    ) {
      newErrors.regionId = "Select a region.";
    }

    if (
      formData.scopeType === "BRANCH" &&
      !formData.branchId.trim()
    ) {
      newErrors.branchId = "Branch ID is required.";
    }

    if (
      formData.scopeType === "CHAPTER" &&
      !formData.chapterId.trim()
    ) {
      newErrors.chapterId = "Chapter ID is required.";
    }

    if (
      formData.scopeType === "GROUP" &&
      !formData.groupId.trim()
    ) {
      newErrors.groupId = "Group ID is required.";
    }

    if (
      formData.scopeType === "MEMBER" &&
      !formData.memberId.trim()
    ) {
      newErrors.memberId = "Member ID is required.";
    }

    if (formData.penaltyType === "FIXED") {
      if (!formData.fixedAmount) {
        newErrors.fixedAmount = "Fixed amount is required.";
      } else if (
        !Number.isFinite(Number(formData.fixedAmount)) ||
        Number(formData.fixedAmount) <= 0
      ) {
        newErrors.fixedAmount = "Enter a valid amount greater than zero.";
      }
    }

    if (formData.penaltyType === "PERCENTAGE") {
      if (!formData.percentage) {
        newErrors.percentage = "Percentage is required.";
      } else if (
        !Number.isFinite(Number(formData.percentage)) ||
        Number(formData.percentage) <= 0
      ) {
        newErrors.percentage = "Enter a valid percentage greater than zero.";
      }
    }

    if (formData.penaltyType === "TIERED") {
      try {
        const parsedTiers: unknown = JSON.parse(formData.tiers);

        if (
          !Array.isArray(parsedTiers) ||
          parsedTiers.length === 0 ||
          !parsedTiers.every(
            (tier) =>
              typeof tier === "object" &&
              tier !== null &&
              !Array.isArray(tier)
          )
        ) {
          newErrors.tiers = "Enter a non-empty JSON array of tier objects.";
        }
      } catch {
        newErrors.tiers = "Enter valid JSON for the penalty tiers.";
      }
    }

    if (
      !formData.gracePeriodDays ||
      !Number.isInteger(Number(formData.gracePeriodDays)) ||
      Number(formData.gracePeriodDays) < 0
    ) {
      newErrors.gracePeriodDays =
        "Grace period must be a non-negative whole number.";
    }

    if (!formData.effectiveFrom) {
      newErrors.effectiveFrom = "Effective from date is required.";
    }

    if (
      formData.effectiveTo &&
      formData.effectiveFrom &&
      formData.effectiveTo < formData.effectiveFrom
    ) {
      newErrors.effectiveTo =
        "Effective to date cannot be earlier than effective from date.";
    }

    if (
      formData.priority &&
      (!Number.isInteger(Number(formData.priority)) ||
        Number(formData.priority) < 0)
    ) {
      newErrors.priority = "Priority must be a non-negative whole number.";
    }

    if (
      formData.capAmount &&
      (!Number.isFinite(Number(formData.capAmount)) ||
        Number(formData.capAmount) < 0)
    ) {
      newErrors.capAmount = "Enter a valid non-negative cap amount.";
    }

    if (
      formData.capPercentage &&
      (!Number.isFinite(Number(formData.capPercentage)) ||
        Number(formData.capPercentage) < 0)
    ) {
      newErrors.capPercentage =
        "Enter a valid non-negative cap percentage.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    let tiers: PenaltyRuleTier[] | undefined;

    if (formData.penaltyType === "TIERED") {
      tiers = JSON.parse(formData.tiers) as PenaltyRuleTier[];
    }

    const payload: CreatePenaltyRuleDto = {
      name: formData.name.trim(),
      code: formData.code.trim(),
      description: formData.description.trim() || undefined,
      penaltyType: formData.penaltyType as PenaltyType,
      contributionPlanId: formData.contributionPlanId,
      scopeType: formData.scopeType as PenaltyScopeType,

      regionId:
        formData.scopeType === "REGION"
          ? formData.regionId
          : undefined,

      branchId:
        formData.scopeType === "BRANCH"
          ? formData.branchId.trim()
          : undefined,

      chapterId:
        formData.scopeType === "CHAPTER"
          ? formData.chapterId.trim()
          : undefined,

      groupId:
        formData.scopeType === "GROUP"
          ? formData.groupId.trim()
          : undefined,

      memberId:
        formData.scopeType === "MEMBER"
          ? formData.memberId.trim()
          : undefined,

      fixedAmount:
        formData.penaltyType === "FIXED"
          ? Number(formData.fixedAmount)
          : undefined,

      percentage:
        formData.penaltyType === "PERCENTAGE"
          ? Number(formData.percentage)
          : undefined,

      gracePeriodDays: Number(formData.gracePeriodDays),

      capAmount: formData.capAmount
        ? Number(formData.capAmount)
        : undefined,

      capPercentage: formData.capPercentage
        ? Number(formData.capPercentage)
        : undefined,

      effectiveFrom: formData.effectiveFrom,

      effectiveTo: formData.effectiveTo || undefined,

      priority: formData.priority
        ? Number(formData.priority)
        : undefined,

      isActive: formData.isActive,

      tiers:
        formData.penaltyType === "TIERED"
          ? tiers
          : undefined,
    };

    try {
      setFormError(null);
      await onSubmit(payload);
    } catch {
      setFormError("Unable to submit the penalty rule. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <section className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-gray-800 dark:text-white">
            Basic Information
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Provide the penalty rule details.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelClassName}>
              Rule Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Enter penalty rule name"
              className={inputClassName}
              disabled={loading}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label className={labelClassName}>
              Rule Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(event) => updateField("code", event.target.value)}
              placeholder="e.g. LATE_PAYMENT"
              className={inputClassName}
              disabled={loading}
            />
            {errors.code && (
              <p className="mt-1 text-xs text-red-500">{errors.code}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className={labelClassName}>Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Describe when and why this penalty applies"
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white"
              disabled={loading}
            />
          </div>

          <div>
            {/* <label className={labelClassName}>
              Contribution Plan <span className="text-red-500">*</span>
            </label> */}
            <ContributionPlanDropdown
              value={formData.contributionPlanId}
              onChange={(value) =>
                updateField("contributionPlanId", value)
              }
              disabled={loading}
              required
              error={errors.contributionPlanId}
            />
          </div>

          <div>
            <label className={labelClassName}>
              Penalty Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.penaltyType}
              onChange={(event) =>
                updateField(
                  "penaltyType",
                  event.target.value as PenaltyType | ""
                )
              }
              className={inputClassName}
              disabled={loading}
            >
              <option value="">Select penalty type</option>
              <option value="FIXED">Fixed Amount</option>
              <option value="PERCENTAGE">Percentage</option>
              <option value="TIERED">Tiered</option>
            </select>
            {errors.penaltyType && (
              <p className="mt-1 text-xs text-red-500">
                {errors.penaltyType}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Penalty Configuration */}
      {formData.penaltyType && (
        <section className="space-y-4 border-t border-gray-200 pt-5 dark:border-gray-800">
          <div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-white">
              Penalty Configuration
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Configure the calculation method for this penalty.
            </p>
          </div>

          {formData.penaltyType === "FIXED" && (
            <div className="max-w-md">
              <label className={labelClassName}>
                Fixed Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={formData.fixedAmount}
                onChange={(event) =>
                  updateField("fixedAmount", event.target.value)
                }
                placeholder="Enter fixed penalty amount"
                className={inputClassName}
                disabled={loading}
              />
              {errors.fixedAmount && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.fixedAmount}
                </p>
              )}
            </div>
          )}

          {formData.penaltyType === "PERCENTAGE" && (
            <div className="max-w-md">
              <label className={labelClassName}>
                Percentage (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={formData.percentage}
                onChange={(event) =>
                  updateField("percentage", event.target.value)
                }
                placeholder="Enter penalty percentage"
                className={inputClassName}
                disabled={loading}
              />
              {errors.percentage && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.percentage}
                </p>
              )}
            </div>
          )}

          {formData.penaltyType === "TIERED" && (
            <div>
              <label className={labelClassName}>
                Penalty Tiers (JSON) <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={8}
                value={formData.tiers}
                onChange={(event) =>
                  updateField("tiers", event.target.value)
                }
                placeholder={'[\n  { "yourTierField": "yourValue" }\n]'}
                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 font-mono text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white"
                disabled={loading}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Enter an array of tier objects using the tier structure
                defined by your backend.
              </p>
              {errors.tiers && (
                <p className="mt-1 text-xs text-red-500">{errors.tiers}</p>
              )}
            </div>
          )}
        </section>
      )}

      {/* Scope */}
      <section className="space-y-4 border-t border-gray-200 pt-5 dark:border-gray-800">
        <div>
          <h3 className="text-base font-semibold text-gray-800 dark:text-white">
            Application Scope
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select where this penalty rule applies.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            {/* <label className={labelClassName}>
              Scope <span className="text-red-500">*</span>
            </label> */}
            <PenaltyRuleScopeDropdown
              value={formData.scopeType}
              onChange={(value) => {
                setFormData((previous) => ({
                  ...previous,
                  scopeType: value,
                  regionId: "",
                  branchId: "",
                  chapterId: "",
                  groupId: "",
                  memberId: "",
                }));
                setErrors({});
              }}
              disabled={loading}
              required
              error={errors.scopeType}
            />
          </div>

          {formData.scopeType === "REGION" && (
            <div>
              {/* <label className={labelClassName}>
                Region <span className="text-red-500">*</span>
              </label> */}
              <RegionDropdown
                value={formData.regionId}
                onChange={(value) => updateField("regionId", value)}
                disabled={loading}
                required
                error={errors.regionId}
              />
            </div>
          )}

          {(
            [
              {
                scope: "BRANCH",
                field: "branchId",
                label: "Branch ID",
              },
              {
                scope: "CHAPTER",
                field: "chapterId",
                label: "Chapter ID",
              },
              {
                scope: "GROUP",
                field: "groupId",
                label: "Group ID",
              },
              {
                scope: "MEMBER",
                field: "memberId",
                label: "Member ID",
              },
            ] as const
          ).map(({ scope, field, label }) =>
            formData.scopeType === scope ? (
              <div key={field}>
                <label className={labelClassName}>
                  {label} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData[field]}
                  onChange={(event) =>
                    updateField(field, event.target.value)
                  }
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className={inputClassName}
                  disabled={loading}
                />
                {errors[field] && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors[field]}
                  </p>
                )}
              </div>
            ) : null
          )}
        </div>
      </section>

      {/* Rules and Dates */}
      <section className="space-y-4 border-t border-gray-200 pt-5 dark:border-gray-800">
        <div>
          <h3 className="text-base font-semibold text-gray-800 dark:text-white">
            Rules and Effective Dates
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelClassName}>
              Grace Period (Days) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={formData.gracePeriodDays}
              onChange={(event) =>
                updateField("gracePeriodDays", event.target.value)
              }
              className={inputClassName}
              disabled={loading}
            />
            {errors.gracePeriodDays && (
              <p className="mt-1 text-xs text-red-500">
                {errors.gracePeriodDays}
              </p>
            )}
          </div>

          <div>
            <label className={labelClassName}>Cap Amount</label>
            <input
              type="number"
              min="0"
              step="any"
              value={formData.capAmount}
              onChange={(event) =>
                updateField("capAmount", event.target.value)
              }
              placeholder="Optional maximum amount"
              className={inputClassName}
              disabled={loading}
            />
            {errors.capAmount && (
              <p className="mt-1 text-xs text-red-500">
                {errors.capAmount}
              </p>
            )}
          </div>

          <div>
            <label className={labelClassName}>Cap Percentage (%)</label>
            <input
              type="number"
              min="0"
              step="any"
              value={formData.capPercentage}
              onChange={(event) =>
                updateField("capPercentage", event.target.value)
              }
              placeholder="Optional maximum percentage"
              className={inputClassName}
              disabled={loading}
            />
            {errors.capPercentage && (
              <p className="mt-1 text-xs text-red-500">
                {errors.capPercentage}
              </p>
            )}
          </div>

          <div>
            <label className={labelClassName}>
              Effective From <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.effectiveFrom}
              onChange={(event) =>
                updateField("effectiveFrom", event.target.value)
              }
              className={inputClassName}
              disabled={loading}
            />
            {errors.effectiveFrom && (
              <p className="mt-1 text-xs text-red-500">
                {errors.effectiveFrom}
              </p>
            )}
          </div>

          <div>
            <label className={labelClassName}>Effective To</label>
            <input
              type="date"
              value={formData.effectiveTo}
              onChange={(event) =>
                updateField("effectiveTo", event.target.value)
              }
              min={formData.effectiveFrom || undefined}
              className={inputClassName}
              disabled={loading}
            />
            {errors.effectiveTo && (
              <p className="mt-1 text-xs text-red-500">
                {errors.effectiveTo}
              </p>
            )}
          </div>

          <div>
            <label className={labelClassName}>Priority</label>
            <input
              type="number"
              min="0"
              step="1"
              value={formData.priority}
              onChange={(event) =>
                updateField("priority", event.target.value)
              }
              className={inputClassName}
              disabled={loading}
            />
            {errors.priority && (
              <p className="mt-1 text-xs text-red-500">
                {errors.priority}
              </p>
            )}
          </div>
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(event) =>
              updateField("isActive", event.target.checked)
            }
            disabled={loading}
            className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Activate this penalty rule
          </span>
        </label>
      </section>

      {formError && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          {formError}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : initialData
              ? "Update Penalty Rule"
              : "Create Penalty Rule"}
        </button>
      </div>
    </form>
  );
};

export default PenaltyRuleForm;