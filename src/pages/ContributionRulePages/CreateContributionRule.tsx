import { useNavigate } from "react-router-dom";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ContributionRuleForm from "../../components/customforms/ContributionRuleForm";
import { useContributionRules } from "../../hooks/useContributionRules";

const CreateContributionRulePage = () => {
  const navigate = useNavigate();

  const { createRule } = useContributionRules();

  const handleSubmit = async (
    payload: Parameters<typeof createRule>[0]
  ) => {
    const success = await createRule(payload);

    if (success) {
      navigate("/contribution-rules");
    }

    return success;
  };

  return (
    <>
      <PageMeta
        title="Create Contribution Rule"
        description="Create a new contribution rule."
      />

      <PageBreadcrumb pageTitle="Create Contribution Rule" />

      <div className="space-y-6">
        <ContributionRuleForm
          mode="create"
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
};

export default CreateContributionRulePage;