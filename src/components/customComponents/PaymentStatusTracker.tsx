import { useEffect, useState } from "react";

import {
  PaymentStatus,
} from "../../types/PaymentType";

import { usePayments } from "../../hooks/usePayments";

interface PaymentStatusTrackerProps {
  paymentId: string;
  initialStatus: PaymentStatus;
  onStatusChange?: (status: PaymentStatus) => void;
}

const POLLING_INTERVAL = 5000;
const MAX_POLLING_ATTEMPTS = 20;

const isPendingStatus = (status: PaymentStatus): boolean => {
  return status === "INITIATED" || status === "PENDING";
};

const formatStatus = (status: PaymentStatus): string => {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getStatusClasses = (status: PaymentStatus): string => {
  const classes: Record<string, string> = {
    INITIATED:
      "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
    PENDING:
      "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400",
    COMPLETED:
      "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400",
    FAILED:
      "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400",
    CANCELLED:
      "bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400",
  };

  return (
    classes[status] ??
    "bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400"
  );
};

const PaymentStatusTracker = ({
  paymentId,
  initialStatus,
  onStatusChange,
}: PaymentStatusTrackerProps) => {
  const { checkMpesaPaymentStatus } = usePayments();

  const [status, setStatus] = useState<PaymentStatus>(initialStatus);
  const [isPolling, setIsPolling] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let attemptsMade = 0;

    const updateStatus = (newStatus: PaymentStatus) => {
      setStatus(newStatus);
      onStatusChange?.(newStatus);
    };

    const scheduleNextCheck = () => {
      if (!active) return;

      if (attemptsMade >= MAX_POLLING_ATTEMPTS) {
        setIsPolling(false);
        setMessage(
          "Automatic status checks have stopped. You can check the payment again later.",
        );
        return;
      }

      timeout = setTimeout(poll, POLLING_INTERVAL);
    };

    const poll = async () => {
      if (!active) return;

      if (attemptsMade >= MAX_POLLING_ATTEMPTS) {
        setIsPolling(false);
        setMessage(
          "Automatic status checks have stopped. You can check the payment again later.",
        );
        return;
      }

      attemptsMade += 1;
      setAttempts(attemptsMade);
      setMessage("");

      try {
        const result = await checkMpesaPaymentStatus(paymentId);

        if (!active) return;

        if (!result) {
          setMessage("Unable to retrieve payment status. Retrying...");
          scheduleNextCheck();
          return;
        }

        updateStatus(result.status);

        if (isPendingStatus(result.status)) {
          scheduleNextCheck();
          return;
        }

        setIsPolling(false);

        if (result.status === "COMPLETED") {
          setMessage("Payment completed successfully.");
        } else if (result.status === "FAILED") {
          setMessage("Payment failed.");
        } else if (result.status === "CANCELLED") {
          setMessage("Payment was cancelled.");
        } else {
          setMessage("Payment status updated.");
        }
      } catch {
        if (!active) return;

        setMessage("Unable to retrieve payment status. Retrying...");
        scheduleNextCheck();
      }
    };

    setStatus(initialStatus);
    setAttempts(0);
    setMessage("");

    if (isPendingStatus(initialStatus)) {
      setIsPolling(true);
      timeout = setTimeout(poll, POLLING_INTERVAL);
    } else {
      setIsPolling(false);
    }

    return () => {
      active = false;

      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [
    paymentId,
    initialStatus,
    checkMpesaPaymentStatus,
    onStatusChange,
  ]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-800 dark:text-white">
            Payment Status
          </h3>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isPolling
              ? "Checking payment status automatically..."
              : "Latest payment status"}
          </p>
        </div>

        <span
          className={`inline-flex w-fit rounded-full px-3 py-1.5 text-sm font-medium ${getStatusClasses(
            status,
          )}`}
        >
          {formatStatus(status)}
        </span>
      </div>

      {isPolling && (
        <div className="mt-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Waiting for payment confirmation
            </span>

            <span className="text-gray-500 dark:text-gray-400">
              {attempts}/{MAX_POLLING_ATTEMPTS}
            </span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div className="h-full w-full animate-pulse rounded-full bg-brand-500" />
          </div>
        </div>
      )}

      {message && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          {message}
        </p>
      )}

      {isPolling && (
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Please wait while we confirm your payment. Avoid initiating another
          payment for the same transaction.
        </p>
      )}
    </div>
  );
};

export default PaymentStatusTracker;