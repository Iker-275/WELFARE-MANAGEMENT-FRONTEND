import { useState, FormEvent } from "react";

import { CreatePaymentProviderDto } from "../../types/PaymentProviderType";

import OptionsDropdown from "../customDropdowns/OptionsDropdown";

interface PaymentProviderFormProps {
  onSubmit: (data: CreatePaymentProviderDto) => void | Promise<void>;
  loading?: boolean;
}

const providerTypeOptions = [
  { value: "BANK", label: "Bank" },
  { value: "CARD", label: "Card" },
  { value: "MOBILE_MONEY", label: "Mobile Money" },
  { value: "MPESA", label: "M-Pesa" },
  { value: "MANUAL", label: "Manual" },
];

const PaymentProviderForm = ({
  onSubmit,
  loading = false,
}: PaymentProviderFormProps) => {
  const [formData, setFormData] = useState<CreatePaymentProviderDto>({
    name: "",
    code: "",
    type: "",
    description: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreatePaymentProviderDto, string>>
  >({});

  const handleChange = (
    field: keyof CreatePaymentProviderDto,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Provider name is required";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Provider code is required";
    } else if (!/^[A-Z0-9_-]+$/.test(formData.code.trim().toUpperCase())) {
      newErrors.code =
        "Use only letters, numbers, underscores or hyphens";
    }

    if (!formData.type) {
      newErrors.type = "Provider type is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    await onSubmit({
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
      type: formData.type,
      description: formData.description?.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Provider Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Provider Name <span className="text-error-500">*</span>
          </label>

          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter provider name"
            disabled={loading}
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white"
          />

          {errors.name && (
            <p className="mt-1 text-sm text-error-500">{errors.name}</p>
          )}
        </div>

        {/* Provider Code */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Provider Code <span className="text-error-500">*</span>
          </label>

          <input
            type="text"
            value={formData.code}
            onChange={(e) => handleChange("code", e.target.value)}
            placeholder="e.g. MPESA"
            disabled={loading}
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm uppercase text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white"
          />

          {errors.code && (
            <p className="mt-1 text-sm text-error-500">{errors.code}</p>
          )}
        </div>

        {/* Provider Type */}
        <div className="md:col-span-2">
          <OptionsDropdown
            label="Provider Type"
            options={providerTypeOptions}
            value={formData.type}
            onChange={(value) => handleChange("type", value)}
            placeholder="Select provider type"
            disabled={loading}
            required
            error={errors.type}
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>

          <textarea
            rows={4}
            value={formData.description ?? ""}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Enter provider description (optional)"
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end border-t border-gray-200 pt-5 dark:border-gray-800">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Provider"}
        </button>
      </div>
    </form>
  );
};

export default PaymentProviderForm;