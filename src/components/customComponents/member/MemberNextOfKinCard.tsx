import {
  NextOfKin,
} from "../../../types/NextOfKinType";

interface MemberNextOfKinCardProps {
  nextOfKin: NextOfKin | null;
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const MemberNextOfKinCard = ({
  nextOfKin,
  onAdd,
  onEdit,
  onDelete,
}: MemberNextOfKinCardProps) => {

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
          Next of Kin
        </h3>

        {nextOfKin && onEdit && (
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

      {!nextOfKin ? (

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
            No next of kin information
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
              Add Next of Kin
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
            label="Full Name"
            value={nextOfKin.fullName}
          />

          <InfoItem
            label="Relationship"
            value={nextOfKin.relationship}
          />

          <InfoItem
            label="Phone Number"
            value={nextOfKin.phoneNumber}
          />

          <InfoItem
            label="National ID"
            value={nextOfKin.nationalId}
          />

          <InfoItem
            label="Address"
            value={nextOfKin.address}
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
                Remove Next of Kin
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

export default MemberNextOfKinCard;