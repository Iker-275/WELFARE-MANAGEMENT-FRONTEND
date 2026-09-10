import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import Input from "../../form/input/InputField";

import Label from "../../form/Label";

import Button from "../../ui/button/Button";

import {
  Employment,
  CreateEmploymentPayload,
} from "../../../types/EmploymentType";

interface EmploymentFormProps {

  initialData?: Employment | null;

  onSubmit: (
    payload: CreateEmploymentPayload
  ) => Promise<boolean>;

  loading?: boolean;

  error?: string;
}

const EmploymentForm = ({
  initialData,
  onSubmit,
  loading = false,
  error,
}: EmploymentFormProps) => {

  const [
    formData,
    setFormData,
  ] = useState<CreateEmploymentPayload>({
    employeeNumber:
      initialData?.employeeNumber ?? "",

    employerName:
      initialData?.employerName ?? "",

    jobTitle:
      initialData?.jobTitle ?? "",
  });

  const [
    errors,
    setErrors,
  ] = useState<Record<string, string>>({});

  useEffect(() => {

    setFormData({
      employeeNumber:
        initialData?.employeeNumber ?? "",

      employerName:
        initialData?.employerName ?? "",

      jobTitle:
        initialData?.jobTitle ?? "",
    });

  }, [initialData]);

  const updateField = (
    field: keyof CreateEmploymentPayload,
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

    if (
      !formData.employeeNumber.trim()
    ) {
      newErrors.employeeNumber =
        "Employee number is required.";
    }

    if (
      !formData.employerName.trim()
    ) {
      newErrors.employerName =
        "Employer name is required.";
    }

    if (
      !formData.jobTitle.trim()
    ) {
      newErrors.jobTitle =
        "Job title is required.";
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
              Employee Number *
            </Label>

            <Input
              value={
                formData.employeeNumber
              }
              onChange={(event) =>
                updateField(
                  "employeeNumber",
                  event?.target.value
                )
              }
              error={
                !!errors.employeeNumber
              }
              hint={
                errors.employeeNumber
              }
              placeholder="Enter employee number"
            />
          </div>

          <div>
            <Label>
              Employer *
            </Label>

            <Input
              value={
                formData.employerName
              }
              onChange={(event) =>
                updateField(
                  "employerName",
                                    event?.target.value

                )
              }
              error={
                !!errors.employerName
              }
              hint={
                errors.employerName
              }
              placeholder="Enter employer name"
            />
          </div>

          <div>
            <Label>
              Job Title *
            </Label>

            <Input
              value={
                formData.jobTitle
              }
              onChange={(event) =>
                updateField(
                  "jobTitle",
                  event?.target.value
                  
                )
              }
              error={
                !!errors.jobTitle
              }
              hint={
                errors.jobTitle
              }
              placeholder="Enter job title"
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
              : "Add Employment"}
        </Button>

      </div>

    </form>
  );
};

export default EmploymentForm;