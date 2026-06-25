import { useState } from "react";
import { useParams } from "react-router-dom";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import RegionUsersFilters from "../../components/customComponents/RegionUserFilters";
import {RegionUsersTable} from "../../components/tables/BasicTables/BasicTableOne";

interface RegionUserFiltersType {
  search?: string;
  membershipStatus?: string;
  employmentStatus?: string;
  roleId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export default function RegionUsersPage() {
  const { id } = useParams();

  const [selectedRegionId, setSelectedRegionId] =
    useState(id || "");

  const [filters, setFilters] =
    useState<RegionUserFiltersType>({
      page: 1,
      limit: 10,
    });

  const handleRegionChange = (
    regionId: string
  ) => {
    setSelectedRegionId(regionId);

    setFilters({
      page: 1,
      limit: 10,
    });
  };

  return (
    <>
      <PageMeta
        title="Region Members"
        description="View region members"
      />

      <PageBreadcrumb
        pageTitle="Region Members"
      />

      <div className="space-y-6">

        <ComponentCard title="Filters">
          <RegionUsersFilters
            selectedRegionId={selectedRegionId}
            onRegionChange={
              handleRegionChange
            }
            filters={filters}
            setFilters={setFilters}
          />
        </ComponentCard>

        <ComponentCard title="Members">
          <RegionUsersTable
            regionId={selectedRegionId}
            filters={filters}
            setFilters={setFilters}
          />
        </ComponentCard>

      </div>
    </>
  );
}