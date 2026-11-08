
import { FormEvent, useState } from "react";

import PenaltyRuleDropdown from "../customDropdowns/PenaltyRuleDropdown";
import PenaltyDropdown from "../customDropdowns/PenaltyDropdown";
import PenaltyAdjustmentTypeDropdown from "../customDropdowns/PenaltyAdjustmentTypeDropdown";

import { usePenaltyAdjustmentContext } from "../../hooks/usePenaltyAdjustments";

import { PenaltyAdjustmentType } from "../../types/PenaltyAdjustmentType";

interface AdjustmentsFormProps {
  onSuccess?: () => void;
}

interface FormErrors {
  ruleId?: string;
  penaltyId?: string;
  type?: string;
  amount?: string;
  reason?: string;
}

const AdjustmentsForm = ({ onSuccess }: AdjustmentsFormProps) => {
  const { createAdjustment, loading, message, clearMessage } =
    usePenaltyAdjustmentContext();

  const [ruleId, setRuleId] = useState("");
  const [penaltyId, setPenaltyId] = useState("");
  const [type, setType] = useState<PenaltyAdjustmentType | "">("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});

  const handleRuleChange = (value: string) => {
    setRuleId(value);
    setPenaltyId("");

    setErrors((previous) => ({
      ...previous,
      ruleId: undefined,
      penaltyId: undefined,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!ruleId) {
      newErrors.ruleId = "Please select a penalty rule.";
    }

    if (!penaltyId) {
      newErrors.penaltyId = "Please select a penalty.";
    }

    if (!type) {
      newErrors.type = "Please select an adjustment type.";
    }

    const numericAmount = Number(amount);

    if (!amount.trim()) {
      newErrors.amount = "Amount is required.";
    } else if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      newErrors.amount = "Enter an amount greater than zero.";
    }

    if (!reason.trim()) {
      newErrors.reason = "Please provide a reason for this adjustment.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    clearMessage();

    if (!validateForm() || !type) return;

    const success = await createAdjustment({
      penaltyId,
      type,
      amount: Number(amount),
      reason: reason.trim(),
    });

    if (!success) return;

    setRuleId("");
    setPenaltyId("");
    setType("");
    setAmount("");
    setReason("");
    setErrors({});

    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Penalty selection */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <PenaltyRuleDropdown
            value={ruleId}
            onChange={handleRuleChange}
            label="Penalty Rule"
            placeholder="Select penalty rule"
            required
            disabled={loading}
          />

          {errors.ruleId && (
            <p className="mt-1 text-sm text-error-500">
              {errors.ruleId}
            </p>
          )}
        </div>

        <div>
          <PenaltyDropdown
            value={penaltyId}
            onChange={setPenaltyId}
            ruleId={ruleId}
            label="Penalty"
            placeholder="Select penalty"
            required
            disabled={loading || !ruleId}
          />

          {errors.penaltyId && (
            <p className="mt-1 text-sm text-error-500">
              {errors.penaltyId}
            </p>
          )}
        </div>
      </div>

      {/* Adjustment details */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <PenaltyAdjustmentTypeDropdown
            value={type}
            onChange={setType}
            label="Adjustment Type"
            placeholder="Select adjustment type"
            required
            disabled={loading}
          />

          {errors.type && (
            <p className="mt-1 text-sm text-error-500">
              {errors.type}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="adjustmentAmount"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Adjustment Amount <span className="text-error-500">*</span>
          </label>

          <input
            id="adjustmentAmount"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Enter adjustment amount"
            disabled={loading}
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />

          {errors.amount && (
            <p className="mt-1 text-sm text-error-500">
              {errors.amount}
            </p>
          )}
        </div>
      </div>

      {/* Reason */}
      <div>
        <label
          htmlFor="adjustmentReason"
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Adjustment Reason <span className="text-error-500">*</span>
        </label>

        <textarea
          id="adjustmentReason"
          rows={4}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Explain why this penalty adjustment is being requested..."
          disabled={loading}
          className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
        />

        {errors.reason && (
          <p className="mt-1 text-sm text-error-500">
            {errors.reason}
          </p>
        )}
      </div>

      {/* API message */}
      {message && (
        <div className="rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {message}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating Adjustment..." : "Create Adjustment"}
        </button>
      </div>
    </form>
  );
};

export default AdjustmentsForm;
