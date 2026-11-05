
import { useState, FormEvent } from "react";

import ContributionPlanDropdown from "../customDropdowns/ContributionPlanDropdown";
import ContributionPeriodDropdown from "../customDropdowns/ContributionPeriodDropdown";
import MemberMultiSelect from "../customComponents/MemberMultiSelect";

export interface GenerateBulkMemberContributionPayload {
  memberIds: string[];
  planId: string;
  periodId: string;
}

interface BulkMemberContributionFormProps {
  loading: boolean;
  onSubmit: (
    payload: GenerateBulkMemberContributionPayload
  ) => Promise<void>;
}

const BulkMemberContributionForm = ({
  loading,
  onSubmit,
}: BulkMemberContributionFormProps) => {
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [planId, setPlanId] = useState("");
  const [periodId, setPeriodId] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (memberIds.length === 0) {
      newErrors.memberIds = "Select at least one member.";
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

    if (loading || !validate()) return;

    await onSubmit({
      memberIds,
      planId,
      periodId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-5">
        {/* Contribution Plan */}
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

        {/* Contribution Period */}
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

        {/* Member Selection */}
        <MemberMultiSelect
          value={memberIds}
          onChange={(ids) => {
            setMemberIds(ids);

            setErrors((previous) => ({
              ...previous,
              memberIds: "",
            }));
          }}
          label="Select Members"
          placeholder="Search and select members..."
          required
          disabled={loading}
          pageSize={10}
          error={errors.memberIds}
        />
      </div>

      {/* Selection Summary */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Selected members
          </span>

          <span className="text-lg font-semibold text-gray-800 dark:text-white">
            {memberIds.length}
          </span>
        </div>

        <p className="mt-1 text-xs text-gray-500">
          Contributions will be generated for the selected members.
        </p>
      </div>

      {/* Submit */}
      <div className="flex justify-end border-t border-gray-100 pt-5 dark:border-gray-800">
        <button
          type="submit"
          disabled={loading || memberIds.length === 0 || !planId || !periodId}
          className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Generating Contributions...
            </>
          ) : (
            `Generate ${memberIds.length} Contribution(s)`
          )}
        </button>
      </div>
    </form>
  );
};

export default BulkMemberContributionForm;
