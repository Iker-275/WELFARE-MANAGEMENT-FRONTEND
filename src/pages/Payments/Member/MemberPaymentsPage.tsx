

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";

import MemberPaymentFilters from "../../../components/customComponents/MemberPaymentFilters";
import { PaymentTable } from "../../../components/tables/BasicTables/BasicTableOne";

import { useAuth } from "../../../hooks/useAuth";
import { useMember } from "../../../hooks/useMember";
import { usePayments } from "../../../hooks/usePayments";

import {
  MemberPaymentFilters as MemberPaymentFiltersType,
} from "../../../types/PaymentType";

const DEFAULT_FILTERS: MemberPaymentFiltersType = {
  page: 1,
  // limit: 10,
  sortBy: "createdAt",
  sortOrder: "desc",
};

const MemberPaymentsPage = () => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const {
    selectedMember,
    loading: memberLoading,
    message: memberMessage,
    fetchMemberByUserId,
  } = useMember();

  const {
    payments,
    pagination,
    loading: paymentLoading,
    message: paymentMessage,
    fetchMemberPayments,
    clearMessage,
  } = usePayments();

  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState<MemberPaymentFiltersType>(
    DEFAULT_FILTERS,
  );

  // ============================================================
  // LOAD MEMBER
  // ============================================================

  useEffect(() => {
    if (!user?.id) {
      setError("Authenticated user could not be identified.");
      setPageLoading(false);
      return;
    }

    let active = true;

    const loadMember = async () => {
      setPageLoading(true);
      setError("");

      try {
        const member = await fetchMemberByUserId(user.id);

        if (!active) return;

        if (!member) {
          setError("Your member profile could not be found.");
        }
      } catch {
        if (active) {
          setError("Failed to load your member profile.");
        }
      } finally {
        if (active) {
          setPageLoading(false);
        }
      }
    };

    void loadMember();

    return () => {
      active = false;
    };
  }, [user?.id, fetchMemberByUserId]);

  // ============================================================
  // LOAD MEMBER PAYMENTS
  // ============================================================

  const loadPayments = useCallback(async () => {
    if (!selectedMember?.id) return;

    await fetchMemberPayments(selectedMember.id, filters);
  }, [
    selectedMember?.id,
    filters,
    fetchMemberPayments,
  ]);

  useEffect(() => {
    if (selectedMember?.id) {
      void loadPayments();
    }
  }, [selectedMember?.id, loadPayments]);

  // ============================================================
  // FILTERS
  // ============================================================

  const handleFilterChange = (
    updatedFilters: MemberPaymentFiltersType,
  ) => {
    setFilters({
      ...updatedFilters,
      page: 1,
      limit: filters.limit ?? 10,
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
    if (page < 1 || page > totalPages || page === currentPage) {
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
  // LOADING
  // ============================================================

  const loading =
    pageLoading ||
    memberLoading ||
    paymentLoading;

  const displayMessage =
    error ||
    memberMessage ||
    paymentMessage;

  if (loading && !selectedMember) {
    return (
      <>
        <PageMeta
          title="Member Payments"
          description="View your payment history"
        />

        <PageBreadcrumb pageTitle="Member Payments" />

        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading your payment information...
          </p>
        </div>
      </>
    );
  }

  // ============================================================
  // MEMBER NOT FOUND
  // ============================================================

  if (!selectedMember) {
    return (
      <>
        <PageMeta
          title="Member Payments"
          description="View your payment history"
        />

        <PageBreadcrumb pageTitle="Member Payments" />

        <ComponentCard title="Member Profile Not Found">
          <p className="text-sm text-red-500">
            {displayMessage ||
              "Your member profile could not be found."}
          </p>
        </ComponentCard>
      </>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <>
      <PageMeta
        title="Member Payments"
        description="View and manage your payment history"
      />

      <PageBreadcrumb pageTitle="Member Payments" />

      <div className="space-y-6">

        {/* PAGE HEADER */}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Payment History
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View your payment transactions and their current statuses.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                `/member-payments/${selectedMember.id}/payments/create`,
              )
            }
            className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600"
          >
            Create Payment
          </button>
        </div>

        {/* FILTERS */}

        <ComponentCard title="Filter Payments">
          <MemberPaymentFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </ComponentCard>

        {/* PAYMENT TABLE */}

        <ComponentCard title="Payment Records">
          <PaymentTable
            payments={payments}
            loading={paymentLoading}
            message={paymentMessage}
            onView={(payment) =>
              navigate(
                `/member-payments/${selectedMember.id}/payments/${payment.id}`,
              )
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
                    paymentLoading ||
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
                    paymentLoading ||
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

export default MemberPaymentsPage;

