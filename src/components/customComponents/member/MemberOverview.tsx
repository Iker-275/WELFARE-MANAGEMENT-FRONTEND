import {
  MemberDetails,
} from "../../../types/MemberType";
import { Member } from "../../../types/MemberType";

interface MemberOverviewProps {
  member: MemberDetails | Member;
  onEdit?: () => void;
}

const MemberOverview = ({
  member,
  onEdit,
}: MemberOverviewProps) => {

  const {
    profile,
  } = member;

  const fullName = [
    profile.firstName,
    profile.otherNames,
    profile.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const getStatusClasses = (
    status: string
  ) => {

    switch (status) {

      case "ACTIVE":
        return `
          bg-green-100
          text-green-700
          dark:bg-green-900/30
          dark:text-green-400
        `;

      case "PENDING":
        return `
          bg-yellow-100
          text-yellow-700
          dark:bg-yellow-900/30
          dark:text-yellow-400
        `;

      case "SUSPENDED":
        return `
          bg-orange-100
          text-orange-700
          dark:bg-orange-900/30
          dark:text-orange-400
        `;

      case "RETIRED":
        return `
          bg-blue-100
          text-blue-700
          dark:bg-blue-900/30
          dark:text-blue-400
        `;

      case "RESIGNED":
        return `
          bg-gray-100
          text-gray-700
          dark:bg-gray-800
          dark:text-gray-400
        `;

      default:
        return `
          bg-gray-100
          text-gray-700
          dark:bg-gray-800
          dark:text-gray-400
        `;
    }
  };

  return (
    <div
      className="
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-6
        dark:border-gray-800
        dark:bg-white/[0.03]
      "
    >

      <div
        className="
          flex
          flex-col
          gap-5
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <div
          className="
            flex
            items-center
            gap-4
          "
        >

          <div
            className="
              flex
              h-16
              w-16
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-gray-100
              text-xl
              font-semibold
              text-gray-600
              dark:bg-gray-800
              dark:text-gray-300
            "
          >
            {profile.firstName
              ?.charAt(0)
              .toUpperCase()}
            {profile.lastName
              ?.charAt(0)
              .toUpperCase()}
          </div>

          <div>

            <h2
              className="
                text-xl
                font-semibold
                text-gray-800
                dark:text-white
              "
            >
              {fullName}
            </h2>

            <div
              className="
                mt-1
                flex
                flex-wrap
                items-center
                gap-2
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              <span>
                {member.membershipNumber}
              </span>

              <span>•</span>

              <span>
                Joined{" "}
                {new Date(
                  member.joinedAt
                ).toLocaleDateString()}
              </span>
            </div>

          </div>

        </div>

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <span
            className={`
              rounded-full
              px-3
              py-1
              text-xs
              font-medium
              ${getStatusClasses(member.status)}
            `}
          >
            {member.status}
          </span>

          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
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
                dark:hover:bg-gray-800
              "
            >
              Edit
            </button>
          )}

        </div>

      </div>

    </div>
  );
};

export default MemberOverview;