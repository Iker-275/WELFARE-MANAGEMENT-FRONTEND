
import {
  useEffect,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import NextOfKinForm from "../../components/customforms/member/NextOfKinForm";

import {
  useNextOfKin,
} from "../../hooks/useNextOfKin";

import {
  UpdateNextOfKinPayload,
} from "../../types/NextOfKinType";


const UpdateNextOfKin = () => {

  const navigate = useNavigate();

  const {
    memberId,
    nextOfKinId,
  } = useParams<{
    memberId: string;
    nextOfKinId: string;
  }>();


  const {
    selectedNextOfKin,
    loading,
    message,
    getMemberNextOfKin,
    updateMemberNextOfKin,
    clearMessage,
  } = useNextOfKin();


  // ============================================================
  // LOAD MEMBER NEXT OF KIN
  // ============================================================

  useEffect(() => {

    if (!memberId) {
      return;
    }

    void getMemberNextOfKin(
      memberId
    );

  }, [
    memberId,
    getMemberNextOfKin,
  ]);


  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (
    payload: UpdateNextOfKinPayload
  ): Promise<boolean> => {

    if (!memberId) {
      return false;
    }

    clearMessage();

    const success =
      await updateMemberNextOfKin(
        memberId,
        payload
      );

    if (success) {
      navigate(
        `/members/${memberId}`
      );
    }

    return success;
  };


  // ============================================================
  // CANCEL
  // ============================================================

  const handleCancel = () => {

    if (memberId) {

      navigate(
        `/members/${memberId}`
      );

      return;
    }

    navigate("/members");
  };


  // ============================================================
  // VALIDATE ROUTE PARAMETERS
  // ============================================================

  if (!memberId || !nextOfKinId) {

    return (
      <div className="rounded-xl border border-error-200 bg-error-50 p-6 text-error-600">
        Member and next of kin IDs are required.
      </div>
    );
  }


  // ============================================================
  // LOADING
  // ============================================================

  if (
    loading &&
    !selectedNextOfKin
  ) {

    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading next of kin information...
        </p>
      </div>
    );
  }


  // ============================================================
  // NOT FOUND
  // ============================================================

  if (!selectedNextOfKin) {

    return (
      <div className="rounded-xl border border-error-200 bg-error-50 p-6 text-error-600">
        {message ||
          "Next of kin information was not found."}
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

        <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Update Next of Kin
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Update next of kin information for this member.
        </p>

      </div>


      {/* MESSAGE */}

      {message && (
        <div className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-600">
          {message}
        </div>
      )}


      {/* FORM */}

      <NextOfKinForm
        initialData={selectedNextOfKin}
        onSubmit={handleSubmit}
        loading={loading}
      />

    </div>
  );
};


export default UpdateNextOfKin;