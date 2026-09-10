import {
  Employment,
} from "../../../types/EmploymentType";

interface MemberEmploymentCardProps {
  employment: Employment | null;
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const MemberEmploymentCard = ({
  employment,
  onAdd,
  onEdit,
  onDelete,
}: MemberEmploymentCardProps) => {

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
          items-center
          justify-between
          border-b
          border-gray-200
          px-6
          py-4
          dark:border-gray-800
        "
      >

        <h3
          className="
            text-lg
            font-semibold
            text-gray-800
            dark:text-white
          "
        >
          Employment
        </h3>

        {employment && onEdit && (
          <button
            type="button"
            onClick={onEdit}
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

      </div>

      {!employment ? (

        <div
          className="
            flex
            flex-col
            items-center
            justify-center
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
            No employment information
            has been added.
          </p>

          {onAdd && (
            <button
              type="button"
              onClick={onAdd}
              className="
                mt-4
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
              Add Employment
            </button>
          )}

        </div>

      ) : (

        <div
          className="
            grid
            grid-cols-1
            gap-5
            p-6
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >

          <InfoItem
            label="Employee Number"
            value={employment.employeeNumber}
          />

          <InfoItem
            label="Employer"
            value={employment.employerName}
          />

          <InfoItem
            label="Job Title"
            value={employment.jobTitle}
          />

          <InfoItem
            label="Employment Status"
            value={employment.employmentStatus}
          />

          <InfoItem
            label="Start Date"
            value={formatDate(
              employment.employmentStartAt
            )}
          />

          <InfoItem
            label="End Date"
            value={formatDate(
              employment.employmentEndAt
            )}
          />

          {onDelete && (
            <div
              className="
                flex
                items-end
              "
            >
              <button
                type="button"
                onClick={onDelete}
                className="
                  text-sm
                  font-medium
                  text-red-500
                  hover:text-red-600
                "
              >
                Remove Employment
              </button>
            </div>
          )}

        </div>

      )}

    </div>
  );
};

interface InfoItemProps {
  label: string;
  value: string | null | undefined;
}

const InfoItem = ({
  label,
  value,
}: InfoItemProps) => {

  return (
    <div>

      <p
        className="
          text-xs
          font-medium
          uppercase
          tracking-wide
          text-gray-500
          dark:text-gray-400
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1
          text-sm
          font-medium
          text-gray-800
          dark:text-white
        "
      >
        {value || "—"}
      </p>

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

export default MemberEmploymentCard;