import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router";

import {
  useMember,
} from "../../hooks/useMember";

import {
  MemberFilters as MemberFiltersType,
} from "../../types/MemberType";

import {RegionMembersTable }from "../../components/tables/BasicTables/BasicTableOne";

import MembershipStatusDropdown from "../../components/customDropdowns/MembershipStatusDropdown";

const RegionMembers = () => {
  const {
    fetchMembers,
  } = useMember();

  const {
    regionId,
  } = useParams<{
    regionId: string;
  }>();

  const [
    filters,
    setFilters,
  ] = useState<MemberFiltersType>({
    page: 1,
    limit: 10,
  });

  /*
   * ============================================================
   * FETCH REGION MEMBERS
   * ============================================================
   */

  useEffect(() => {
    if (!regionId) {
      return;
    }

    void fetchMembers({
      ...filters,
      regionId,
    });
  }, [
    regionId,
    filters,
    fetchMembers,
  ]);

  /*
   * ============================================================
   * FILTERS
   * ============================================================
   */

  const handleSearchChange = useCallback(
    (search: string) => {
      setFilters(previous => ({
        ...previous,
        search:
          search || undefined,
        page: 1,
      }));
    },
    []
  );

  const handleStatusChange = useCallback(
    (status: string) => {
      setFilters(previous => ({
        ...previous,
        status:
          status
            ? status as MemberFiltersType["status"]
            : undefined,
        page: 1,
      }));
    },
    []
  );

  /*
   * ============================================================
   * PAGINATION
   * ============================================================
   */

  const handlePageChange = useCallback(
    (page: number) => {
      setFilters(previous => ({
        ...previous,
        page,
      }));
    },
    []
  );

  /*
   * ============================================================
   * RESET
   * ============================================================
   */

  const handleReset = useCallback(() => {
    setFilters({
      page: 1,
      limit: 10,
    });
  }, []);

  if (!regionId) {
    return (
      <div className="p-6">
        <div
          className="
            rounded-xl
            border
            border-gray-200
            bg-white
            p-10
            text-center
            text-gray-500
            dark:border-gray-800
            dark:bg-white/[0.03]
            dark:text-gray-400
          "
        >
          Region not found.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ========================================================
          HEADER
      ======================================================== */}

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
            Region Members
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            View and manage members assigned
            to this region.
          </p>
        </div>

        <Link
          to="/regions"
          className="
            inline-flex
            items-center
            justify-center
            rounded-lg
            border
            border-gray-300
            px-4
            py-2
            text-sm
            font-medium
            text-gray-700
            hover:bg-gray-50
            dark:border-gray-700
            dark:text-gray-300
            dark:hover:bg-white/[0.03]
          "
        >
          Back to Regions
        </Link>
      </div>

      {/* ========================================================
          FILTERS
      ======================================================== */}

      <div
        className="
          rounded-xl
          border
          border-gray-200
          bg-white
          p-5
          dark:border-gray-800
          dark:bg-white/[0.03]
        "
      >
        <div
          className="
            grid
            grid-cols-1
            gap-4
            md:grid-cols-3
          "
        >
          <div>
            <label
              className="
                mb-1
                block
                text-sm
                font-medium
                text-gray-700
                dark:text-gray-300
              "
            >
              Search
            </label>

            <input
              type="text"
              placeholder="Search members..."
              value={
                filters.search || ""
              }
              onChange={event =>
                handleSearchChange(
                  event.target.value
                )
              }
              className="
                h-11
                w-full
                rounded-lg
                border
                border-gray-300
                bg-white
                px-4
                text-sm
                outline-none
                focus:border-brand-500
                dark:border-gray-700
                dark:bg-gray-900
                dark:text-white
              "
            />
          </div>

          <MembershipStatusDropdown
            value={
              filters.status || ""
            }
            onChange={
              handleStatusChange
            }
            label="Membership Status"
            placeholder="All statuses"
          />

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleReset}
              className="
                h-11
                rounded-lg
                border
                border-gray-300
                px-4
                text-sm
                font-medium
                text-gray-700
                hover:bg-gray-50
                dark:border-gray-700
                dark:text-gray-300
                dark:hover:bg-white/[0.03]
              "
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          MEMBERS
      ======================================================== */}

      <RegionMembersTable
        regionId={regionId}
        filters={filters}
        onPageChange={
          handlePageChange
        }
      />
    </div>
  );
};

export default RegionMembers;