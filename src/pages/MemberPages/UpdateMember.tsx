
import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router";

import MemberProfileForm from "../../components/customforms/member/MemberProfileForm";

import {
  useMember,
} from "../../hooks/useMember";

import type {
  UpdateMemberProfileDto,
} from "../../types/MemberType";

const UpdateMember = () => {
  const {
    memberId,
  } = useParams<{
    memberId: string;
  }>();

  const navigate =
    useNavigate();

  const {
    selectedMember,
    loading,
    message,
    fetchMember,
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

  useEffect(() => {
    if (!memberId) {
      setError(
        "Member ID is required."
      );

      setPageLoading(false);

      return;
    }

    const loadMember =
      async () => {
        setPageLoading(true);
        setError("");

        const member =
          await fetchMember(
            memberId
          );

        if (!member) {
          setError(
            "Member could not be found."
          );
        }

        setPageLoading(false);
      };

    void loadMember();
  }, [
    memberId,
    fetchMember,
  ]);

  const handleSubmit = async (
    payload: UpdateMemberProfileDto
  ) => {
    if (!memberId) {
      setError(
        "Member ID is required."
      );

      return false;
    }
    

    setError("");
    clearMessage();

    const success =
      await updateMemberProfile(
        memberId,
        payload
      );

    if (!success) {
      setError(
        message ||
          "Failed to update member."
      );

      return;
    }

    navigate(
      `/members/${memberId}`
    );
  };

  const handleCancel = () => {
    if (!memberId) {
      navigate(
        "/members"
      );

      return;
    }

    navigate(
      `/members/${memberId}`
    );
  };

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
          Loading member...
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
        <div className="text-center">
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
            {error ||
              message ||
              "The requested member could not be found."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/members")
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
            Back to Members
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}

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
          Update Member
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-gray-500
            dark:text-gray-400
          "
        >
          Update the member's region and personal
          information.
        </p>
      </div>

      {/* Error */}

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

      {/* Profile Form */}

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

export default UpdateMember;