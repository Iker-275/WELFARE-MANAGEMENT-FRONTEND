import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { RegionFilters } from "../../../types/RegionType";
import {
  useUser,
} from "../../../hooks/useUser";

import {
  User,
} from "../../../types/UserType";


import Badge from "../../ui/badge/Badge";
import { Link, useNavigate } from "react-router";
import { useRoles } from "../../../hooks/useRoles";
import { useMenu } from "../../../hooks/useMenu";
import { useEffect, useState } from "react";
import { useStatus } from "../../../hooks/useStatus";
import { useOrder } from "../../../hooks/useOrder"
import { OrderFilters } from "../../../types/OrderTypes";
import { useCustomer } from "../../../hooks/useCustomers";
import {usePermissions}from "../../../hooks/usePermission";
import { useRegion } from "../../../hooks/useRegion";
import {useMember,} from "../../../hooks/useMember";
import { Member,MemberFilters,} from "../../../types/MemberType";
import {
  ImportJob,
} from "../../../types/ImportTypes";
import Button from "../../ui/button/Button";

import { useContributionPlans } from "../../../hooks/useContributionPlans";
import { ContributionPlan ,ContributionPlanStatus,} from "../../../types/ContributionPlanType";
import { useContributionRules } from "../../../hooks/useContributionRules";

import  {
  ContributionRule,
  ContributionRuleScope,
}  from "../../../types/ContributionRuleType";

import { useContributionPeriods } from "../../../hooks/useContributionPeriods";
import type {
  ContributionPeriod,
  ContributionPeriodStatus,
} from "../../../types/ContributionPeriodType";
import {
  MemberContribution,
  MemberContributionStatus,
} from "../../../types/MemberContributionType";

import { useMemberContributions } from "../../../hooks/useMemberContributions";
import MemberContributionActions from "../../customComponents/MemberContributionActions";
import { PaymentProvider, PaymentProviderType } from "../../../types/PaymentProviderType";
import { usePaymentProviders } from "../../../hooks/usePaymentProviders";



 function CustomersTable() {
  const { customers, loadCustomers, loading } = useCustomer();

  useEffect(() => {
    loadCustomers();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <>
    <div className="flex justify-end mb-4">
        <Link
          to="/customers/create"
          className="px-4 py-2 text-white bg-blue-600 rounded-lg"
        >
          + Create Customers
        </Link>
      </div>
    <div className="overflow-hidden rounded-xl border bg-white">
      <div className="overflow-x-auto">

        <table className="min-w-full text-sm">

          <thead className="border-b">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((c) => (
              <tr key={c._id} className="border-b">

                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.phone}</td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      c.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {c.active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="p-3">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>

                <td className="p-3">
                  <div className="flex gap-3">

                    <Link to={`/customers/${c._id}`} className="text-blue-500">
                      View
                    </Link>

                    <Link to={`/customers/edit/${c._id}`} className="text-blue-500">
                      Edit
                    </Link>

                  </div>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
    </>
  );
}


 function OrdersTable({
  filters,
  setFilters,
  onPreviewPdf
}: {
  filters: OrderFilters;
  setFilters: (filters: OrderFilters) => void;
  onPreviewPdf: () => void;
}) {
  const { orders, loading,totalPages, loadOrders, cancel, bulkPayOrders, } = useOrder();

  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);

  // LOAD ORDERS
  // useEffect(() => {
  //   loadOrders({ ...filters, page: page });
  //   // loadOrders(filters);
  // }, [filters, page]);

  useEffect(() => {
  loadOrders(filters);
}, [filters]);

  // HANDLE SELECT
  const toggleSelect = (orderId: number) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((o) => o.orderId));
    }
  };

  const handlePageChange = (newPage: number) => {
    setFilters({
      ...filters,
      page: newPage,
    });
  };

  // BULK PAY
  const handleBulkPay = async () => {
    if (!selectedOrders.length) return;

    await bulkPayOrders(selectedOrders);
    setSelectedOrders([]);
    loadOrders(filters);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin h-8 w-8 border-b-2 border-brand-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      {/* ACTION BAR */}
      <div className="flex justify-between items-center mb-4">
        <div>
          {selectedOrders.length > 0 && (
            <button
              onClick={handleBulkPay}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Bulk Pay ({selectedOrders.length})
            </button>
          )}
        </div>
        <div className="flex justify-end">

          <button
            onClick={onPreviewPdf}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Preview PDF
          </button>

        </div>
        
      </div>
       
      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="overflow-x-auto">

          <table className="min-w-full text-sm">

            {/* HEADER */}
            <thead className="border-b">
              <tr>
                <th className="p-3">
                  <input
                    type="checkbox"
                    checked={
                      orders.length > 0 &&
                      selectedOrders.length === orders.length
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Paid</th>
                <th className="p-3 text-left">Balance</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b">

                  {/* SELECT */}
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.orderId)}
                      onChange={() => toggleSelect(order.orderId)}
                    />
                  </td>

                  <td className="p-3">{order.orderId}</td>

                  <td className="p-3">
                    {order.customer_name || "-"}
                  </td>

                  <td className="p-3">${order.orderTotal}</td>

                  <td className="p-3">${order.paidAmount}</td>

                  <td className="p-3">${order.balance}</td>

                  {/* STATUS */}
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${order.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="p-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-3">
                    <div className="flex gap-3">

                      <Link
                        to={`/orders/${order._id}`}
                        className="text-blue-500"
                      >
                        View
                      </Link>

                      {order.status !== "cancelled" && (
                        <button
                          onClick={() => cancel(order._id)}
                          className="text-red-500"
                        >
                          Cancel
                        </button>
                      )}

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-4">

        {/* <button
          disabled={page === 1}
          onClick={() => loadOrders({ ...filters, page: page - 1 })}
          className="px-3 py-1 border rounded"
        >
          Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => loadOrders({ ...filters, page: page + 1 })}
          className="px-3 py-1 border rounded"
        >
          Next
        </button> */}

        <button
          disabled={filters.page === 1}
          onClick={() => handlePageChange(filters.page! - 1)}
        >
          Prev
        </button>

        <span>
          Page {filters.page} of {totalPages}
        </span>

        <button
          disabled={filters.page === totalPages}
          onClick={() => handlePageChange(filters.page! + 1)}
        >
          Next
        </button>

      </div>
    </>
  );
}

function StatusTable() {
  const {
    statuses,
    loading,
    removeStatus,
    toggleStatus,
    loadStatuses,
  } = useStatus();

  useEffect(() => {
    loadStatuses();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin h-8 w-8 border-b-2 border-brand-500 rounded-full"></div>
      </div>
    );

  return (
    <>
      <div className="flex justify-end mb-4">
        <Link
          to="/status/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          + Create Status
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="overflow-x-auto">

          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Visibility</th>
                <th className="px-5 py-3">Created</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {statuses.map((s) => (
                <tr key={s._id} className="border-b">

                  <td className="px-5 py-4">{s.name}</td>

                  <td className="px-5 py-4">
                    <Badge color={s.visibility ? "success" : "error"}>
                      {s.visibility ? "Visible" : "Hidden"}
                    </Badge>
                  </td>

                  <td className="px-5 py-4">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex gap-3">

                      <Link
                        to={`/order-status/edit/${s._id}`}
                        className="text-blue-500"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => toggleStatus(s._id)}
                        className="text-yellow-500"
                      >
                        Toggle
                      </button>

                      <button
                        onClick={() => removeStatus(s._id)}
                        className="text-red-500"
                      >
                        Delete
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </>
  );
}

function MenuTable() {
  const { loading, menu, deleteMenu, fetchMenu } = useMenu();
  useEffect(() => {
    fetchMenu();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );


  return (
    <>
      <div className="flex justify-end mb-4">
        <Link
          to="/menu/create"
          className="px-4 py-2 text-white bg-blue-600 rounded-lg"
        >
          + Add Menu Item
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">

          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Available</th>
                <th className="px-5 py-3">Best Seller</th>
                <th className="px-5 py-3">Created</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {menu.map((item) => (
                <tr key={item._id} className="border-b">

                  <td className="px-5 py-4">{item.menuItem}</td>

                  <td className="px-5 py-4">
                    {item.pricePerQty} {item.currency}
                  </td>

                  <td className="px-5 py-4">
                    <Badge color={item.availableToday ? "success" : "error"}>
                      {item.availableToday ? "Available" : "Unavailable"}
                    </Badge>
                  </td>

                  <td className="px-5 py-4">
                    <Badge color={item.bestSeller ? "success" : "warning"}>
                      {item.bestSeller ? "Yes" : "No"}
                    </Badge>
                  </td>

                  <td className="px-5 py-4">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex gap-3">

                      <Link
                        to={`/menu/edit/${item._id}`}
                        className="text-blue-500"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => deleteMenu(item._id)}
                        className="text-red-500"
                      >
                        Delete
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </>
  );
}

 function RolesTable() {
  const {
    roles,
    loading,
    deleteRole,
    message,
  } = useRoles();

  const handleDelete = async (
    roleId: string,
    roleName: string
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the role "${roleName}"?`
    );

    if (!confirmed) {
      return;
    }

    await deleteRole(roleId);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-brand-500" />
      </div>
    );
  }

  return (
    <>
      {message && (
        <div className="mb-4 text-sm text-gray-600">
          {message}
        </div>
      )}

      <div className="mb-4 flex justify-end">
        <Link
          to="/roles/create"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Create Role
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start"
                >
                  Name
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start"
                >
                  Type
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start"
                >
                  Created At
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100">
              {roles.length === 0 ? (
                <TableRow>
                  <TableCell
                    
                    className="px-5 py-10 text-center text-sm text-gray-500"
                  >
                    No roles found.
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="px-5 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {role.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {role.slug}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="px-5 py-4">
                      {role.isSystem ? (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                          System
                        </span>
                      ) : (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          Custom
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="px-5 py-4">
                      {new Date(
                        role.createdAt
                      ).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <Link
                          to={`/roles/${role.id}/permissions`}
                          className="text-green-600 hover:text-green-700"
                        >
                          Permissions
                        </Link>

                        <Link
                          to={`/roles/edit/${role.id}`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Edit
                        </Link>

                        {!role.isSystem && (
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                role.id,
                                role.name
                              )
                            }
                            className="text-red-600 hover:text-red-700"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}


interface MembersTableProps {
  onRefresh?: () => void;
}



const MembersTable = ({
  onRefresh,
}: MembersTableProps) => {

  const {
    members,
    loading,
    message,
    activateMember,
    suspendMember,
    reinstateMember,
    retireMember,
    resignMember,
  } = useMember();

  const [
    expandedMemberId,
    setExpandedMemberId,
  ] = useState<string | null>(null);

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);

  /**
   * Toggle expanded member row.
   */
  const handleRowClick = (
    memberId: string
  ) => {

    setExpandedMemberId(
      current =>
        current === memberId
          ? null
          : memberId
    );
  };

  /**
   * Activate member.
   */
  const handleActivate = async (
    member: Member
  ) => {

    const confirmed =
      window.confirm(
        `Are you sure you want to activate member "${member.membershipNumber}"?`
      );

    if (!confirmed) {
      return;
    }

    setActionLoading(true);

    try {

      const success =
        await activateMember(
          member.id
        );

      if (success) {
        onRefresh?.();
      }

    } finally {

      setActionLoading(false);

    }
  };

  /**
   * Suspend member.
   */
  const handleSuspend = async (
    member: Member
  ) => {

    const confirmed =
      window.confirm(
        `Are you sure you want to suspend member "${member.membershipNumber}"?`
      );

    if (!confirmed) {
      return;
    }

    setActionLoading(true);

    try {

      const success =
        await suspendMember(
          member.id,
          {
            reason:
              "Member suspended from membership management.",
          }
        );

      if (success) {
        onRefresh?.();
      }

    } finally {

      setActionLoading(false);

    }
  };

  /**
   * Reinstate member.
   */
  const handleReinstate = async (
    member: Member
  ) => {

    const confirmed =
      window.confirm(
        `Are you sure you want to reinstate member "${member.membershipNumber}"?`
      );

    if (!confirmed) {
      return;
    }

    setActionLoading(true);

    try {

      const success =
        await reinstateMember(
          member.id,
          {
            reason:
              "Member reinstated from membership management.",
          }
        );

      if (success) {
        onRefresh?.();
      }

    } finally {

      setActionLoading(false);

    }
  };

  /**
   * Retire member.
   */
  const handleRetire = async (
    member: Member
  ) => {

    const confirmed =
      window.confirm(
        `Are you sure you want to retire member "${member.membershipNumber}"?`
      );

    if (!confirmed) {
      return;
    }

    setActionLoading(true);

    try {

      const success =
        await retireMember(
          member.id,
          {
            reason:
              "Member retired from membership management.",
          }
        );

      if (success) {
        onRefresh?.();
      }

    } finally {

      setActionLoading(false);

    }
  };

  /**
   * Resign member.
   */
  const handleResign = async (
    member: Member
  ) => {

    const confirmed =
      window.confirm(
        `Are you sure you want to mark member "${member.membershipNumber}" as resigned?`
      );

    if (!confirmed) {
      return;
    }

    setActionLoading(true);

    try {

      const success =
        await resignMember(
          member.id,
          {
            reason:
              "Member resignation recorded from membership management.",
          }
        );

      if (success) {
        onRefresh?.();
      }

    } finally {

      setActionLoading(false);

    }
  };

  /**
   * Get status badge classes.
   */
  const getStatusClasses = (
    status: Member["status"]
  ) => {

    switch (status) {

      case "ACTIVE":
        return "bg-green-100 text-green-700";

      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "SUSPENDED":
        return "bg-orange-100 text-orange-700";

      case "RETIRED":
        return "bg-blue-100 text-blue-700";

      case "RESIGNED":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  /**
   * Get member display name.
   */
  const getMemberName = (
    member: Member
  ) => {

    return [
      member.profile.firstName,
      member.profile.otherNames,
      member.profile.lastName,
    ]
      .filter(Boolean)
      .join(" ");
  };

  /**
   * Render status-specific actions.
   */
  const renderStatusActions = (
    member: Member
  ) => {

    switch (member.status) {

      case "PENDING":

        return (
          <button
            type="button"
            disabled={actionLoading}
            onClick={() =>
              handleActivate(
                member
              )
            }
            className="
              text-green-600
              hover:text-green-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Activate
          </button>
        );

      case "ACTIVE":

        return (
          <>
            <button
              type="button"
              disabled={actionLoading}
              onClick={() =>
                handleSuspend(
                  member
                )
              }
              className="
                text-orange-600
                hover:text-orange-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Suspend
            </button>

            <button
              type="button"
              disabled={actionLoading}
              onClick={() =>
                handleRetire(
                  member
                )
              }
              className="
                text-blue-600
                hover:text-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Retire
            </button>

            <button
              type="button"
              disabled={actionLoading}
              onClick={() =>
                handleResign(
                  member
                )
              }
              className="
                text-red-600
                hover:text-red-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Resign
            </button>
          </>
        );

      case "SUSPENDED":

        return (
          <>
            <button
              type="button"
              disabled={actionLoading}
              onClick={() =>
                handleReinstate(
                  member
                )
              }
              className="
                text-green-600
                hover:text-green-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Reinstate
            </button>

            <button
              type="button"
              disabled={actionLoading}
              onClick={() =>
                handleRetire(
                  member
                )
              }
              className="
                text-blue-600
                hover:text-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Retire
            </button>

            <button
              type="button"
              disabled={actionLoading}
              onClick={() =>
                handleResign(
                  member
                )
              }
              className="
                text-red-600
                hover:text-red-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Resign
            </button>
          </>
        );

      case "RETIRED":
      case "RESIGNED":

        return (
          <span
            className="
              text-sm
              text-gray-400
            "
          >
            No actions available
          </span>
        );

      default:
        return null;
    }
  };

  /**
   * Loading state.
   */
  if (loading) {

    return (
      <div
        className="
          flex
          justify-center
          py-10
        "
      >

        <div
          className="
            h-8
            w-8
            animate-spin
            rounded-full
            border-b-2
            border-brand-500
          "
        />

      </div>
    );
  }

  return (
    <>
      {/* Message */}

      {message && (
        <div
          className="
            mb-4
            text-sm
            text-gray-600
            dark:text-gray-400
          "
        >
          {message}
        </div>
      )}

      {/* Table Container */}

      <div
        className="
          overflow-hidden
          rounded-xl
          border
          border-gray-200
          bg-white
          dark:border-gray-800
          dark:bg-white/[0.03]
        "
      >

        <div
          className="
            max-w-full
            overflow-x-auto
          "
        >

          <Table>

            {/* Table Header */}

            <TableHeader>

              <TableRow>

                <TableCell
                  isHeader
                  className="
                    px-5
                    py-3
                    text-start
                  "
                >
                  Member
                </TableCell>

                <TableCell
                  isHeader
                  className="
                    px-5
                    py-3
                    text-start
                  "
                >
                  Membership No.
                </TableCell>

                <TableCell
                  isHeader
                  className="
                    px-5
                    py-3
                    text-start
                  "
                >
                  Status
                </TableCell>

                <TableCell
                  isHeader
                  className="
                    px-5
                    py-3
                    text-start
                  "
                >
                  Joined
                </TableCell>

                <TableCell
                  isHeader
                  className="
                    px-5
                    py-3
                    text-start
                  "
                >
                  Actions
                </TableCell>

              </TableRow>

            </TableHeader>

            {/* Table Body */}

            <TableBody
              className="
                divide-y
                divide-gray-100
                dark:divide-gray-800
              "
            >

              {members.length === 0 ? (

                <TableRow>

                  <TableCell
                    className="
                      px-5
                      py-10
                      text-center
                      text-sm
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    No members found.
                  </TableCell>

                </TableRow>

              ) : (

                members.map(
                  member => {

                    const isExpanded =
                      expandedMemberId ===
                      member.id;

                    return (
                      <>
                        {/* Member Row */}

                        <TableRow
                          key={member.id}
                          className="
                            cursor-pointer
                            hover:bg-gray-50
                            dark:hover:bg-white/[0.02]
                          "
                          onClick={() =>
                            handleRowClick(
                              member.id
                            )
                          }
                        >

                          {/* Member */}

                          <TableCell
                            className="
                              px-5
                              py-4
                            "
                          >

                            <div>

                              <p
                                className="
                                  font-medium
                                  text-gray-900
                                  dark:text-white
                                "
                              >
                                {getMemberName(
                                  member
                                )}
                              </p>

                              <p
                                className="
                                  text-sm
                                  text-gray-500
                                  dark:text-gray-400
                                "
                              >
                                {member.profile
                                  .nationalId ||
                                  "No national ID"}
                              </p>

                            </div>

                          </TableCell>

                          {/* Membership Number */}

                          <TableCell
                            className="
                              px-5
                              py-4
                            "
                          >
                            {member.membershipNumber}
                          </TableCell>

                          {/* Status */}

                          <TableCell
                            className="
                              px-5
                              py-4
                            "
                          >

                            <span
                              className={`
                                rounded-full
                                px-3
                                py-1
                                text-xs
                                font-medium
                                ${getStatusClasses(
                                  member.status
                                )}
                              `}
                            >
                              {member.status}
                            </span>

                          </TableCell>

                          {/* Joined */}

                          <TableCell
                            className="
                              px-5
                              py-4
                            "
                          >
                            {new Date(
                              member.joinedAt
                            ).toLocaleDateString()}
                          </TableCell>

                          {/* View */}

                          <TableCell
                            className="
                              px-5
                              py-4
                            "
                            onClick={event =>
                              event.stopPropagation()
                            }
                          >

                            <Link
                              to={`/members/${member.id}`}
                              className="
                                text-blue-600
                                hover:text-blue-700
                              "
                            >
                              View
                            </Link>

                          </TableCell>

                        </TableRow>

                        {/* Expanded Actions */}

                        {isExpanded && (

                          <TableRow
                            key={`${member.id}-actions`}
                          >

                            <TableCell
                              colSpan={5}
                              className="
                                bg-gray-50
                                px-5
                                py-4
                                dark:bg-white/[0.02]
                              "
                            >

                              <div
                                className="
                                  flex
                                  flex-wrap
                                  items-center
                                  gap-4
                                "
                              >

                                {/* View Profile */}

                                <Link
                                  to={`/members/${member.id}`}
                                  onClick={event =>
                                    event.stopPropagation()
                                  }
                                  className="
                                    text-blue-600
                                    hover:text-blue-700
                                  "
                                >
                                  View Profile
                                </Link>

                                {/* Edit */}

                                <Link
                                  to={`/members/edit/${member.id}`}
                                  onClick={event =>
                                    event.stopPropagation()
                                  }
                                  className="
                                    text-gray-600
                                    hover:text-gray-800
                                    dark:text-gray-400
                                    dark:hover:text-gray-200
                                  "
                                >
                                  Edit
                                </Link>

                                {/* Status Actions */}

                                {renderStatusActions(
                                  member
                                )}

                              </div>

                            </TableCell>

                          </TableRow>

                        )}

                      </>
                    );
                  }
                )

              )}

            </TableBody>

          </Table>

        </div>

      </div>
    </>
  );
};


interface RegionsTableProps {
  filters: RegionFilters;
}


function RegionsTable({
  filters,
}: RegionsTableProps) {
  const {
    regions,
    loading,
    fetchRegions,
    deleteRegion,
  } = useRegion();

  /*
   * ============================================================
   * FETCH REGIONS
   * ============================================================
   */

  useEffect(() => {
    void fetchRegions(filters);
  }, [
    fetchRegions,
    filters,
  ]);

  /*
   * ============================================================
   * DELETE REGION
   * ============================================================
   */

  const handleDelete = async (
    regionId: string
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this region?"
      );

    if (!confirmed) {
      return;
    }

    await deleteRegion(regionId);
  };

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div
          className="
            h-8
            w-8
            animate-spin
            rounded-full
            border-b-2
            border-brand-500
          "
        />
      </div>
    );
  }

  /*
   * ============================================================
   * TABLE
   * ============================================================
   */

  return (
    <div
      className="
        overflow-hidden
        rounded-xl
        border
        border-gray-200
        bg-white
        dark:border-gray-800
        dark:bg-white/[0.03]
      "
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="border-b dark:border-gray-800">
            <tr>
              <th className="p-3 text-left">
                Name
              </th>

              <th className="p-3 text-left">
                Code
              </th>

              <th className="p-3 text-left">
                Description
              </th>

              <th className="p-3 text-left">
                Members
              </th>

              <th className="p-3 text-left">
                Created
              </th>

              <th className="p-3 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {regions.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="
                    p-6
                    text-center
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  No regions found.
                </td>
              </tr>
            ) : (
              regions.map(region => (
                <tr
                  key={region.id}
                  className="
                    border-b
                    border-gray-100
                    dark:border-gray-800
                  "
                >
                  <td className="p-3 capitalize">
                    {region.name}
                  </td>

                  <td className="p-3">
                    {region.code || "-"}
                  </td>

                  <td className="p-3">
                    {region.description || "-"}
                  </td>

                  <td className="p-3">
                    {region._count?.members ?? 0}
                  </td>

                  <td className="p-3">
                    {new Date(
                      region.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="p-3">
                    <div className="flex gap-3">
                      <Link
                        to={`/regions/${region.id}/members`}
                        className="
                          text-green-600
                          hover:text-green-700
                        "
                      >
                        Members
                      </Link>

                      <Link
                        to={`/regions/edit/${region.id}`}
                        className="
                          text-blue-600
                          hover:text-blue-700
                        "
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            region.id
                          )
                        }
                        className="
                          text-red-600
                          hover:text-red-700
                        "
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}



function PermissionsTable() {
  const {
    permissions,
    loading,
    message,
    deletePermission,
  } = usePermissions();

  const handleDelete = async (
    permissionId: string
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this permission?"
      );

    if (!confirmed) {
      return;
    }

    await deletePermission(
      permissionId
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div
          className="
            h-8
            w-8
            animate-spin
            rounded-full
            border-b-2
            border-brand-500
          "
        />
      </div>
    );
  }

  return (
    <>
      {message && (
        <div className="mb-4 text-sm">
          {message}
        </div>
      )}

      <div className="mb-4 flex justify-end">
        <Link
          to="/permissions/create"
          className="
            rounded-lg
            bg-blue-600
            px-4
            py-2
            text-white
            hover:bg-blue-700
          "
        >
          + Create Permission
        </Link>
      </div>

      <div
        className="
          overflow-hidden
          rounded-xl
          border
          bg-white
        "
      >
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start"
                >
                  Name
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start"
                >
                  Description
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start"
                >
                  Created At
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100">
              {permissions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="px-5 py-10 text-center text-sm text-gray-500"
                  >
                    No permissions found.
                  </TableCell>
                </TableRow>
              ) : (
                permissions.map(
                  (permission) => (
                    <TableRow
                      key={permission.id}
                    >
                      <TableCell className="px-5 py-4">
                        <p className="font-medium">
                          {permission.name}
                        </p>
                      </TableCell>

                      <TableCell className="px-5 py-4">
                        {permission.description ||
                          "-"}
                      </TableCell>

                      <TableCell className="px-5 py-4">
                        {new Date(
                          permission.createdAt
                        ).toLocaleDateString()}
                      </TableCell>

                      <TableCell className="px-5 py-4">
                        <div className="flex gap-4">
                          <Link
                            to={`/permissions/edit/${permission.id}`}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                permission.id
                              )
                            }
                            className="text-red-600 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                )
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}


interface RegionMembersTableProps {
  regionId: string;
  filters: MemberFilters;
  onPageChange: (
    page: number
  ) => void;
}

const RegionMembersTable = ({
  onPageChange,
}: RegionMembersTableProps) => {
  const {
    members,
    pagination,
    loading,
    message,

    activateMember,
    suspendMember,
    reinstateMember,
    retireMember,
    resignMember,
  } = useMember();

  const [
    expandedMemberId,
    setExpandedMemberId,
  ] = useState<string | null>(null);

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);

  /*
   * ============================================================
   * ROW
   * ============================================================
   */

  const handleRowClick = (
    memberId: string
  ) => {
    setExpandedMemberId(
      current =>
        current === memberId
          ? null
          : memberId
    );
  };

  /*
   * ============================================================
   * MEMBER NAME
   * ============================================================
   */

  const getMemberName = (
    member: Member
  ) => {
    return [
      member.profile.firstName,
      member.profile.otherNames,
      member.profile.lastName,
    ]
      .filter(Boolean)
      .join(" ");
  };

  /*
   * ============================================================
   * STATUS CLASSES
   * ============================================================
   */

  const getStatusClasses = (
    status: Member["status"]
  ) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";

      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "SUSPENDED":
        return "bg-orange-100 text-orange-700";

      case "RETIRED":
        return "bg-blue-100 text-blue-700";

      case "RESIGNED":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  /*
   * ============================================================
   * ACTIONS
   * ============================================================
   */

  const handleActivate = async (
    member: Member
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to activate member "${member.membershipNumber}"?`
      );

    if (!confirmed) {
      return;
    }

    setActionLoading(true);

    try {
      const success =
        await activateMember(
          member.id
        );

      if (success) {
        window.location.reload();
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspend = async (
    member: Member
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to suspend member "${member.membershipNumber}"?`
      );

    if (!confirmed) {
      return;
    }

    setActionLoading(true);

    try {
      const success =
        await suspendMember(
          member.id,
          {
            reason:
              "Member suspended from membership management.",
          }
        );

      if (success) {
        window.location.reload();
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleReinstate = async (
    member: Member
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to reinstate member "${member.membershipNumber}"?`
      );

    if (!confirmed) {
      return;
    }

    setActionLoading(true);

    try {
      const success =
        await reinstateMember(
          member.id,
          {
            reason:
              "Member reinstated from membership management.",
          }
        );

      if (success) {
        window.location.reload();
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleRetire = async (
    member: Member
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to retire member "${member.membershipNumber}"?`
      );

    if (!confirmed) {
      return;
    }

    setActionLoading(true);

    try {
      const success =
        await retireMember(
          member.id,
          {
            reason:
              "Member retired from membership management.",
          }
        );

      if (success) {
        window.location.reload();
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleResign = async (
    member: Member
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to mark member "${member.membershipNumber}" as resigned?`
      );

    if (!confirmed) {
      return;
    }

    setActionLoading(true);

    try {
      const success =
        await resignMember(
          member.id,
          {
            reason:
              "Member resignation recorded from membership management.",
          }
        );

      if (success) {
        window.location.reload();
      }
    } finally {
      setActionLoading(false);
    }
  };

  /*
   * ============================================================
   * STATUS ACTIONS
   * ============================================================
   */

  const renderStatusActions = (
    member: Member
  ) => {
    switch (member.status) {
      case "PENDING":
        return (
          <button
            type="button"
            disabled={actionLoading}
            onClick={() =>
              handleActivate(member)
            }
            className="
              text-green-600
              hover:text-green-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Activate
          </button>
        );

      case "ACTIVE":
        return (
          <>
            <button
              type="button"
              disabled={actionLoading}
              onClick={() =>
                handleSuspend(member)
              }
              className="
                text-orange-600
                hover:text-orange-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Suspend
            </button>

            <button
              type="button"
              disabled={actionLoading}
              onClick={() =>
                handleRetire(member)
              }
              className="
                text-blue-600
                hover:text-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Retire
            </button>

            <button
              type="button"
              disabled={actionLoading}
              onClick={() =>
                handleResign(member)
              }
              className="
                text-red-600
                hover:text-red-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Resign
            </button>
          </>
        );

      case "SUSPENDED":
        return (
          <>
            <button
              type="button"
              disabled={actionLoading}
              onClick={() =>
                handleReinstate(member)
              }
              className="
                text-green-600
                hover:text-green-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Reinstate
            </button>

            <button
              type="button"
              disabled={actionLoading}
              onClick={() =>
                handleRetire(member)
              }
              className="
                text-blue-600
                hover:text-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Retire
            </button>

            <button
              type="button"
              disabled={actionLoading}
              onClick={() =>
                handleResign(member)
              }
              className="
                text-red-600
                hover:text-red-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Resign
            </button>
          </>
        );

      case "RETIRED":
      case "RESIGNED":
        return (
          <span
            className="
              text-sm
              text-gray-400
            "
          >
            No actions available
          </span>
        );

      default:
        return null;
    }
  };

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div
          className="
            h-8
            w-8
            animate-spin
            rounded-full
            border-b-2
            border-brand-500
          "
        />
      </div>
    );
  }

  /*
   * ============================================================
   * TABLE
   * ============================================================
   */

  return (
    <>
      {message && (
        <div
          className="
            mb-4
            text-sm
            text-gray-600
            dark:text-gray-400
          "
        >
          {message}
        </div>
      )}

      <div
        className="
          overflow-hidden
          rounded-xl
          border
          border-gray-200
          bg-white
          dark:border-gray-800
          dark:bg-white/[0.03]
        "
      >
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start"
                >
                  Member
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start"
                >
                  Membership No.
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start"
                >
                  Status
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start"
                >
                  Joined
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody
              className="
                divide-y
                divide-gray-100
                dark:divide-gray-800
              "
            >
              {members.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="
                      px-5
                      py-10
                      text-center
                      text-sm
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    No members found in this
                    region.
                  </TableCell>
                </TableRow>
              ) : (
                members.map(member => {
                  const isExpanded =
                    expandedMemberId ===
                    member.id;

                  return (
                    <>
                      <TableRow
                        key={member.id}
                        className="
                          cursor-pointer
                          hover:bg-gray-50
                          dark:hover:bg-white/[0.02]
                        "
                        onClick={() =>
                          handleRowClick(
                            member.id
                          )
                        }
                      >
                        <TableCell className="px-5 py-4">
                          <div>
                            <p
                              className="
                                font-medium
                                text-gray-900
                                dark:text-white
                              "
                            >
                              {getMemberName(
                                member
                              )}
                            </p>

                            <p
                              className="
                                text-sm
                                text-gray-500
                                dark:text-gray-400
                              "
                            >
                              {member.profile
                                .nationalId ||
                                "No national ID"}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell className="px-5 py-4">
                          {member.membershipNumber}
                        </TableCell>

                        <TableCell className="px-5 py-4">
                          <span
                            className={`
                              rounded-full
                              px-3
                              py-1
                              text-xs
                              font-medium
                              ${getStatusClasses(
                                member.status
                              )}
                            `}
                          >
                            {member.status}
                          </span>
                        </TableCell>

                        <TableCell className="px-5 py-4">
                          {new Date(
                            member.joinedAt
                          ).toLocaleDateString()}
                        </TableCell>

                        <TableCell
                          className="px-5 py-4"
                          onClick={event =>
                            event.stopPropagation()
                          }
                        >
                          <Link
                            to={`/members/${member.id}`}
                            className="
                              text-blue-600
                              hover:text-blue-700
                            "
                          >
                            View
                          </Link>
                        </TableCell>
                      </TableRow>

                      {isExpanded && (
                        <TableRow
                          key={`${member.id}-actions`}
                        >
                          <TableCell
                            colSpan={5}
                            className="
                              bg-gray-50
                              px-5
                              py-4
                              dark:bg-white/[0.02]
                            "
                          >
                            <div
                              className="
                                flex
                                flex-wrap
                                items-center
                                gap-4
                              "
                            >
                              <Link
                                to={`/members/${member.id}`}
                                onClick={event =>
                                  event.stopPropagation()
                                }
                                className="
                                  text-blue-600
                                  hover:text-blue-700
                                "
                              >
                                View Profile
                              </Link>

                              <Link
                                to={`/members/edit/${member.id}`}
                                onClick={event =>
                                  event.stopPropagation()
                                }
                                className="
                                  text-gray-600
                                  hover:text-gray-800
                                  dark:text-gray-400
                                  dark:hover:text-gray-200
                                "
                              >
                                Edit
                              </Link>

                              {renderStatusActions(
                                member
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ========================================================
          PAGINATION
      ======================================================== */}

      {pagination &&
        pagination.total > 0 && (
          <div
            className="
              mt-4
              flex
              items-center
              justify-between
            "
          >
            <div
              className="
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Page{" "}
              {pagination.page}{" "}
              of{" "}
              {pagination.totalPages}

              <span className="mx-2">
                •
              </span>

              {pagination.total}{" "}
              members
            </div>

            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <button
                type="button"
                disabled={
                  !pagination.hasPreviousPage
                }
                onClick={() =>
                  onPageChange(
                    pagination.page - 1
                  )
                }
                className="
                  rounded-lg
                  border
                  border-gray-300
                  px-3
                  py-2
                  text-sm
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  dark:border-gray-700
                "
              >
                Previous
              </button>

              <span
                className="
                  px-3
                  text-sm
                  text-gray-700
                  dark:text-gray-300
                "
              >
                {pagination.page}
              </span>

              <button
                type="button"
                disabled={
                  !pagination.hasNextPage
                }
                onClick={() =>
                  onPageChange(
                    pagination.page + 1
                  )
                }
                className="
                  rounded-lg
                  border
                  border-gray-300
                  px-3
                  py-2
                  text-sm
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  dark:border-gray-700
                "
              >
                Next
              </button>
            </div>
          </div>
        )}
    </>
  );
};


interface UsersTableProps {
  onRefresh?: () => void;
}


const UsersTable = ({
  onRefresh,
}: UsersTableProps) => {

  const {
    users,
    loading,
    message,

    restoreUser,
    deleteUser,
  } = useUser();


  const [
    expandedUserId,
    setExpandedUserId,
  ] = useState<string | null>(
    null
  );


  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);


  /*
   * ============================================================
   * ROW
   * ============================================================
   */

  const handleRowClick = (
    userId: string
  ) => {

    setExpandedUserId(
      current =>
        current === userId
          ? null
          : userId
    );
  };


  /*
   * ============================================================
   * USER NAME
   * ============================================================
   */

  const getUserName = (
    user: User
  ) => {

    return [
      user.firstName,
      user.lastName,
    ]
      .filter(Boolean)
      .join(" ") || "Unnamed user";
  };


  /*
   * ============================================================
   * STATUS CLASSES
   * ============================================================
   */

  const getStatusClasses = (
    status: string
  ) => {

    switch (status) {

      case "ACTIVE":
        return "bg-green-100 text-green-700";

      // case "PENDING":
      //   return "bg-yellow-100 text-yellow-700";

      case "SUSPENDED":
        return "bg-orange-100 text-orange-700";

      // case "DEACTIVATED":
      //   return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };


  /*
   * ============================================================
   * RESTORE
   * ============================================================
   */

  const handleRestore = async (
    user: User
  ) => {

    const confirmed =
      window.confirm(
        `Are you sure you want to restore "${getUserName(user)}"?`
      );

    if (!confirmed) {
      return;
    }


    setActionLoading(true);

    try {

      const success =
        await restoreUser(
          user.id
        );

      if (success) {
        onRefresh?.();
      }

    } finally {

      setActionLoading(false);
    }
  };


  /*
   * ============================================================
   * DELETE
   * ============================================================
   */

  const handleDelete = async (
    user: User
  ) => {

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${getUserName(user)}"?`
      );

    if (!confirmed) {
      return;
    }


    setActionLoading(true);

    try {

      const success =
        await deleteUser(
          user.id
        );

      if (success) {
        onRefresh?.();
      }

    } finally {

      setActionLoading(false);
    }
  };


  /*
   * ============================================================
   * STATUS ACTIONS
   * ============================================================
   */

  const renderStatusActions = (
    user: User
  ) => {

    if (
      user.accountStatus !==
      "DEACTIVATED"
    ) {
      return null;
    }


    return (
      <button
        type="button"
        disabled={
          actionLoading
        }
        onClick={() =>
          handleRestore(user)
        }
        className="
          text-green-600
          hover:text-green-700
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        Restore
      </button>
    );
  };


  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (loading) {

    return (
      <div className="flex justify-center py-10">

        <div
          className="
            h-8
            w-8
            animate-spin
            rounded-full
            border-b-2
            border-brand-500
          "
        />

      </div>
    );
  }


  /*
   * ============================================================
   * TABLE
   * ============================================================
   */

  return (
    <>
      {message && (
        <div
          className="
            mb-4
            text-sm
            text-gray-600
            dark:text-gray-400
          "
        >
          {message}
        </div>
      )}


      <div
        className="
          overflow-hidden
          rounded-xl
          border
          border-gray-200
          bg-white
          dark:border-gray-800
          dark:bg-white/[0.03]
        "
      >

        <div className="max-w-full overflow-x-auto">

          <Table>

            <TableHeader>

              <TableRow>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start"
                >
                  User
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start"
                >
                  Email
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start"
                >
                  Phone
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start"
                >
                  Role
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start"
                >
                  Region
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start"
                >
                  Status
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start"
                >
                  Created
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start"
                >
                  Actions
                </TableCell>

              </TableRow>

            </TableHeader>


            <TableBody
              className="
                divide-y
                divide-gray-100
                dark:divide-gray-800
              "
            >

              {users.length === 0 ? (

                <TableRow>

                  <TableCell
                    colSpan={8}
                    className="
                      px-5
                      py-10
                      text-center
                      text-sm
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    No users found.
                  </TableCell>

                </TableRow>

              ) : (

                users.map(user => {

                  const isExpanded =
                    expandedUserId ===
                    user.id;


                  return (
                    <>
                      <TableRow
                        key={user.id}
                        className="
                          cursor-pointer
                          hover:bg-gray-50
                          dark:hover:bg-white/[0.02]
                        "
                        onClick={() =>
                          handleRowClick(
                            user.id
                          )
                        }
                      >

                        <TableCell className="px-5 py-4">

                          <div>

                            <p
                              className="
                                font-medium
                                text-gray-900
                                dark:text-white
                              "
                            >
                              {getUserName(user)}
                            </p>

                            <p
                              className="
                                text-sm
                                text-gray-500
                                dark:text-gray-400
                              "
                            >
                              {user.userType}
                            </p>

                          </div>

                        </TableCell>


                        <TableCell className="px-5 py-4">
                          {user.email}
                        </TableCell>


                        <TableCell className="px-5 py-4">
                          {user.phoneNumber || "-"}
                        </TableCell>


                        <TableCell className="px-5 py-4">
                          {user.role?.name || "-"}
                        </TableCell>


                        <TableCell className="px-5 py-4">
                          {user.region?.name || "-"}
                        </TableCell>


                        <TableCell className="px-5 py-4">

                          <span
                            className={`
                              rounded-full
                              px-3
                              py-1
                              text-xs
                              font-medium
                              ${getStatusClasses(
                                user.accountStatus
                              )}
                            `}
                          >
                            {user.accountStatus}
                          </span>

                        </TableCell>


                        <TableCell className="px-5 py-4">

                          {new Date(
                            user.createdAt
                          ).toLocaleDateString()}

                        </TableCell>


                        <TableCell
                          className="px-5 py-4"
                          onClick={event =>
                            event.stopPropagation()
                          }
                        >

                          <Link
                            to={`/users/${user.id}`}
                            className="
                              text-blue-600
                              hover:text-blue-700
                            "
                          >
                            View
                          </Link>

                        </TableCell>

                      </TableRow>


                      {isExpanded && (

                        <TableRow
                          key={`${user.id}-actions`}
                        >

                          <TableCell
                            colSpan={8}
                            className="
                              bg-gray-50
                              px-5
                              py-4
                              dark:bg-white/[0.02]
                            "
                          >

                            <div
                              className="
                                flex
                                flex-wrap
                                items-center
                                gap-4
                              "
                            >

                              {/* View */}
                              <Link
                                to={`/users/${user.id}`}
                                onClick={event =>
                                  event.stopPropagation()
                                }
                                className="
                                  text-blue-600
                                  hover:text-blue-700
                                "
                              >
                                View Profile
                              </Link>


                              {/* Edit */}
                              <Link
                                to={`/users/edit/${user.id}`}
                                onClick={event =>
                                  event.stopPropagation()
                                }
                                className="
                                  text-gray-600
                                  hover:text-gray-800
                                  dark:text-gray-400
                                  dark:hover:text-gray-200
                                "
                              >
                                Edit
                              </Link>


                              {/* Restore */}
                              {renderStatusActions(
                                user
                              )}


                              {/* Delete */}
                              <button
                                type="button"
                                disabled={
                                  actionLoading
                                }
                                onClick={() =>
                                  handleDelete(user)
                                }
                                className="
                                  text-red-600
                                  hover:text-red-700
                                  disabled:cursor-not-allowed
                                  disabled:opacity-50
                                "
                              >
                                Delete
                              </button>

                            </div>

                          </TableCell>

                        </TableRow>
                      )}

                    </>
                  );
                })

              )}

            </TableBody>

          </Table>

        </div>

      </div>
    </>
  );
};





interface ImportsTableProps {
  imports: ImportJob[];
  

  loading?: boolean;

  onRefresh?: () => void;
}

const getStatusClass = (
  status: string
) => {

  switch (status) {

    case "COMPLETED":
      return "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400";

    case "FAILED":
      return "bg-error-50 text-error-600 dark:bg-error-500/10 dark:text-error-400";

    case "PROCESSING":
      return "bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-400";

    default:
      return "bg-gray-100 text-gray-600 dark:bg-white/[0.06] dark:text-gray-300";
  }
};

export default function ImportsTable({
  imports,
  loading = false,
}: ImportsTableProps) {

  const navigate =
    useNavigate();

  if (
    loading &&
    imports.length === 0
  ) {

    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-white/[0.03]">

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading imports...
        </p>

      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">

      <div className="overflow-x-auto">

        <table className="min-w-full text-left text-sm">

          <thead>

            <tr className="border-b border-gray-200 dark:border-gray-800">

              <th className="px-5 py-3 font-medium text-gray-600 dark:text-gray-300">
                File
              </th>

              <th className="px-5 py-3 font-medium text-gray-600 dark:text-gray-300">
                Type
              </th>

              <th className="px-5 py-3 font-medium text-gray-600 dark:text-gray-300">
                Status
              </th>

              <th className="px-5 py-3 font-medium text-gray-600 dark:text-gray-300">
                Rows
              </th>

              <th className="px-5 py-3 font-medium text-gray-600 dark:text-gray-300">
                Successful
              </th>

              <th className="px-5 py-3 font-medium text-gray-600 dark:text-gray-300">
                Failed
              </th>

              <th className="px-5 py-3 text-right font-medium text-gray-600 dark:text-gray-300">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {imports.length === 0 ? (

              <tr>

                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-gray-500 dark:text-gray-400"
                >
                  No imports found.
                </td>

              </tr>

            ) : (

              imports.map(
                importJob => (
                  <tr
                    key={importJob.id}
                    className="border-b border-gray-100 dark:border-gray-800"
                  >

                    <td className="px-5 py-4">

                      <p className="font-medium text-gray-800 dark:text-white/90">
                        {importJob.originalName}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(
                          importJob.createdAt
                        ).toLocaleString()}
                      </p>

                    </td>

                    <td className="px-5 py-4">

                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {importJob.type}
                      </span>

                    </td>

                    <td className="px-5 py-4">

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                          importJob.status
                        )}`}
                      >
                        {importJob.status}
                      </span>

                    </td>

                    <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                      {importJob.totalRows}
                    </td>

                    <td className="px-5 py-4 text-success-600 dark:text-success-400">
                      {importJob.successfulRows}
                    </td>

                    <td className="px-5 py-4 text-error-600 dark:text-error-400">
                      {importJob.failedRows}
                    </td>

                    <td className="px-5 py-4">

                      <div className="flex justify-end gap-2">

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(
                              `/imports/${importJob.id}`
                            )
                          }
                        >
                          View
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(
                              `/imports/${importJob.id}/errors`
                            )
                          }
                        >
                          Errors
                        </Button>

                      </div>

                    </td>

                  </tr>
                )
              )

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}





interface ContributionPlansTableProps {
  onEdit: (plan: ContributionPlan) => void;
}

const formatDate = (date: string | null | undefined): string => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusClassesP = (status: ContributionPlanStatus): string => {
  switch (status) {
    case "ACTIVE":
      return "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400";

    case "DRAFT":
      return "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400";

    case "INACTIVE":
      return "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400";

    case "ARCHIVED":
      return "bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400";

    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400";
  }
};

const getCreatorName = (plan: ContributionPlan): string => {
  if (!plan.createdBy) return "—";

  const fullName = [
    plan.createdBy.firstName,
    plan.createdBy.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return fullName || plan.createdBy.email;
};

const ContributionPlansTable = ({
  onEdit,
}: ContributionPlansTableProps) => {
  const {
    plans,
    loading,
    message,
    activatePlan,
    deactivatePlan,
    archivePlan,
  } = useContributionPlans();

  const handleActivate = async (plan: ContributionPlan) => {
    const confirmed = window.confirm(
      `Are you sure you want to activate the contribution plan "${plan.name}"?`
    );

    if (!confirmed) return;

    await activatePlan(plan.id);
  };

  const handleDeactivate = async (plan: ContributionPlan) => {
    const confirmed = window.confirm(
      `Are you sure you want to deactivate the contribution plan "${plan.name}"?`
    );

    if (!confirmed) return;

    await deactivatePlan(plan.id);
  };

  const handleArchive = async (plan: ContributionPlan) => {
    const confirmed = window.confirm(
      `Are you sure you want to archive "${plan.name}"? This action may prevent the plan from being used for new contributions.`
    );

    if (!confirmed) return;

    await archivePlan(plan.id);
  };

  const renderActions = (plan: ContributionPlan) => {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onEdit(plan)}
          disabled={loading || plan.status === "ARCHIVED"}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
        >
          Edit
        </button>

        {plan.status === "ACTIVE" && (
          <button
            type="button"
            onClick={() => handleDeactivate(plan)}
            disabled={loading}
            className="rounded-md border border-warning-300 px-3 py-1.5 text-xs font-medium text-warning-700 hover:bg-warning-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-warning-500/30 dark:text-warning-400"
          >
            Deactivate
          </button>
        )}

        {(plan.status === "DRAFT" || plan.status === "INACTIVE") && (
          <button
            type="button"
            onClick={() => handleActivate(plan)}
            disabled={loading}
            className="rounded-md border border-success-300 px-3 py-1.5 text-xs font-medium text-success-700 hover:bg-success-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-success-500/30 dark:text-success-400"
          >
            Activate
          </button>
        )}

        {plan.status !== "ARCHIVED" && (
          <button
            type="button"
            onClick={() => handleArchive(plan)}
            disabled={loading}
            className="rounded-md border border-error-300 px-3 py-1.5 text-xs font-medium text-error-700 hover:bg-error-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-error-500/30 dark:text-error-400"
          >
            Archive
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Backend message */}
      {message && (
        <div
          role="status"
          className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300"
        >
          {message}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Plan
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Frequency
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Currency
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Effective Period
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Status
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Related Records
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Created By
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading && plans.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-brand-500" />
                      Loading contribution plans...
                    </div>
                  </TableCell>
                </TableRow>
              ) : plans.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No contribution plans found.
                  </TableCell>
                </TableRow>
              ) : (
                plans.map((plan) => (
                  <TableRow key={plan.id}>
                    {/* Plan */}
                    <TableCell className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800 dark:text-white/90">
                          {plan.name}
                        </span>

                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {plan.code}
                        </span>
                      </div>
                    </TableCell>

                    {/* Frequency */}
                    <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {plan.frequencyOverride || plan.frequency}
                    </TableCell>

                    {/* Currency */}
                    <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {plan.currency}
                    </TableCell>

                    {/* Effective Period */}
                    <TableCell className="px-5 py-4">
                      <div className="flex flex-col text-sm text-gray-600 dark:text-gray-300">
                        <span>
                          From: {formatDate(plan.effectiveFrom)}
                        </span>

                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          To: {formatDate(plan.effectiveTo)}
                        </span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClassesP(
                          plan.status
                        )}`}
                      >
                        {plan.status}
                      </span>
                    </TableCell>

                    {/* Related Records */}
                    <TableCell className="px-5 py-4">
                      <div className="flex flex-col gap-1 text-xs text-gray-600 dark:text-gray-300">
                        <span>Rules: {plan._count?.rules ?? 0}</span>
                        <span>Periods: {plan._count?.periods ?? 0}</span>
                        <span>
                          Member Contributions:{" "}
                          {plan._count?.memberContributions ?? 0}
                        </span>
                        <span>
                          Penalty Rules: {plan._count?.penaltyRules ?? 0}
                        </span>
                      </div>
                    </TableCell>

                    {/* Creator */}
                    <TableCell className="px-5 py-4">
                      <div className="flex flex-col text-sm">
                        <span className="text-gray-700 dark:text-gray-300">
                          {getCreatorName(plan)}
                        </span>

                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(plan.createdAt)}
                        </span>
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="px-5 py-4">
                      {renderActions(plan)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {loading && plans.length > 0 && (
          <div className="border-t border-gray-200 px-5 py-2 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
            Updating contribution plans...
          </div>
        )}
      </div>
    </div>
  );
};






interface ContributionRuleTableProps {
  onEdit: (rule: ContributionRule) => void;
}

/*
 * ============================================================
 * HELPERS
 * ============================================================
 */


const formatAmount = (
  amount: string | number,
  currency: string
): string => {
  const parsedAmount = Number(amount);

  if (Number.isNaN(parsedAmount)) {
    return `${currency} ${amount}`;
  }

  return `${currency} ${parsedAmount.toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatScope = (
  scope: ContributionRuleScope
): string => {
  const labels: Record<ContributionRuleScope, string> = {
    GLOBAL: "Global",
    REGION: "Region",
    BRANCH: "Branch",
    CHAPTER: "Chapter",
    GROUP: "Group",
    MEMBER: "Individual Member",
  };

  return labels[scope] || scope;
};

const formatDeadline = (
  rule: ContributionRule
): string => {
  switch (rule.deadlineType) {
    case "FIXED_DAY_OF_MONTH":
      return rule.deadlineDay
        ? `Day ${rule.deadlineDay} of month`
        : "Fixed day of month";

    case "FIRST_WEEKDAY":
      return "First weekday";

    case "LAST_WEEKDAY":
      return "Last weekday";

    case "NTH_WEEKDAY":
      return `Week ${rule.deadlineWeek ?? "—"}, weekday ${
        rule.deadlineWeekday ?? "—"
      }`;

    case "DAYS_AFTER_PERIOD_START":
      return `${rule.deadlineOffsetDays ?? 0} days after period start`;

    case "DAYS_BEFORE_PERIOD_END":
      return `${rule.deadlineOffsetDays ?? 0} days before period end`;

    default:
      return rule.deadlineType;
  }
};

const getScopeName = (
  rule: ContributionRule
): string => {
  switch (rule.scopeType) {
    case "REGION":
      return rule.region?.name || "—";

    case "BRANCH":
      return rule.branch?.name || "—";

    case "CHAPTER":
      return rule.chapter?.name || "—";

    case "GROUP":
      return rule.group?.name || "—";

    case "MEMBER":
      return (
        rule.member?.membershipNumber ||
        [
          rule.member?.firstName,
          rule.member?.lastName,
        ]
          .filter(Boolean)
          .join(" ") ||
        "—"
      );

    default:
      return "All members";
  }
};



/*
 * ============================================================
 * COMPONENT
 * ============================================================
 */
const getStatusClassesR = (
  isActive: boolean
): string => {
  return isActive
    ? "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400"
    : "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400";
};
const ContributionRuleTable = ({
  onEdit,
}: ContributionRuleTableProps) => {
  

  const {
    rules,
    loading,
    message,
    activateRule,
    deactivateRule,
    deleteRule,
  } = useContributionRules();

  /*
   * ============================================================
   * ACTIVATE RULE
   * ============================================================
   */

  const handleActivate = async (
    rule: ContributionRule
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to activate the contribution rule "${rule.name}"?`
    );

    if (!confirmed) return;

    await activateRule(rule.id);
  };

  /*
   * ============================================================
   * DEACTIVATE RULE
   * ============================================================
   */

  const handleDeactivate = async (
    rule: ContributionRule
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to deactivate the contribution rule "${rule.name}"?`
    );

    if (!confirmed) return;

    await deactivateRule(rule.id);
  };

  /*
   * ============================================================
   * DELETE RULE
   * ============================================================
   */

  const handleDelete = async (
    rule: ContributionRule
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the contribution rule "${rule.name}"?`
    );

    if (!confirmed) return;

    await deleteRule(rule.id);
  };

  /*
   * ============================================================
   * ACTIONS
   * ============================================================
   */

  const renderActions = (
    rule: ContributionRule
  ) => {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onEdit(rule)}
          disabled={loading}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
        >
          Edit
        </button>

        {rule.isActive ? (
          <button
            type="button"
            onClick={() => handleDeactivate(rule)}
            disabled={loading}
            className="rounded-md border border-warning-300 px-3 py-1.5 text-xs font-medium text-warning-700 hover:bg-warning-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-warning-500/30 dark:text-warning-400"
          >
            Deactivate
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleActivate(rule)}
            disabled={loading}
            className="rounded-md border border-success-300 px-3 py-1.5 text-xs font-medium text-success-700 hover:bg-success-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-success-500/30 dark:text-success-400"
          >
            Activate
          </button>
        )}

        <button
          type="button"
          onClick={() => handleDelete(rule)}
          disabled={loading}
          className="rounded-md border border-error-300 px-3 py-1.5 text-xs font-medium text-error-700 hover:bg-error-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-error-500/30 dark:text-error-400"
        >
          Delete
        </button>
      </div>
    );
  };

  /*
   * ============================================================
   * TABLE
   * ============================================================
   */

  return (
    <div className="space-y-4">
      {/* Backend message */}
      {message && (
        <div
          role="status"
          className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300"
        >
          {message}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Rule
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Contribution Plan
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Scope
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Amount
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Frequency
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Deadline
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Priority
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Effective Period
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Status
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading && rules.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-brand-500" />
                      Loading contribution rules...
                    </div>
                  </TableCell>
                </TableRow>
              ) : rules.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No contribution rules found.
                  </TableCell>
                </TableRow>
              ) : (
                rules.map((rule) => (
                  <TableRow key={rule.id}>
                    {/* Rule */}
                    <TableCell className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800 dark:text-white/90">
                          {rule.name}
                        </span>

                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {rule.id}
                        </span>
                      </div>
                    </TableCell>

                    {/* Plan */}
                    <TableCell className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {rule.plan?.name || "—"}
                        </span>

                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {rule.plan?.code || "—"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Scope */}
                    <TableCell className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {formatScope(rule.scopeType)}
                        </span>

                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {getScopeName(rule)}
                        </span>
                      </div>
                    </TableCell>

                    {/* Amount */}
                    <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {formatAmount(
                        rule.amount,
                        rule.currency
                      )}
                    </TableCell>

                    {/* Frequency */}
                    <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {rule.frequencyOverride ||
                        rule.plan?.frequency ||
                        "—"}
                    </TableCell>

                    {/* Deadline */}
                    <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {formatDeadline(rule)}
                    </TableCell>

                    {/* Priority */}
                    <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {rule.priority}
                    </TableCell>

                    {/* Effective Period */}
                    <TableCell className="px-5 py-4">
                      <div className="flex flex-col text-sm text-gray-600 dark:text-gray-300">
                        <span>
                          From: {formatDate(rule.effectiveFrom)}
                        </span>

                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          To: {formatDate(rule.effectiveTo)}
                        </span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium 
                           ${getStatusClassesR(
                          rule.isActive 
                        )
                      }
               `}
                      >
                        {rule.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="px-5 py-4">
                      {renderActions(rule)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {loading && rules.length > 0 && (
          <div className="border-t border-gray-200 px-5 py-2 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
            Updating contribution rules...
          </div>
        )}
      </div>
    </div>
  );
};




// interface ContributionPeriodTableProps {
//   onView?: (period: ContributionPeriod) => void;
// }

interface ContributionPeriodTableProps {
  periods: ContributionPeriod[];
  loading: boolean;
  onView?: (period: ContributionPeriod) => void;
}



const formatStatus = (status: ContributionPeriodStatus): string => {
  return status.charAt(0) + status.slice(1).toLowerCase();
};

const getStatusClasses = (status: ContributionPeriodStatus): string => {
  const classes: Record<ContributionPeriodStatus, string> = {
    UPCOMING:
      "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
    OPEN:
      "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400",
    DUE:
      "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400",
    OVERDUE:
      "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400",
    CLOSED:
      "bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400",
  };

  return classes[status];
};

const getAvailableActions = (
  status: ContributionPeriodStatus
): string[] => {
  const actions: Record<ContributionPeriodStatus, string[]> = {
    UPCOMING: ["open"],
    OPEN: ["due", "close"],
    DUE: ["overdue", "close"],
    OVERDUE: ["close"],
    CLOSED: [],
  };

  return actions[status];
};

const ContributionPeriodTable = ({
  onView,
}: ContributionPeriodTableProps) => {
  const {
    periods,
    loading,
    message,
    openPeriod,
    closePeriod,
    markPeriodDue,
    markPeriodOverdue,
  } = useContributionPeriods();

  const handleAction = async (
    period: ContributionPeriod,
    action: string
  ) => {
    const actionLabels: Record<string, string> = {
      open: "open",
      due: "mark as due",
      overdue: "mark as overdue",
      close: "close",
    };

    const confirmed = window.confirm(
      `Are you sure you want to ${actionLabels[action]} "${period.name}"?`
    );

    if (!confirmed) return;

    switch (action) {
      case "open":
        await openPeriod(period.id);
        break;

      case "due":
        await markPeriodDue(period.id);
        break;

      case "overdue":
        await markPeriodOverdue(period.id);
        break;

      case "close":
        await closePeriod(period.id);
        break;

      default:
        break;
    }
  };

  const renderActionButton = (
    period: ContributionPeriod,
    action: string
  ) => {
    const labels: Record<string, string> = {
      open: "Open",
      due: "Mark Due",
      overdue: "Mark Overdue",
      close: "Close",
    };

    const styles: Record<string, string> = {
      open: "text-green-600 hover:text-green-800 dark:text-green-400",
      due: "text-yellow-600 hover:text-yellow-800 dark:text-yellow-400",
      overdue: "text-red-600 hover:text-red-800 dark:text-red-400",
      close: "text-gray-600 hover:text-gray-800 dark:text-gray-400",
    };

    return (
      <button
        key={action}
        type="button"
        disabled={loading}
        onClick={() => void handleAction(period, action)}
        className={`text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[action]}`}
      >
        {labels[action]}
      </button>
    );
  };

  return (
    <div className="space-y-4">
      {message && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
          {message}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                  Period
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                  Contribution Plan
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                  Period Dates
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                  Due Date
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-center font-medium text-gray-600 dark:text-gray-300">
                  Contributions
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                  Status
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                  Generated
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading && periods.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-brand-500" />
                      Loading contribution periods...
                    </div>
                  </td>
                </tr>
              ) : periods.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-gray-500 dark:text-gray-400"
                  >
                    No contribution periods found.
                  </td>
                </tr>
              ) : (
                periods.map((period) => {
                  const actions = getAvailableActions(period.status);

                  return (
                    <tr
                      key={period.id}
                      className="transition hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-800 dark:text-white/90">
                          {period.name}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {period.id}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-800 dark:text-white/90">
                          {period.plan?.name ?? "—"}
                        </div>
                        {period.plan?.code && (
                          <div className="mt-1 text-xs text-gray-500">
                            {period.plan.code}
                          </div>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-gray-600 dark:text-gray-300">
                        <div>{formatDate(period.periodStart)}</div>
                        <div className="mt-1 text-xs text-gray-500">
                          to {formatDate(period.periodEnd)}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-gray-600 dark:text-gray-300">
                        {formatDate(period.dueDate)}
                      </td>

                      <td className="px-4 py-4 text-center font-medium text-gray-800 dark:text-white/90">
                        {period._count?.memberContributions ?? 0}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(period.status)}`}
                        >
                          {formatStatus(period.status)}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-gray-600 dark:text-gray-300">
                        {formatDate(period.generatedAt)}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex min-w-[120px] flex-col items-start gap-2">
                          {onView && (
                            <button
                              type="button"
                              onClick={() => onView(period)}
                              className="text-xs font-medium text-brand-600 hover:text-brand-800 dark:text-brand-400"
                            >
                              View
                            </button>
                          )}

                          {actions.length > 0 ? (
                            actions.map((action) =>
                              renderActionButton(period, action)
                            )
                          ) : (
                            !onView && (
                              <span className="text-xs text-gray-400">
                                No actions
                              </span>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {loading && periods.length > 0 && (
          <div className="border-t border-gray-100 px-4 py-2 text-center text-xs text-gray-500 dark:border-gray-800">
            Updating contribution periods...
          </div>
        )}
      </div>
    </div>
  );
};



interface MemberContributionTableProps {
  onView?: (contribution: MemberContribution) => void;
  onPay?: (contribution: MemberContribution) => void;
  onWaive?: (contribution: MemberContribution) => void;
}

const formatStatusC = (status: MemberContributionStatus): string => {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getStatusClassesC = (status: MemberContributionStatus): string => {
  const classes: Record<string, string> = {
    PENDING:
      "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",

    PARTIALLY_PAID:
      "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400",

    PAID:
      "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400",

    OVERDUE:
      "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400",

    WAIVED:
      "bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400",

    CANCELLED:
      "bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400",
  };

  return (
    classes[status] ??
    "bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400"
  );
};

const formatAmountC = (
  amount: number | string | null | undefined,
  currency: string
): string => {
  const numericAmount = Number(amount ?? 0);

  return `${currency} ${numericAmount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDateC = (date?: string | null): string => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString();
};

const MemberContributionTable = ({
  onView,
  onPay,
  onWaive,
}: MemberContributionTableProps) => {
  const {
    contributions,
    loading,
    message,
    markContributionOverdue,
    cancelContribution,
  } = useMemberContributions();

  const handleMarkOverdue = async (contribution: MemberContribution) => {
    await markContributionOverdue(contribution.id);
  };

  const handleCancel = async (contribution: MemberContribution) => {
    await cancelContribution(contribution.id);
  };

  return (
    <div className="space-y-4">
      {message && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
          {message}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                  Member
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                  Contribution Plan
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                  Period
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-300">
                  Amount Due
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-300">
                  Amount Paid
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-300">
                  Outstanding
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                  Due Date
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                  Status
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading && contributions.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-10 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-brand-500" />
                      Loading member contributions...
                    </div>
                  </td>
                </tr>
              ) : contributions.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-10 text-center text-gray-500 dark:text-gray-400"
                  >
                    No member contributions found.
                  </td>
                </tr>
              ) : (
                contributions.map((contribution) => (
                  <tr
                    key={contribution.id}
                    className="transition hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-800 dark:text-white/90">
                        {contribution.member?.membershipNumber ?? "—"}
                      </div>

                      <div className="mt-1 text-xs text-gray-500">
                        {contribution.memberId}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-800 dark:text-white/90">
                        {contribution.plan?.name ?? "—"}
                      </div>

                      {contribution.plan?.code && (
                        <div className="mt-1 text-xs text-gray-500">
                          {contribution.plan.code}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-800 dark:text-white/90">
                        {contribution.period?.name ?? "—"}
                      </div>

                      <div className="mt-1 text-xs text-gray-500">
                        {contribution.periodId}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-right text-gray-600 dark:text-gray-300">
                      {formatAmountC(
                        contribution.amountDue,
                        contribution.currency
                      )}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-right text-gray-600 dark:text-gray-300">
                      {formatAmountC(
                        contribution.amountPaid,
                        contribution.currency
                      )}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-right font-medium text-gray-800 dark:text-white/90">
                      {formatAmountC(
                        contribution.outstandingAmount,
                        contribution.currency
                      )}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-gray-600 dark:text-gray-300">
                      {formatDateC(contribution.dueAt)}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClassesC(
                          contribution.status
                        )}`}
                      >
                        {formatStatusC(contribution.status)}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex min-w-[100px] flex-col items-start gap-2">
                        {onView && (
                          <button
                            type="button"
                            onClick={() => onView(contribution)}
                            className="text-xs font-medium text-brand-600 hover:text-brand-800 dark:text-brand-400"
                          >
                            View
                          </button>
                        )}

                        <MemberContributionActions
                          contribution={contribution}
                          loading={loading}
                          onPay={onPay}
                          onWaive={onWaive}
                          onMarkOverdue={handleMarkOverdue}
                          onCancel={handleCancel}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {loading && contributions.length > 0 && (
          <div className="border-t border-gray-100 px-4 py-2 text-center text-xs text-gray-500 dark:border-gray-800">
            Updating member contributions...
          </div>
        )}
      </div>
    </div>
  );
};


interface PaymentProviderTableProps {
  onEdit?: (provider: PaymentProvider) => void;
  onView?: (provider: PaymentProvider) => void;
}

const formatProviderType = (type: PaymentProviderType): string => {
  return type
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const PaymentProviderTable = ({
  onEdit,
  onView,
}: PaymentProviderTableProps) => {
  const {
    providers,
    loading,
    message,
    activatePaymentProvider,
    deactivatePaymentProvider,
  } = usePaymentProviders();

  const handleToggleStatus = async (provider: PaymentProvider) => {
    const action = provider.isActive ? "deactivate" : "activate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${provider.name}?`,
    );

    if (!confirmed) return;

    if (provider.isActive) {
      await deactivatePaymentProvider(provider.id);
    } else {
      await activatePaymentProvider(provider.id);
    }
  };

  return (
    <div className="space-y-4">
      {/* {message && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
          {message}
        </div>
      )} */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
              <tr>
                {[
                  "Provider",
                  "Code",
                  "Type",
                  "Description",
                  "Payments",
                  "Transactions",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading && providers.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-brand-500" />
                      Loading payment providers...
                    </div>
                  </td>
                </tr>
              ) : providers.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-gray-500 dark:text-gray-400"
                  >
                    No payment providers found.
                  </td>
                </tr>
              ) : (
                providers.map((provider) => (
                  <tr
                    key={provider.id}
                    className="transition hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-800 dark:text-white/90">
                        {provider.name}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 font-mono text-xs text-gray-600 dark:text-gray-300">
                      {provider.code}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-gray-600 dark:text-gray-300">
                      {formatProviderType(provider.type)}
                    </td>

                    <td className="max-w-xs px-4 py-4 text-gray-600 dark:text-gray-300">
                      <span className="line-clamp-2">
                        {provider.description || "—"}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                      {provider._count?.payments ?? "—"}
                    </td>

                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                      {provider._count?.transactions ?? "—"}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          provider.isActive
                            ? "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400"
                        }`}
                      >
                        {provider.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex min-w-[100px] flex-col items-start gap-2">
                        {onView && (
                          <button
                            type="button"
                            onClick={() => onView(provider)}
                            className="text-xs font-medium text-brand-600 hover:text-brand-800 dark:text-brand-400"
                          >
                            View
                          </button>
                        )}

                        {onEdit && (
                          <button
                            type="button"
                            onClick={() => onEdit(provider)}
                            className="text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400"
                          >
                            Edit
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => handleToggleStatus(provider)}
                          className={`text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50 ${
                            provider.isActive
                              ? "text-red-600 hover:text-red-800 dark:text-red-400"
                              : "text-green-600 hover:text-green-800 dark:text-green-400"
                          }`}
                        >
                          {provider.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {loading && providers.length > 0 && (
          <div className="border-t border-gray-100 px-4 py-2 text-center text-xs text-gray-500 dark:border-gray-800">
            Updating payment providers...
          </div>
        )}
      </div>
    </div>
  );
};

import { Payment } from "../../../types/PaymentType";

interface PaymentTableProps {
  payments: Payment[];
  loading?: boolean;
  message?: string | null;
  showMember?: boolean;
  onView?: (payment: Payment) => void;
}

const formatPaymentStatus = (status: string): string => {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getPaymentStatusClasses = (status: string): string => {
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

const formatPaymentMethod = (method: string): string => {
  const methods: Record<string, string> = {
    MPESA: "M-Pesa",
    CASH: "Cash",
    BANK: "Bank Transfer",
    CARD: "Card",
    CHEQUE: "Cheque",
  };

  return methods[method] ?? formatPaymentStatus(method);
};





const PaymentTable = ({
  payments,
  loading = false,
  message,
  showMember = false,
  onView,
}: PaymentTableProps) => {
  const columnCount = showMember ? 8 : 7;

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
      {message && (
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
          {message}
        </div>
      )}

      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            {showMember && (
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Member
              </th>
            )}

            <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Amount
            </th>

            <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Method
            </th>

            <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Provider
            </th>

            <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Reference
            </th>

            <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Status
            </th>

            <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Date
            </th>

            {onView && (
              <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Actions
              </th>
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-950">
          {loading ? (
            <tr>
              <td
                colSpan={columnCount}
                className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
              >
                Loading payments...
              </td>
            </tr>
          ) : payments.length === 0 ? (
            <tr>
              <td
                colSpan={columnCount}
                className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
              >
                No payments found.
              </td>
            </tr>
          ) : (
            payments.map((payment) => (
              <tr
                key={payment.id}
                className="transition hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                {showMember && (
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {payment.member?.membershipNumber ??
                      payment.memberId}
                  </td>
                )}

                <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">
                  {formatAmount(payment.amount, payment.currency)}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {formatPaymentMethod(payment.method)}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {payment.provider?.name ?? "—"}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                  <div>
                    <p>{payment.internalReference}</p>
                    {payment.externalReference && (
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        External: {payment.externalReference}
                      </p>
                    )}
                  </div>
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getPaymentStatusClasses(
                      payment.status,
                    )}`}
                  >
                    {formatPaymentStatus(payment.status)}
                  </span>
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {formatDate(payment.createdAt)}
                </td>

                {onView && (
                  <td className="whitespace-nowrap px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => onView(payment)}
                      className="text-sm font-medium text-brand-500 hover:text-brand-600"
                    >
                      View
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};









export {PaymentTable, PaymentProviderTable , RolesTable,  MenuTable, StatusTable, OrdersTable,CustomersTable, PermissionsTable,RegionsTable ,RegionMembersTable,MembersTable,UsersTable,ImportsTable, ContributionPlansTable,ContributionRuleTable,ContributionPeriodTable,MemberContributionTable}; 