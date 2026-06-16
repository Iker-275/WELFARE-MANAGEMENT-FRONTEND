import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";
import { Link } from "react-router";
import { useRoles } from "../../../hooks/useRoles";
import { useMenu } from "../../../hooks/useMenu";
import { useEffect, useState } from "react";
import { useStatus } from "../../../hooks/useStatus";
import { useOrder } from "../../../hooks/useOrder"
import { OrderFilters } from "../../../types/OrderTypes";
import { useCustomer } from "../../../hooks/useCustomers";








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
  const { loading, roles, deleteRole } = useRoles();

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
          to="/roles/create"
          className="px-4 py-2 text-white bg-blue-600 rounded-lg"
        >
          + Create Role
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">

          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>

                <TableCell isHeader className="px-5 py-3 text-start">
                  Name
                </TableCell>

                <TableCell isHeader className="px-5 py-3 text-start">
                  Description
                </TableCell>

                <TableCell isHeader className="px-5 py-3 text-start">
                  Status
                </TableCell>

                <TableCell isHeader className="px-5 py-3 text-start">
                  Created At
                </TableCell>

                <TableCell isHeader className="px-5 py-3 text-start">
                  Actions
                </TableCell>

              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">

              {roles.map((role) => (
                <TableRow key={role._id}>

                  <TableCell className="px-5 py-4 text-start">
                    {role.name}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-start">
                    {role.description}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-start">

                    <Badge
                      size="sm"
                      color={role.active ? "success" : "error"}
                    >
                      {role.active ? "Active" : "Inactive"}
                    </Badge>

                  </TableCell>

                  <TableCell className="px-5 py-4 text-start">
                    {new Date(role.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-3">

                      <Link
                        to={`/roles/edit/${role._id}`}
                        className="text-blue-500"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => deleteRole(role._id)}
                        className="text-red-500"
                      >
                        Delete
                      </button>

                    </div>
                  </TableCell>

                </TableRow>
              ))}

            </TableBody>
          </Table>

        </div>
      </div>
    </>
  );
}







export {  RolesTable,  MenuTable, StatusTable, OrdersTable,CustomersTable }