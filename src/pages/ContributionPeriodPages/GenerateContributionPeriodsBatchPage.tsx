
// import { useNavigate } from "react-router-dom";

// import PageMeta from "../../components/common/PageMeta";
// import PageBreadcrumb from "../../components/common/PageBreadCrumb";

// import GenerateContributionPeriodsBatchForm from "../../components/customforms/GenerateContributionPeriodsBatchForm";
// import { useContributionPeriods } from "../../hooks/useContributionPeriods";

// import type {
//   GenerateContributionPeriodsBatchDto,
// } from "../../types/ContributionPeriodType";

// const GenerateContributionPeriodsBatchPage = () => {
//   const navigate = useNavigate();

//   const {
//     generateBatch,
//     loading,
//   } = useContributionPeriods();

//   const handleSubmit = async (
//     payload: GenerateContributionPeriodsBatchDto
//   ): Promise<boolean> => {
//     const success = await generateBatch(payload);

//     if (success) {
//       navigate("/contribution-periods");
//     }

//     return success;
//   };

//   return (
//     <>
//       <PageMeta
//         title="Generate Multiple Contribution Periods"
//         description="Generate multiple contribution periods for a contribution plan."
//       />

//       <PageBreadcrumb pageTitle="Generate Multiple Contribution Periods" />

//       <div className="space-y-6">
//         <GenerateContributionPeriodsBatchForm
//           onSubmit={handleSubmit}
//           loading={loading}
//         />
//       </div>
//     </>
//   );
// };

// export default GenerateContributionPeriodsBatchPage;


import { useEffect } from "react";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

import GenerateContributionPeriodsBatchForm from "../../components/customforms/GenerateContributionPeriodsBatchForm";

import { useContributionPeriods } from "../../hooks/useContributionPeriods";

import type {
  GenerateContributionPeriodsBatchDto,
} from "../../types/ContributionPeriodType";

const GenerateContributionPeriodsBatchPage = () => {

  const {
    generateBatch,
    loading,
    message,
    clearMessage,
  } = useContributionPeriods();

  useEffect(() => {
    clearMessage();
  }, [clearMessage]);

  const handleSubmit = async (
    payload: GenerateContributionPeriodsBatchDto
  ): Promise<boolean> => {
    return await generateBatch(payload);
  };

  return (
    <>
      <PageMeta
        title="Generate Multiple Contribution Periods"
        description="Generate multiple contribution periods for a contribution plan."
      />

      <PageBreadcrumb pageTitle="Generate Multiple Contribution Periods" />

      <div className="space-y-6">
        {message && (
          <div
            className={`rounded-lg border px-4 py-3 text-sm ${
              message.toLowerCase().includes("success")
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <GenerateContributionPeriodsBatchForm
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </>
  );
};

export default GenerateContributionPeriodsBatchPage;
