// import { useState } from "react";

// import { Link } from "react-router-dom";

// import PageMeta from "../../components/common/PageMeta";
// import PageBreadcrumb from "../../components/common/PageBreadCrumb";
// import ComponentCard from "../../components/common/ComponentCard";

// import RegionFilters from "../../components/customComponents/RegionFilters";

// import {RegionsTable} from "../../components/tables/BasicTables/BasicTableOne";

// interface RegionFiltersType {
//   search?: string;
//   page?: number;
//   limit?: number;
// }

// export default function RegionsPage() {
//   const [filters, setFilters] =
//     useState<RegionFiltersType>({
//       page: 1,
//       limit: 10,
//     });

//   return (
//     <>
//       <PageMeta
//         title="Regions"
//         description="Manage Regions"
//       />

//       <PageBreadcrumb
//         pageTitle="Regions"
//       />

//       <div className="space-y-6">

//         <ComponentCard title="Filters">
//           <RegionFilters
//             filters={filters}
//             setFilters={setFilters}
//           />
//         </ComponentCard>

//         <ComponentCard title="Regions">

//           <div className="flex justify-end mb-4">

//             <Link
//               to="/regions/create"
//               className="px-4 py-2 bg-brand-500 text-white rounded-lg"
//             >
//               Create Region
//             </Link>

//           </div>

//           <RegionsTable
//             filters={filters}
//           />

//         </ComponentCard>

//       </div>
//     </>
//   );
// }

import { useState } from "react";

import { Link } from "react-router-dom";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import RegionFilters from "../../components/customComponents/RegionFilters";

import { RegionsTable } from "../../components/tables/BasicTables/BasicTableOne";

import { useRegion } from "../../hooks/useRegion";

interface RegionFiltersType {
  search?: string;
  page?: number;
  limit?: number;
}

export default function RegionsPage() {
  const [filters, setFilters] =
    useState<RegionFiltersType>({
      page: 1,
      limit: 10,
    });

  const { message } = useRegion();

  return (
    <>
      <PageMeta
        title="Regions"
        description="Manage Regions"
      />

      <PageBreadcrumb
        pageTitle="Regions"
      />

      <div className="space-y-6">

        {message && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        <ComponentCard title="Filters">
          <RegionFilters
            filters={filters}
            setFilters={setFilters}
          />
        </ComponentCard>

        <ComponentCard title="Regions">

          <div className="flex justify-end mb-4">
            <Link
              to="/regions/create"
              className="px-4 py-2 bg-brand-500 text-white rounded-lg"
            >
              Create Region
            </Link>
          </div>

          <RegionsTable
            filters={filters}
          />

        </ComponentCard>

      </div>
    </>
  );
}