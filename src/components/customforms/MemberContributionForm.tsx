
import { useState, FormEvent } from "react";

import ContributionPlanDropdown from "../customDropdowns/ContributionPlanDropdown";
import ContributionPeriodDropdown from "../customDropdowns/ContributionPeriodDropdown";

export interface GenerateMemberContributionPayload {
  memberId: string;
  planId: string;
  periodId: string;
}

interface MemberContributionFormProps {
  loading: boolean;
  onSubmit: (payload: GenerateMemberContributionPayload) => Promise<void>;
}

const MemberContributionForm = ({
  loading,
  onSubmit,
}: MemberContributionFormProps) => {
  const [memberId, setMemberId] = useState("");
  const [planId, setPlanId] = useState("");
  const [periodId, setPeriodId] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!memberId.trim()) {
      newErrors.memberId = "Member ID is required.";
    }

    if (!planId) {
      newErrors.planId = "Contribution plan is required.";
    }

    if (!periodId) {
      newErrors.periodId = "Contribution period is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) return;

    await onSubmit({
      memberId: memberId.trim(),
      planId,
      periodId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Member */}
        <div className="md:col-span-2">
          <label
            htmlFor="memberId"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Member ID <span className="text-red-500">*</span>
          </label>

          <input
            id="memberId"
            type="text"
            value={memberId}
            onChange={(event) => {
              setMemberId(event.target.value);
              setErrors((previous) => ({
                ...previous,
                memberId: "",
              }));
            }}
            placeholder="Enter member ID"
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />

          {errors.memberId && (
            <p className="mt-1 text-xs text-red-500">
              {errors.memberId}
            </p>
          )}
        </div>

        {/* Contribution Plan */}
        <div>
          <ContributionPlanDropdown
            value={planId}
            onChange={(value) => {
              setPlanId(value);
              setPeriodId("");

              setErrors((previous) => ({
                ...previous,
                planId: "",
                periodId: "",
              }));
            }}
            label="Contribution Plan"
            placeholder="Select contribution plan"
            required
            disabled={loading}
            error={errors.planId}
          />
        </div>

        {/* Contribution Period */}
        <div>
          <ContributionPeriodDropdown
            value={periodId}
            onChange={(value) => {
              setPeriodId(value);

              setErrors((previous) => ({
                ...previous,
                periodId: "",
              }));
            }}
            planId={planId}
            label="Contribution Period"
            placeholder={
              planId
                ? "Select contribution period"
                : "Select a plan first"
            }
            required
            disabled={loading || !planId}
            error={errors.periodId}
          />
        </div>
      </div>

      <div className="flex justify-end border-t border-gray-100 pt-5 dark:border-gray-800">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Generating...
            </>
          ) : (
            "Generate Contribution"
          )}
        </button>
      </div>
    </form>
  );
};

export default MemberContributionForm;
