import {
  useEffect,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import EmploymentForm from "../../components/customforms/member/EmploymentForm";

import {
  useEmployment,
} from "../../hooks/useEmployment";

import {
  UpdateEmploymentPayload,
} from "../../types/EmploymentType";


const UpdateMyEmployment = () => {

  const navigate =
    useNavigate();


  const {
    myEmployment,
    loading,
    message,
    getMyEmployment,
    updateMyEmployment,
    clearMessage,
  } = useEmployment();


  // ============================================================
  // LOAD EMPLOYMENT
  // ============================================================

  useEffect(() => {

    void getMyEmployment();

  }, [
    getMyEmployment,
  ]);


  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (
    payload: UpdateEmploymentPayload
  ): Promise<boolean> => {

    clearMessage();


    const success =
      await updateMyEmployment(
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
    !myEmployment
  ) {

    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading employment information...
        </p>

      </div>
    );
  }


  // ============================================================
  // NOT FOUND
  // ============================================================

  if (!myEmployment) {

    return (
      <div className="rounded-xl border border-error-200 bg-error-50 p-6 text-error-600">

        {message ||
          "Employment information was not found."}

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
          Update Employment
        </h1>


        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Update your employment information.
        </p>

      </div>


      {message && (
        <div className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-600">
          {message}
        </div>
      )}


      <EmploymentForm
        initialData={myEmployment}
        onSubmit={handleSubmit}
    
        loading={loading}
      />

    </div>
  );
};


export default UpdateMyEmployment;