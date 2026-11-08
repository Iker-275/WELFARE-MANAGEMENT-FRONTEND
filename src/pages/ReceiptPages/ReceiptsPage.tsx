
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageMeta from "../../components/common/PageMeta";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import ReceiptFilters from "../../components/customComponents/ReceiptFilters";
import { ReceiptTable } from "../../components/tables/BasicTables/BasicTableOne";
import PdfPreviewModal from "../../components/customComponents/PDFPreview";

import { useReceiptContext } from "../../hooks/useReceipts";

import {
  Receipt,
  ReceiptFilters as ReceiptFiltersType,
  ReceiptStatus,
} from "../../types/ReceiptType";

const initialFilters: ReceiptFiltersType = {
  page: 1,
  limit: 10,
};

const ReceiptsPage = () => {
  const navigate = useNavigate();

  const {
    receipts,
    pagination,
    loading,
    message,
    fetchReceipts,
    fetchReceiptPdf,
    voidReceipt,
    clearMessage,
  } = useReceiptContext();

  const [filters, setFilters] =
    useState<ReceiptFiltersType>(initialFilters);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const loadReceipts = useCallback(async () => {
    await fetchReceipts(filters);
  }, [fetchReceipts, filters]);

  useEffect(() => {
    loadReceipts();
  }, [loadReceipts]);

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const handleFilterChange = (nextFilters: ReceiptFiltersType) => {
    setFilters({
      ...nextFilters,
      page: 1,
    });
  };

  const handleStatusChange = (status: ReceiptStatus | "") => {
    setFilters((previous) => ({
      ...previous,
      status: status || undefined,
      page: 1,
    }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const handleView = (receipt: Receipt) => {
    navigate(`/receipts/${receipt.id}`);
  };

  const handlePreviewPdf = async (receipt: Receipt) => {
    setPdfLoading(true);
    clearMessage();

    const blob = await fetchReceiptPdf(receipt.id);

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

  const handleVoid = async (receipt: Receipt) => {
    if (receipt.status !== "GENERATED") {
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
      await fetchReceipts(filters);
    }
  };

  const handlePreviousPage = () => {
    if (!pagination || pagination.page <= 1) {
      return;
    }

    setFilters((previous) => ({
      ...previous,
      page: pagination.page - 1,
    }));
  };

  const handleNextPage = () => {
    if (!pagination || pagination.page >= pagination.totalPages) {
      return;
    }

    setFilters((previous) => ({
      ...previous,
      page: pagination.page + 1,
    }));
  };

  return (
    <>
      <PageMeta
        title="Receipts | Budgeti"
        description="Manage issued payment receipts"
      />

      <PageBreadCrumb pageTitle="Receipts" />

      <div className="space-y-6">
        <ComponentCard title="Receipt Management">
          {message && (
            <div className="mb-4 flex items-center justify-between rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
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

          <ReceiptFilters
            filters={filters}
            status={filters.status || ""}
            onChange={handleFilterChange}
            onStatusChange={handleStatusChange}
            onReset={handleResetFilters}
          />

          <div className="mt-6">
            <ReceiptTable
              receipts={receipts}
              loading={loading}
              onView={handleView}
              onPreviewPdf={handlePreviewPdf}
              onVoid={handleVoid}
            />
          </div>

          {pdfLoading && (
            <p className="mt-3 text-sm text-gray-500">
              Preparing receipt PDF...
            </p>
          )}

          {pagination && pagination.totalPages > 0 && (
            <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Page {pagination.page} of {pagination.totalPages} (
                {pagination.total} receipts)
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePreviousPage}
                  disabled={pagination.page <= 1 || loading}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700"
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={
                    pagination.page >= pagination.totalPages || loading
                  }
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </ComponentCard>
      </div>

      <PdfPreviewModal
        open={pdfOpen}
        url={pdfUrl}
        onClose={handleClosePdf}
      />
    </>
  );
};

export default ReceiptsPage;
