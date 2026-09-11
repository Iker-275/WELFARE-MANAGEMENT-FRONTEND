import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import MemberProfileForm from "../../components/customforms/member/MemberProfileForm";

import {
  useAuth,
} from "../../hooks/useAuth";

import {
  useMember,
} from "../../hooks/useMember";

import type {
  UpdateMemberProfileDto,
} from "../../types/MemberType";


const UpdateMyProfile = () => {

  const navigate =
    useNavigate();


  const {
    user,
  } = useAuth();


  const {
    selectedMember,
    loading,
    message,
    fetchMemberByUserId,
    updateMemberProfile,
    clearMessage,
  } = useMember();


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


    const loadMember =
      async () => {

        setPageLoading(true);
        setError("");


        const member =
          await fetchMemberByUserId(
            user.id
          );


        if (!member) {

          setError(
            "Your member profile could not be found."
          );
        }


        setPageLoading(false);
      };


    void loadMember();

  }, [
    user?.id,
    fetchMemberByUserId,
  ]);


  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (
    payload: UpdateMemberProfileDto
  ): Promise<boolean> => {

    if (!selectedMember) {

      setError(
        "Your member profile could not be found."
      );

      return false;
    }


    setError("");
    clearMessage();


    const success =
      await updateMemberProfile(
        selectedMember.id,
        payload
      );


    if (!success) {

      setError(
        message ||
          "Failed to update your profile."
      );

      return false;
    }


    navigate(
      "/profile"
    );


    return true;
  };


  // ============================================================
  // CANCEL
  // ============================================================

  const handleCancel = () => {

    navigate(
      "/profile"
    );
  };


  // ============================================================
  // LOADING
  // ============================================================

  if (pageLoading) {

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
            {error ||
              message ||
              "Your member profile could not be found."}
          </p>


          <button
            type="button"
            onClick={() =>
              navigate("/profile")
            }
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
            Back to Profile
          </button>

        </div>

      </div>
    );
  }


  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="space-y-6">

      <div>

        <button
          type="button"
          onClick={handleCancel}
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
          ← Back to Profile
        </button>


        <h1
          className="
            text-2xl
            font-semibold
            text-gray-800
            dark:text-white
          "
        >
          Update My Profile
        </h1>


        <p
          className="
            mt-1
            text-sm
            text-gray-500
            dark:text-gray-400
          "
        >
          Update your region and personal information.
        </p>

      </div>


      {error && (
        <div
          className="
            rounded-lg
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-700
            dark:border-red-900/40
            dark:bg-red-900/10
            dark:text-red-400
          "
        >
          {error}
        </div>
      )}


      <MemberProfileForm
        initialData={{
          regionId:
            selectedMember.regionId ??
            "",

          firstName:
            selectedMember.profile
              .firstName,

          lastName:
            selectedMember.profile
              .lastName,

          otherNames:
            selectedMember.profile
              .otherNames,

          gender:
            selectedMember.profile
              .gender,

          dateOfBirth:
            selectedMember.profile
              .dateOfBirth,

          nationalId:
            selectedMember.profile
              .nationalId,

          address:
            selectedMember.profile
              .address,

          profilePhotoId:
            selectedMember.profile
              .profilePhotoId,
        }}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />

    </div>
  );
};


export default UpdateMyProfile;