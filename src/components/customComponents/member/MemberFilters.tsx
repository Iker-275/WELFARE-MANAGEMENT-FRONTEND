
import React, {
  useEffect,
  useState,
} from "react";

import {
  MemberFilters as MemberFiltersType,
  MembershipStatus,
} from "../../../types/MemberType";

import RegionDropdown from "../../customDropdowns/RegionDropdown";
import MembershipStatusDropdown from "../../customDropdowns/MembershipStatusDropdown";

interface Props {
  filters: MemberFiltersType;

  setFilters: (
    filters: Partial<MemberFiltersType>
  ) => void;

  onReset?: () => void;
}

const MemberFilters = ({
  filters,
  setFilters,
  onReset,
}: Props) => {

  const [
    search,
    setSearch,
  ] = useState(
    filters.search ?? ""
  );

  const [
    status,
    setStatus,
  ] = useState<
    MembershipStatus | ""
  >(
    filters.status ?? ""
  );

  const [
    regionId,
    setRegionId,
  ] = useState(
    filters.regionId ?? ""
  );

  const [
    groupId,
    setGroupId,
  ] = useState(
    filters.groupId ?? ""
  );

  /*
   * Debounced search
   */
  useEffect(() => {

    const timer =
      setTimeout(() => {

        const value =
          search.trim() ||
          undefined;

        if (
          value === filters.search
        ) {
          return;
        }

        setFilters({
          search: value,
        });

      }, 500);

    return () =>
      clearTimeout(timer);

  }, [
    search,
  ]);

  /*
   * Membership status
   */
  const handleStatusChange = (
    value: string
  ) => {

    const selectedStatus =
      value
        ? (
            value as MembershipStatus
          )
        : undefined;

    setStatus(
      selectedStatus ?? ""
    );

    setFilters({
      status:
        selectedStatus,
    });
  };

  /*
   * Region
   */
  const handleRegionChange = (
    value: string
  ) => {

    setRegionId(value);

    setFilters({
      regionId:
        value || undefined,
    });
  };

  /*
   * Group
   */
  const handleGroupChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const value =
      event.target.value;

    setGroupId(value);

    setFilters({
      groupId:
        value.trim() ||
        undefined,
    });
  };

  /*
   * Reset
   */
  const handleReset = () => {

    setSearch("");
    setStatus("");
    setRegionId("");
    setGroupId("");

    onReset?.();
  };

  return (
    <div
      className="
        flex
        flex-wrap
        items-center
        justify-between
        gap-4
      "
    >

      <div
        className="
          flex
          flex-wrap
          gap-3
        "
      >

        {/* Search */}

        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          className="
            w-64
            rounded-lg
            border
            border-gray-300
            bg-white
            px-3
            py-2
            text-sm
            outline-none
            focus:border-brand-500
            dark:border-gray-700
            dark:bg-gray-900
            dark:text-white
          "
        />

        {/* Membership Status */}

        <MembershipStatusDropdown
          value={status}
          onChange={
            handleStatusChange
          }
          label=""
          placeholder="All statuses"
        />

        {/* Region */}

        <RegionDropdown
          value={regionId}
          onChange={
            handleRegionChange
          }
          label=""
          placeholder="All regions"
          includeAllOption
          allOptionLabel="All regions"
        />

        {/* Group */}

        <input
          type="text"
          placeholder="Group ID..."
          value={groupId}
          onChange={
            handleGroupChange
          }
          className="
            w-40
            rounded-lg
            border
            border-gray-300
            bg-white
            px-3
            py-2
            text-sm
            outline-none
            focus:border-brand-500
            dark:border-gray-700
            dark:bg-gray-900
            dark:text-white
          "
        />

        {/* Reset */}

        <button
          type="button"
          onClick={handleReset}
          className="
            rounded-lg
            bg-gray-200
            px-4
            py-2
            text-sm
            font-medium
            text-gray-700
            hover:bg-gray-300
            dark:bg-gray-800
            dark:text-gray-300
            dark:hover:bg-gray-700
          "
        >
          Reset
        </button>

      </div>

    </div>
  );
};

export default MemberFilters;