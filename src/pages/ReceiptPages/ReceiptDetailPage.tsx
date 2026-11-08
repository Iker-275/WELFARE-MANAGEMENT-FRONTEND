
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PageMeta from "../../components/common/PageMeta";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PdfPreviewModal from "../../components/customComponents/PDFPreview";

import { useReceiptContext } from "../../hooks/useReceipts";

import { Receipt } from "../../types/ReceiptType";

const formatAmount = (amount: string | number, currency: string) => {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return `${currency} ${amount}`;
  }

  return `${currency} ${numericAmount.toLocaleString()}`;
};

const formatDate = (date?: string | null) => {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleString();
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

const ReceiptDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    selectedReceipt,
    loading,
    message,
    fetchReceipt,
    fetchReceiptPdf,
    voidReceipt,
    clearSelectedReceipt,
    clearMessage,
  } = useReceiptContext();

  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }

    let active = true;

    clearSelectedReceipt();

    const loadReceipt = async () => {
      const result = await fetchReceipt(id);

      if (active) {
        setReceipt(result);
      }
    };

    loadReceipt();

    return () => {
      active = false;
    };
  }, [id, fetchReceipt, clearSelectedReceipt]);

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  useEffect(() => {
    if (selectedReceipt?.id === id) {
      setReceipt(selectedReceipt);
    }
  }, [selectedReceipt, id]);

  const handlePreviewPdf = async () => {
    if (!id) {
      return;
    }

    setPdfLoading(true);
    clearMessage();

    const blob = await fetchReceiptPdf(id);

    setPdfLoading(false);

    if (!blob) {
      return;
    }

    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }

    const url = URL.createObjectURL(blob);

    setPdfUrl(url);
    setPdfOpen(true);
  };

  const handleClosePdf = () => {
    setPdfOpen(false);

    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };

  const handleVoid = async () => {
    if (!receipt || receipt.status !== "GENERATED") {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to void receipt ${receipt.receiptNumber}?`
    );

    if (!confirmed) {
      return;
    }

    const voidReason = window.prompt(
      "Enter the reason for voiding this receipt:"
    );

    if (!voidReason?.trim()) {
      return;
    }

    const success = await voidReceipt(receipt.id, {
      voidReason: voidReason.trim(),
    });

    if (success) {
      const updatedReceipt = await fetchReceipt(receipt.id);

      if (updatedReceipt) {
        setReceipt(updatedReceipt);
      }
    }
  };

  if (loading && !receipt) {
    return (
      <>
        <PageMeta
          title="Receipt Details | Budgeti"
          description="View receipt details"
        />
        <PageBreadCrumb pageTitle="Receipt Details" />

        <div className="py-10 text-center text-gray-500">
          Loading receipt...
        </div>
      </>
    );
  }

  if (!receipt) {
    return (
      <>
        <PageMeta
          title="Receipt Details | Budgeti"
          description="View receipt details"
        />
        <PageBreadCrumb pageTitle="Receipt Details" />

        <ComponentCard title="Receipt Not Found">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {message || "The requested receipt could not be found."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/receipts")}
            className="mt-4 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
          >
            Back to Receipts
          </button>
        </ComponentCard>
      </>
    );
  }

  const member = receipt.payment?.member;
  const memberName = member?.user
    ? `${member.user.firstName} ${member.user.lastName}`
    : "—";

  return (
    <>
      <PageMeta
        title={`Receipt ${receipt.receiptNumber} | Budgeti`}
        description="View receipt details"
      />

      <PageBreadCrumb pageTitle="Receipt Details" />

      <div className="space-y-6">
        {message && (
          <div className="flex items-center justify-between rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <span>{message}</span>

            <button
              type="button"
              onClick={clearMessage}
              className="font-medium hover:text-gray-900 dark:hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        <ComponentCard title="Receipt Information">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {receipt.receiptNumber}
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Issued {formatDate(receipt.issuedAt)}
              </p>

              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                  receipt.status === "GENERATED"
                    ? "bg-green-100 text-green-700"
                    : receipt.status === "VOIDED"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                }`}
              >
                {receipt.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => navigate("/receipts")}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handlePreviewPdf}
                disabled={pdfLoading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {pdfLoading ? "Preparing PDF..." : "Preview PDF"}
              </button>

              {receipt.status === "GENERATED" && (
                <button
                  type="button"
                  onClick={handleVoid}
                  disabled={loading}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  Void Receipt
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 border-t border-gray-200 pt-6 dark:border-gray-700 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem
              label="Receipt Number"
              value={receipt.receiptNumber}
            />

            <DetailItem
              label="Amount"
              value={formatAmount(receipt.amount, receipt.currency)}
            />

            <DetailItem label="Currency" value={receipt.currency} />

            <DetailItem label="Status" value={receipt.status} />

            <DetailItem
              label="Issued At"
              value={formatDate(receipt.issuedAt)}
            />

            <DetailItem
              label="Generated By"
              value={
                receipt.generatedBy
                  ? `${receipt.generatedBy.firstName} ${receipt.generatedBy.lastName}`
                  : "—"
              }
            />
          </div>
        </ComponentCard>

        <ComponentCard title="Payment Information">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem
              label="Payment Reference"
              value={
                receipt.payment?.internalReference || receipt.paymentId
              }
            />

            <DetailItem
              label="Payment Method"
              value={receipt.payment?.method}
            />

            <DetailItem
              label="Payment Status"
              value={receipt.payment?.status}
            />

            <DetailItem
              label="External Reference"
              value={receipt.payment?.externalReference}
            />

            <DetailItem
              label="Payment Initiated"
              value={formatDate(receipt.payment?.initiatedAt)}
            />

            <DetailItem
              label="Payment Completed"
              value={formatDate(receipt.payment?.completedAt)}
            />
          </div>
        </ComponentCard>

        <ComponentCard title="Member Information">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem
              label="Membership Number"
              value={member?.membershipNumber}
            />

            <DetailItem label="Member Name" value={memberName} />

            <DetailItem
              label="Email"
              value={member?.user?.email}
            />

            <DetailItem
              label="Phone Number"
              value={member?.user?.phoneNumber}
            />

            <DetailItem
              label="Member ID"
              value={receipt.payment?.memberId}
            />
          </div>
        </ComponentCard>

        {receipt.status === "VOIDED" && (
          <ComponentCard title="Void Information">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <DetailItem
                label="Void Reason"
                value={receipt.voidReason}
              />

              <DetailItem
                label="Voided At"
                value={formatDate(receipt.voidedAt)}
              />

              <DetailItem
                label="Voided By"
                value={
                  receipt.voidedBy
                    ? `${receipt.voidedBy.firstName} ${receipt.voidedBy.lastName}`
                    : "—"
                }
              />
            </div>
          </ComponentCard>
        )}
      </div>

      <PdfPreviewModal
        open={pdfOpen}
        url={pdfUrl}
        onClose={handleClosePdf}
      />
    </>
  );
};

export default ReceiptDetailPage;
