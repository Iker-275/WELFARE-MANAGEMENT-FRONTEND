import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import RegionFilters from "../../components/customComponents/RegionFilters";
import { RegionsTable } from "../../components/tables/BasicTables/BasicTableOne";

import { useRegion } from "../../hooks/useRegion";

import {
  RegionFilters as RegionFiltersType,
} from "../../types/RegionType";

export default function RegionsPage() {
  const [filters, setFilters] =
    useState<RegionFiltersType>({});

  const {
    message,
    loading,
    fetchRegions,
    clearMessage,
  } = useRegion();

  useEffect(() => {
    fetchRegions(filters);
  }, [
    fetchRegions,
    filters,
  ]);

  return (
    <>
      <PageMeta
        title="Regions"
        description="Manage Regions"
      />

      <PageBreadcrumb
        pageTitle="Regions"
      />

      <div className="space-y-6">

        {message && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        <ComponentCard title="Filters">
          <RegionFilters
            filters={filters}
            setFilters={setFilters}
            onReset={clearMessage}
          />
        </ComponentCard>

        <ComponentCard title="Regions">
          <div className="mb-4 flex justify-end">
            <Link
              to="/regions/create"
              className="rounded-lg bg-brand-500 px-4 py-2 text-white"
            >
              Create Region
            </Link>
          </div>

          <RegionsTable
            filters={filters}
            // loading={loading}
          />
        </ComponentCard>

      </div>
    </>
  );
}