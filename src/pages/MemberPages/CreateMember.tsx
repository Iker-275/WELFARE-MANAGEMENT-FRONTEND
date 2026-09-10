import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router";

import MemberForm from "../../components/customforms/member/MemberForm";

import {
  useMember,
} from "../../hooks/useMember";

import type {
  CreateMemberDto,
} from "../../types/MemberType";


const CreateMember = () => {

  const navigate =
    useNavigate();

  const {
    createMember,
    loading,
    message,
    clearMessage,
  } = useMember();

  const [
    error,
    setError,
  ] = useState("");


//   const handleSubmit = async (
//     payload: CreateMemberDto
//   ) => {

//     setError("");
//     clearMessage();

//     const success =
//       await createMember(payload);

//     if (!success) {

//       setError(
//         message ||
//         "Failed to create member."
//       );

//       return;
//     }

//     navigate(
//       "/members"
//     );
//   };

const handleSubmit = async (
  payload: CreateMemberDto
): Promise<boolean> => {

  setError("");
  clearMessage();

  const success =
    await createMember(payload);

  if (!success) {
    return false;
  }

  navigate("/members");

  return true;
};

  const handleCancel = () => {

    navigate(
      "/members"
    );
  };


  return (
    <div
      className="
        space-y-6
      "
    >

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
          Create Member
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-gray-500
            dark:text-gray-400
          "
        >
          Create a new welfare member and assign their membership region.
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


      {/* Form */}

      <MemberForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />

    </div>
  );
};


export default CreateMember;