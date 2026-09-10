
import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import Button from "../../ui/button/Button";

import GenderDropdown from "../../customDropdowns/GenderDropdown";
import DependantRelationshipDropdown from "../../customDropdowns/DependantRelationshipDropdown";

import {
  Gender,
} from "../../../types/GenderType";

import {
  Dependant,
  CreateDependantPayload,
} from "../../../types/DependantType";

interface DependantFormProps {
  initialData?: Dependant | null;

  onSubmit: (
    payload: CreateDependantPayload
  ) => Promise<boolean>;

  onCancel?: () => void;

  loading?: boolean;

  error?: string;
}

const DependantForm = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  error,
}: DependantFormProps) => {
  const [
    formData,
    setFormData,
  ] = useState<CreateDependantPayload>({
    fullName:
      initialData?.fullName ?? "",

    relationship:
      initialData?.relationship ?? "",

    dateOfBirth:
      initialData?.dateOfBirth ?? null,

    gender:
      initialData?.gender ?? null,

    nationalId:
      initialData?.nationalId ?? "",

    birthNotificationNo:
      initialData?.birthNotificationNo ?? "",
  });

  const [
    errors,
    setErrors,
  ] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData({
      fullName:
        initialData?.fullName ?? "",

      relationship:
        initialData?.relationship ?? "",

      dateOfBirth:
        initialData?.dateOfBirth ?? null,

      gender:
        initialData?.gender ?? null,

      nationalId:
        initialData?.nationalId ?? "",

      birthNotificationNo:
        initialData?.birthNotificationNo ?? "",
    });

    setErrors({});
  }, [initialData]);

  const updateField = (
    field: keyof CreateDependantPayload,
    value:
      | string
      | null
      | Gender
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));
  };

  const validate = () => {
    const newErrors:
      Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName =
        "Full name is required.";
    }

    if (!formData.relationship.trim()) {
      newErrors.relationship =
        "Relationship is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {error && (
        <div
          className="
            rounded-lg
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-600
          "
        >
          {error}
        </div>
      )}

      <div
        className="
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-6
          dark:border-gray-800
          dark:bg-white/[0.03]
        "
      >
        <div
          className="
            grid
            grid-cols-1
            gap-5
            md:grid-cols-2
          "
        >
          {/* Full Name */}
          <div>
            <Label>
              Full Name *
            </Label>

            <Input
              value={
                formData.fullName
              }
              onChange={(event) =>
                updateField(
                  "fullName",
                  event.target.value
                )
              }
              error={
                !!errors.fullName
              }
              hint={
                errors.fullName
              }
              placeholder="Enter full name"
              disabled={loading}
            />
          </div>

          {/* Relationship */}
          <DependantRelationshipDropdown
            value={
              formData.relationship
            }
            onChange={(value) =>
              updateField(
                "relationship",
                value
              )
            }
            label="Relationship"
            placeholder="Select relationship"
            required
            disabled={loading}
            error={
              errors.relationship
            }
          />

          {/* Date of Birth */}
          <div>
            <Label>
              Date of Birth
            </Label>

            <Input
              type="date"
              value={
                formData.dateOfBirth ??
                ""
              }
              onChange={(event) =>
                updateField(
                  "dateOfBirth",
                  event.target.value ||
                    null
                )
              }
              disabled={loading}
            />
          </div>

          {/* Gender */}
          <GenderDropdown
            value={
              formData.gender ?? ""
            }
            onChange={(value) =>
              updateField(
                "gender",
                value
                  ? (value as Gender)
                  : null
              )
            }
            label="Gender"
            placeholder="Select gender"
            disabled={loading}
          />

          {/* National ID */}
          <div>
            <Label>
              National ID
            </Label>

            <Input
              value={
                formData.nationalId ?? ""
              }
              onChange={(event) =>
                updateField(
                  "nationalId",
                  event.target.value
                )
              }
              placeholder="Enter national ID"
              disabled={loading}
            />
          </div>

          {/* Birth Notification Number */}
          <div>
            <Label>
              Birth Notification Number
            </Label>

            <Input
              value={
                formData.birthNotificationNo ??
                ""
              }
              onChange={(event) =>
                updateField(
                  "birthNotificationNo",
                  event.target.value
                )
              }
              placeholder="Enter birth notification number"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button
    
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}

        <Button
          
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : initialData
              ? "Save Changes"
              : "Add Dependant"}
        </Button>
      </div>
    </form>
  );
};

export default DependantForm;