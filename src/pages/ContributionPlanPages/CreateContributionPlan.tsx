
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

import ContributionPlanForm from "../../components/customforms/ContributionPlanForm";

import { useContributionPlans } from "../../hooks/useContributionPlans";

const CreateContributionPlan = () => {
  const navigate = useNavigate();

  const {
    loading,
    message,
    createPlan,
    clearMessage,
  } = useContributionPlans();

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (
    payload: Parameters<typeof createPlan>[0]
  ) => {
    if (submitting) return false;

    setSubmitting(true);

    try {
      const success = await createPlan(payload);

      if (success) {
        navigate("/contribution-plans", {
          replace: true,
          state: {
            message,
          },
        });
      }

      return success;
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    clearMessage();
    navigate("/contribution-plans");
  };

  return (
    <>
      <PageMeta
        title="Create Contribution Plan | Welfare Management"
        description="Create a new contribution plan."
      />

      <PageBreadcrumb pageTitle="Create Contribution Plan" />

      <div className="space-y-6">
        <ContributionPlanForm
          mode="create"
          loading={loading || submitting}
          message={message}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </>
  );
};

export default CreateContributionPlan;
