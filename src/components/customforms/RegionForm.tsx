import { useEffect, useState } from "react";

import ComponentCard from "../common/ComponentCard";

import Label from "../form/Label";

import Input from "../form/input/InputField";

import Button from "../ui/button/Button";

interface RegionFormProps {
  mode: "create" | "edit";

  initialData?: {
    name: string;
    code?: string;
    description?: string;
  };

  onSubmit: (data: {
    name: string;
    code?: string;
    description?: string;
  }) => void;
}

export default function RegionForm({
  mode,
  initialData,
  onSubmit,
}: RegionFormProps) {
  const [name, setName] =
    useState("");

  const [code, setCode] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [errors, setErrors] =
    useState<any>({});

  useEffect(() => {
    if (initialData) {
      setName(
        initialData.name || ""
      );

      setCode(
        initialData.code || ""
      );

      setDescription(
        initialData.description || ""
      );
    }
  }, [initialData]);

  const validate = () => {
    const error: any = {};

    if (!name.trim()) {
      error.name =
        "Region name is required";
    }

    setErrors(error);

    return (
      Object.keys(error).length === 0
    );
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    onSubmit({
      name,
      code,
      description,
    });
  };

  return (
    <ComponentCard
      title={
        mode === "create"
          ? "Create Region"
          : "Update Region"
      }
    >
      
      <div className="space-y-6">
        <div>
          <Label>
            Region Name
          </Label>

          <Input
            placeholder="Enter region name"
            value={name}
            onChange={(e: any) =>
              setName(e.target.value)
            }
          />

          {errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <Label>
            Region Code
          </Label>

          <Input
            placeholder="Enter region code"
            value={code}
            onChange={(e: any) =>
              setCode(e.target.value)
            }
          />
        </div>

        <div>
          <Label>
            Description
          </Label>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
            placeholder="Enter description"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t mt-6">
        <Button
          variant="outline"
          onClick={handleSubmit}
        >
          {mode === "create"
            ? "Create Region"
            : "Update Region"}
        </Button>
      </div>
    </ComponentCard>
  );
}