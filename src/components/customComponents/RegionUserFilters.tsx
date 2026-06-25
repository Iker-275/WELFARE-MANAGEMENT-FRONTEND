import { useEffect, useState } from "react";

import { useRegion } from "../../hooks/useRegion";
import { useRoles } from "../../hooks/useRoles";

interface RegionUserFilters {
  search?: string;
  membershipStatus?: string;
  employmentStatus?: string;
  roleId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

interface Props {
  selectedRegionId: string;
  onRegionChange: (regionId: string) => void;
  filters: RegionUserFilters;
  setFilters: (
    filters: RegionUserFilters
  ) => void;
}

export default function RegionUsersFilters({
  selectedRegionId,
  onRegionChange,
  filters,
  setFilters,
}: Props) {
  const {
    regions,
    fetchRegions,
  } = useRegion();

  const {
    roles,
    fetchRoles,
  } = useRoles();

  const [search, setSearch] =
    useState(filters.search || "");

  useEffect(() => {
    fetchRegions();
    fetchRoles();
  }, []);

  useEffect(() => {
    const timer =
      setTimeout(() => {
        setFilters({
          ...filters,
          search,
          page: 1,
        });
      }, 500);

    return () =>
      clearTimeout(timer);
  }, [search]);

  return (
    <div className="flex flex-wrap gap-4 items-center justify-between">

      <div className="flex gap-3 flex-wrap">

        {/* SEARCH */}

        <input
          type="text"
          placeholder="Search member..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="border rounded-lg px-3 py-2 w-56"
        />

        {/* REGION */}

        <select
          value={selectedRegionId}
          onChange={(e) =>
            onRegionChange(
              e.target.value
            )
          }
          className="border rounded-lg px-3 py-2"
        >
          <option value="">
            Select Region
          </option>

          {regions.map(
            (region: any) => (
              <option
                key={region.id}
                value={region.id}
              >
                {region.name}
              </option>
            )
          )}
        </select>

        {/* ROLE */}

        <select
          value={
            filters.roleId || ""
          }
          onChange={(e) =>
            setFilters({
              ...filters,
              roleId:
                e.target.value ||
                undefined,
              page: 1,
            })
          }
          className="border rounded-lg px-3 py-2"
        >
          <option value="">
            All Roles
          </option>

          {roles.map(
            (role: any) => (
              <option
                key={role.id}
                value={role.id}
              >
                {role.name}
              </option>
            )
          )}
        </select>

        {/* MEMBERSHIP STATUS */}

        <select
          value={
            filters.membershipStatus ||
            ""
          }
          onChange={(e) =>
            setFilters({
              ...filters,
              membershipStatus:
                e.target.value ||
                undefined,
              page: 1,
            })
          }
          className="border rounded-lg px-3 py-2"
        >
          <option value="">
            All Membership Status
          </option>

          <option value="active">
            Active
          </option>

          <option value="inactive">
            Inactive
          </option>

          <option value="suspended">
            Suspended
          </option>

          <option value="revoked">
            Revoked
          </option>

          <option value="deceased">
            Deceased
          </option>

          <option value="resigned">
            Resigned
          </option>

          <option value="pending">
            Pending
          </option>
        </select>

        {/* EMPLOYMENT STATUS */}

        <select
          value={
            filters.employmentStatus ||
            ""
          }
          onChange={(e) =>
            setFilters({
              ...filters,
              employmentStatus:
                e.target.value ||
                undefined,
              page: 1,
            })
          }
          className="border rounded-lg px-3 py-2"
        >
          <option value="">
            All Employment Status
          </option>

          <option value="serving">
            Serving
          </option>

          <option value="retired">
            Retired
          </option>

          <option value="former">
            Former
          </option>
        </select>

        {/* ACTIVE */}

        <select
          value={
            filters.isActive ===
            undefined
              ? ""
              : String(
                  filters.isActive
                )
          }
          onChange={(e) =>
            setFilters({
              ...filters,
              isActive:
                e.target.value ===
                ""
                  ? undefined
                  : e.target
                        .value ===
                    "true",
              page: 1,
            })
          }
          className="border rounded-lg px-3 py-2"
        >
          <option value="">
            All Users
          </option>

          <option value="true">
            Active
          </option>

          <option value="false">
            Inactive
          </option>
        </select>

        {/* RESET */}

        <button
          onClick={() =>
            setFilters({
              page: 1,
              limit: 10,
            })
          }
          className="px-4 py-2 bg-gray-200 rounded-lg"
        >
          Reset
        </button>

      </div>

    </div>
  );
}