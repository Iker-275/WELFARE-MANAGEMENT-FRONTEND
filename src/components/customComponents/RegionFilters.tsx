
import {
  useEffect,
  useState,
} from "react";

import {
  RegionFilters as RegionFiltersType,
} from "../../types/RegionType";

interface Props {
  filters: RegionFiltersType;

  setFilters: (
    filters: RegionFiltersType
  ) => void;

  onReset?: () => void;
}

export default function RegionFilters({
  filters,
  setFilters,
  onReset,
}: Props) {
  const [search, setSearch] =
    useState(
      filters.search ?? ""
    );

  useEffect(() => {
    const timer =
      setTimeout(() => {
        setFilters({
          search:
            search.trim() || undefined,
        });
      }, 500);

    return () =>
      clearTimeout(timer);
  }, [
    search,
    setFilters,
  ]);

  const handleReset = () => {
    setSearch("");

    setFilters({});

    onReset?.();
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search region..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          className="w-64 rounded-lg border px-3 py-2"
        />

        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg bg-gray-200 px-4 py-2"
        >
          Reset
        </button>
      </div>
    </div>
  );
}