import {
  useEffect,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import NextOfKinForm from "../../components/customforms/member/NextOfKinForm";

import {
  useNextOfKin,
} from "../../hooks/useNextOfKin";

import {
  UpdateNextOfKinPayload,
} from "../../types/NextOfKinType";


const UpdateMyNextOfKin = () => {

  const navigate =
    useNavigate();


  const {
    myNextOfKin,
    loading,
    message,
    getMyNextOfKin,
    updateMyNextOfKin,
    clearMessage,
  } = useNextOfKin();


  // ============================================================
  // LOAD NEXT OF KIN
  // ============================================================

  useEffect(() => {

    void getMyNextOfKin();

  }, [
    getMyNextOfKin,
  ]);


  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (
    payload: UpdateNextOfKinPayload
  ): Promise<boolean> => {

    clearMessage();


    const success =
      await updateMyNextOfKin(
        payload
      );


    if (success) {

      navigate(
        "/profile"
      );
    }


    return success;
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

  if (
    loading &&
    !myNextOfKin
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

  if (!myNextOfKin) {

    return (
      <div className="rounded-xl border border-error-200 bg-error-50 p-6 text-error-600">

        {message ||
          "Next of kin information was not found."}

      </div>
    );
  }


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


        <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Update Next of Kin
        </h1>


        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Update your next of kin information.
        </p>

      </div>


      {message && (
        <div className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-600">
          {message}
        </div>
      )}


      <NextOfKinForm
        initialData={myNextOfKin}
        onSubmit={handleSubmit}
        loading={loading}
      />

    </div>
  );
};


export default UpdateMyNextOfKin;