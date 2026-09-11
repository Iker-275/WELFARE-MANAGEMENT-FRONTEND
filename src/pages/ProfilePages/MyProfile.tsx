import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import MemberOverview from "../../components/customComponents/member/MemberOverview";
import MemberPersonalInfo from "../../components/customComponents/member/MemberPersonalInfo";
import MemberEmploymentCard from "../../components/customComponents/member/MemberEmploymentCard";
import MemberNextOfKinCard from "../../components/customComponents/member/MemberNextOfKinCard";
import MemberDependantsCard from "../../components/customComponents/member/MemberDependantsCard";

import {
  useAuth,
} from "../../hooks/useAuth";

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


const MyProfile = () => {

  const navigate =
    useNavigate();


  const {
    user,
  } = useAuth();


  const {
    selectedMember,
    loading: memberLoading,
    message: memberMessage,
    fetchMemberByUserId,
  } = useMember();


  const {
    myEmployment,
    loading: employmentLoading,
    message: employmentMessage,
    getMyEmployment,
    deleteMyEmployment,
  } = useEmployment();


  const {
    myNextOfKin,
    loading: nextOfKinLoading,
    message: nextOfKinMessage,
    getMyNextOfKin,
    deleteMyNextOfKin,
  } = useNextOfKin();


  const {
    myDependants,
    loading: dependantLoading,
    message: dependantMessage,
    getMyDependants,
    deleteMyDependant,
  } = useDependants();


  const [
    pageLoading,
    setPageLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  // ============================================================
  // LOAD PROFILE
  // ============================================================

  useEffect(() => {

    if (!user?.id) {

      setError(
        "Authenticated user could not be identified."
      );

      setPageLoading(false);

      return;
    }


    const loadProfile =
      async () => {

        setPageLoading(true);
        setError("");


        try {

          const member =
            await fetchMemberByUserId(
              user.id
            );


          if (!member) {

            setError(
              "Your member profile could not be found."
            );

            return;
          }


          await Promise.all([
            getMyEmployment(),
            getMyNextOfKin(),
            getMyDependants(),
          ]);

        } catch {

          setError(
            "Failed to load your profile."
          );

        } finally {

          setPageLoading(false);
        }
      };


    void loadProfile();

  }, [
    user?.id,
    fetchMemberByUserId,
    getMyEmployment,
    getMyNextOfKin,
    getMyDependants,
  ]);


  // ============================================================
  // PROFILE
  // ============================================================

  const handleEditProfile = () => {

    navigate(
      "/profile/edit"
    );
  };


  // ============================================================
  // EMPLOYMENT
  // ============================================================

  const handleAddEmployment = () => {

    navigate(
      "/profile/employment/create"
    );
  };


  const handleEditEmployment = () => {

    if (!myEmployment) {
      return;
    }

    navigate(
      "/profile/employment/edit"
    );
  };


  const handleDeleteEmployment =
    async () => {

      if (!myEmployment) {
        return;
      }


      const confirmed =
        window.confirm(
          "Are you sure you want to remove your employment information?"
        );


      if (!confirmed) {
        return;
      }


      await deleteMyEmployment();
    };


  // ============================================================
  // NEXT OF KIN
  // ============================================================

  const handleAddNextOfKin = () => {

    navigate(
      "/profile/next-of-kin/create"
    );
  };


  const handleEditNextOfKin = () => {

    if (!myNextOfKin) {
      return;
    }

    navigate(
      "/profile/next-of-kin/edit"
    );
  };


  const handleDeleteNextOfKin =
    async () => {

      if (!myNextOfKin) {
        return;
      }


      const confirmed =
        window.confirm(
          "Are you sure you want to remove your next of kin?"
        );


      if (!confirmed) {
        return;
      }


      await deleteMyNextOfKin(
        myNextOfKin.id
      );
    };


  // ============================================================
  // DEPENDANTS
  // ============================================================

  const handleAddDependant = () => {

    navigate(
      "/profile/dependants/create"
    );
  };


  const handleEditDependant = (
    dependant: Dependant
  ) => {

    navigate(
      `/profile/dependants/edit/${dependant.id}`
    );
  };


  const handleDeleteDependant =
    async (
      dependant: Dependant
    ) => {

      const confirmed =
        window.confirm(
          `Are you sure you want to delete ${dependant.fullName}?`
        );


      if (!confirmed) {
        return;
      }


      await deleteMyDependant(
        dependant.id
      );
    };


  // ============================================================
  // LOADING
  // ============================================================

  const loading =
    pageLoading ||
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
          Loading your profile...
        </div>

      </div>
    );
  }


  // ============================================================
  // NOT FOUND
  // ============================================================

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

        <div className="text-center">

          <h2
            className="
              text-lg
              font-semibold
              text-gray-800
              dark:text-white
            "
          >
            Profile Not Found
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
              "Your member profile could not be found."}
          </p>

        </div>

      </div>
    );
  }


  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="space-y-6">

      {/* PAGE HEADER */}

      <div>

        <h1
          className="
            text-2xl
            font-semibold
            text-gray-800
            dark:text-white
          "
        >
          My Profile
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-gray-500
            dark:text-gray-400
          "
        >
          View and manage your membership information.
        </p>

      </div>


      {/* MEMBER OVERVIEW */}

      <MemberOverview
        member={selectedMember}
        onEdit={handleEditProfile}
      />


      {/* PERSONAL INFORMATION */}

      <MemberPersonalInfo
        profile={selectedMember.profile}
        onEdit={handleEditProfile}
      />


      {/* EMPLOYMENT */}

      <MemberEmploymentCard
        employment={myEmployment}
        onAdd={handleAddEmployment}
        onEdit={handleEditEmployment}
        onDelete={
          myEmployment
            ? handleDeleteEmployment
            : undefined
        }
      />


      {/* NEXT OF KIN */}

      <MemberNextOfKinCard
        nextOfKin={myNextOfKin}
        onAdd={handleAddNextOfKin}
        onEdit={handleEditNextOfKin}
        onDelete={
          myNextOfKin
            ? handleDeleteNextOfKin
            : undefined
        }
      />


      {/* DEPENDANTS */}

      <MemberDependantsCard
        dependants={myDependants}
        onAdd={handleAddDependant}
        onEdit={handleEditDependant}
        onDelete={handleDeleteDependant}
      />

    </div>
  );
};


export default MyProfile;