
import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

interface RoleFormData {
  name: string;
  isSystem: boolean;
  description?: string | null;
}

interface RoleFormErrors {
  name?: string;
}

interface RoleFormProps {
  mode: "create" | "edit";
  initialData?: RoleFormData;
  loading?: boolean;
  onSubmit: (
    data: RoleFormData
  ) => void | Promise<void>;
}

export default function RoleForm({
  mode,
  initialData,
  loading = false,
  onSubmit,
}: RoleFormProps) {
  const [name, setName] =
    useState("");

  const [isSystem, setIsSystem] =
    useState(false);

  const [description, setDescription] =
    useState("");

  const [errors, setErrors] =
    useState<RoleFormErrors>({});

  useEffect(() => {
    if (!initialData) {
      setName("");
      setIsSystem(false);
      setDescription("");
      return;
    }

    setName(initialData.name);
    setIsSystem(initialData.isSystem);
    setDescription(
      initialData.description ?? ""
    );
  }, [initialData]);

  const validate = (): boolean => {
    const validationErrors: RoleFormErrors =
      {};

    if (!name.trim()) {
      validationErrors.name =
        "Role name is required.";
    }

    setErrors(validationErrors);

    return (
      Object.keys(validationErrors).length === 0
    );
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit({
      name: name.trim(),
      isSystem,
      description:
        description.trim() || null,
    });
  };

  return (
    <ComponentCard
      title={
        mode === "create"
          ? "Create Role"
          : "Update Role"
      }
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Role Name */}
        <div>
          <Label>Role Name</Label>

          <Input
            placeholder="Enter role name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);

              if (errors.name) {
                setErrors({});
              }
            }}
            disabled={loading}
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-500">
              {errors.name}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <Label>Description</Label>

          <textarea
            placeholder="Enter role description"
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            disabled={loading}
            rows={4}
            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 shadow-theme-xs outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-0 dark:border-gray-700 dark:bg-gray-dark dark:text-white/90 dark:placeholder:text-gray-500"
          />
        </div>

        {/* System Role */}
        <div>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={isSystem}
              onChange={(event) =>
                setIsSystem(
                  event.target.checked
                )
              }
              disabled={loading}
              className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
            />

            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              System Role
            </span>
          </label>

          <p className="mt-1 ml-7 text-xs text-gray-500 dark:text-gray-400">
            System roles are protected from deletion.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t pt-6">
          <Button
            
            disabled={loading}
          >
            {loading
              ? mode === "create"
                ? "Creating..."
                : "Updating..."
              : mode === "create"
                ? "Create Role"
                : "Update Role"}
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
}

