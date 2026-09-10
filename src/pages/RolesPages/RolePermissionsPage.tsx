
import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";

import { usePermissions } from "../../hooks/usePermission";
import { useRoles } from "../../hooks/useRoles";

import RolePermissionGrid from "../../components/customComponents/RolePermissionGrid";

export default function RolePermissionsPage() {
  const { id } = useParams<{
    id: string;
  }>();

  const navigate = useNavigate();

  const {
    permissions,
    fetchPermissions,
  } = usePermissions();

  const {
    fetchRolePermissions,
    permissions: rolePermissions,
    syncPermissions,
    loading,
    message,
  } = useRoles();

  const [
    selectedPermissions,
    setSelectedPermissions,
  ] = useState<string[]>([]);

  const [pageLoading, setPageLoading] =
    useState(true);

  useEffect(() => {
    if (!id) {
      navigate("/roles");
      return;
    }

    const loadData = async () => {
      setPageLoading(true);

      try {
        await Promise.all([
          fetchPermissions(),
          fetchRolePermissions(id),
        ]);
      } finally {
        setPageLoading(false);
      }
    };

    loadData();
  }, [
    id,
    fetchPermissions,
    fetchRolePermissions,
    navigate,
  ]);

  // ======================================================
  // INITIAL ROLE PERMISSIONS
  // ======================================================

  useEffect(() => {
    const existingIds =
      rolePermissions.map(
        (rolePermission) =>
          rolePermission.permissionId
      );

    setSelectedPermissions(
      existingIds
    );
  }, [rolePermissions]);

  // ======================================================
  // SAVE
  // ======================================================

  const handleSync = async () => {
    if (!id) {
      return;
    }

    const success =
      await syncPermissions(
        id,
        selectedPermissions
      );

    if (success) {
      navigate("/roles");
    }
  };

  if (pageLoading) {
    return (
      <div className="py-10 text-center">
        Loading permissions...
      </div>
    );
  }

  return (
    <ComponentCard title="Role Permissions">
      <div className="space-y-6">
        {message && (
          <div className="text-sm">
            {message}
          </div>
        )}

        <RolePermissionGrid
          permissions={permissions}
          selectedPermissions={
            selectedPermissions
          }
          onChange={
            setSelectedPermissions
          }
        />

        <div className="flex justify-end border-t pt-6">
          <Button
            onClick={handleSync}
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : "Save Permissions"}
          </Button>
        </div>
      </div>
    </ComponentCard>
  );
}