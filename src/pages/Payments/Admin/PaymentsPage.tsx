


import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";

import PaymentFilters from "../../../components/customComponents/PaymentFilters";
import { PaymentTable } from "../../../components/tables/BasicTables/BasicTableOne";

import { usePayments } from "../../../hooks/usePayments";

import {
  PaymentFilters as PaymentFiltersType,
} from "../../../types/PaymentType";

const DEFAULT_FILTERS: PaymentFiltersType = {
  page: 1,
  // limit: 10,
  sortBy: "createdAt",
  sortOrder: "desc",
};

const AdminPaymentsPage = () => {
  const navigate = useNavigate();

  const {
    payments,
    pagination,
    loading,
    message,
    fetchPayments,
    clearMessage,
  } = usePayments();

  const [filters, setFilters] = useState<PaymentFiltersType>(
    DEFAULT_FILTERS,
  );

  // ============================================================
  // LOAD PAYMENTS
  // ============================================================

  const loadPayments = useCallback(async () => {
    await fetchPayments(filters);
  }, [filters, fetchPayments]);

  useEffect(() => {
    void loadPayments();
  }, [loadPayments]);

  // ============================================================
  // FILTERS
  // ============================================================

  const handleFilterChange = (
    updatedFilters: PaymentFiltersType,
  ) => {
    setFilters({
      ...updatedFilters,
      page: 1,
      // limit: filters.limit ?? 10,
    });
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    clearMessage();
  };

  // ============================================================
  // PAGINATION
  // ============================================================

  const currentPage = filters.page ?? 1;
  const totalPages = pagination?.totalPages ?? 0;

  const handlePageChange = (page: number) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage
    ) {
      return;
    }

    setFilters((current) => ({
      ...current,
      page,
    }));
  };

  const handlePreviousPage = () => {
    handlePageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    handlePageChange(currentPage + 1);
  };

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <>
      <PageMeta
        title="Payments Management"
        description="Manage and monitor all member payments"
      />

      <PageBreadcrumb pageTitle="Payments Management" />

      <div className="space-y-6">

        {/* PAGE HEADER */}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Payments
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Monitor, search, and manage member payment transactions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/payments/create")}
            className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600"
          >
            Create Payment
          </button>
        </div>

        {/* FILTERS */}

        <ComponentCard title="Filter Payments">
          <PaymentFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </ComponentCard>

        {/* PAYMENT TABLE */}

        <ComponentCard title="Payment Records">
          <PaymentTable
            payments={payments}
            loading={loading}
            message={message}
            showMember
            onView={(payment) =>
              navigate(`/payments/${payment.id}`)
            }
          />

          {/* PAGINATION */}

          {pagination && pagination.totalPages > 0 && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing page {currentPage} of {totalPages}
                {" "}({pagination.total} payments)
              </p>

              <div className="flex items-center gap-2">

                <button
                  type="button"
                  disabled={
                    loading ||
                    currentPage <= 1
                  }
                  onClick={handlePreviousPage}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={
                    loading ||
                    currentPage >= totalPages
                  }
                  onClick={handleNextPage}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Next
                </button>

              </div>
            </div>
          )}
        </ComponentCard>
      </div>
    </>
  );
};

export default AdminPaymentsPage;

