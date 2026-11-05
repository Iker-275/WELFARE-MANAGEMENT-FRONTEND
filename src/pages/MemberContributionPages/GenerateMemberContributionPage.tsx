
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import MemberContributionForm from "../../components/customforms/MemberContributionForm";

import { useMemberContributions } from "../../hooks/useMemberContributions";

const GenerateMemberContributionPage = () => {
  const {
    loading,
    message,
    generateContribution,
    clearMessage,
  } = useMemberContributions();

  const handleGenerate = async (payload: {
    memberId: string;
    planId: string;
    periodId: string;
  }) => {
    clearMessage();

    await generateContribution(payload);
  };

  return (
    <>
      <PageMeta
        title="Generate Member Contribution"
        description="Generate an individual member contribution."
      />

      <PageBreadcrumb pageTitle="Generate Member Contribution" />

      <div className="space-y-6">
        <ComponentCard title="Generate Individual Contribution">
          <div className="space-y-5">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select a member, contribution plan, and contribution period
              to generate an individual contribution record.
            </p>

            {message && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                {message}
              </div>
            )}

            <MemberContributionForm
              loading={loading}
              onSubmit={handleGenerate}
            />
          </div>
        </ComponentCard>
      </div>
    </>
  );
};

export default GenerateMemberContributionPage;
