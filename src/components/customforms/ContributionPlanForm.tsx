
import { FormEvent, useEffect, useState } from "react";

import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

import ContributionFrequencyDropdown from "../customDropdowns/ContributionFrequencyDropdown";

import {
    ContributionFrequency,
    CreateContributionPlanDto,
    ContributionPlan,
} from "../../types/ContributionPlanType";

export type ContributionPlanFormMode = "create" | "edit";

export interface ContributionPlanFormData {
    name: string;
    code: string;
    description: string;
    frequency: ContributionFrequency;
    currency: string;
    effectiveFrom: string;
    effectiveTo: string;
}

interface ContributionPlanFormProps {
    mode: ContributionPlanFormMode;
    initialData?: ContributionPlan | null;
    loading?: boolean;
    message?: string;
    onSubmit: (data: CreateContributionPlanDto) => Promise<boolean>;
    onCancel?: () => void;
}

interface ContributionPlanFormErrors {
    name?: string;
    code?: string;
    description?: string;
    frequency?: string;
    currency?: string;
    effectiveFrom?: string;
    effectiveTo?: string;
}

const getInitialFormData = (
    initialData?: ContributionPlan | null
): ContributionPlanFormData => ({
    name: initialData?.name ?? "",
    code: initialData?.code ?? "",
    description: initialData?.description ?? "",
    frequency: initialData?.frequency ?? "MONTHLY",
    currency: initialData?.currency ?? "KES",
    effectiveFrom: initialData?.effectiveFrom
        ? initialData.effectiveFrom.slice(0, 10)
        : "",
    effectiveTo: initialData?.effectiveTo
        ? initialData.effectiveTo.slice(0, 10)
        : "",
});

const ContributionPlanForm = ({
    mode,
    initialData,
    loading = false,
    message = "",
    onSubmit,
    onCancel,
}: ContributionPlanFormProps) => {
    const [formData, setFormData] = useState<ContributionPlanFormData>(
        () => getInitialFormData(initialData)
    );

    const [errors, setErrors] = useState<ContributionPlanFormErrors>({});

    // Populate the form when editing data is loaded or changed.
    useEffect(() => {
        setFormData(getInitialFormData(initialData));
        setErrors({});
    }, [initialData]);

    const updateField = <K extends keyof ContributionPlanFormData>(
        field: K,
        value: ContributionPlanFormData[K]
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

    const validateForm = (): boolean => {
        const newErrors: ContributionPlanFormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Plan name is required.";
        } else if (formData.name.trim().length < 3) {
            newErrors.name = "Plan name must contain at least 3 characters.";
        }

        if (!formData.code.trim()) {
            newErrors.code = "Plan code is required.";
        } else if (!/^[A-Za-z0-9_-]+$/.test(formData.code.trim())) {
            newErrors.code =
                "Plan code can only contain letters, numbers, underscores and hyphens.";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Plan description is required.";
        }

        if (!formData.frequency) {
            newErrors.frequency = "Contribution frequency is required.";
        }

        if (!formData.currency.trim()) {
            newErrors.currency = "Currency is required.";
        } else if (!/^[A-Za-z]{3}$/.test(formData.currency.trim())) {
            newErrors.currency = "Enter a valid 3-letter currency code.";
        }

        if (!formData.effectiveFrom) {
            newErrors.effectiveFrom = "Effective from date is required.";
        }

        if (
            formData.effectiveFrom &&
            formData.effectiveTo &&
            formData.effectiveTo < formData.effectiveFrom
        ) {
            newErrors.effectiveTo =
                "Effective to date cannot be earlier than effective from date.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (loading || !validateForm()) {
            return;
        }

        const payload: CreateContributionPlanDto = {
            name: formData.name.trim(),
            code: formData.code.trim().toUpperCase(),
            description: formData.description.trim(),
            frequency: formData.frequency,
            currency: formData.currency.trim().toUpperCase(),
            effectiveFrom: new Date(
                `${formData.effectiveFrom}T00:00:00.000Z`
            ).toISOString(),

            effectiveTo: formData.effectiveTo
                ? new Date(
                    `${formData.effectiveTo}T23:59:59.999Z`
                ).toISOString()
                : null,
            //   effectiveFrom: formData.effectiveFrom,
            //   effectiveTo: formData.effectiveTo || null,
        };

        await onSubmit(payload);
    };

    const isEditMode = mode === "edit";

    return (
        <ComponentCard
            title={isEditMode ? "Update Contribution Plan" : "Create Contribution Plan"}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Backend message */}
                {message && (
                    <div
                        role="alert"
                        className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300"
                    >
                        {message}
                    </div>
                )}

                {/* Basic Information */}
                <div>
                    <h4 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
                        Basic Information
                    </h4>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                            <Label>
                                Plan Name <span className="text-error-500">*</span>
                            </Label>

                            <Input
                                type="text"
                                value={formData.name}
                                onChange={(event) =>
                                    updateField("name", event.target.value)
                                }
                                placeholder="Enter contribution plan name"
                                disabled={loading}
                            />

                            {errors.name && (
                                <p className="mt-1 text-sm text-error-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>
                                Plan Code <span className="text-error-500">*</span>
                            </Label>

                            <Input
                                type="text"
                                value={formData.code}
                                onChange={(event) =>
                                    updateField("code", event.target.value.toUpperCase())
                                }
                                placeholder="e.g. STANDARD_MONTHLY"
                                disabled={loading || isEditMode}
                            />

                            {errors.code && (
                                <p className="mt-1 text-sm text-error-500">
                                    {errors.code}
                                </p>
                            )}

                            {isEditMode && (
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Plan code cannot be changed when editing.
                                </p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <Label>
                                Description <span className="text-error-500">*</span>
                            </Label>

                            <textarea
                                value={formData.description}
                                onChange={(event) =>
                                    updateField("description", event.target.value)
                                }
                                placeholder="Describe this contribution plan..."
                                rows={4}
                                disabled={loading}
                                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 shadow-theme-xs outline-none placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                            />

                            {errors.description && (
                                <p className="mt-1 text-sm text-error-500">
                                    {errors.description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contribution Settings */}
                <div>
                    <h4 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
                        Contribution Settings
                    </h4>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                            <ContributionFrequencyDropdown
                                value={formData.frequency}
                                onChange={(value) =>
                                    updateField(
                                        "frequency",
                                        value as ContributionFrequency
                                    )
                                }
                                label="Contribution Frequency"
                                placeholder="Select frequency"
                                disabled={loading}
                                required
                                error={errors.frequency}
                            />
                        </div>

                        <div>
                            <Label>
                                Currency <span className="text-error-500">*</span>
                            </Label>

                            <Input
                                type="text"
                                value={formData.currency}
                                onChange={(event) =>
                                    updateField(
                                        "currency",
                                        event.target.value.toUpperCase()
                                    )
                                }
                                placeholder="KES"
                                // maxLength={3}
                                disabled={loading}
                            />

                            {errors.currency && (
                                <p className="mt-1 text-sm text-error-500">
                                    {errors.currency}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Effective Period */}
                <div>
                    <h4 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
                        Effective Period
                    </h4>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                            <Label>
                                Effective From <span className="text-error-500">*</span>
                            </Label>

                            <Input
                                type="date"
                                value={formData.effectiveFrom}
                                onChange={(event) =>
                                    updateField("effectiveFrom", event.target.value)
                                }
                                disabled={loading}
                            />

                            {errors.effectiveFrom && (
                                <p className="mt-1 text-sm text-error-500">
                                    {errors.effectiveFrom}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>Effective To</Label>

                            <Input
                                type="date"
                                value={formData.effectiveTo}
                                min={formData.effectiveFrom || undefined}
                                onChange={(event) =>
                                    updateField("effectiveTo", event.target.value)
                                }
                                disabled={loading}
                            />

                            {errors.effectiveTo && (
                                <p className="mt-1 text-sm text-error-500">
                                    {errors.effectiveTo}
                                </p>
                            )}

                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Leave empty if this plan has no end date.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-800 sm:flex-row">
                    {onCancel && (
                        <Button
                            //   type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                    )}

                    <Button disabled={loading}>
                        {loading
                            ? isEditMode
                                ? "Updating..."
                                : "Creating..."
                            : isEditMode
                                ? "Update Plan"
                                : "Create Plan"}
                    </Button>
                </div>
            </form>
        </ComponentCard>
    );
};

export default ContributionPlanForm;
