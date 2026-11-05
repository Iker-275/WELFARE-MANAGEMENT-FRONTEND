
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";

import ContributionPlanFilters from "../../components/customComponents/ContributionPlanFilters";
import { ContributionPlansTable } from "../../components/tables/BasicTables/BasicTableOne";

import { useContributionPlans } from "../../hooks/useContributionPlans";

import { ContributionPlanFilters as ContributionPlanFiltersType } from "../../types/ContributionPlanType";

const ContributionPlans = () => {
  const navigate = useNavigate();

  const {
    pagination,
    loading,
    fetchPlans,
  } = useContributionPlans();

  const [filters, setFilters] = useState<ContributionPlanFiltersType>({
    page: 1,
    // limit: 20,
  });

  // Fetch plans whenever the filters or pagination change.
  useEffect(() => {
    void fetchPlans(filters);
  }, [filters, fetchPlans]);

  const handleEdit = (plan: { id: string }) => {
    navigate(`/contribution-plans/edit/${plan.id}`);
  };

  const handlePageChange = (page: number) => {
    setFilters((previous) => ({
      ...previous,
      page,
    }));
  };

  const handleLimitChange = (limit: number) => {
    setFilters((previous) => ({
      ...previous,
      page: 1,
       limit,
    }));
  };

  const currentPage = pagination?.page ?? filters.page ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const totalRecords = pagination?.total ?? 0;
  const pageLimit = pagination?.limit ?? filters.limit ?? 20;

  const startRecord =
    totalRecords === 0 ? 0 : (currentPage - 1) * pageLimit + 1;

  const endRecord = Math.min(
    currentPage * pageLimit,
    totalRecords
  );

  return (
    <>
      <PageMeta
        title="Contribution Plans | Welfare Management"
        description="Manage contribution plans."
      />

      <PageBreadcrumb pageTitle="Contribution Plans" />

      <div className="space-y-6">
        <ComponentCard title="Contribution Plans">
          {/* Page Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Manage Contribution Plans
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Create, view, update, activate, deactivate and archive
                contribution plans.
              </p>
            </div>

            <Link to="/contribution-plans/create">
              <Button>
                Create Contribution Plan
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <ContributionPlanFilters
              filters={filters}
              setFilters={setFilters}
            />
          </div>

          {/* Table */}
          <ContributionPlansTable onEdit={handleEdit} />

          {/* Pagination */}
          <div className="mt-6 flex flex-col gap-4 border-t border-gray-200 pt-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400 sm:flex-row sm:items-center sm:gap-4">
              <span>
                Showing {startRecord}–{endRecord} of {totalRecords} plans
              </span>

              <div className="flex items-center gap-2">
                <label htmlFor="contribution-plan-page-limit">
                  Rows:
                </label>

                <select
                  id="contribution-plan-page-limit"
                  value={pageLimit}
                  onChange={(event) =>
                    handleLimitChange(Number(event.target.value))
                  }
                  disabled={loading}
                  className="rounded-lg border border-gray-300 bg-transparent px-2 py-1.5 text-sm text-gray-700 outline-none focus:border-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={loading || currentPage <= 1}
              >
                Previous
              </Button>

              <span className="px-2 text-sm text-gray-600 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={loading || currentPage >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </ComponentCard>
      </div>
    </>
  );
};

export default ContributionPlans;
