import {
  Dependant,
} from "../../../types/DependantType";

interface MemberDependantsCardProps {
  dependants: Dependant[];
  onAdd?: () => void;
  onEdit?: (
    dependant: Dependant
  ) => void;
  onDelete?: (
    dependant: Dependant
  ) => void;
}

const MemberDependantsCard = ({
  dependants,
  onAdd,
  onEdit,
  onDelete,
}: MemberDependantsCardProps) => {

  return (
    <div
      className="
        rounded-2xl
        border
        border-gray-200
        bg-white
        dark:border-gray-800
        dark:bg-white/[0.03]
      "
    >

      <div
        className="
          flex
          flex-col
          gap-3
          border-b
          border-gray-200
          px-6
          py-4
          sm:flex-row
          sm:items-center
          sm:justify-between
          dark:border-gray-800
        "
      >

        <div>

          <h3
            className="
              text-lg
              font-semibold
              text-gray-800
              dark:text-white
            "
          >
            Dependants
          </h3>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            {dependants.length} dependant
            {dependants.length === 1
              ? ""
              : "s"}
          </p>

        </div>

        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="
              inline-flex
              items-center
              justify-center
              rounded-lg
              bg-brand-500
              px-4
              py-2
              text-sm
              font-medium
              text-white
              hover:bg-brand-600
            "
          >
            + Add Dependant
          </button>
        )}

      </div>

      {dependants.length === 0 ? (

        <div
          className="
            px-6
            py-10
            text-center
          "
        >

          <p
            className="
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            No dependants have been
            added to this member.
          </p>

        </div>

      ) : (

        <div
          className="
            overflow-x-auto
          "
        >

          <table
            className="
              min-w-full
            "
          >

            <thead>

              <tr
                className="
                  border-b
                  border-gray-200
                  dark:border-gray-800
                "
              >

                <th
                  className="
                    px-6
                    py-3
                    text-left
                    text-xs
                    font-medium
                    uppercase
                    tracking-wider
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Name
                </th>

                <th
                  className="
                    px-6
                    py-3
                    text-left
                    text-xs
                    font-medium
                    uppercase
                    tracking-wider
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Relationship
                </th>

                <th
                  className="
                    px-6
                    py-3
                    text-left
                    text-xs
                    font-medium
                    uppercase
                    tracking-wider
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Date of Birth
                </th>

                <th
                  className="
                    px-6
                    py-3
                    text-left
                    text-xs
                    font-medium
                    uppercase
                    tracking-wider
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Gender
                </th>

                <th
                  className="
                    px-6
                    py-3
                    text-left
                    text-xs
                    font-medium
                    uppercase
                    tracking-wider
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Status
                </th>

                <th
                  className="
                    px-6
                    py-3
                    text-right
                    text-xs
                    font-medium
                    uppercase
                    tracking-wider
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Actions
                </th>

              </tr>

            </thead>

            <tbody
              className="
                divide-y
                divide-gray-200
                dark:divide-gray-800
              "
            >

              {dependants.map(
                (dependant) => (

                  <tr
                    key={dependant.id}
                    className="
                      hover:bg-gray-50
                      dark:hover:bg-white/[0.02]
                    "
                  >

                    <td
                      className="
                        whitespace-nowrap
                        px-6
                        py-4
                        text-sm
                        font-medium
                        text-gray-800
                        dark:text-white
                      "
                    >
                      {dependant.fullName}
                    </td>

                    <td
                      className="
                        whitespace-nowrap
                        px-6
                        py-4
                        text-sm
                        text-gray-600
                        dark:text-gray-300
                      "
                    >
                      {dependant.relationship}
                    </td>

                    <td
                      className="
                        whitespace-nowrap
                        px-6
                        py-4
                        text-sm
                        text-gray-600
                        dark:text-gray-300
                      "
                    >
                      {formatDate(
                        dependant.dateOfBirth
                      )}
                    </td>

                    <td
                      className="
                        whitespace-nowrap
                        px-6
                        py-4
                        text-sm
                        text-gray-600
                        dark:text-gray-300
                      "
                    >
                      {formatGender(
                        dependant.gender
                      )}
                    </td>

                    <td
                      className="
                        whitespace-nowrap
                        px-6
                        py-4
                      "
                    >

                      <span
                        className={`
                          rounded-full
                          px-2.5
                          py-1
                          text-xs
                          font-medium
                          ${
                            dependant.isActive
                              ? `
                                bg-green-100
                                text-green-700
                                dark:bg-green-900/30
                                dark:text-green-400
                              `
                              : `
                                bg-gray-100
                                text-gray-600
                                dark:bg-gray-800
                                dark:text-gray-400
                              `
                          }
                        `}
                      >
                        {dependant.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </td>

                    <td
                      className="
                        whitespace-nowrap
                        px-6
                        py-4
                        text-right
                      "
                    >

                      <div
                        className="
                          flex
                          justify-end
                          gap-3
                        "
                      >

                        {onEdit && (
                          <button
                            type="button"
                            onClick={() =>
                              onEdit(
                                dependant
                              )
                            }
                            className="
                              text-sm
                              font-medium
                              text-brand-500
                              hover:text-brand-600
                            "
                          >
                            Edit
                          </button>
                        )}

                        {onDelete && (
                          <button
                            type="button"
                            onClick={() =>
                              onDelete(
                                dependant
                              )
                            }
                            className="
                              text-sm
                              font-medium
                              text-red-500
                              hover:text-red-600
                            "
                          >
                            Delete
                          </button>
                        )}

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
};

const formatDate = (
  value: string | null
) => {

  if (!value) {
    return "—";
  }

  return new Date(
    value
  ).toLocaleDateString();
};

const formatGender = (
  value: string | null
) => {

  if (!value) {
    return "—";
  }

  return value.charAt(0) +
    value
      .slice(1)
      .toLowerCase();
};

export default MemberDependantsCard;