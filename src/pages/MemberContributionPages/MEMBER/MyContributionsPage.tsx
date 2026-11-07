
import { useEffect, useState } from "react";

import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";

import { MemberContributionTable } from "../../../components/tables/BasicTables/BasicTableOne";
import MemberMyContributionFilters from "../../../components/customComponents/MemberMyContributionFilters";

import { useAuth } from "../../../hooks/useAuth";
import { useMember } from "../../../hooks/useMember";
import { useMemberContributions } from "../../../hooks/useMemberContributions";

import {
  MemberContributionFilters as MemberContributionFiltersType,
} from "../../../types/MemberContributionType";

const MyContributionsPage = () => {
  const { user } = useAuth();

  const {
    selectedMember,
    loading: memberLoading,
    message: memberMessage,
    fetchMemberByUserId,
  } = useMember();

  const {
    pagination,
    loading: contributionLoading,
    fetchMemberContributionHistory,
  } = useMemberContributions();

  const [filters, setFilters] =
    useState<MemberContributionFiltersType>({
      page: 1,
    //   limit: 10,
    });

  // Resolve the authenticated user's member record.
  useEffect(() => {
    if (user?.id) {
      fetchMemberByUserId(user.id);
    }
  }, [user?.id, fetchMemberByUserId]);

  // Load contribution history when the member becomes available.
  useEffect(() => {
    if (selectedMember?.id) {
      fetchMemberContributionHistory(selectedMember.id, {
        ...filters,
        page: 1,
        // limit: 10,
      });
    }
  }, [selectedMember?.id, fetchMemberContributionHistory]);

  const currentPage = pagination?.page ?? filters.page ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const totalRecords = pagination?.total ?? 0;

  const loading = memberLoading || contributionLoading;

  // Handle filter changes.
  const handleFilterChange = (
    updatedFilters: MemberContributionFiltersType
  ) => {
    if (!selectedMember?.id) return;

    const newFilters: MemberContributionFiltersType = {
      ...updatedFilters,
      page: 1,
    //   limit: filters.limit ?? 10,
    };

    setFilters(newFilters);

    fetchMemberContributionHistory(
      selectedMember.id,
      newFilters
    );
  };

  // Reset filters.
  const handleResetFilters = () => {
    if (!selectedMember?.id) return;

    const resetFilters: MemberContributionFiltersType = {
      page: 1,
    //   limit: 10,
    };

    setFilters(resetFilters);

    fetchMemberContributionHistory(
      selectedMember.id,
      resetFilters
    );
  };

  // Handle pagination.
  const handlePageChange = (newPage: number) => {
    if (
      loading ||
      !selectedMember?.id ||
      newPage < 1 ||
      newPage > totalPages ||
      newPage === currentPage
    ) {
      return;
    }

    const newFilters: MemberContributionFiltersType = {
      ...filters,
      page: newPage,
    //   limit: filters.limit ?? 10,
    };

    setFilters(newFilters);

    fetchMemberContributionHistory(
      selectedMember.id,
      newFilters
    );
  };

  // Generate visible page numbers.
  const getPageNumbers = () => {
    const pages: number[] = [];

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let page = startPage; page <= endPage; page++) {
      pages.push(page);
    }

    return pages;
  };

  return (
    <>
      <PageMeta
        title="My Contributions | Welfare Management"
        description="View and monitor your contribution history."
      />

      <PageBreadcrumb pageTitle="My Contributions" />

      <div className="space-y-6">
        <ComponentCard title="My Contributions">
          <div className="mb-5">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              View your contribution records, payment progress,
              outstanding balances, and contribution history.
            </p>
          </div>

          {/* Member Loading */}
          {memberLoading && !selectedMember && (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-500 dark:text-gray-400">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-brand-500" />
              Loading your member profile...
            </div>
          )}

          {/* Member Error */}
          {!memberLoading && !selectedMember && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
              {memberMessage ||
                "No member profile is linked to your account."}
            </div>
          )}

          {/* Member Contributions */}
          {selectedMember && (
            <>
              {/* Filters */}
              <div className="mb-5">
                <MemberMyContributionFilters
                  filters={filters}
                  onChange={handleFilterChange}
                  onReset={handleResetFilters}
                />
              </div>

              {/* Contributions Table */}
              <MemberContributionTable
                showMember={false}
                showActions={false}
              />

              {/* Pagination */}
              <div className="mt-5 flex flex-col gap-4 border-t border-gray-200 pt-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Page{" "}
                  <span className="font-medium text-gray-800 dark:text-white">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-gray-800 dark:text-white">
                    {totalPages}
                  </span>
                  {" · "}
                  <span className="font-medium text-gray-800 dark:text-white">
                    {totalRecords}
                  </span>{" "}
                  contributions
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handlePageChange(currentPage - 1)
                    }
                    disabled={
                      loading ||
                      currentPage <= 1 ||
                      !pagination?.hasPreviousPage
                    }
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                  >
                    Previous
                  </button>

                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => handlePageChange(page)}
                      disabled={loading || page === currentPage}
                      className={`min-w-9 rounded-lg border px-3 py-2 text-sm font-medium ${
                        page === currentPage
                          ? "border-brand-500 bg-brand-500 text-white"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                      } disabled:cursor-not-allowed`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      handlePageChange(currentPage + 1)
                    }
                    disabled={
                      loading ||
                      currentPage >= totalPages ||
                      !pagination?.hasNextPage
                    }
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </ComponentCard>
      </div>
    </>
  );
};

export default MyContributionsPage;
