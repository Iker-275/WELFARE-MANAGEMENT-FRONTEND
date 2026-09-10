import {
  useEffect,
} from "react";

import {
  Link,
} from "react-router";

import {MembersTable }from "../../components/tables/BasicTables/BasicTableOne";

import {
  useMember,
} from "../../hooks/useMember";


const Members = () => {

  const {
    fetchMembers,
  } = useMember();

  useEffect(() => {

    void fetchMembers();

  }, [
    fetchMembers,
  ]);

  return (
    <div
      className="
        space-y-6
      "
    >

      {/* Page Header */}

      <div
        className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <div>

          <h1
            className="
              text-2xl
              font-semibold
              text-gray-800
              dark:text-white
            "
          >
            Members
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            Manage welfare membership and member information.
          </p>

        </div>

        <Link
          to="/members/create"
          className="
            inline-flex
            items-center
            justify-center
            rounded-lg
            bg-brand-500
            px-4
            py-2.5
            text-sm
            font-medium
            text-white
            transition
            hover:bg-brand-600
          "
        >
          + Add Member
        </Link>

      </div>

      {/* Members Table */}

      <MembersTable />

    </div>
  );
};

export default Members;