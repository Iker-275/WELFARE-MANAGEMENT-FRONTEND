import {
  useCallback,
  useEffect,
  useState,
} from "react";

import PageMeta from "../../components/common/PageMeta";

import ComponentCard from "../../components/common/ComponentCard";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";

import UsersFilters from "../../components/customComponents/UsersFilters";

import {UsersTable} from "../../components/tables/BasicTables/BasicTableOne";

import {
  useUser,
} from "../../hooks/useUser";

import {
  UserFilters as UserFiltersType,
} from "../../types/UserType";

export default function Users() {

  const {
    pagination,
    fetchUsers,
  } = useUser();

  const [
    filters,
    setFilters,
  ] = useState<UserFiltersType>({
    page: 1,
    limit: 10,
  });

  /*
   * ============================================================
   * FETCH USERS
   * ============================================================
   */

  useEffect(() => {

    void fetchUsers(
      filters
    );

  }, [
    filters,
    fetchUsers,
  ]);

  /*
   * ============================================================
   * UPDATE FILTERS
   * ============================================================
   */

  const updateFilters =
    useCallback(
      (
        updates: Partial<UserFiltersType>
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

  /*
   * ============================================================
   * PAGE CHANGE
   * ============================================================
   */

  const handlePageChange =
    useCallback(
      (page: number) => {

        setFilters(
          previous => ({
            ...previous,
            page,
          })
        );
      },
      []
    );

  /*
   * ============================================================
   * RESET
   * ============================================================
   */

  const handleReset =
    useCallback(() => {

      setFilters({
        page: 1,
        limit: 10,
      });

    }, []);

  /*
   * ============================================================
   * REFRESH
   * ============================================================
   */

  const handleRefresh =
    useCallback(() => {

      void fetchUsers(
        filters
      );

    }, [
      fetchUsers,
      filters,
    ]);

  return (
    <>
      <PageMeta
        title="Users"
        description="Manage system users"
      />

      <PageBreadcrumb
        pageTitle="Users"
      />

      <div className="space-y-6">

        <ComponentCard
          title="Users"
        >

          <div className="space-y-6">

            <UsersFilters
              filters={filters}
              updateFilters={
                updateFilters
              }
              onReset={
                handleReset
              }
            />

            <UsersTable
              onRefresh={
                handleRefresh
              }
            />

            {pagination &&
              pagination.total > 0 && (
                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >

                  <div
                    className="
                      text-sm
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    Page{" "}
                    {pagination.page}{" "}
                    of{" "}
                    {pagination.totalPages}

                    <span className="mx-2">
                      •
                    </span>

                    {pagination.total}{" "}
                    users
                  </div>

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
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                        dark:border-gray-700
                      "
                    >
                      Previous
                    </button>

                    <span
                      className="
                        px-3
                        text-sm
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
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                        dark:border-gray-700
                      "
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
}