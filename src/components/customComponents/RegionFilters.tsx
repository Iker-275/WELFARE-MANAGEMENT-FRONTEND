import { useEffect, useState } from "react";

interface RegionFilters {
  search?: string;
  page?: number;
  limit?: number;
}

interface Props {
  filters: RegionFilters;
  setFilters: (filters: RegionFilters) => void;
}

export default function RegionFilters({
  filters,
  setFilters,
}: Props) {
  const [search, setSearch] =
    useState(filters.search || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({
        ...filters,
        search,
        page: 1,
      });
    }, 500);

    return () =>
      clearTimeout(timer);
  }, [search]);

  const handleReset = () => {
    setSearch("");

    setFilters({
      page: 1,
      limit: 10,
    });
  };

  return (
    <div className="flex flex-wrap gap-4 items-center justify-between">
      <div className="flex gap-3 flex-wrap">

        <input
          type="text"
          placeholder="Search region..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="border rounded-lg px-3 py-2 w-64"
        />

        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-200 rounded-lg"
        >
          Reset
        </button>

      </div>
    </div>
  );
}