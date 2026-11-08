
import { useNavigate } from "react-router-dom";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import AdjustmentsForm from "../../components/customforms/AdjustmentsForm";

const CreatePenaltyAdjustmentPage = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/penalty-adjustments");
  };

  return (
    <>
      <PageMeta
        title="Create Penalty Adjustment | Budgeti"
        description="Create a penalty adjustment request."
      />

      <PageBreadcrumb pageTitle="Create Penalty Adjustment" />

      <div className="space-y-6">
        <ComponentCard
          title="Create Penalty Adjustment"
          desc="Submit a request to waive, reduce, or increase an existing penalty. The request must be approved separately."
        >
          <AdjustmentsForm onSuccess={handleSuccess} />
        </ComponentCard>
      </div>
    </>
  );
};

export default CreatePenaltyAdjustmentPage;
