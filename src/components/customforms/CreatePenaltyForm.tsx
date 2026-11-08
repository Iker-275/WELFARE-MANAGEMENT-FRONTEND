import { FormEvent, useState } from "react";

import { usePenaltyContext } from "../../hooks/usePenalties";

import PaymentMemberDropdown from "../customDropdowns/PaymentMemberDropdown";
import PenaltyRuleDropdown from "../customDropdowns/PenaltyRuleDropdown";
import PenaltyTypeDropdown from "../customDropdowns/PenaltyTypeDropdown";
import PenaltyStatusDropdown from "../customDropdowns/PenaltyStatusDropdown";

import {
  CreatePenaltyDto,
  PenaltyStatus,
  PenaltyType,
} from "../../types/PenaltyType";

interface CreatePenaltyFormProps {
  onSuccess?: () => void;
}

const CreatePenaltyForm = ({
  onSuccess,
}: CreatePenaltyFormProps) => {
  const {
    createPenalty,
    loading,
    message,
    clearMessage,
  } = usePenaltyContext();

  const [memberId, setMemberId] = useState("");
  const [memberContributionId, setMemberContributionId] = useState("");
  const [penaltyRuleId, setPenaltyRuleId] = useState("");

  const [type, setType] = useState<PenaltyType | "">("");
  const [baseAmount, setBaseAmount] = useState("");
  const [percentage, setPercentage] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<PenaltyStatus>("PENDING");

  const [error, setError] = useState("");

  const resetForm = () => {
    setMemberId("");
    setMemberContributionId("");
    setPenaltyRuleId("");
    setType("");
    setBaseAmount("");
    setPercentage("");
    setAmount("");
    setCurrency("");
    setReason("");
    setStatus("PENDING");
    setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    clearMessage();
    setError("");

    if (!memberId) {
      setError("Please select a member.");
      return;
    }

    if (!type) {
      setError("Please select a penalty type.");
      return;
    }

    if (!amount.trim() || Number(amount) <= 0) {
      setError("Please enter a valid penalty amount.");
      return;
    }

    if (
      baseAmount.trim() &&
      (!Number.isFinite(Number(baseAmount)) || Number(baseAmount) < 0)
    ) {
      setError("Please enter a valid base amount.");
      return;
    }

    if (
      percentage.trim() &&
      (!Number.isFinite(Number(percentage)) || Number(percentage) < 0)
    ) {
      setError("Please enter a valid percentage.");
      return;
    }

    const payload: CreatePenaltyDto = {
      memberId,
      type,
      amount: amount.trim(),
      source: "MANUAL",
    //   status,
      ...(memberContributionId.trim() && {
        memberContributionId: memberContributionId.trim(),
      }),
      ...(penaltyRuleId && {
        penaltyRuleId,
      }),
      ...(baseAmount.trim() && {
        baseAmount: baseAmount.trim(),
      }),
      ...(percentage.trim() && {
        percentage: percentage.trim(),
      }),
      ...(currency.trim() && {
        currency: currency.trim().toUpperCase(),
      }),
      ...(reason.trim() && {
        reason: reason.trim(),
      }),
    };

    const success = await createPenalty(payload);

    if (success) {
      resetForm();
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Member and contribution */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <PaymentMemberDropdown
          value={memberId}
          onChange={setMemberId}
          label="Member"
          placeholder="Select member"
          required
          disabled={loading}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Member Contribution ID
          </label>

          <input
            type="text"
            value={memberContributionId}
            onChange={(event) =>
              setMemberContributionId(event.target.value)
            }
            placeholder="Enter member contribution ID (optional)"
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white"
          />

          <p className="mt-1 text-xs text-gray-500">
            Optionally associate this penalty with a member contribution.
          </p>
        </div>
      </div>

      {/* Penalty rule and type */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <PenaltyRuleDropdown
          value={penaltyRuleId}
          onChange={setPenaltyRuleId}
          label="Penalty Rule"
          placeholder="Select penalty rule (optional)"
          disabled={loading}
        />

        <PenaltyTypeDropdown
          value={type}
          onChange={(value) => setType(value)}
          label="Penalty Type"
          placeholder="Select penalty type"
          required
          disabled={loading}
        />
      </div>

      {/* Amount details */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Penalty Amount *
          </label>

          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Enter penalty amount"
            required
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Currency
          </label>

          <input
            type="text"
            value={currency}
            onChange={(event) => setCurrency(event.target.value)}
            placeholder="e.g. KES"
            maxLength={3}
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm uppercase text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Base Amount
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={baseAmount}
            onChange={(event) => setBaseAmount(event.target.value)}
            placeholder="Enter base amount (optional)"
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Percentage
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={percentage}
            onChange={(event) => setPercentage(event.target.value)}
            placeholder="Enter percentage (optional)"
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Status */}
      <div className="max-w-md">
        <PenaltyStatusDropdown
          value={status}
          onChange={(value) => setStatus(value as PenaltyStatus)}
          label="Initial Status"
          placeholder="Select status"
          disabled={loading}
        />
      </div>

      {/* Reason */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Reason
        </label>

        <textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Enter the reason for this penalty"
          rows={4}
          disabled={loading}
          className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white"
        />
      </div>

      {/* Feedback */}
      {(error || message) && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            error
              ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
              : "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
          }`}
        >
          {error || message}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-700">
        <button
          type="button"
          onClick={resetForm}
          disabled={loading}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Reset
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating Penalty..." : "Create Penalty"}
        </button>
      </div>
    </form>
  );
};

export default CreatePenaltyForm;