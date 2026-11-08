
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";

import { PenaltyTable } from "../../../components/tables/BasicTables/BasicTableOne";
import PenaltyFilters from "../../../components/customComponents/PenaltyFilters";

import { usePenaltyContext } from "../../../hooks/usePenalties";

import {
  PenaltyFilters as PenaltyFiltersType,
  Penalty,
} from "../../../types/PenaltyType";

const initialFilters: PenaltyFiltersType = {
  page: 1,
  sortBy: "createdAt",
  sortOrder: "desc",
};

const AdminPenaltiesPage = () => {
  const navigate = useNavigate();

  const {
    penalties,
    pagination,
    loading,
    message,
    fetchPenaltiesByRule,
    activatePenalty,
    payPenalty,
    cancelPenalty,
    waivePenalty,
    clearMessage,
  } = usePenaltyContext();

  const [filters, setFilters] =
    useState<PenaltyFiltersType>(initialFilters);

  const ruleId = filters.penaltyRuleId;

  /**
   * Fetch penalties only when a penalty rule is selected.
   */
  const loadPenalties = useCallback(async () => {
    if (!ruleId) return;

    await fetchPenaltiesByRule(ruleId, filters);
  }, [ruleId, filters, fetchPenaltiesByRule]);

  useEffect(() => {
    if (!ruleId) return;

    loadPenalties();
  }, [ruleId, loadPenalties]);

  /**
   * Update filters and restart pagination.
   */
  const handleFilterChange = (
    nextFilters: PenaltyFiltersType,
  ) => {
    clearMessage();

    setFilters({
      ...nextFilters,
      page: 1,
    });
  };

  /**
   * Reset filters.
   * No penalties are fetched until a rule is selected again.
   */
  const handleResetFilters = () => {
    clearMessage();
    setFilters(initialFilters);
  };

  /**
   * Change page while retaining the selected rule and other filters.
   */
  const handlePageChange = (page: number) => {
    setFilters((current) => ({
      ...current,
      page,
    }));
  };

  const handleView = (penalty: Penalty) => {
    navigate(`/penalties/${penalty.id}`);
  };

  const handleActivate = async (penalty: Penalty) => {
    const confirmed = window.confirm(
      "Are you sure you want to activate this penalty?",
    );

    if (!confirmed) return;

    await activatePenalty(penalty.id);
  };

  const handlePay = async (penalty: Penalty) => {
    const confirmed = window.confirm(
      "Are you sure you want to mark this penalty as paid?",
    );

    if (!confirmed) return;

    await payPenalty(penalty.id);
  };

  const handleCancel = async (penalty: Penalty) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this penalty?",
    );

    if (!confirmed) return;

    await cancelPenalty(penalty.id);
  };

  const handleWaive = async (penalty: Penalty) => {
    const waiverReason = window.prompt(
      "Enter the reason for waiving this penalty:",
    );

    if (!waiverReason?.trim()) return;

    const confirmed = window.confirm(
      "Are you sure you want to waive this penalty?",
    );

    if (!confirmed) return;

    await waivePenalty(penalty.id, {
      waiverReason: waiverReason.trim(),
    });
  };

  const hasSelectedRule = Boolean(ruleId);

  return (
    <>
      <PageMeta
        title="Admin Penalties | Budgeti"
        description="Administrative penalty management"
      />

      <PageBreadcrumb pageTitle="Admin Penalties" />

      <div className="space-y-6">
        {/* Page heading */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Review and manage penalties across members and contribution plans.
            </p>
          </div>

          <Link
            to="/penalties/create"
            className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
          >
            Create Penalty
          </Link>
        </div>

        {/* Filters */}
        <ComponentCard title="Penalty Filters">
          <PenaltyFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />

          {!hasSelectedRule && (
            <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
              Select a penalty rule to load penalty records. A rule
              selection is required.
            </p>
          )}
        </ComponentCard>

        {/* Penalty records */}
        <ComponentCard title="Penalty Records">
          {!hasSelectedRule ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No penalties loaded. Select a penalty rule in the
                filters above to continue.
              </p>
            </div>
          ) : (
            <>
              <PenaltyTable
                penalties={penalties}
                loading={loading}
                message={message}
                showMember
                onView={handleView}
                onActivate={handleActivate}
                onPay={handlePay}
                onCancel={handleCancel}
                onWaive={handleWaive}
              />

              {/* Pagination */}
              {pagination && pagination.total > 0 && (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing page{" "}
                    <span className="font-medium text-gray-800 dark:text-white">
                      {pagination.page}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-gray-800 dark:text-white">
                      {pagination.totalPages}
                    </span>{" "}
                    ({pagination.total} records)
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handlePageChange(pagination.page - 1)
                      }
                      disabled={
                        loading || !pagination.hasPreviousPage
                      }
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      Previous
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handlePageChange(pagination.page + 1)
                      }
                      disabled={
                        loading || !pagination.hasNextPage
                      }
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </ComponentCard>
      </div>
    </>
  );
};

export default AdminPenaltiesPage;
