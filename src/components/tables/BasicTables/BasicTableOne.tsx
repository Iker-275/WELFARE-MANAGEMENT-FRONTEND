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
import { Link } from "react-router";
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
                    {region._count?.users ?? 0}
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

    updateUserStatus,
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

      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "SUSPENDED":
        return "bg-orange-100 text-orange-700";

      case "DEACTIVATED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  /*
   * ============================================================
   * UPDATE STATUS
   * ============================================================
   */

  const handleStatusChange = async (
    user: User,
    accountStatus: string
  ) => {

    const confirmed =
      window.confirm(
        `Are you sure you want to change "${getUserName(user)}" to ${accountStatus}?`
      );

    if (!confirmed) {
      return;
    }

    setActionLoading(true);

    try {

      const success =
        await updateUserStatus(
          user.id,
          {
            accountStatus,
          }
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

    switch (user.accountStatus) {

      case "ACTIVE":
        return (
          <button
            type="button"
            disabled={
              actionLoading
            }
            onClick={() =>
              handleStatusChange(
                user,
                "SUSPENDED"
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
        );

      case "SUSPENDED":
        return (
          <button
            type="button"
            disabled={
              actionLoading
            }
            onClick={() =>
              handleStatusChange(
                user,
                "ACTIVE"
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

      case "DEACTIVATED":
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

                              {renderStatusActions(
                                user
                              )}

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






export {  RolesTable,  MenuTable, StatusTable, OrdersTable,CustomersTable, PermissionsTable,RegionsTable ,RegionMembersTable,MembersTable,UsersTable}; 