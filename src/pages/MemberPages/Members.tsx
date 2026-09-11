
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router";

import MemberFilters from "../../components/customComponents/member/MemberFilters";

import {
  MembersTable,
} from "../../components/tables/BasicTables/BasicTableOne";

import {
  useMember,
} from "../../hooks/useMember";

import {
  MemberFilters as MemberFiltersType,
} from "../../types/MemberType";

const Members = () => {

  const {
    fetchMembers,
    pagination,
  } = useMember();

  const [
    filters,
    setFilters,
  ] = useState<MemberFiltersType>({
    page: 1,
    limit: 10,
  });

  /**
   * Fetch members whenever filters change.
   */
  useEffect(() => {

    void fetchMembers(
      filters
    );

  }, [
    filters,
    fetchMembers,
  ]);

  /**
   * Update filters.
   *
   * Any filter change returns the
   * collection to page 1.
   */
  const updateFilters = useCallback(
    (
      updates: Partial<MemberFiltersType>
    ) => {

      setFilters(
        previous => ({
          ...previous,
          ...updates,
          page: 1,
        })
      );

    },
    []
  );

  /**
   * Change page without changing
   * the other active filters.
   */
  const handlePageChange = useCallback(
    (
      page: number
    ) => {

      setFilters(
        previous => ({
          ...previous,
          page,
        })
      );

    },
    []
  );

  /**
   * Reset filters and pagination.
   */
  const handleReset = useCallback(() => {

    setFilters({
      page: 1,
      limit: 10,
    });

  }, []);

  /**
   * Refresh current page while
   * preserving filters and pagination.
   */
  const handleRefresh = useCallback(() => {

    void fetchMembers(
      filters
    );

  }, [
    fetchMembers,
    filters,
  ]);

  return (
    <div
      className="
        space-y-6
      "
    >

      {/* Page Header */}

      <div
        className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <div>

          <h1
            className="
              text-2xl
              font-semibold
              text-gray-800
              dark:text-white
            "
          >
            Members
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            Manage welfare membership and member information.
          </p>

        </div>

        <Link
          to="/members/create"
          className="
            inline-flex
            items-center
            justify-center
            rounded-lg
            bg-brand-500
            px-4
            py-2.5
            text-sm
            font-medium
            text-white
            transition
            hover:bg-brand-600
          "
        >
          + Add Member
        </Link>

      </div>

      {/* Member Filters */}

      <MemberFilters
        filters={filters}
        setFilters={updateFilters}
        onReset={handleReset}
      />

      {/* Members Table */}

      <MembersTable
        onRefresh={handleRefresh}
      />

      {/* Pagination */}

      {pagination && pagination.total > 0 && (

        <div
          className="
            flex
            flex-col
            gap-4
            rounded-xl
            border
            border-gray-200
            bg-white
            px-5
            py-4
            sm:flex-row
            sm:items-center
            sm:justify-between
            dark:border-gray-800
            dark:bg-white/[0.03]
          "
        >

          {/* Results information */}

          <div
            className="
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            Page{" "}
            <span className="font-medium text-gray-800 dark:text-white">
              {pagination.page}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-800 dark:text-white">
              {pagination.totalPages}
            </span>

            <span className="mx-2">
              •
            </span>

            {pagination.total} members
          </div>

          {/* Pagination controls */}

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <button
              type="button"
              disabled={
                !pagination.hasPreviousPage
              }
              onClick={() =>
                handlePageChange(
                  pagination.page - 1
                )
              }
              className="
                rounded-lg
                border
                border-gray-300
                px-3
                py-2
                text-sm
                font-medium
                text-gray-700
                transition
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-50
                dark:border-gray-700
                dark:text-gray-300
                dark:hover:bg-white/[0.05]
              "
            >
              Previous
            </button>

            <span
              className="
                min-w-10
                text-center
                text-sm
                font-medium
                text-gray-700
                dark:text-gray-300
              "
            >
              {pagination.page}
            </span>

            <button
              type="button"
              disabled={
                !pagination.hasNextPage
              }
              onClick={() =>
                handlePageChange(
                  pagination.page + 1
                )
              }
              className="
                rounded-lg
                border
                border-gray-300
                px-3
                py-2
                text-sm
                font-medium
                text-gray-700
                transition
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-50
                dark:border-gray-700
                dark:text-gray-300
                dark:hover:bg-white/[0.05]
              "
            >
              Next
            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default Members;