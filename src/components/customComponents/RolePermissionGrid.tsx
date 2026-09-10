
import { Permission } from "../../types/RoleType";

interface RolePermissionGridProps {
  permissions: Permission[];

  selectedPermissions: string[];

  onChange: (
    permissionIds: string[]
  ) => void;
}

export default function RolePermissionGrid({
  permissions,
  selectedPermissions,
  onChange,
}: RolePermissionGridProps) {
  const togglePermission = (
    permissionId: string
  ) => {
    if (
      selectedPermissions.includes(
        permissionId
      )
    ) {
      onChange(
        selectedPermissions.filter(
          (id) =>
            id !== permissionId
        )
      );

      return;
    }

    onChange([
      ...selectedPermissions,
      permissionId,
    ]);
  };

  if (permissions.length === 0) {
    return (
      <div className="rounded-xl border p-6 text-center text-sm text-gray-500">
        No permissions available.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {permissions.map(
        (permission) => {
          const isSelected =
            selectedPermissions.includes(
              permission.id
            );

          return (
            <label
              key={permission.id}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                isSelected
                  ? "border-brand-500 bg-brand-50"
                  : "bg-white"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() =>
                  togglePermission(
                    permission.id
                  )
                }
                className="mt-1"
              />

              <div className="min-w-0">
                <p className="font-medium text-gray-900">
                  {permission.name}
                </p>

                {permission.description && (
                  <p className="mt-1 text-sm text-gray-500">
                    {permission.description}
                  </p>
                )}

                <p className="mt-2 text-xs text-gray-400">
                  {permission.slug}
                </p>
              </div>
            </label>
          );
        }
      )}
    </div>
  );
}