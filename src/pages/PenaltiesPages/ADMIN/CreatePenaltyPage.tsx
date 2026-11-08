import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";

import CreatePenaltyForm from "../../../components/customforms/CreatePenaltyForm";

const CreatePenaltyPage = () => {
  return (
    <>
      <PageMeta
        title="Create Penalty | Budgeti"
        description="Create a manual member penalty"
      />

      <PageBreadcrumb pageTitle="Create Penalty" />

      <ComponentCard title="Create Penalty">
        <CreatePenaltyForm />
      </ComponentCard>
    </>
  );
};

export default CreatePenaltyPage;