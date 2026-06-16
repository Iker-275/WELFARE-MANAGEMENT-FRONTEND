import { useState, useEffect } from "react";
import { OrderFilters } from "../../types/OrderTypes";
import { useStatus } from "../../hooks/useStatus";
import { useCustomer } from "../../hooks/useCustomers";


interface Props {
  filters: OrderFilters;
  setFilters: (filters: OrderFilters) => void;
}

const MONTH_MAP: Record<string, number> = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

export default function OrderFiltersComponent({ filters, setFilters }: Props) {
  const { statuses, loadStatuses } = useStatus();
  const { customers, loadCustomers } = useCustomer();
  // const { users, fetchUsers } = useUsers();


  const [search, setSearch] = useState(filters.customer || "");



  // load dependencies
  useEffect(() => {
    loadStatuses({ visible: true });
    loadCustomers();
    
  }, []);

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({
        ...filters,
        customer: search,
        page: 1, // reset pagination
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="flex flex-wrap gap-4 items-center justify-between">

      <div className="flex gap-3 flex-wrap">

        {/* 🔍 Customer Search */}
        <input
          type="text"
          placeholder="Search customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 w-56"
        />

        {/* 👤 Customer Dropdown */}
        <select
          value={filters.customer || ""}
          onChange={(e) =>
            setFilters({
              ...filters,
              customer: e.target.value,
              page: 1,
            })
          }
          className="border rounded-lg px-3 py-2"
        >
          <option value="">All Customers</option>
          {customers.map((c) => (
            <option key={c._id} value={c.phone}>
              {c.name}
            </option>
          ))}
        </select>

        {/* waiter dropdown */}
       
         

        {/* 📌 Status Dropdown */}
        <select
          value={filters.status || ""}
          onChange={(e) =>
            setFilters({
              ...filters,
              status: e.target.value,
              page: 1,
            })
          }
          className="border rounded-lg px-3 py-2"
        >
          <option value="">All Status</option>
          {statuses.map((s) => (
            <option key={s._id} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>

        {/* 📅 Single Date */}
        <input
          type="date"
          onChange={(e) =>
            setFilters({
              ...filters,
              date: e.target.value
                ? new Date(e.target.value)
                  .toISOString()
                  .split("T")[0]
                  .split("-")
                  .reverse()
                  .join("-") // convert to DD-MM-YYYY
                : undefined,
              page: 1,
            })
          }
          className="border rounded-lg px-3 py-2"
        />

        {/* 📅 Start Date */}
        <input
          type="date"
          onChange={(e) =>
            setFilters({
              ...filters,
              startDate: e.target.value,
              page: 1,
            })
          }
          className="border rounded-lg px-3 py-2"
        />

        {/* 📅 End Date */}
        <input
          type="date"
          onChange={(e) =>
            setFilters({
              ...filters,
              endDate: e.target.value,
              page: 1,
            })
          }
          className="border rounded-lg px-3 py-2"
        />

        {/* 📆 Month */}

        <select
          onChange={(e) => {
            const value = e.target.value;

            setFilters({
              ...filters,
              month: value ? MONTH_MAP[value] : undefined, // 👈 convert to number
              page: 1,
            });
          }}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">All Months</option>

          {Object.keys(MONTH_MAP).map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        {/* 📆 Year */}
        <input
          type="number"
          placeholder="Year"
          onChange={(e) =>
            setFilters({
              ...filters,
              year: Number(e.target.value) || undefined,
              page: 1,
            })
          }
          className="border rounded-lg px-3 py-2 w-28"
        />

        {/* 📆 Week */}
        <input
          type="number"
          placeholder="Week"
          onChange={(e) =>
            setFilters({
              ...filters,
              week: Number(e.target.value) || undefined,
              page: 1,
            })
          }
          className="border rounded-lg px-3 py-2 w-24"
        />

        {/* 🔄 Reset */}
        <button
          onClick={() =>
            setFilters({
              page: 1,
              limit: 10,
            })
          }
          className="px-4 py-2 bg-gray-200 rounded-lg"
        >
          Reset
        </button>

      </div>
    </div>
  );
}