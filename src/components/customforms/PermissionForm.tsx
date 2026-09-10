import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ComponentCard from "../common/ComponentCard";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import Button from "../ui/button/Button";
import Label from "../form/Label";

import { usePermissions } from "../../hooks/usePermission";

import {
  CreatePermissionPayload,
  Permission,
  UpdatePermissionPayload,
} from "../../types/PermissionType";

interface PermissionFormProps {
  mode: "create" | "edit";
  initialData?: Permission;
}

interface PermissionFormErrors {
  name?: string;
  description?: string;
}

export default function PermissionForm({
  mode,
  initialData,
}: PermissionFormProps) {
  const navigate = useNavigate();

  const {
    createPermission,
    updatePermission,
    loading,
    message,
    clearMessage,
  } = usePermissions();

  const [name, setName] = useState(
    initialData?.name ?? ""
  );

  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );

  const [errors, setErrors] =
    useState<PermissionFormErrors>({});

  /*
   * ============================================================
   * INITIAL DATA
   * ============================================================
   */

  useEffect(() => {
    if (!initialData) {
      return;
    }

    setName(initialData.name);
    setDescription(initialData.description ?? "");
  }, [initialData]);

  /*
   * ============================================================
   * VALIDATION
   * ============================================================
   */

  const validate = (): boolean => {
    const newErrors: PermissionFormErrors = {};

    if (!name.trim()) {
      newErrors.name =
        "Permission name is required";
    }

    if (!description.trim()) {
      newErrors.description =
        "Permission description is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /*
   * ============================================================
   * FIELD ERROR HANDLING
   * ============================================================
   */

  const clearFieldError = (
    field: keyof PermissionFormErrors
  ) => {
    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  };

  /*
   * ============================================================
   * SUBMIT
   * ============================================================
   */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    clearMessage();

    if (!validate()) {
      return;
    }

    const trimmedName = name.trim();
    const trimmedDescription =
      description.trim();

    let success = false;

    if (mode === "create") {
      const payload: CreatePermissionPayload = {
        name: trimmedName,
        description: trimmedDescription,
      };

      success =
        await createPermission(payload);
    } else {
      if (!initialData?.id) {
        return;
      }

      const payload: UpdatePermissionPayload = {
        name: trimmedName,
        description: trimmedDescription,
      };

      success =
        await updatePermission(
          initialData.id,
          payload
        );
    }

    if (!success) {
      return;
    }

    navigate("/permissions");
  };

  const isEdit = mode === "edit";

  return (
    <ComponentCard
      title={
        isEdit
          ? "Edit Permission"
          : "Create Permission"
      }
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* NAME */}

        <div>
          <Label>
            Name
          </Label>

          <Input
            placeholder="Permission name"
            value={name}
            disabled={loading}
            onChange={(event) => {
              setName(event.target.value);
              clearFieldError("name");
            }}
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-500">
              {errors.name}
            </p>
          )}
        </div>

        {/* DESCRIPTION */}

        <div>
          <Label>
            Description
          </Label>

          <TextArea
            placeholder="Permission description"
            value={description}
            disabled={loading}
            onChange={(value) => {
              setDescription(value);
              clearFieldError("description");
            }}
          />

          {errors.description && (
            <p className="mt-1 text-sm text-red-500">
              {errors.description}
            </p>
          )}
        </div>

        {/* MESSAGE */}

        {message && (
          <div className="text-sm text-blue-600">
            {message}
          </div>
        )}

        {/* ACTIONS */}

        <div className="flex justify-end gap-3 border-t pt-5">
          <Button
            
            variant="outline"
            disabled={loading}
            onClick={() =>
              navigate("/permissions")
            }
          >
            Cancel
          </Button>

          <Button
          
            disabled={loading}
          >
            {loading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
                ? "Update Permission"
                : "Create Permission"}
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
}