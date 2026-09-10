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
import { Role } from "../../types/RoleType";

export default function UpdateRole() {
  const { id } = useParams<{
    id: string;
  }>();

  const navigate = useNavigate();

  const {
    fetchRole,
    updateRole,
    message,
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

    const loadRole = async () => {
      setPageLoading(true);

      const result = await fetchRole(id);

      setRole(result);

      setPageLoading(false);
    };

    loadRole();
  }, [id, fetchRole, navigate]);

  const handleUpdate = async (
    data: { name: string }
  ) => {
    if (!id || !role) {
      return;
    }

    const success = await updateRole(
      id,
      {
        name: data.name,
        isSystem: role.isSystem,
      }
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
        Role not found.
      </div>
    );
  }

  return (
    <>
      <RoleForm
        mode="edit"
        initialData={{
          name: role.name,
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