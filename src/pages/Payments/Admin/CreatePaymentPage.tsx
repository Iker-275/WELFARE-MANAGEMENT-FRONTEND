
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";

import PaymentForm from "../../../components/customforms/PaymentForm";

import PaymentMemberDropdown from "../../../components/customDropdowns/PaymentMemberDropdown";
import PaymentStatusTracker from "../../../components/customComponents/PaymentStatusTracker";

import { usePayments } from "../../../hooks/usePayments";

import {
  CreatePaymentDto,
  Payment,
  PaymentStatus,
} from "../../../types/PaymentType";

const formatStatus = (status: PaymentStatus): string => {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatAmount = (
  amount: string | number,
  currency: string,
): string => {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return `${currency} ${amount}`;
  }

  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(numericAmount);
};

const CreateAdminPaymentPage = () => {
  const navigate = useNavigate();

  const {
    createPayment,
    initiateMpesaStkPush,
    fetchPayment,
    loading,
    message,
    clearMessage,
  } = usePayments();

  const [memberId, setMemberId] = useState("");
  const [payment, setPayment] = useState<Payment | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(
    null,
  );
  const [workflowMessage, setWorkflowMessage] = useState("");
  const [isInitiating, setIsInitiating] = useState(false);

  const handleSubmit = async (payload: CreatePaymentDto) => {
    if (!memberId) {
      setWorkflowMessage("Please select a member before creating a payment.");
      return;
    }

    clearMessage();
    setWorkflowMessage("");
    setPayment(null);
    setPaymentStatus(null);
    setIsInitiating(true);

    try {
      const createdPayment = await createPayment({
        ...payload,
        memberId,
      });

      if (!createdPayment) return;

      setPayment(createdPayment);
      setPaymentStatus(createdPayment.status);

      if (createdPayment.method !== "MPESA") {
        setWorkflowMessage(
          "Payment created successfully. Follow the applicable payment processing procedure.",
        );
        return;
      }

      const stkResponse = await initiateMpesaStkPush(createdPayment.id);

      if (!stkResponse) {
        setWorkflowMessage(
          "Payment was created, but STK Push initiation could not be confirmed. Check the existing payment before retrying.",
        );
        return;
      }

      setPaymentStatus(stkResponse.status);

      setWorkflowMessage(
        stkResponse.message ||
          "STK Push initiated. Ask the member to check their phone and complete the payment.",
      );
    } finally {
      setIsInitiating(false);
    }
  };

  const handleStatusChange = async (status: PaymentStatus) => {
    setPaymentStatus(status);

    if (
      status === "COMPLETED" ||
      status === "FAILED" ||
      status === "CANCELLED"
    ) {
      if (!payment) return;

      const latestPayment = await fetchPayment(payment.id);

      if (latestPayment) {
        setPayment(latestPayment);
      }
    }
  };

  return (
    <>
      <PageMeta
        title="Create Payment"
        description="Create a payment for a member"
      />

      <PageBreadcrumb pageTitle="Create Payment" />

      <div className="space-y-6">
        {!payment ? (
          <>
            <ComponentCard title="Select Member">
              <PaymentMemberDropdown
                value={memberId}
                onChange={setMemberId}
                label="Member"
                placeholder="Select a member"
                disabled={loading || isInitiating}
                required
              />
            </ComponentCard>

            <ComponentCard title="Payment Information">
              {memberId ? (
                <PaymentForm
                  memberId={memberId}
                  onSubmit={handleSubmit}
                  loading={loading || isInitiating}
                />
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Select a member to continue with payment creation.
                </p>
              )}

              {message && (
                <p className="mt-4 text-sm text-red-500">{message}</p>
              )}

              {workflowMessage && (
                <p className="mt-4 text-sm text-red-500">
                  {workflowMessage}
                </p>
              )}
            </ComponentCard>
          </>
        ) : (
          <>
            <ComponentCard title="Payment Information">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Amount
                  </p>
                  <p className="mt-1 font-medium text-gray-800 dark:text-white">
                    {formatAmount(payment.amount, payment.currency)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Payment Method
                  </p>
                  <p className="mt-1 font-medium text-gray-800 dark:text-white">
                    {payment.method}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Member ID
                  </p>
                  <p className="mt-1 font-medium text-gray-800 dark:text-white">
                    {payment.member?.membershipNumber ?? payment.memberId}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Internal Reference
                  </p>
                  <p className="mt-1 font-medium text-gray-800 dark:text-white">
                    {payment.internalReference}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Status
                  </p>
                  <p className="mt-1 font-medium text-gray-800 dark:text-white">
                    {formatStatus(paymentStatus ?? payment.status)}
                  </p>
                </div>
              </div>
            </ComponentCard>

            {payment.method === "MPESA" && (
              <ComponentCard title="M-Pesa Payment Tracking">
                <PaymentStatusTracker
                  paymentId={payment.id}
                  initialStatus={paymentStatus ?? payment.status}
                  onStatusChange={handleStatusChange}
                />
              </ComponentCard>
            )}

            {workflowMessage && (
              <ComponentCard title="Payment Update">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {workflowMessage}
                </p>
              </ComponentCard>
            )}

            {paymentStatus === "COMPLETED" && (
              <ComponentCard title="Payment Completed">
                <p className="text-sm text-green-600 dark:text-green-400">
                  Payment completed successfully.
                </p>
              </ComponentCard>
            )}

            {(paymentStatus === "FAILED" ||
              paymentStatus === "CANCELLED") && (
              <ComponentCard title="Payment Not Completed">
                <p className="text-sm text-red-500">
                  Payment {formatStatus(paymentStatus).toLowerCase()}.
                  Review the payment before attempting another transaction.
                </p>
              </ComponentCard>
            )}

            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate(`/payments/${payment.id}`)}
                className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
              >
                View Payment Details
              </button>

              <button
                type="button"
                onClick={() => navigate("/payments")}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Back to Payments
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CreateAdminPaymentPage;
