import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router";

import MemberOverview from "../../components/customComponents/member/MemberOverview";
import MemberPersonalInfo from "../../components/customComponents/member/MemberPersonalInfo";
import MemberEmploymentCard from "../../components/customComponents/member/MemberEmploymentCard";
import MemberNextOfKinCard from "../../components/customComponents/member/MemberNextOfKinCard";
import MemberDependantsCard from "../../components/customComponents/member/MemberDependantsCard";

import {
  useMember,
} from "../../hooks/useMember";

import {
  useEmployment,
} from "../../hooks/useEmployment";

import {
  useNextOfKin,
} from "../../hooks/useNextOfKin";

import {
  useDependants,
} from "../../hooks/useDependants";

import {
  Dependant,
} from "../../types/DependantType";

const MemberProfile = () => {

  const {
    memberId,
  } = useParams<{
    memberId: string;
  }>();

 
  const navigate =
    useNavigate();

  const {
    selectedMember,
    loading: memberLoading,
    message: memberMessage,
    fetchMember,
  } = useMember();

  const {
    memberEmployment,
    loading: employmentLoading,
    message: employmentMessage,
    getMemberEmployment,
    deleteEmployment,
  } = useEmployment();

  const {
    selectedNextOfKin,
    loading: nextOfKinLoading,
    message: nextOfKinMessage,
    getMemberNextOfKin,
    deleteNextOfKin,
  } = useNextOfKin();

  const {
    memberDependants,
    loading: dependantLoading,
    message: dependantMessage,
    getMemberDependants,
    deleteDependant,
  } = useDependants();

  const [
    loadingProfile,
    setLoadingProfile,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {

    if (!memberId) {
      setError(
        "Member ID is required."
      );

      setLoadingProfile(false);

      return;
    }

    const loadMemberProfile =
      async () => {

        setLoadingProfile(true);
        setError("");

        try {

          const [
            member,
          ] = await Promise.all([
            fetchMember(memberId),
            getMemberEmployment(
              memberId
            ),
            getMemberNextOfKin(
              memberId
            ),
            getMemberDependants(
              memberId
            ),
          ]);

          if (!member) {
            setError(
              "Member could not be found."
            );
          }

        } catch {
          setError(
            "Failed to load member profile."
          );
        } finally {

          setLoadingProfile(false);

        }
      };

    void loadMemberProfile();

  }, [
    memberId,
    fetchMember,
    getMemberEmployment,
    getMemberNextOfKin,
    getMemberDependants,
  ]);

  const handleEditMember = () => {

    if (!memberId) {
      return;
    }

    navigate(
      `/members/edit/${memberId}`
    );
  };

  const handleAddEmployment = () => {

    if (!memberId) {
      return;
    }

    navigate(
      `/members/${memberId}/employment/create`
    );
  };

  const handleEditEmployment = () => {

    if (
      !memberId ||
      !memberEmployment
    ) {
      return;
    }

    navigate(
      `/members/${memberId}/employment/edit/${memberEmployment.id}`
    );
  };

  const handleDeleteEmployment = async () => {

    if (!memberEmployment) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to remove this employment information?"
      );

    if (!confirmed) {
      return;
    }

    await deleteEmployment(
      memberEmployment.id
    );
  };

  const handleAddNextOfKin = () => {

    if (!memberId) {
      return;
    }

    navigate(
      `/members/${memberId}/next-of-kin/create`
    );
  };

  const handleEditNextOfKin = () => {

    if (
      !memberId ||
      !selectedNextOfKin
    ) {
      return;
    }

    navigate(
      `/members/${memberId}/next-of-kin/edit/${selectedNextOfKin.id}`
    );
  };

  const handleDeleteNextOfKin = async () => {

    if (!selectedNextOfKin) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to remove this next of kin?"
      );

    if (!confirmed) {
      return;
    }

    await deleteNextOfKin(
      selectedNextOfKin.id
    );
  };

  const handleAddDependant = () => {

    if (!memberId) {
      return;
    }

    navigate(
      `/members/${memberId}/dependants/create`
    );
  };

  const handleEditDependant = (
    dependant: Dependant
  ) => {

    if (!memberId) {
      return;
    }

    navigate(
      `/members/${memberId}/dependants/edit/${dependant.id}`
    );
  };

  const handleDeleteDependant = async (
    dependant: Dependant
  ) => {

    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${dependant.fullName}?`
      );

    if (!confirmed) {
      return;
    }

    await deleteDependant(
      dependant.id
    );
  };

  const handleBack = () => {

    navigate(
      "/members"
    );
  };

  const loading =
    loadingProfile ||
    memberLoading ||
    employmentLoading ||
    nextOfKinLoading ||
    dependantLoading;

  const displayMessage =
    error ||
    memberMessage ||
    employmentMessage ||
    nextOfKinMessage ||
    dependantMessage;

  if (loading) {

    return (
      <div
        className="
          flex
          min-h-[400px]
          items-center
          justify-center
        "
      >

        <div
          className="
            text-sm
            text-gray-500
            dark:text-gray-400
          "
        >
          Loading member profile...
        </div>

      </div>
    );
  }

  if (!selectedMember) {

    return (
      <div
        className="
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-8
          dark:border-gray-800
          dark:bg-white/[0.03]
        "
      >

        <div
          className="
            text-center
          "
        >

          <h2
            className="
              text-lg
              font-semibold
              text-gray-800
              dark:text-white
            "
          >
            Member Not Found
          </h2>

          <p
            className="
              mt-2
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            {displayMessage ||
              "The requested member could not be found."}
          </p>

          <button
            type="button"
            onClick={handleBack}
            className="
              mt-5
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
            Back to Members
          </button>

        </div>

      </div>
    );
  }

  /*
   * MemberDetails is required by the profile components.
   *
   * fetchMember() should return the detailed member object
   * from the backend.
   */
  const member =
    selectedMember;

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

          <button
            type="button"
            onClick={handleBack}
            className="
              mb-2
              text-sm
              font-medium
              text-gray-500
              hover:text-gray-700
              dark:text-gray-400
              dark:hover:text-gray-200
            "
          >
            ← Back to Members
          </button>

          <h1
            className="
              text-2xl
              font-semibold
              text-gray-800
              dark:text-white
            "
          >
            Member Profile
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            View and manage member information.
          </p>

        </div>

      </div>

      {/* Member Overview */}

      <MemberOverview
        member={member}
        onEdit={handleEditMember}
      />

      {/* Personal Information */}

      <MemberPersonalInfo
        profile={member.profile}
        onEdit={handleEditMember}
      />

      {/* Employment */}

      <MemberEmploymentCard
        employment={memberEmployment}
        onAdd={handleAddEmployment}
        onEdit={handleEditEmployment}
        onDelete={
          memberEmployment
            ? handleDeleteEmployment
            : undefined
        }
      />

      {/* Next of Kin */}

      <MemberNextOfKinCard
        nextOfKin={selectedNextOfKin}
        onAdd={handleAddNextOfKin}
        onEdit={handleEditNextOfKin}
        onDelete={
          selectedNextOfKin
            ? handleDeleteNextOfKin
            : undefined
        }
      />

      {/* Dependants */}

      <MemberDependantsCard
        dependants={memberDependants}
        onAdd={handleAddDependant}
        onEdit={handleEditDependant}
        onDelete={handleDeleteDependant}
      />

    </div>
  );
};

export default MemberProfile;