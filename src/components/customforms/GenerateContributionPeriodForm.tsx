
import { FormEvent, useEffect, useState } from "react";

import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

import ContributionPlanDropdown from "../customDropdowns/ContributionPlanDropdown";

import type {
  GenerateContributionPeriodDto,
} from "../../types/ContributionPeriodType";

interface GenerateContributionPeriodFormProps {
  onSubmit: (
    payload: GenerateContributionPeriodDto
  ) => Promise<boolean>;
  loading?: boolean;
}

interface FormData {
  planId: string;
  name: string;
  periodStart: string;
  periodEnd: string;
  effectiveDate: string;
}

interface FormErrors {
  planId?: string;
  name?: string;
  periodStart?: string;
  periodEnd?: string;
  effectiveDate?: string;
}

const initialFormData: FormData = {
  planId: "",
  name: "",
  periodStart: "",
  periodEnd: "",
  effectiveDate: "",
};

const toUtcDateTime = (date: string): string => {
  return new Date(`${date}T00:00:00.000Z`).toISOString();
};

const GenerateContributionPeriodForm = ({
  onSubmit,
  loading = false,
}: GenerateContributionPeriodFormProps) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setErrors({});
  }, [formData]);

  const handleChange = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.planId) {
      newErrors.planId = "Please select a contribution plan.";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Period name is required.";
    }

    if (!formData.periodStart) {
      newErrors.periodStart = "Period start date is required.";
    }

    if (!formData.periodEnd) {
      newErrors.periodEnd = "Period end date is required.";
    }

    if (
      formData.periodStart &&
      formData.periodEnd &&
      formData.periodEnd < formData.periodStart
    ) {
      newErrors.periodEnd =
        "Period end date cannot be earlier than the start date.";
    }

    if (!formData.effectiveDate) {
      newErrors.effectiveDate = "Effective date is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) return;

    const payload: GenerateContributionPeriodDto = {
      planId: formData.planId,
      name: formData.name.trim(),
      periodStart: toUtcDateTime(formData.periodStart),
      periodEnd: toUtcDateTime(formData.periodEnd),
      effectiveDate: toUtcDateTime(formData.effectiveDate),
    };

    const success = await onSubmit(payload);

    if (success) {
      setFormData(initialFormData);
      setErrors({});
    }
  };

  return (
    <ComponentCard title="Generate Contribution Period">
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
            Period Name <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            placeholder="e.g. November 2026 Contributions"
            value={formData.name}
            onChange={(event) => handleChange("name", event.target.value)}
            disabled={loading}
          />
          {errors.name && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.name}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <Label>
              Period Start Date <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              value={formData.periodStart}
              onChange={(event) =>
                handleChange("periodStart", event.target.value)
              }
              disabled={loading}
            />
            {errors.periodStart && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.periodStart}
              </p>
            )}
          </div>

          <div>
            <Label>
              Period End Date <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              value={formData.periodEnd}
              onChange={(event) =>
                handleChange("periodEnd", event.target.value)
              }
              disabled={loading}
            />
            {errors.periodEnd && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.periodEnd}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label>
            Effective Date <span className="text-red-500">*</span>
          </Label>
          <Input
            type="date"
            value={formData.effectiveDate}
            onChange={(event) =>
              handleChange("effectiveDate", event.target.value)
            }
            disabled={loading}
          />
          {errors.effectiveDate && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.effectiveDate}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            The date from which this contribution period becomes effective.
          </p>
        </div>

        <div className="flex justify-end">
          <Button  disabled={loading}>
            {loading ? "Generating..." : "Generate Period"}
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
};

export default GenerateContributionPeriodForm;
