
// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// import PageMeta from "../../../components/common/PageMeta";
// import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
// import ComponentCard from "../../../components/common/ComponentCard";

// import PaymentStatusTracker from "../../../components/customComponents/PaymentStatusTracker";

// import { usePayments } from "../../../hooks/usePayments";

// import {
//   Payment,
//   PaymentStatus,
// } from "../../../types/PaymentType";

// const formatStatus = (status: string): string => {
//   return status
//     .replace(/_/g, " ")
//     .toLowerCase()
//     .replace(/\b\w/g, (char) => char.toUpperCase());
// };

// const formatAmount = (
//   amount: string | number,
//   currency: string,
// ): string => {
//   const numericAmount = Number(amount);

//   if (!Number.isFinite(numericAmount)) {
//     return `${currency} ${amount}`;
//   }

//   return new Intl.NumberFormat("en-KE", {
//     style: "currency",
//     currency,
//     minimumFractionDigits: 2,
//   }).format(numericAmount);
// };

// const formatDate = (date?: string | null): string => {
//   if (!date) return "—";

//   const parsedDate = new Date(date);

//   if (Number.isNaN(parsedDate.getTime())) {
//     return "—";
//   }

//   return parsedDate.toLocaleString("en-KE", {
//     dateStyle: "medium",
//     timeStyle: "short",
//   });
// };

// const DetailItem = ({
//   label,
//   value,
// }: {
//   label: string;
//   value?: string | number | null;
// }) => (
//   <div>
//     <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
//     <p className="mt-1 break-words text-sm font-medium text-gray-800 dark:text-white">
//       {value ?? "—"}
//     </p>
//   </div>
// );

// const MemberPaymentDetailsPage = () => {
//   const { memberId, paymentId } = useParams<{
//     memberId: string;
//     paymentId: string;
//   }>();

//   const navigate = useNavigate();

//   const {
//     selectedPayment,
//     loading,
//     message,
//     fetchPayment,
//     clearMessage,
//   } = usePayments();

//   const [payment, setPayment] = useState<Payment | null>(null);
//   const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(
//     null,
//   );

//   useEffect(() => {
//     if (!paymentId) return;

//     clearMessage();
//     setPayment(null);
//     setPaymentStatus(null);

//     let active = true;

//     const loadPayment = async () => {
//       const result = await fetchPayment(paymentId);

//       if (!active) return;

//       if (result) {
//         setPayment(result);
//         setPaymentStatus(result.status);
//       }
//     };

//     loadPayment();

//     return () => {
//       active = false;
//     };
//   }, [paymentId, fetchPayment, clearMessage]);

//   const handleStatusChange = (status: PaymentStatus) => {
//     setPaymentStatus(status);
//   };

//   if (!memberId || !paymentId) {
//     return (
//       <div className="p-5 text-sm text-red-500">
//         Member ID or payment ID is missing from the route.
//       </div>
//     );
//   }

//   if (loading && !payment && !selectedPayment) {
//     return (
//       <div className="p-5 text-sm text-gray-500 dark:text-gray-400">
//         Loading payment details...
//       </div>
//     );
//   }

//   const currentPayment =
//     payment ??
//     (selectedPayment?.id === paymentId ? selectedPayment : null);

//   if (!currentPayment) {
//     return (
//       <>
//         <PageMeta
//           title="Payment Details"
//           description="View payment details"
//         />

//         <PageBreadcrumb pageTitle="Payment Details" />

//         <ComponentCard title="Payment Not Found">
//           <p className="text-sm text-gray-600 dark:text-gray-400">
//             {message || "The requested payment could not be found."}
//           </p>

//           <button
//             type="button"
//             onClick={() =>
//               navigate(`/member-payments`)
//             }
//             className="mt-5 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
//           >
//             Back to Payments
//           </button>
//         </ComponentCard>
//       </>
//     );
//   }

//   const displayedStatus = paymentStatus ?? currentPayment.status;

//   return (
//     <>
//       <PageMeta
//         title="Payment Details"
//         description="View individual payment details"
//       />

//       <PageBreadcrumb pageTitle="Payment Details" />

//       <div className="space-y-6">
//         <div className="flex flex-wrap items-center justify-between gap-3">
//           <div>
//             <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
//               Payment Details
//             </h2>

//             <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//               Reference: {currentPayment.internalReference}
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={() =>
//               navigate(`/member-payments`)
//             }
//             className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
//           >
//             Back to Payments
//           </button>
//         </div>

//         <ComponentCard title="Payment Summary">
//           <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
//             <DetailItem
//               label="Amount"
//               value={formatAmount(
//                 currentPayment.amount,
//                 currentPayment.currency,
//               )}
//             />

//             <DetailItem
//               label="Payment Method"
//               value={currentPayment.method}
//             />

//             <DetailItem
//               label="Status"
//               value={formatStatus(displayedStatus)}
//             />

//             <DetailItem
//               label="Internal Reference"
//               value={currentPayment.internalReference}
//             />

//             <DetailItem
//               label="External Reference"
//               value={currentPayment.externalReference}
//             />

//             <DetailItem
//               label="Description"
//               value={currentPayment.description}
//             />

//             <DetailItem
//               label="Initiated At"
//               value={formatDate(currentPayment.initiatedAt)}
//             />

//             <DetailItem
//               label="Completed At"
//               value={formatDate(currentPayment.completedAt)}
//             />

//             <DetailItem
//               label="Created At"
//               value={formatDate(currentPayment.createdAt)}
//             />
//           </div>
//         </ComponentCard>

//         {currentPayment.method === "MPESA" &&
//           (displayedStatus === "INITIATED" ||
//             displayedStatus === "PENDING") && (
//             <ComponentCard title="M-Pesa Payment Tracking">
//               <PaymentStatusTracker
//                 paymentId={currentPayment.id}
//                 initialStatus={displayedStatus}
//                 onStatusChange={handleStatusChange}
//               />
//             </ComponentCard>
//           )}

//         <ComponentCard title="Payment Provider">
//           <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//             <DetailItem
//               label="Provider Name"
//               value={currentPayment.provider?.name}
//             />

//             <DetailItem
//               label="Provider Code"
//               value={currentPayment.provider?.code}
//             />

//             <DetailItem
//               label="Provider Type"
//               value={currentPayment.provider?.type}
//             />
//           </div>
//         </ComponentCard>

//         <ComponentCard title="Payment Transactions">
//           {!currentPayment.transactions?.length ? (
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               No payment transactions available.
//             </p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
//                 <thead className="bg-gray-50 dark:bg-gray-900">
//                   <tr>
//                     {["Type", "Status", "External Reference", "Processed At", "Created At"].map(
//                       (heading) => (
//                         <th
//                           key={heading}
//                           className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400"
//                         >
//                           {heading}
//                         </th>
//                       ),
//                     )}
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
//                   {currentPayment.transactions.map((transaction) => (
//                     <tr key={transaction.id}>
//                       <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
//                         {formatStatus(transaction.type)}
//                       </td>

//                       <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
//                         {formatStatus(transaction.status)}
//                       </td>

//                       <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
//                         {transaction.externalReference ??
//                           transaction.externalTransactionId ??
//                           "—"}
//                       </td>

//                       <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
//                         {formatDate(transaction.processedAt)}
//                       </td>

//                       <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
//                         {formatDate(transaction.createdAt)}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </ComponentCard>

//         <ComponentCard title="Payment Allocations">
//           {!currentPayment.allocations?.length ? (
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               No payment allocations available.
//             </p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
//                 <thead className="bg-gray-50 dark:bg-gray-900">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
//                       Amount
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
//                       Currency
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
//                       Contribution ID
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
//                   {currentPayment.allocations.map((allocation) => (
//                     <tr key={allocation.id}>
//                       <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
//                         {allocation.amount != null
//                           ? formatAmount(
//                               allocation.amount,
//                               allocation.currency ?? currentPayment.currency,
//                             )
//                           : "—"}
//                       </td>

//                       <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
//                         {allocation.currency ?? currentPayment.currency}
//                       </td>

//                       <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
//                         {allocation.memberContributionId ??
//                           allocation.contributionId ??
//                           "—"}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </ComponentCard>

//         <ComponentCard title="Payment Receipt">
//           {currentPayment.receipt ? (
//             <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//               <DetailItem
//                 label="Receipt Number"
//                 value={currentPayment.receipt.receiptNumber}
//               />

//               <DetailItem
//                 label="Amount"
//                 value={formatAmount(
//                   currentPayment.receipt.amount,
//                   currentPayment.receipt.currency,
//                 )}
//               />

//               <DetailItem
//                 label="Receipt Status"
//                 value={formatStatus(currentPayment.receipt.status)}
//               />

//               <DetailItem
//                 label="Issued At"
//                 value={formatDate(currentPayment.receipt.issuedAt)}
//               />

//               <DetailItem
//                 label="Voided At"
//                 value={formatDate(currentPayment.receipt.voidedAt)}
//               />

//               <DetailItem
//                 label="Void Reason"
//                 value={currentPayment.receipt.voidReason}
//               />
//             </div>
//           ) : (
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               No receipt has been issued for this payment.
//             </p>
//           )}
//         </ComponentCard>
//       </div>
//     </>
//   );
// };

// export default MemberPaymentDetailsPage;

import { useCallback, useEffect, useState } from "react";
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

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

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

    <p className="mt-1 break-words text-sm font-medium text-gray-800 dark:text-white">
      {value ?? "—"}
    </p>
  </div>
);

const MemberPaymentDetailsPage = () => {
  const { memberId, paymentId } = useParams<{
    memberId: string;
    paymentId: string;
  }>();

  const navigate = useNavigate();

  const {
    selectedPayment,
    loading,
    message,
    fetchPayment,
    clearMessage,
  } = usePayments();

  const { fetchReceiptPdf } = useReceiptContext();

  const [payment, setPayment] = useState<Payment | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(
    null,
  );

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
    if (!paymentId) return;

    setPayment(null);
    setPaymentStatus(null);

    let active = true;

    const load = async () => {
      const result = await fetchPayment(paymentId);

      if (!active) return;

      if (result) {
        setPayment(result);
        setPaymentStatus(result.status);
      }
    };

    clearMessage();
    load();

    return () => {
      active = false;
    };
  }, [paymentId, fetchPayment, clearMessage]);

  useEffect(() => {
    if (selectedPayment?.id === paymentId) {
      setPayment(selectedPayment);
      setPaymentStatus(selectedPayment?.status!);
    }
  }, [selectedPayment, paymentId]);

  // Revoke the temporary PDF URL when it changes or the page unmounts.
  useEffect(() => {
    return () => {
      if (receiptPdfUrl) {
        URL.revokeObjectURL(receiptPdfUrl);
      }
    };
  }, [receiptPdfUrl]);

  const handlePreviewReceiptPdf = async () => {
    const receiptId = currentPayment?.receipt?.id;

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

  const handleStatusChange = async (status: PaymentStatus) => {
    setPaymentStatus(status);

    if (
      status === "COMPLETED" ||
      status === "FAILED" ||
      status === "CANCELLED"
    ) {
      await loadPayment();
    }
  };

  if (!memberId || !paymentId) {
    return (
      <div className="p-5 text-sm text-red-500">
        Member ID or payment ID is missing from the route.
      </div>
    );
  }

  if (loading && !payment && !selectedPayment) {
    return (
      <div className="p-5 text-sm text-gray-500 dark:text-gray-400">
        Loading payment details...
      </div>
    );
  }

  const currentPayment =
    payment ??
    (selectedPayment?.id === paymentId ? selectedPayment : null);

  if (!currentPayment) {
    return (
      <>
        <PageMeta
          title="Payment Details"
          description="View payment details"
        />

        <PageBreadcrumb pageTitle="Payment Details" />

        <ComponentCard title="Payment Not Found">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {message || "The requested payment could not be found."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/member-payments")}
            className="mt-5 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
          >
            Back to Payments
          </button>
        </ComponentCard>
      </>
    );
  }

  const displayedStatus = paymentStatus ?? currentPayment.status;

  return (
    <>
      <PageMeta
        title="Payment Details"
        description="View individual payment details"
      />

      <PageBreadcrumb pageTitle="Payment Details" />

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Payment Details
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Reference: {currentPayment.internalReference}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/member-payments")}
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

        <ComponentCard title="Payment Summary">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            <DetailItem
              label="Amount"
              value={formatAmount(
                currentPayment.amount,
                currentPayment.currency,
              )}
            />

            <DetailItem
              label="Payment Method"
              value={formatStatus(currentPayment.method)}
            />

            <DetailItem
              label="Status"
              value={formatStatus(displayedStatus)}
            />

            <DetailItem
              label="Internal Reference"
              value={currentPayment.internalReference}
            />

            <DetailItem
              label="External Reference"
              value={currentPayment.externalReference}
            />

            <DetailItem
              label="Description"
              value={currentPayment.description}
            />

            <DetailItem
              label="Initiated At"
              value={formatDate(currentPayment.initiatedAt)}
            />

            <DetailItem
              label="Completed At"
              value={formatDate(currentPayment.completedAt)}
            />

            <DetailItem
              label="Created At"
              value={formatDate(currentPayment.createdAt)}
            />
          </div>
        </ComponentCard>

        {currentPayment.method === "MPESA" &&
          (displayedStatus === "INITIATED" ||
            displayedStatus === "PENDING") && (
            <ComponentCard title="M-Pesa Payment Tracking">
              <PaymentStatusTracker
                paymentId={currentPayment.id}
                initialStatus={displayedStatus}
                onStatusChange={handleStatusChange}
              />
            </ComponentCard>
          )}

        <ComponentCard title="Payment Provider">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <DetailItem
              label="Provider Name"
              value={currentPayment.provider?.name}
            />

            <DetailItem
              label="Provider Code"
              value={currentPayment.provider?.code}
            />

            <DetailItem
              label="Provider Type"
              value={currentPayment.provider?.type}
            />
          </div>
        </ComponentCard>

        <ComponentCard title="Payment Transactions">
          {!currentPayment.transactions?.length ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No payment transactions available.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    {[
                      "Type",
                      "Status",
                      "External Reference",
                      "Processed At",
                      "Created At",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {currentPayment.transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {formatStatus(transaction.type)}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {formatStatus(transaction.status)}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {transaction.externalReference ??
                          transaction.externalTransactionId ??
                          "—"}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {formatDate(transaction.processedAt)}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {formatDate(transaction.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ComponentCard>

        <ComponentCard title="Payment Allocations">
          {!currentPayment.allocations?.length ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No payment allocations available.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                      Amount
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                      Currency
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                      Contribution ID
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {currentPayment.allocations.map((allocation) => (
                    <tr key={allocation.id}>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {allocation.amount != null
                          ? formatAmount(
                              allocation.amount,
                              allocation.currency ?? currentPayment.currency,
                            )
                          : "—"}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {allocation.currency ?? currentPayment.currency}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {allocation.memberContributionId ??
                          allocation.contributionId ??
                          "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ComponentCard>

        <ComponentCard title="Payment Receipt">
          {currentPayment.receipt ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <DetailItem
                  label="Receipt Number"
                  value={currentPayment.receipt.receiptNumber}
                />

                <DetailItem
                  label="Amount"
                  value={formatAmount(
                    currentPayment.receipt.amount,
                    currentPayment.receipt.currency,
                  )}
                />

                <DetailItem
                  label="Receipt Status"
                  value={formatStatus(currentPayment.receipt.status)}
                />

                <DetailItem
                  label="Issued At"
                  value={formatDate(currentPayment.receipt.issuedAt)}
                />

                <DetailItem
                  label="Voided At"
                  value={formatDate(currentPayment.receipt.voidedAt)}
                />

                <DetailItem
                  label="Void Reason"
                  value={currentPayment.receipt.voidReason}
                />
              </div>

              {currentPayment.receipt.id && (
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
      </div>

      <PdfPreviewModal
        open={receiptPdfOpen}
        url={receiptPdfUrl}
        onClose={handleCloseReceiptPdf}
      />
    </>
  );
};

export default MemberPaymentDetailsPage;
