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
import {usePermissions}from "../../../hooks/usePermission";
import { useRegion } from "../../../hooks/useRegion";




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


  if (loading) {
    return (
      <div className="flex justify-center py-10">

        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"/>

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


      <div className="flex justify-end mb-4">
        <Link
          to="/roles/create"
          className="
          px-4 py-2
          rounded-lg
          bg-blue-600
          text-white
          "
        >
          + Create Role
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



            <TableBody
              className="
              divide-y
              divide-gray-100
              "
            >
              {roles.map((role:any)=>(
                <TableRow
                  key={role.id}
                >
                  <TableCell
                    className="px-5 py-4"
                  >
                    <div>
                      <p className="font-medium">
                        {role.name}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell
                    className="px-5 py-4">
                    {new Date(role.createdAt) .toLocaleDateString()}

                  </TableCell>
                  <TableCell
                    className="px-5 py-4"
                  >
                    <div
                      className="
                      flex
                      gap-4
                      "
                    >
                      <Link
                        to={`/roles/${role.id}/permissions`}
                        className="
                        text-green-600
                        "
                      >
                        Permissions
                      </Link>
                      <Link
                        to={`/roles/edit/${role.id}`}
                        className="
                        text-blue-600
                        " >
                        Edit
                      </Link>
                      <button
                        onClick={()=>deleteRole(role.id)}
                        className=" text-red-600" >
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

 function PermissionsTable() {
  const { permissions, loading, message} = usePermissions();
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="  animate-spin  rounded-full  h-8 w-8 border-b-2 border-brand-500 " /></div>);
  }
  return (
    <>
      {message && ( <div className="mb-4 text-sm"> {message} </div>)}
      <div className="flex justify-end mb-4">

        <Link

          to="/permissions/create"

          className="
          px-4 py-2
          rounded-lg
          bg-blue-600
          text-white
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

                  className="
                  px-5
                  py-3
                  text-start
                  "

                >

                  Name

                </TableCell>




                <TableCell

                  isHeader

                  className="
                  px-5
                  py-3
                  text-start
                  "

                >

                  Description

                </TableCell>





                <TableCell

                  isHeader

                  className="
                  px-5
                  py-3
                  text-start
                  "

                >

                  Created At

                </TableCell>




              </TableRow>


            </TableHeader>






            <TableBody

              className="
              divide-y
              divide-gray-100
              "

            >



              {
                permissions.map(
                  (permission:any)=>(


                  <TableRow

                    key={permission.id}

                  >




                    <TableCell

                      className="
                      px-5
                      py-4
                      "

                    >


                      <p className="font-medium">

                        {permission.name}

                      </p>


                    </TableCell>







                    <TableCell

                      className="
                      px-5
                      py-4
                      "

                    >


                      {

                        permission.description ||

                        "-"

                      }


                    </TableCell>







                    <TableCell

                      className="
                      px-5
                      py-4
                      "

                    >


                      {

                        new Date(
                          permission.createdAt
                        )
                        .toLocaleDateString()

                      }



                    </TableCell>





                  </TableRow>


                ))

              }





            </TableBody>




          </Table>


        </div>



      </div>




    </>


  );


}




interface RegionFilters {
  search?: string;
  page?: number;
  limit?: number;
}

interface Props {
  filters: RegionFilters;
}

 function RegionsTable({
  filters,
}: Props) {
  const {
    regions,
    loading,
    fetchRegions,
    deleteRegionHandler,
  } = useRegion();

  useEffect(() => {
    fetchRegions(filters);
  }, [filters]);

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

    await deleteRegionHandler(
      regionId
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin h-8 w-8 border-b-2 border-brand-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">

          <thead className="border-b">
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
            {regions.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center p-6 text-gray-500"
                >
                  No regions found
                </td>
              </tr>
            )}

            {regions.map(
              (region: any) => (
                <tr
                  key={region.id}
                  className="border-b"
                >
                  <td className="p-3 capitalize">
                    {region.name}
                  </td>

                  <td className="p-3">
                    {region.code || "-"}
                  </td>

                  <td className="p-3">
                    {region.description ||
                      "-"}
                  </td>

                  <td className="p-3">
                    {region._count
                      ?.users || 0}
                  </td>

                  <td className="p-3">
                    {new Date(
                      region.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="p-3">
                    <div className="flex gap-3">

                      <Link
                        to={`/regions/${region.id}/users`}
                        className="text-green-600"
                      >
                        Users
                      </Link>

                      <Link
                        to={`/regions/edit/${region.id}`}
                        className="text-blue-600"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() =>
                          handleDelete(
                            region.id
                          )
                        }
                        className="text-red-600"
                      >
                        Delete
                      </button>

                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}


interface RegionUserFilters {
  search?: string;
  membershipStatus?: string;
  employmentStatus?: string;
  roleId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

interface Props2 {
  regionId: string;
  filters: RegionUserFilters;
  setFilters: (
    filters: RegionUserFilters
  ) => void;
}

 function RegionUsersTable({
  regionId,
  filters,
  setFilters,
}: Props2) {
  const {
    regionUsers,
pagination,
    loading,
    fetchRegionUsers,
  } = useRegion();

  useEffect(() => {
    if (!regionId) return;

    fetchRegionUsers(
      regionId,
      filters
    );
  }, [regionId, filters]);

  const handlePageChange = (
    page: number
  ) => {
    setFilters({
      ...filters,
      page,
    });
  };

  if (!regionId) {
    return (
      <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
        Select a region to view members
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin h-8 w-8 border-b-2 border-brand-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="overflow-x-auto">

          <table className="min-w-full text-sm">

            <thead className="border-b">
              <tr>
                <th className="p-3 text-left">
                  Membership No
                </th>

                <th className="p-3 text-left">
                  Name
                </th>

                <th className="p-3 text-left">
                  Email
                </th>

                <th className="p-3 text-left">
                  Phone
                </th>

                <th className="p-3 text-left">
                  Role
                </th>

                <th className="p-3 text-left">
                  Membership Status
                </th>

                <th className="p-3 text-left">
                  Employment Status
                </th>

                <th className="p-3 text-left">
                  NEC
                </th>

                <th className="p-3 text-left">
                  Active
                </th>
              </tr>
            </thead>

            <tbody>
              {regionUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center p-6 text-gray-500"
                  >
                    No users found
                  </td>
                </tr>
              )}

              {regionUsers.map(
                (user: any) => (
                  <tr
                    key={user.id}
                    className="border-b"
                  >
                    <td className="p-3">
                      {user.membershipNumber ||
                        "-"}
                    </td>

                    <td className="p-3">
                      {[
                        user.firstName,
                        user.lastName,
                      ]
                        .filter(Boolean)
                        .join(" ") || "-"}
                    </td>

                    <td className="p-3">
                      {user.email ||
                        "-"}
                    </td>

                    <td className="p-3">
                      {user.phone ||
                        "-"}
                    </td>

                    <td className="p-3">
                      {user.role
                        ?.name || "-"}
                    </td>

                    <td className="p-3">
                      <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
                        {
                          user.membershipStatus
                        }
                      </span>
                    </td>

                    <td className="p-3">
                      {
                        user.employmentStatus
                      }
                    </td>

                    <td className="p-3">
                      {user.isNecMember
                        ? "Yes"
                        : "No"}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          user.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>
                  </tr>
                )
              )}
            </tbody>

          </table>
        </div>
      </div>

      {pagination &&
        pagination.totalPages >
          0 && (
          <div className="flex justify-between items-center mt-4">

            <button
              disabled={
                !pagination.hasPreviousPage
              }
              onClick={() =>
                handlePageChange(
                  filters.page! - 1
                )
              }
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span>
              Page{" "}
              {
                pagination.page
              }{" "}
              of{" "}
              {
                pagination.totalPages
              }
            </span>

            <button
              disabled={
                !pagination.hasNextPage
              }
              onClick={() =>
                handlePageChange(
                  filters.page! + 1
                )
              }
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>

          </div>
        )}
    </>
  );
}


export {  RolesTable,  MenuTable, StatusTable, OrdersTable,CustomersTable, PermissionsTable,RegionsTable ,RegionUsersTable}; 