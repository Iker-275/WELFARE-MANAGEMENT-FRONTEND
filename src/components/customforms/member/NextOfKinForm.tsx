import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import Input from "../../form/input/InputField";

import Label from "../../form/Label";
import Button from "../../ui/button/Button";


import {
  NextOfKin,
  CreateNextOfKinPayload,
} from "../../../types/NextOfKinType";

interface NextOfKinFormProps {

  initialData?: NextOfKin | null;

  onSubmit: (
    payload: CreateNextOfKinPayload
  ) => Promise<boolean>;

  loading?: boolean;

  error?: string;
}

const NextOfKinForm = ({
  initialData,
  onSubmit,
  loading = false,
  error,
}: NextOfKinFormProps) => {

  const [
    formData,
    setFormData,
  ] = useState<CreateNextOfKinPayload>({
    fullName:
      initialData?.fullName ?? "",

    relationship:
      initialData?.relationship ?? "",

    phoneNumber:
      initialData?.phoneNumber ?? "",

    nationalId:
      initialData?.nationalId ?? "",

    address:
      initialData?.address ?? "",
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

      phoneNumber:
        initialData?.phoneNumber ?? "",

      nationalId:
        initialData?.nationalId ?? "",

      address:
        initialData?.address ?? "",
    });

  }, [initialData]);

  const updateField = (
    field: keyof CreateNextOfKinPayload,
    value: string
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

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber =
        "Phone number is required.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
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
            />
          </div>

          <div>
            <Label>
              Relationship *
            </Label>

            <Input
              value={
                formData.relationship
              }
              onChange={(event) =>
                updateField(
                  "relationship",
                                    event.target.value

                )
              }
              error={
                !!errors.relationship
              }
              hint={
                errors.relationship
              }
              placeholder="e.g. Spouse"
            />
          </div>

          <div>
            <Label>
              Phone Number *
            </Label>

            <Input
              value={
                formData.phoneNumber
              }
              onChange={(event) =>
                updateField(
                  "phoneNumber",
                                    event.target.value

                )
              }
              error={
                !!errors.phoneNumber
              }
              hint={
                errors.phoneNumber
              }
              placeholder="+254..."
            />
          </div>

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
            />
          </div>

          <div className="md:col-span-2">

            <Label>
              Address
            </Label>

            <Input
              value={
                formData.address ?? ""
              }
              onChange={(event) =>
                updateField(
                  "address",
                  event.target.value
                  
                )
              }
            />

          </div>

        </div>

      </div>

      <div className="flex justify-end">

        <Button
          
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : initialData
              ? "Save Changes"
              : "Add Next of Kin"}
        </Button>

      </div>

    </form>
  );
};

export default NextOfKinForm;