
import {
  FormEvent,
  useState,
} from "react";

import Input from "../../form/input/InputField";
import Label from "../../form/Label";

import GenderDropdown from "../../customDropdowns/GenderDropdown";
import RegionDropdown from "../../customDropdowns/RegionDropdown";

import Button from "../../ui/button/Button";

import {
  Gender,
} from "../../../types/GenderType";

import {
  UpdateMemberProfileDto,
} from "../../../types/MemberType";

export interface MemberProfileFormData {
  regionId: string;

  firstName: string;
  lastName: string;
  otherNames: string | null;
  gender: Gender | null;
  dateOfBirth: string | null;
  nationalId: string | null;
  address: string | null;
  profilePhotoId: string | null;
}

interface MemberProfileFormProps {
  initialData: MemberProfileFormData;

  onSubmit: (
    payload: UpdateMemberProfileDto
  ) => Promise<boolean>;

  onCancel?: () => void;

  loading?: boolean;

  error?: string;
}

const MemberProfileForm = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  error,
}: MemberProfileFormProps) => {
  const [formData, setFormData] =
    useState<MemberProfileFormData>({
      regionId:
        initialData.regionId ?? "",

      firstName:
        initialData.firstName ?? "",

      lastName:
        initialData.lastName ?? "",

      otherNames:
        initialData.otherNames ?? "",

      gender:
        initialData.gender ?? null,

      dateOfBirth:
        initialData.dateOfBirth ?? "",

      nationalId:
        initialData.nationalId ?? "",

      address:
        initialData.address ?? "",

      profilePhotoId:
        initialData.profilePhotoId ?? null,
    });

  const [
    errors,
    setErrors,
  ] = useState<Record<string, string>>({});

  const updateField = (
    field: keyof MemberProfileFormData,
    value: string | null
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

    if (!formData.regionId) {
      newErrors.regionId =
        "Region is required.";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName =
        "First name is required.";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName =
        "Last name is required.";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth =
        "Date of birth is required.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const payload: UpdateMemberProfileDto = {
      regionId:
        formData.regionId,

      firstName:
        formData.firstName.trim(),

      lastName:
        formData.lastName.trim(),

      otherNames:
        formData.otherNames?.trim() || null,

      gender:
        formData.gender,

      dateOfBirth:
        formData.dateOfBirth || null,

      nationalId:
        formData.nationalId?.trim() || null,

      address:
        formData.address?.trim() || null,

      profilePhotoId:
        formData.profilePhotoId,
    };

    await onSubmit(payload);
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
            dark:border-red-900/40
            dark:bg-red-900/20
            dark:text-red-400
          "
        >
          {error}
        </div>
      )}

      {/* Member Assignment */}

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
        <h3
          className="
            mb-5
            text-lg
            font-semibold
            text-gray-800
            dark:text-white
          "
        >
          Member Assignment
        </h3>

        <div
          className="
            grid
            grid-cols-1
            gap-5
            md:grid-cols-2
          "
        >
          <RegionDropdown
            value={
              formData.regionId
            }
            onChange={(value) => {
              updateField(
                "regionId",
                value
              );
            }}
            label="Region"
            placeholder="Select region"
            required
            disabled={loading}
            error={
              errors.regionId
            }
          />
        </div>
      </div>

      {/* Personal Information */}

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
        <h3
          className="
            mb-5
            text-lg
            font-semibold
            text-gray-800
            dark:text-white
          "
        >
          Personal Information
        </h3>

        <div
          className="
            grid
            grid-cols-1
            gap-5
            md:grid-cols-2
          "
        >
          {/* First Name */}

          <div>
            <Label>
              First Name
              <span className="ml-1 text-red-500">
                *
              </span>
            </Label>

            <Input
              value={
                formData.firstName
              }
              onChange={(event) =>
                updateField(
                  "firstName",
                  event.target.value
                )
              }
              placeholder="Enter first name"
              disabled={loading}
              error={
                !!errors.firstName
              }
              hint={
                errors.firstName
              }
            />
          </div>

          {/* Last Name */}

          <div>
            <Label>
              Last Name
              <span className="ml-1 text-red-500">
                *
              </span>
            </Label>

            <Input
              value={
                formData.lastName
              }
              onChange={(event) =>
                updateField(
                  "lastName",
                  event.target.value
                )
              }
              placeholder="Enter last name"
              disabled={loading}
              error={
                !!errors.lastName
              }
              hint={
                errors.lastName
              }
            />
          </div>

          {/* Other Names */}

          <div>
            <Label>
              Other Names
            </Label>

            <Input
              value={
                formData.otherNames ??
                ""
              }
              onChange={(event) =>
                updateField(
                  "otherNames",
                  event.target.value
                )
              }
              placeholder="Enter other names"
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
            error={errors.gender}
          />

          {/* Date of Birth */}

          <div>
            <Label>
              Date of Birth
              <span className="ml-1 text-red-500">
                *
              </span>
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
                  event.target.value
                )
              }
              disabled={loading}
              error={
                !!errors.dateOfBirth
              }
              hint={
                errors.dateOfBirth
              }
            />
          </div>

          {/* National ID */}

          <div>
            <Label>
              National ID
            </Label>

            <Input
              value={
                formData.nationalId ??
                ""
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

          {/* Address */}

          <div className="md:col-span-2">
            <Label>
              Address
            </Label>

            <Input
              value={
                formData.address ??
                ""
              }
              onChange={(event) =>
                updateField(
                  "address",
                  event.target.value
                )
              }
              placeholder="Enter address"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Actions */}

      <div
        className="
          flex
          justify-end
          gap-3
        "
      >
        {onCancel && (
          <Button
            
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
            ? "Updating..."
            : "Update Member"}
        </Button>
      </div>
    </form>
  );
};

export default MemberProfileForm;