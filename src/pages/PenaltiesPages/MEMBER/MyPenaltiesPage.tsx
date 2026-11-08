
import { useCallback, useEffect, useState } from "react";

import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";

import { PenaltyTable } from "../../../components/tables/BasicTables/BasicTableOne";
import PenaltyFilters from "../../../components/customComponents/PenaltyFilters";

import { useAuth } from "../../../hooks/useAuth";
import { useMember } from "../../../hooks/useMember";
import { usePenaltyContext } from "../../../hooks/usePenalties";

import { PenaltyFilters as PenaltyFiltersType } from "../../../types/PenaltyType";

const initialFilters: PenaltyFiltersType = {
  page: 1,
//   limit: 10,
  sortBy: "createdAt",
  sortOrder: "desc",
};

const MyPenaltiesPage = () => {
  const { user } = useAuth();

  const {
    selectedMember,
    loading: memberLoading,
    message: memberMessage,
    fetchMemberByUserId,
  } = useMember();

  const {
    penalties,
    pagination,
    loading,
    message,
    fetchPenaltiesByMember,
    clearMessage,
  } = usePenaltyContext();

  const [filters, setFilters] =
    useState<PenaltyFiltersType>(initialFilters);

  useEffect(() => {
    if (user?.id) {
      fetchMemberByUserId(user.id);
    }
  }, [user?.id, fetchMemberByUserId]);

  const loadMyPenalties = useCallback(() => {
    if (!selectedMember?.id) return;

    fetchPenaltiesByMember(selectedMember.id, filters);
  }, [selectedMember?.id, filters, fetchPenaltiesByMember]);

  useEffect(() => {
    loadMyPenalties();
  }, [loadMyPenalties]);

  const handleFilterChange = (
    updatedFilters: PenaltyFiltersType,
  ) => {
    setFilters({
      ...updatedFilters,
      page: 1,
    });
  };

  const handleResetFilters = () => {
    clearMessage();
    setFilters(initialFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters((previous) => ({
      ...previous,
      page,
    }));
  };

  const displayMessage = memberMessage || message;
  const isLoading = memberLoading || loading;

  return (
    <>
      <PageMeta
        title="My Penalties | Budgeti"
        description="View your penalty records"
      />

      <PageBreadcrumb pageTitle="My Penalties" />

      <div className="space-y-6">
        <ComponentCard title="My Penalty Records">
          {selectedMember && (
            <div className="mb-5 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Membership Number
              </p>

              <p className="font-medium text-gray-800 dark:text-white">
                {selectedMember.membershipNumber}
              </p>
            </div>
          )}

          <PenaltyFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />

          <div className="mt-5">
            <PenaltyTable
              penalties={penalties}
              loading={isLoading}
              message={displayMessage}
              showMember={false}
            />
          </div>

          {pagination && pagination.total > 0 && (
            <div className="mt-5 flex flex-col gap-3 border-t border-gray-200 pt-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
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
                  disabled={!pagination.hasPreviousPage || loading}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300"
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handlePageChange(pagination.page + 1)
                  }
                  disabled={!pagination.hasNextPage || loading}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </ComponentCard>
      </div>
    </>
  );
};

export default MyPenaltiesPage;

