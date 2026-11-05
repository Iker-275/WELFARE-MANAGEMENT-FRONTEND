
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Button from "../../components/ui/button/Button";

import ContributionPlanForm from "../../components/customforms/ContributionPlanForm";

import { useContributionPlans } from "../../hooks/useContributionPlans";

import {
  ContributionPlan,
  CreateContributionPlanDto,
} from "../../types/ContributionPlanType";

const UpdateContributionPlan = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();

  const {
    loading,
    message,
    fetchPlan,
    updatePlan,
    clearMessage,
  } = useContributionPlans();

  const [plan, setPlan] = useState<ContributionPlan | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);

  // Fetch the contribution plan when the page loads.
  useEffect(() => {
    let isMounted = true;

    const loadPlan = async () => {
      if (!planId) {
        setFetchFailed(true);
        setPageLoading(false);
        return;
      }

      setPageLoading(true);
      setFetchFailed(false);

      const result = await fetchPlan(planId);

      if (!isMounted) return;

      if (result) {
        setPlan(result);
      } else {
        setPlan(null);
        setFetchFailed(true);
      }

      setPageLoading(false);
    };

    void loadPlan();

    return () => {
      isMounted = false;
    };
  }, [planId, fetchPlan]);

  // Submit the updated contribution plan.
  const handleSubmit = async (
    payload: CreateContributionPlanDto
  ): Promise<boolean> => {
    if (!planId || submitting) return false;

    setSubmitting(true);

    try {
      const success = await updatePlan(planId, payload);

      if (success) {
        navigate("/contribution-plans", {
          replace: true,
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
        title="Update Contribution Plan | Welfare Management"
        description="Update an existing contribution plan."
      />

      <PageBreadcrumb pageTitle="Update Contribution Plan" />

      <div className="space-y-6">
        {pageLoading ? (
          <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-12 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-brand-500" />
              Loading contribution plan...
            </div>
          </div>
        ) : fetchFailed || !plan ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Unable to Load Contribution Plan
              </h3>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {message || "The requested contribution plan could not be found."}
              </p>
            </div>

            <Button onClick={handleCancel}>
              Back to Contribution Plans
            </Button>
          </div>
        ) : (
          <ContributionPlanForm
            key={plan.id}
            mode="edit"
            initialData={plan}
            loading={loading || submitting}
            message={message}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
      </div>
    </>
  );
};

export default UpdateContributionPlan;
