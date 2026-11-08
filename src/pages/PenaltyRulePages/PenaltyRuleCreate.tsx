import { useNavigate } from "react-router-dom";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import PenaltyRuleForm from "../../components/customforms/PenaltyRuleForm";

import { usePenaltyRules } from "../../hooks/usePenaltyRules";

import type { CreatePenaltyRuleDto } from "../../types/PenaltyRuleType";

const PenaltyRuleCreate = () => {
  const navigate = useNavigate();

  const {
    loading,
    message,
    clearMessage,
    createPenaltyRule,
  } = usePenaltyRules();

  const handleCreatePenaltyRule = async (
    payload: CreatePenaltyRuleDto
  ) => {
    clearMessage();

    const createdRule = await createPenaltyRule(payload);

    if (createdRule) {
      navigate("/penalty-rules");
    }
  };

  const handleCancel = () => {
    navigate("/penalty-rules");
  };

  return (
    <>
      <PageMeta
        title="Create Penalty Rule "
        description="Create a new contribution penalty rule."
      />

      <PageBreadcrumb pageTitle="Create Penalty Rule" />

      <div className="space-y-6">
        {/* Page Header */}
        <div>
          {/* <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Create Penalty Rule
          </h2> */}

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Configure a penalty rule and define when it applies to
            contributions.
          </p>
        </div>

        {/* Error Message */}
        {message && (
          <div className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
            <p>{message}</p>

            <button
              type="button"
              onClick={clearMessage}
              className="text-red-500 hover:text-red-700 dark:hover:text-red-300"
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        {/* Form */}
        <ComponentCard title="Penalty Rule Details">
          <PenaltyRuleForm
            onSubmit={handleCreatePenaltyRule}
            loading={loading}
          />

          <div className="mt-4 flex justify-end border-t border-gray-200 pt-4 dark:border-gray-800">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
            >
              Cancel
            </button>
          </div>
        </ComponentCard>
      </div>
    </>
  );
};

export default PenaltyRuleCreate;