
// import { useNavigate } from "react-router-dom";

// import PageMeta from "../../components/common/PageMeta";
// import PageBreadcrumb from "../../components/common/PageBreadCrumb";

// import GenerateContributionPeriodForm from "../../components/customforms/GenerateContributionPeriodForm";

// import { useContributionPeriods } from "../../hooks/useContributionPeriods";

// import type {
//   GenerateContributionPeriodDto,
// } from "../../types/ContributionPeriodType";

// const GenerateContributionPeriodPage = () => {
//   const navigate = useNavigate();

//   const {
//     generatePeriod,
//     loading,
//   } = useContributionPeriods();

//   const handleSubmit = async (
//     payload: GenerateContributionPeriodDto
//   ): Promise<boolean> => {
//     const success = await generatePeriod(payload);

//     if (success) {
//       navigate("/contribution-periods");
//     }

//     return success;
//   };

//   return (
//     <>
//       <PageMeta
//         title="Generate Contribution Period"
//         description="Generate a contribution period for a contribution plan."
//       />

//       <PageBreadcrumb pageTitle="Generate Contribution Period" />

//       <div className="space-y-6">
//         <GenerateContributionPeriodForm
//           onSubmit={handleSubmit}
//           loading={loading}
//         />
//       </div>
//     </>
//   );
// };

// export default GenerateContributionPeriodPage;


import { useEffect } from "react";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

import GenerateContributionPeriodForm from "../../components/customforms/GenerateContributionPeriodForm";

import { useContributionPeriods } from "../../hooks/useContributionPeriods";

import type {
  GenerateContributionPeriodDto,
} from "../../types/ContributionPeriodType";

const GenerateContributionPeriodPage = () => {
  

  const {
    generatePeriod,
    loading,
    message,
    clearMessage,
  } = useContributionPeriods();

  useEffect(() => {
    clearMessage();
  }, [clearMessage]);

  const handleSubmit = async (
    payload: GenerateContributionPeriodDto
  ): Promise<boolean> => {
    return await generatePeriod(payload);
  };

  useEffect(() => {
    if (!loading && message) {
      // Navigation is handled after a successful submission below.
    }
  }, [loading, message]);

  return (
    <>
      <PageMeta
        title="Generate Contribution Period"
        description="Generate a contribution period for a contribution plan."
      />

      <PageBreadcrumb pageTitle="Generate Contribution Period" />

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

        <GenerateContributionPeriodForm
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </>
  );
};

export default GenerateContributionPeriodPage;
