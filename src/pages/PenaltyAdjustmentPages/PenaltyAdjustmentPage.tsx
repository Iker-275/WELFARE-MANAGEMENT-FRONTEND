
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import { PenaltyAdjustmentTable } from "../../components/tables/BasicTables/BasicTableOne";
import PenaltyAdjustmentFilters from "../../components/customComponents/PenaltyAdjustmentFilters";

import { usePenaltyAdjustmentContext } from "../../hooks/usePenaltyAdjustments";

import {
  PenaltyAdjustmentListFilters,
  PenaltyAdjustmentType,
} from "../../types/PenaltyAdjustmentType";

const initialFilters: PenaltyAdjustmentListFilters = {
  page: 1,
//   limit: 10,
  sortBy: "createdAt",
  sortOrder: "desc",
};

const PenaltyAdjustmentPage = () => {
  const navigate = useNavigate();

  const {
    adjustments,
    pagination,
    loading,
    message,
    fetchPendingAdjustments,
    fetchAdjustmentsByType,
    approveAdjustment,
    clearMessage,
  } = usePenaltyAdjustmentContext();

  const [filters, setFilters] =
    useState<PenaltyAdjustmentListFilters>(initialFilters);

  const [adjustmentType, setAdjustmentType] =
    useState<PenaltyAdjustmentType | "">("");

  const loadAdjustments = useCallback(async () => {
    if (adjustmentType) {
      await fetchAdjustmentsByType(adjustmentType, filters);
    } else {
      await fetchPendingAdjustments(filters);
    }
  }, [
    adjustmentType,
    filters,
    fetchAdjustmentsByType,
    fetchPendingAdjustments,
  ]);

  useEffect(() => {
    loadAdjustments();
  }, [loadAdjustments]);

  const handleTypeChange = (type: PenaltyAdjustmentType | "") => {
    setAdjustmentType(type);
    setFilters((current) => ({
      ...current,
      page: 1,
    }));
  };

  const handleFiltersChange = (
    updatedFilters: PenaltyAdjustmentListFilters,
  ) => {
    setFilters(updatedFilters);
  };

  const handleResetFilters = () => {
    setAdjustmentType("");
    setFilters({ ...initialFilters });
  };

  const handleView = (adjustmentId: string) => {
    navigate(`/penalty-adjustments/${adjustmentId}`);
  };

  const handleApprove = async (adjustmentId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this penalty adjustment?",
    );

    if (!confirmed) return;

    clearMessage();

    const success = await approveAdjustment(adjustmentId);

    if (success) {
      await loadAdjustments();
    }
  };

  const handlePreviousPage = () => {
    if (!pagination || pagination.page <= 1) return;

    setFilters((current) => ({
      ...current,
      page: pagination.page - 1,
    }));
  };

  const handleNextPage = () => {
    if (!pagination || pagination.page >= pagination.totalPages) return;

    setFilters((current) => ({
      ...current,
      page: pagination.page + 1,
    }));
  };

  return (
    <>
      <PageMeta
        title="Penalty Adjustments | Budgeti"
        description="Manage and review penalty adjustment requests."
      />

      <PageBreadcrumb pageTitle="Penalty Adjustments" />

      <div className="space-y-6">
        <ComponentCard
          title="Penalty Adjustments"
          desc="Review, filter, and approve penalty adjustment requests."
        >
          <div className="space-y-6">
            {/* Header actions */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                  Adjustment Requests
                </h3>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Review submitted waivers, reductions, and increases.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/penalty-adjustments/create")
                }
                className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
              >
                Create Adjustment
              </button>
            </div>

            {/* Filters */}
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <PenaltyAdjustmentFilters
                filters={filters}
                adjustmentType={adjustmentType}
                onChange={handleFiltersChange}
                onTypeChange={handleTypeChange}
                onReset={handleResetFilters}
              />
            </div>

            {/* API message */}
            {message && (
              <div className="rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                {message}
              </div>
            )}

            {/* Table */}
            <PenaltyAdjustmentTable
              adjustments={adjustments}
              loading={loading}
              onView={(adjustment) => handleView(adjustment.id)}
              onApprove={(adjustment) => handleApprove(adjustment.id)}
            />

            {/* Pagination */}
            {pagination && pagination.total > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-4 dark:border-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing page{" "}
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    {pagination.page}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    {pagination.totalPages}
                  </span>{" "}
                  ({pagination.total} records)
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePreviousPage}
                    disabled={loading || pagination.page <= 1}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={
                      loading ||
                      pagination.page >= pagination.totalPages
                    }
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </ComponentCard>
      </div>
    </>
  );
};

export default PenaltyAdjustmentPage;
