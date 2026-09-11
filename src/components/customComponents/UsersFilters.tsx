import {
  useEffect,
  useState,
} from "react";

import {
  UserFilters as UserFiltersType,
} from "../../types/UserType";

import {
  useRoles,
} from "../../hooks/useRoles";

interface UsersFiltersProps {
  filters: UserFiltersType;

  updateFilters: (
    updates: Partial<UserFiltersType>
  ) => void;

  onReset: () => void;
}

const UsersFilters = ({
  filters,
  updateFilters,
  onReset,
}: UsersFiltersProps) => {

  const {
    roles,
    fetchRoles,
  } = useRoles();

  const [
    search,
    setSearch,
  ] = useState("");

  /*
   * ============================================================
   * LOAD ROLES
   * ============================================================
   */

  useEffect(() => {

    if (roles.length === 0) {
      void fetchRoles();
    }

  }, [
    roles.length,
    fetchRoles,
  ]);

  /*
   * ============================================================
   * SEARCH
   * ============================================================
   */

  useEffect(() => {

    const timeout =
      window.setTimeout(() => {

        updateFilters({
          page: 1,
          ...(search.trim()
            ? {
                search:
                  search.trim(),
              }
            : {}),
        });

      }, 500);

    return () => {
      window.clearTimeout(
        timeout
      );
    };

  }, [
    search,
    updateFilters,
  ]);

  /*
   * ============================================================
   * FILTER CHANGES
   * ============================================================
   */

  const handleAccountStatusChange = (
    value: string
  ) => {

    updateFilters({
      accountStatus:
        value || undefined,
    });
  };

  const handleUserTypeChange = (
    value: string
  ) => {

    updateFilters({
      userType:
        value || undefined,
    });
  };

  const handleRoleChange = (
    value: string
  ) => {

    updateFilters({
      roleId:
        value || undefined,
    });
  };

  return (
    <div
      className="
        rounded-xl
        border
        border-gray-200
        bg-white
        p-5
        dark:border-gray-800
        dark:bg-white/[0.03]
      "
    >
      <div
        className="
          grid
          grid-cols-1
          gap-4
          md:grid-cols-2
          lg:grid-cols-4
        "
      >

        {/* ======================================================
            SEARCH
        ====================================================== */}

        <div>
          <label
            className="
              mb-1
              block
              text-sm
              font-medium
              text-gray-700
              dark:text-gray-300
            "
          >
            Search
          </label>

          <input
            type="text"
            value={search}
            onChange={event =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search users..."
            className="
              h-11
              w-full
              rounded-lg
              border
              border-gray-300
              bg-white
              px-4
              text-sm
              outline-none
              focus:border-brand-500
              dark:border-gray-700
              dark:bg-gray-900
              dark:text-white
            "
          />
        </div>

        {/* ======================================================
            ACCOUNT STATUS
        ====================================================== */}

        <div>
          <label
            className="
              mb-1
              block
              text-sm
              font-medium
              text-gray-700
              dark:text-gray-300
            "
          >
            Account Status
          </label>

          <select
            value={
              filters.accountStatus ||
              ""
            }
            onChange={event =>
              handleAccountStatusChange(
                event.target.value
              )
            }
            className="
              h-11
              w-full
              rounded-lg
              border
              border-gray-300
              bg-white
              px-4
              text-sm
              outline-none
              focus:border-brand-500
              dark:border-gray-700
              dark:bg-gray-900
              dark:text-white
            "
          >
            <option value="">
              All statuses
            </option>

            <option value="ACTIVE">
              Active
            </option>

            <option value="PENDING">
              Pending
            </option>

            <option value="SUSPENDED">
              Suspended
            </option>

            <option value="DEACTIVATED">
              Deactivated
            </option>
          </select>
        </div>

        {/* ======================================================
            USER TYPE
        ====================================================== */}

        <div>
          <label
            className="
              mb-1
              block
              text-sm
              font-medium
              text-gray-700
              dark:text-gray-300
            "
          >
            User Type
          </label>

          <select
            value={
              filters.userType ||
              ""
            }
            onChange={event =>
              handleUserTypeChange(
                event.target.value
              )
            }
            className="
              h-11
              w-full
              rounded-lg
              border
              border-gray-300
              bg-white
              px-4
              text-sm
              outline-none
              focus:border-brand-500
              dark:border-gray-700
              dark:bg-gray-900
              dark:text-white
            "
          >
            <option value="">
              All user types
            </option>

            <option value="MEMBER">
              Member
            </option>

            <option value="STAFF">
              Staff
            </option>

            <option value="ADMIN">
              Admin
            </option>
          </select>
        </div>

        {/* ======================================================
            ROLE
        ====================================================== */}

        <div>
          <label
            className="
              mb-1
              block
              text-sm
              font-medium
              text-gray-700
              dark:text-gray-300
            "
          >
            Role
          </label>

          <select
            value={
              filters.roleId ||
              ""
            }
            onChange={event =>
              handleRoleChange(
                event.target.value
              )
            }
            className="
              h-11
              w-full
              rounded-lg
              border
              border-gray-300
              bg-white
              px-4
              text-sm
              outline-none
              focus:border-brand-500
              dark:border-gray-700
              dark:bg-gray-900
              dark:text-white
            "
          >
            <option value="">
              All roles
            </option>

            {roles.map(role => (
              <option
                key={role.id}
                value={role.id}
              >
                {role.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ========================================================
          RESET
      ======================================================== */}

      <div className="mt-4">
        <button
          type="button"
          onClick={() => {
            setSearch("");
            onReset();
          }}
          className="
            rounded-lg
            border
            border-gray-300
            px-4
            py-2
            text-sm
            font-medium
            text-gray-700
            hover:bg-gray-50
            dark:border-gray-700
            dark:text-gray-300
            dark:hover:bg-white/[0.03]
          "
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default UsersFilters;