import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ContributionRuleForm from "../../components/customforms/ContributionRuleForm";

import { useContributionRules } from "../../hooks/useContributionRules";
import type { ContributionRule, CreateContributionRuleDto } from "../../types/ContributionRuleType";

const EditContributionRulePage = () => {
  const { ruleId } = useParams<{ ruleId: string }>();
  const navigate = useNavigate();

  const {
    fetchRule,
    updateRule,
    loading,
    message,
  } = useContributionRules();

  const [rule, setRule] = useState<ContributionRule | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadRule = async () => {
      if (!ruleId) {
        setPageLoading(false);
        return;
      }

      setPageLoading(true);

      const result = await fetchRule(ruleId);

      if (isMounted) {
        setRule(result);
        setPageLoading(false);
      }
    };

    loadRule();

    return () => {
      isMounted = false;
    };
  }, [ruleId, fetchRule]);

  

  const handleSubmit = async (payload: CreateContributionRuleDto) => {
  if (!ruleId) return false;

  const success = await updateRule(ruleId, { ...payload });

  if (success) {
    navigate("/contribution-rules");
  }

  return success;
};

  if (pageLoading || loading) {
    return (
      <>
        <PageMeta
          title="Edit Contribution Rule"
          description="Update an existing contribution rule."
        />

        <PageBreadcrumb pageTitle="Edit Contribution Rule" />

        <div className="py-6 text-center text-gray-500">
          Loading contribution rule...
        </div>
      </>
    );
  }

  if (!rule) {
    return (
      <>
        <PageMeta
          title="Edit Contribution Rule"
          description="Update an existing contribution rule."
        />

        <PageBreadcrumb pageTitle="Edit Contribution Rule" />

        <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
          <p className="text-sm text-gray-500">
            {message || "Contribution rule not found."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/contribution-rules")}
            className="mt-4 text-sm font-medium text-brand-500 hover:underline"
          >
            Back to Contribution Rules
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="Edit Contribution Rule"
        description="Update an existing contribution rule."
      />

      <PageBreadcrumb pageTitle="Edit Contribution Rule" />

      <div className="space-y-6">
        <ContributionRuleForm
          mode="edit"
          initialData={rule}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
};

export default EditContributionRulePage;