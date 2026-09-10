import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PermissionForm from "../../components/customforms/PermissionForm";

import { usePermissions } from "../../hooks/usePermission";
import { Permission } from "../../types/PermissionType";

export default function UpdatePermission() {
  const { id } = useParams<{
    id: string;
  }>();

  const navigate = useNavigate();

  const {
    fetchPermission,
    clearMessage,
  } = usePermissions();

  const [permission, setPermission] =
    useState<Permission | null>(null);

  const [loadingPermission, setLoadingPermission] =
    useState(true);

  useEffect(() => {
    const loadPermission = async () => {
      if (!id) {
        navigate("/permissions", {
          replace: true,
        });

        return;
      }

      clearMessage();
      setLoadingPermission(true);

      const result =
        await fetchPermission(id);

      if (!result) {
        navigate("/permissions", {
          replace: true,
        });

        return;
      }

      setPermission(result);
      setLoadingPermission(false);
    };

    loadPermission();
  }, [
    id,
    fetchPermission,
    clearMessage,
    navigate,
  ]);

  if (loadingPermission) {
    return (
      <div className="flex justify-center py-10">
        <div
          className="
            h-8
            w-8
            animate-spin
            rounded-full
            border-b-2
            border-brand-500
          "
        />
      </div>
    );
  }

  if (!permission) {
    return null;
  }

  return (
    <PermissionForm
      mode="edit"
      initialData={permission}
    />
  );
}