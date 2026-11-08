
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import PenaltyRuleFilters from "../../components/customComponents/PenaltyRuleFilters";
import { PenaltyRuleTable } from "../../components/tables/BasicTables/BasicTableOne";

import { usePenaltyRules } from "../../hooks/usePenaltyRules";

import type { PenaltyRuleFilters as PenaltyRuleFiltersType } from "../../types/PenaltyRuleType";

const initialFilters: PenaltyRuleFiltersType = {
  page: 1,
//   limit: 10,
  sortBy: "createdAt",
  sortOrder: "desc",
};

const PenaltyRulePage = () => {
  const navigate = useNavigate();

  const {
    penaltyRules,
    pagination,
    loading,
    message,
    clearMessage,
    fetchPenaltyRules,
    activatePenaltyRule,
    deactivatePenaltyRule,
  } = usePenaltyRules();

  const [filters, setFilters] =
    useState<PenaltyRuleFiltersType>(initialFilters);

  useEffect(() => {
    fetchPenaltyRules(filters);
  }, [filters, fetchPenaltyRules]);

  const handleFilterChange = (
    updatedFilters: PenaltyRuleFiltersType
  ) => {
    setFilters(updatedFilters);
  };

  const handleResetFilters = () => {
    clearMessage();
    setFilters(initialFilters);
  };

  const handleActivate = async (penaltyRuleId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to activate this penalty rule?"
    );

    if (!confirmed) return;

    clearMessage();

    const success = await activatePenaltyRule(penaltyRuleId);

    if (success) {
      await fetchPenaltyRules(filters);
    }
  };

  const handleDeactivate = async (penaltyRuleId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this penalty rule?"
    );

    if (!confirmed) return;

    clearMessage();

    const success = await deactivatePenaltyRule(penaltyRuleId);

    if (success) {
      await fetchPenaltyRules(filters);
    }
  };

  const handlePageChange = (page: number) => {
    setFilters((previous) => ({
      ...previous,
      page,
    }));
  };

  const handlePageSizeChange = (limit: number) => {
    setFilters((previous) => ({
      ...previous,
      page: 1,
    //   limit,
    }));
  };

  return (
    <>
      <PageMeta
        title="Penalty Rules"
        description="Manage contribution penalty rules."
      />

      <PageBreadcrumb pageTitle="Penalty Rules" />

      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {/* <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Penalty Rules
            </h2> */}

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Configure and manage penalties applied to contribution plans.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/penalty-rules/create")}
            className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
          >
            <span className="mr-2 text-lg">+</span>
            Create Penalty Rule
          </button>
        </div>

        {/* Filters */}
        <ComponentCard title="Penalty Rule Filters">
          <PenaltyRuleFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </ComponentCard>

        {/* Status Message */}
        {message && (
          <div className="flex items-start justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300">
            <p>{message}</p>

            <button
              type="button"
              onClick={clearMessage}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        {/* Penalty Rule Table */}
        <ComponentCard title="Penalty Rules">
          <PenaltyRuleTable
            penaltyRules={penaltyRules}
            loading={loading}
            message={message}
            onView={(rule) =>
              navigate(`/penalty-rules/${rule.id}`)
            }
            onActivate={(rule) =>
              handleActivate(rule.id)
            }
            onDeactivate={(rule) =>
              handleDeactivate(rule.id)
            }
          />

          {/* Pagination */}
          {pagination && (
            <div className="mt-5 flex flex-col gap-4 border-t border-gray-200 pt-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <label
                  htmlFor="penalty-rule-page-size"
                  className="text-sm text-gray-500 dark:text-gray-400"
                >
                  Rows per page:
                </label>

                <select
                  id="penalty-rule-page-size"
                  value={filters.limit ?? 10}
                  onChange={(event) =>
                    handlePageSizeChange(Number(event.target.value))
                  }
                  className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>

                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {pagination.total} total rules
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handlePageChange(pagination.page - 1)
                    }
                    disabled={!pagination.hasPreviousPage || loading}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handlePageChange(pagination.page + 1)
                    }
                    disabled={!pagination.hasNextPage || loading}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </ComponentCard>
      </div>
    </>
  );
};

export default PenaltyRulePage;
