
import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import RoleForm from "../../components/customforms/RolesForm";

import { useRoles } from "../../hooks/useRoles";

import {
  Role,
  UpdateRolePayload,
} from "../../types/RoleType";

export default function UpdateRole() {
  const { id } =
    useParams<{
      id: string;
    }>();

  const navigate =
    useNavigate();

  const {
    fetchRole,
    updateRole,
    loading,
    message,
    clearMessage,
  } = useRoles();

  const [role, setRole] =
    useState<Role | null>(null);

  const [pageLoading, setPageLoading] =
    useState(true);

  useEffect(() => {
    if (!id) {
      navigate("/roles");
      return;
    }

    let mounted = true;

    const loadRole = async () => {
      setPageLoading(true);

      const result =
        await fetchRole(id);

      if (mounted) {
        setRole(result);
        setPageLoading(false);
      }
    };

    void loadRole();

    return () => {
      mounted = false;
    };
  }, [
    id,
    fetchRole,
    navigate,
  ]);

  const handleUpdate = async (
    data: UpdateRolePayload
  ) => {
    if (!id) {
      return;
    }

    clearMessage();

    const success =
      await updateRole(
        id,
        data
      );

    if (success) {
      navigate("/roles");
    }
  };

  if (pageLoading) {
    return (
      <div className="py-10 text-center">
        Loading role...
      </div>
    );
  }

  if (!role) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-red-500">
          Role not found.
        </p>

        {message && (
          <p className="mt-2 text-sm text-gray-600">
            {message}
          </p>
        )}
      </div>
    );
  }

  return (
    <>
      <RoleForm
        mode="edit"
        loading={loading}
        initialData={{
          name: role.name,
          isSystem: role.isSystem,
          description:
            role.description ?? "",
        }}
        onSubmit={handleUpdate}
      />

      {message && (
        <div className="mt-4 text-sm">
          {message}
        </div>
      )}
    </>
  );
}

