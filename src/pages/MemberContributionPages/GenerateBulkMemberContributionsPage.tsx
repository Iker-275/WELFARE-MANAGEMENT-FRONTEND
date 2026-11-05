
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import BulkMemberContributionForm from "../../components/customforms/BulkMemberContributionForm";

import { useMemberContributions } from "../../hooks/useMemberContributions";

const GenerateBulkMemberContributionsPage = () => {
  const {
    loading,
    message,
    generateBulkContributions,
    clearMessage,
  } = useMemberContributions();

  const handleGenerate = async (payload: {
    memberIds: string[];
    planId: string;
    periodId: string;
  }) => {
    clearMessage();

    await generateBulkContributions(payload);
  };

  return (
    <>
      <PageMeta
        title="Generate Bulk Member Contributions"
        description="Generate contributions for multiple members."
      />

      <PageBreadcrumb pageTitle="Generate Bulk Contributions" />

      <div className="space-y-6">
        <ComponentCard title="Generate Bulk Member Contributions">
          <div className="space-y-5">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select a contribution plan and period, then choose the
              members who should receive the contribution.
            </p>

            {message && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                {message}
              </div>
            )}

            <BulkMemberContributionForm
              loading={loading}
              onSubmit={handleGenerate}
            />
          </div>
        </ComponentCard>
      </div>
    </>
  );
};

export default GenerateBulkMemberContributionsPage;
