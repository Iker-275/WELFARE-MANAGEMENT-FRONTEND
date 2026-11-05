
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import memberService from "../../api/MemberApi";

import {
  Member,
  MemberFilters,
  MemberPagination,
  MembershipStatus,
} from "../../types/MemberType";

import RegionDropdown from "../customDropdowns/RegionDropdown";
import MemberContributionStatusDropdown from "../customDropdowns/MemberContributionStatusDropdown";

interface MemberMultiSelectProps {
  value: string[];
  onChange: (memberIds: string[]) => void;

  label?: string;
  placeholder?: string;

  disabled?: boolean;
  required?: boolean;
  error?: string;

  pageSize?: number;
}

const MemberMultiSelect = ({
  value,
  onChange,
  label = "Members",
  placeholder = "Search members...",
  disabled = false,
  required = false,
  error,
  pageSize = 10,
}: MemberMultiSelectProps) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [pagination, setPagination] =
    useState<MemberPagination | null>(null);

  const [search, setSearch] = useState("");
  const [regionId, setRegionId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const requestIdRef = useRef(0);

  /**
   * Fetch members independently of MemberContext.
   */
  const fetchMembers = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setFetchError("");

    const filters: MemberFilters = {
      page,
      limit: pageSize,
      ...(search.trim() && { search: search.trim() }),
      ...(regionId && { regionId }),
      ...(groupId && { groupId }),
      ...(status && {
        status: status as MembershipStatus,
      }),
    };

    try {
      const response = await memberService.getAll(filters);

      // Ignore outdated responses.
      if (requestId !== requestIdRef.current) return;

      setMembers(response.data);
      setPagination(response.pagination);
    } catch (err: unknown) {
      if (requestId !== requestIdRef.current) return;

      const message =
        err instanceof Error
          ? err.message
          : "Failed to load members.";

      setFetchError(message);
      setMembers([]);
      setPagination(null);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [page, pageSize, search, regionId, groupId, status]);

  /**
   * Fetch whenever filters or page changes.
   */
  useEffect(() => {
    fetchMembers();

    return () => {
      requestIdRef.current++;
    };
  }, [fetchMembers]);

  /**
   * Reset pagination when filters change.
   */
  const updateSearch = (nextValue: string) => {
    setSearch(nextValue);
    setPage(1);
  };

  const updateRegion = (nextValue: string) => {
    setRegionId(nextValue);
    setPage(1);
  };

  const updateGroup = (nextValue: string) => {
    setGroupId(nextValue);
    setPage(1);
  };

  const updateStatus = (nextValue: string) => {
    setStatus(nextValue);
    setPage(1);
  };

  /**
   * Toggle an individual member.
   */
  const toggleMember = (memberId: string) => {
    if (value.includes(memberId)) {
      onChange(value.filter((id) => id !== memberId));
      return;
    }

    onChange([...value, memberId]);
  };

  /**
   * Select or deselect only the currently loaded page.
   */
  const loadedMemberIds = useMemo(
    () => members.map((member) => member.id),
    [members]
  );

  const allLoadedSelected =
    loadedMemberIds.length > 0 &&
    loadedMemberIds.every((id) => value.includes(id));

  const toggleAllLoaded = () => {
    if (allLoadedSelected) {
      onChange(
        value.filter((id) => !loadedMemberIds.includes(id))
      );
      return;
    }

    onChange(
      Array.from(new Set([...value, ...loadedMemberIds]))
    );
  };

  /**
   * Display member's full name.
   */
  const getMemberName = (member: Member) => {
    const profile = member.profile;

    return [
      profile?.firstName,
      profile?.otherNames,
      profile?.lastName,
    ]
      .filter(Boolean)
      .join(" ") || "Unnamed Member";
  };

  const clearFilters = () => {
    setSearch("");
    setRegionId("");
    setGroupId("");
    setStatus("");
    setPage(1);
  };

  return (
    <div className="relative space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}

          {required && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>
      )}

      {/* Selected members summary */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-left text-sm dark:border-gray-700 dark:bg-gray-900"
      >
        <span className="text-gray-700 dark:text-gray-200">
          {value.length > 0
            ? `${value.length} member(s) selected`
            : placeholder}
        </span>

        <span className="text-gray-400">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {isOpen && (
        <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => updateSearch(e.target.value)}
            placeholder="Search by member name or membership number..."
            disabled={disabled}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />

          {/* Filters */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <RegionDropdown
              value={regionId}
              onChange={updateRegion}
              label="Region"
              includeAllOption
              allOptionLabel="All Regions"
              disabled={disabled}
            />

            <MemberContributionStatusDropdown
              value={status}
              onChange={updateStatus}
              label="Contribution Status"
              placeholder="All Membership Statuses"
              includeAllOption
              allOptionLabel="All Membership Statuses"
              disabled={disabled}
            />

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Group ID
              </label>

              <input
                type="text"
                value={groupId}
                onChange={(e) => updateGroup(e.target.value)}
                placeholder="Enter group ID"
                disabled={disabled}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={clearFilters}
              disabled={disabled}
              className="text-sm text-brand-500 hover:underline"
            >
              Clear filters
            </button>

            <span className="text-xs text-gray-500">
              {pagination
                ? `${pagination.total} matching members`
                : ""}
            </span>
          </div>

          {/* Select loaded members */}
          <div className="flex items-center justify-between border-y border-gray-200 py-3 dark:border-gray-700">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={allLoadedSelected}
                onChange={toggleAllLoaded}
                disabled={disabled || loading || members.length === 0}
              />

              Select all on this page
            </label>

            <button
              type="button"
              onClick={() => onChange([])}
              disabled={disabled || value.length === 0}
              className="text-sm text-red-500 hover:underline"
            >
              Clear selection
            </button>
          </div>

          {/* Results */}
          <div className="max-h-72 space-y-2 overflow-y-auto">
            {loading ? (
              <p className="py-6 text-center text-sm text-gray-500">
                Loading members...
              </p>
            ) : fetchError ? (
              <p className="py-6 text-center text-sm text-red-500">
                {fetchError}
              </p>
            ) : members.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-500">
                No members found.
              </p>
            ) : (
              members.map((member) => (
                <label
                  key={member.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <input
                    type="checkbox"
                    checked={value.includes(member.id)}
                    onChange={() => toggleMember(member.id)}
                    disabled={disabled}
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-800 dark:text-white">
                      {getMemberName(member)}
                    </p>

                    <p className="text-xs text-gray-500">
                      {member.membershipNumber}
                    </p>
                  </div>

                  <span className="text-xs text-gray-500">
                    {member.status}
                  </span>
                </label>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
              <button
                type="button"
                disabled={
                  disabled ||
                  loading ||
                  !pagination.hasPreviousPage
                }
                onClick={() => setPage((current) => current - 1)}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700"
              >
                Previous
              </button>

              <span className="text-sm text-gray-500">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                type="button"
                disabled={
                  disabled ||
                  loading ||
                  !pagination.hasNextPage
                }
                onClick={() => setPage((current) => current + 1)}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700"
              >
                Next
              </button>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default MemberMultiSelect;
