import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import PaymentProviderFilters from "../../components/customComponents/PaymentProviderFilters";
import { PaymentProviderTable } from "../../components/tables/BasicTables/BasicTableOne";

import { usePaymentProviders } from "../../hooks/usePaymentProviders";

import { PaymentProviderFilters as PaymentProviderFilterType } from "../../types/PaymentProviderType";

const PaymentProvidersPage = () => {
  const navigate = useNavigate();

  const {
    pagination,
    loading,
    message,
    fetchProviders,
  } = usePaymentProviders();

  const [filters, setFilters] = useState<PaymentProviderFilterType>({
    page: 1,
    // limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  useEffect(() => {
    fetchProviders(filters);
  }, [filters, fetchProviders]);

  const handleFilterChange = (newFilters: PaymentProviderFilterType) => {
    setFilters({
      ...newFilters,
      page: 1,
    });
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleEdit = (provider: { id: string }) => {
    navigate(`/payment-providers/${provider.id}/edit`);
  };

  return (
    <>
      <PageMeta
        title="Payment Providers"
        description="Manage payment providers"
      />

      <PageBreadcrumb pageTitle="Payment Providers" />

      <div className="space-y-6">
        <ComponentCard
          title="Payment Providers"
          desc="View and manage registered payment providers."
        >
          {/* Header Actions */}
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Providers
              </h3>

              {pagination && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {pagination.total} payment provider(s) found
                </p>
              )}
            </div>

            <Link
              to="/payment-providers/create"
              className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
            >
              + Create Provider
            </Link>
          </div>

          {/* Filters */}
          <div className="mb-5">
            <PaymentProviderFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* API Message */}
          {message && (
            <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300">
              {message}
            </div>
          )}

          {/* Providers Table */}
          <PaymentProviderTable onEdit={handleEdit} />

          {/* Server-side Pagination */}
          {pagination && pagination.totalPages > 0 && (
            <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-4 dark:border-gray-800 sm:flex-row">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Page {pagination.page} of {pagination.totalPages}
                {" · "}
                {pagination.total} records
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPreviousPage || loading}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNextPage || loading}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
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

export default PaymentProvidersPage;