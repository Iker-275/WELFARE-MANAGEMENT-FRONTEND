
import { FormEvent, useState } from "react";

import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

import ContributionPlanDropdown from "../customDropdowns/ContributionPlanDropdown";

import type {
  GenerateContributionPeriodsBatchDto,
} from "../../types/ContributionPeriodType";

interface GenerateContributionPeriodsBatchFormProps {
  onSubmit: (
    payload: GenerateContributionPeriodsBatchDto
  ) => Promise<boolean>;
  loading?: boolean;
}

interface FormData {
  planId: string;
  startDate: string;
  count: string;
}

interface FormErrors {
  planId?: string;
  startDate?: string;
  count?: string;
}

const initialFormData: FormData = {
  planId: "",
  startDate: "",
  count: "12",
};

const toUtcDateTime = (date: string): string => {
  return new Date(`${date}T00:00:00.000Z`).toISOString();
};

const GenerateContributionPeriodsBatchForm = ({
  onSubmit,
  loading = false,
}: GenerateContributionPeriodsBatchFormProps) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.planId) {
      newErrors.planId = "Please select a contribution plan.";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required.";
    }

    const count = Number(formData.count);

    if (!formData.count.trim()) {
      newErrors.count = "Number of periods is required.";
    } else if (!Number.isInteger(count) || count < 1) {
      newErrors.count = "Enter a valid whole number greater than zero.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) return;

    const payload: GenerateContributionPeriodsBatchDto = {
      planId: formData.planId,
      startDate: toUtcDateTime(formData.startDate),
      count: Number(formData.count),
    };

    const success = await onSubmit(payload);

    if (success) {
      setFormData(initialFormData);
      setErrors({});
    }
  };

  return (
    <ComponentCard title="Generate Multiple Contribution Periods">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <ContributionPlanDropdown
            value={formData.planId}
            onChange={(value) => handleChange("planId", value)}
            label="Contribution Plan"
            placeholder="Select contribution plan"
            required
            error={errors.planId}
            disabled={loading}
          />
        </div>

        <div>
          <Label>
            Start Date <span className="text-red-500">*</span>
          </Label>
          <Input
            type="date"
            value={formData.startDate}
            onChange={(event) =>
              handleChange("startDate", event.target.value)
            }
            disabled={loading}
          />
          {errors.startDate && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.startDate}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            The starting date used to generate the first contribution period.
          </p>
        </div>

        <div>
          <Label>
            Number of Periods <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            min="1"
            // step="1"
            value={formData.count}
            onChange={(event) =>
              handleChange("count", event.target.value)
            }
            disabled={loading}
          />
          {errors.count && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.count}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Enter how many consecutive contribution periods should be generated.
          </p>
        </div>

        <div className="flex justify-end">
          <Button  disabled={loading}>
            {loading ? "Generating..." : "Generate Periods"}
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
};

export default GenerateContributionPeriodsBatchForm;
