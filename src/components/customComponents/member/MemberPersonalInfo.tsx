import {
  MemberProfile,
} from "../../../types/MemberType";

interface MemberPersonalInfoProps {
  profile: MemberProfile;
  onEdit?: () => void;
}

const MemberPersonalInfo = ({
  profile,
  onEdit,
}: MemberPersonalInfoProps) => {

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

  const getGenderLabel = (
    gender: string | null
  ) => {

    if (!gender) {
      return "—";
    }

    return gender.charAt(0) +
      gender
        .slice(1)
        .toLowerCase();
  };

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
          Personal Information
        </h3>

        {onEdit && (
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
          label="First Name"
          value={profile.firstName}
        />

        <InfoItem
          label="Last Name"
          value={profile.lastName}
        />

        <InfoItem
          label="Other Names"
          value={profile.otherNames}
        />

        <InfoItem
          label="Gender"
          value={getGenderLabel(
            profile.gender
          )}
        />

        <InfoItem
          label="Date of Birth"
          value={formatDate(
            profile.dateOfBirth
          )}
        />

        <InfoItem
          label="National ID"
          value={profile.nationalId}
        />

        <InfoItem
          label="Address"
          value={profile.address}
        />

      </div>

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

export default MemberPersonalInfo;