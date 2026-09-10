import { useEffect } from "react";

import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import {
  RolesTable,
} from "../../components/tables/BasicTables/BasicTableOne";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useRoles } from "../../hooks/useRoles";

export default function Roles() {
  const { fetchRoles } = useRoles();

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return (
    <>
      <PageMeta
        title="Roles"
        description="Manage roles"
      />

      <PageBreadcrumb pageTitle="Roles" />

      <div className="space-y-6">
        <ComponentCard title="Roles">
          <RolesTable />
        </ComponentCard>
      </div>
    </>
  );
}