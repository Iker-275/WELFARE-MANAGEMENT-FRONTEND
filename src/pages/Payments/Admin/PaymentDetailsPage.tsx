

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";

import PaymentStatusTracker from "../../../components/customComponents/PaymentStatusTracker";
import PdfPreviewModal from "../../../components/customComponents/PDFPreview";

import { usePayments } from "../../../hooks/usePayments";
import { useReceiptContext } from "../../../hooks/useReceipts";

import {
  Payment,
  PaymentStatus,
} from "../../../types/PaymentType";

const formatStatus = (status: string): string => {
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

const formatDate = (date?: string | null): string => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleString("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <div>
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>

    <p className="mt-1 break-words font-medium text-gray-800 dark:text-white">
      {value === null || value === undefined || value === ""
        ? "—"
        : value}
    </p>
  </div>
);

const AdminPaymentDetailsPage = () => {
  const { paymentId } = useParams<{ paymentId: string }>();
  const navigate = useNavigate();

  const {
    selectedPayment,
    loading,
    message,
    fetchPayment,
    completeManualPayment,
    clearMessage,
  } = usePayments();

  const { fetchReceiptPdf } = useReceiptContext();

  const [payment, setPayment] = useState<Payment | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(
    null,
  );

  const [externalReference, setExternalReference] = useState("");
  const [notes, setNotes] = useState("");
  const [showManualCompletion, setShowManualCompletion] = useState(false);

  // Receipt PDF preview state
  const [receiptPdfUrl, setReceiptPdfUrl] = useState<string | null>(null);
  const [receiptPdfOpen, setReceiptPdfOpen] = useState(false);
  const [receiptPdfLoading, setReceiptPdfLoading] = useState(false);

  const loadPayment = useCallback(async () => {
    if (!paymentId) return;

    clearMessage();

    const result = await fetchPayment(paymentId);

    if (result) {
      setPayment(result);
      setPaymentStatus(result.status);
    }
  }, [paymentId, fetchPayment, clearMessage]);

  useEffect(() => {
    loadPayment();
  }, [loadPayment]);

  useEffect(() => {
    if (selectedPayment?.id === paymentId) {
      setPayment(selectedPayment);
      setPaymentStatus(selectedPayment?.status!);
    }
  }, [selectedPayment, paymentId]);

  // Revoke the generated PDF URL when it changes or the page unmounts.
  useEffect(() => {
    return () => {
      if (receiptPdfUrl) {
        URL.revokeObjectURL(receiptPdfUrl);
      }
    };
  }, [receiptPdfUrl]);

  const handlePreviewReceiptPdf = async () => {
    const receiptId = payment?.receipt?.id;

    if (!receiptId) return;

    setReceiptPdfLoading(true);

    try {
      const blob = await fetchReceiptPdf(receiptId);

      if (!blob) return;

      const url = URL.createObjectURL(blob);

      setReceiptPdfUrl(url);
      setReceiptPdfOpen(true);
    } finally {
      setReceiptPdfLoading(false);
    }
  };

  const handleCloseReceiptPdf = () => {
    setReceiptPdfOpen(false);
    setReceiptPdfUrl(null);
  };

  const handleStatusChange = useCallback(
    async (status: PaymentStatus) => {
      setPaymentStatus(status);

      if (
        status === "COMPLETED" ||
        status === "FAILED" ||
        status === "CANCELLED"
      ) {
        if (!paymentId) return;

        const latestPayment = await fetchPayment(paymentId);

        if (latestPayment) {
          setPayment(latestPayment);
          setPaymentStatus(latestPayment.status);
        }
      }
    },
    [paymentId, fetchPayment],
  );

  const handleManualCompletion = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!payment) return;

    clearMessage();

    const success = await completeManualPayment(payment.id, {
      externalReference: externalReference.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    if (success) {
      setShowManualCompletion(false);
      setExternalReference("");
      setNotes("");

      // Reload payment so the newly issued receipt is included.
      const latestPayment = await fetchPayment(payment.id);

      if (latestPayment) {
        setPayment(latestPayment);
        setPaymentStatus(latestPayment.status);
      }
    }
  };

  if (loading && !payment) {
    return (
      <>
        <PageMeta
          title="Payment Details"
          description="View payment information"
        />

        <PageBreadcrumb pageTitle="Payment Details" />

        <ComponentCard title="Payment Details">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading payment details...
          </p>
        </ComponentCard>
      </>
    );
  }

  if (!payment) {
    return (
      <>
        <PageMeta
          title="Payment Details"
          description="View payment information"
        />

        <PageBreadcrumb pageTitle="Payment Details" />

        <ComponentCard title="Payment Not Found">
          {message && (
            <p className="mb-4 text-sm text-red-500">{message}</p>
          )}

          <p className="text-sm text-gray-500 dark:text-gray-400">
            The requested payment could not be loaded.
          </p>

          <button
            type="button"
            onClick={() => navigate("/payments")}
            className="mt-5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Back to Payments
          </button>
        </ComponentCard>
      </>
    );
  }

  const currentStatus = paymentStatus ?? payment.status;

  const isMpesaPending =
    payment.method === "MPESA" &&
    (currentStatus === "INITIATED" || currentStatus === "PENDING");

  const canCompleteManually =
    payment.method !== "MPESA" &&
    currentStatus !== "COMPLETED" &&
    currentStatus !== "FAILED" &&
    currentStatus !== "CANCELLED";

  return (
    <>
      <PageMeta
        title="Payment Details"
        description="View and manage payment information"
      />

      <PageBreadcrumb pageTitle="Payment Details" />

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Payment Details
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Reference: {payment.internalReference}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/payments")}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Back to Payments
          </button>
        </div>

        {message && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400">
            {message}
          </div>
        )}

        <ComponentCard title="Payment Overview">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <DetailItem
              label="Amount"
              value={formatAmount(payment.amount, payment.currency)}
            />

            <DetailItem
              label="Payment Method"
              value={formatStatus(payment.method)}
            />

            <DetailItem
              label="Status"
              value={formatStatus(currentStatus)}
            />

            <DetailItem
              label="Internal Reference"
              value={payment.internalReference}
            />

            <DetailItem
              label="External Reference"
              value={payment.externalReference}
            />

            <DetailItem
              label="Description"
              value={payment.description}
            />

            <DetailItem
              label="Initiated At"
              value={formatDate(payment.initiatedAt)}
            />

            <DetailItem
              label="Completed At"
              value={formatDate(payment.completedAt)}
            />

            <DetailItem
              label="Created At"
              value={formatDate(payment.createdAt)}
            />
          </div>
        </ComponentCard>

        <ComponentCard title="Member Information">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <DetailItem
              label="Membership Number"
              value={payment.member?.membershipNumber}
            />

            <DetailItem
              label="Member ID"
              value={payment.memberId}
            />

            <DetailItem
              label="Membership Status"
              value={
                payment.member?.status
                  ? formatStatus(payment.member.status)
                  : "—"
              }
            />
          </div>
        </ComponentCard>

        <ComponentCard title="Payment Provider">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <DetailItem
              label="Provider Name"
              value={payment.provider?.name}
            />

            <DetailItem
              label="Provider Code"
              value={payment.provider?.code}
            />

            <DetailItem
              label="Provider Type"
              value={
                payment.provider?.type
                  ? formatStatus(payment.provider.type)
                  : "—"
              }
            />
          </div>
        </ComponentCard>

        {isMpesaPending && (
          <ComponentCard title="M-Pesa Status Tracking">
            <PaymentStatusTracker
              paymentId={payment.id}
              initialStatus={currentStatus}
              onStatusChange={handleStatusChange}
            />
          </ComponentCard>
        )}

        {canCompleteManually && (
          <ComponentCard title="Manual Payment Completion">
            {!showManualCompletion ? (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Use this action after confirming that the payment was
                  received through the relevant manual payment channel.
                </p>

                <button
                  type="button"
                  onClick={() => setShowManualCompletion(true)}
                  className="mt-4 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
                >
                  Complete Manual Payment
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleManualCompletion}
                className="space-y-4"
              >
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    External Reference
                  </label>

                  <input
                    type="text"
                    value={externalReference}
                    onChange={(event) =>
                      setExternalReference(event.target.value)
                    }
                    placeholder="Enter bank or payment reference"
                    className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Notes
                  </label>

                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    rows={3}
                    placeholder="Enter payment verification notes"
                    className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex flex-wrap justify-end gap-3">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => setShowManualCompletion(false)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "Processing..." : "Confirm Payment"}
                  </button>
                </div>
              </form>
            )}
          </ComponentCard>
        )}

        <ComponentCard title="Payment Transactions">
          {!payment.transactions?.length ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No payment transactions found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 font-medium text-gray-500">
                      Type
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-500">
                      Status
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-500">
                      External Reference
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-500">
                      Error
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-500">
                      Processed At
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {payment.transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-gray-100 dark:border-gray-800"
                    >
                      <td className="px-4 py-3 text-gray-800 dark:text-white">
                        {formatStatus(transaction.type)}
                      </td>

                      <td className="px-4 py-3 text-gray-800 dark:text-white">
                        {formatStatus(transaction.status)}
                      </td>

                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {transaction.externalReference ??
                          transaction.externalTransactionId ??
                          "—"}
                      </td>

                      <td className="px-4 py-3 text-red-500">
                        {transaction.errorMessage ?? "—"}
                      </td>

                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {formatDate(transaction.processedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ComponentCard>

        <ComponentCard title="Payment Allocations">
          {!payment.allocations?.length ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No payment allocations found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 font-medium text-gray-500">
                      Allocation ID
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-500">
                      Amount
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-500">
                      Contribution ID
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-500">
                      Created At
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {payment.allocations.map((allocation) => (
                    <tr
                      key={allocation.id}
                      className="border-b border-gray-100 dark:border-gray-800"
                    >
                      <td className="px-4 py-3 text-gray-800 dark:text-white">
                        {allocation.id}
                      </td>

                      <td className="px-4 py-3 text-gray-800 dark:text-white">
                        {allocation.amount !== undefined
                          ? formatAmount(
                              allocation.amount,
                              allocation.currency ?? payment.currency,
                            )
                          : "—"}
                      </td>

                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {allocation.memberContributionId ??
                          allocation.contributionId ??
                          "—"}
                      </td>

                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {formatDate(allocation.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ComponentCard>

        <ComponentCard title="Payment Receipt">
          {payment.receipt ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                <DetailItem
                  label="Receipt Number"
                  value={payment.receipt.receiptNumber}
                />

                <DetailItem
                  label="Amount"
                  value={formatAmount(
                    payment.receipt.amount,
                    payment.receipt.currency,
                  )}
                />

                <DetailItem
                  label="Receipt Status"
                  value={formatStatus(payment.receipt.status)}
                />

                <DetailItem
                  label="Issued At"
                  value={formatDate(payment.receipt.issuedAt)}
                />

                <DetailItem
                  label="Voided At"
                  value={formatDate(payment.receipt.voidedAt)}
                />

                <DetailItem
                  label="Void Reason"
                  value={payment.receipt.voidReason}
                />
              </div>

              {payment.receipt.id && (
                <div className="flex justify-end border-t border-gray-200 pt-4 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={handlePreviewReceiptPdf}
                    disabled={receiptPdfLoading}
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {receiptPdfLoading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Loading Receipt...
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="h-5 w-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 12s3.5-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.5 7.5-9.75 7.5S2.25 12 2.25 12Z"
                          />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        Preview Receipt PDF
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 p-5 text-center dark:border-gray-700">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                No receipt has been issued for this payment.
              </p>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                A receipt will appear here after the payment has been
                successfully completed and a receipt has been issued.
              </p>
            </div>
          )}
        </ComponentCard>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={loadPayment}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {loading ? "Refreshing..." : "Refresh Payment"}
          </button>
        </div>
      </div>

      {/* Receipt PDF Preview Modal */}
      <PdfPreviewModal
        open={receiptPdfOpen}
        url={receiptPdfUrl}
        onClose={handleCloseReceiptPdf}
      />
    </>
  );
};

export default AdminPaymentDetailsPage;