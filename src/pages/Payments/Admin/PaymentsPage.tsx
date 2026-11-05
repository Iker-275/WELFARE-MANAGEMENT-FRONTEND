
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

  const [filters, setFilters] = useState<PaymentFiltersType>({
    page: 1,
    // limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const loadPayments = useCallback(async () => {
    await fetchPayments(filters);
  }, [filters, fetchPayments]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const handleFilterChange = (updatedFilters: PaymentFiltersType) => {
    setFilters({
      ...updatedFilters,
      page: 1,
    });
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

    clearMessage();
  };

  const handlePageChange = (page: number) => {
    setFilters((current) => ({
      ...current,
      page,
    }));
  };

  return (
    <>
      <PageMeta
        title="Payments Management"
        description="Manage and monitor all member payments"
      />

      <PageBreadcrumb pageTitle="Payments Management" />

      <div className="space-y-6">
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

        <ComponentCard title="Filter Payments">
          <PaymentFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </ComponentCard>

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

          {pagination && pagination.totalPages > 0 && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing page {pagination.page} of {pagination.totalPages}
                {" "}({pagination.total} payments)
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={
                    loading || !pagination.hasPreviousPage
                  }
                  onClick={() =>
                    handlePageChange(pagination.page - 1)
                  }
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={
                    loading || !pagination.hasNextPage
                  }
                  onClick={() =>
                    handlePageChange(pagination.page + 1)
                  }
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
