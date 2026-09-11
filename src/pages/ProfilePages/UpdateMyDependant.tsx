import {
  useEffect,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import DependantForm from "../../components/customforms/member/DependantForm";

import {
  useDependants,
} from "../../hooks/useDependants";

import {
  UpdateDependantPayload,
} from "../../types/DependantType";


const UpdateMyDependant = () => {

  const navigate =
    useNavigate();


  const {
    dependantId,
  } = useParams<{
    dependantId: string;
  }>();


  const {
    myDependants,
    selectedDependant,
    loading,
    message,
    getMyDependants,
    getDependant,
    updateDependant,
    clearMessage,
  } = useDependants();


  // ============================================================
  // LOAD DEPENDANTS
  // ============================================================

  useEffect(() => {

    void getMyDependants();

  }, [
    getMyDependants,
  ]);


  // ============================================================
  // LOAD DEPENDANT
  // ============================================================

  useEffect(() => {

    if (!dependantId) {
      return;
    }


    void getDependant(
      dependantId
    );

  }, [
    dependantId,
    getDependant,
  ]);


  const dependant =
    selectedDependant ??
    myDependants.find(
      (item) =>
        item.id === dependantId
    ) ??
    null;


  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (
    payload: UpdateDependantPayload
  ): Promise<boolean> => {

    if (!dependantId) {
      return false;
    }


    clearMessage();


    const success =
      await updateDependant(
        dependantId,
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
  // ROUTE VALIDATION
  // ============================================================

  if (!dependantId) {

    return (
      <div className="rounded-xl border border-error-200 bg-error-50 p-6 text-error-600">

        Dependant ID is required.

      </div>
    );
  }


  // ============================================================
  // LOADING
  // ============================================================

  if (
    loading &&
    !dependant
  ) {

    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading dependant information...
        </p>

      </div>
    );
  }


  // ============================================================
  // NOT FOUND
  // ============================================================

  if (!dependant) {

    return (
      <div className="rounded-xl border border-error-200 bg-error-50 p-6 text-error-600">

        {message ||
          "Dependant information was not found."}

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
          Update Dependant
        </h1>


        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Update dependant information.
        </p>

      </div>


      {message && (
        <div className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-600">
          {message}
        </div>
      )}


      <DependantForm
        initialData={dependant}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />

    </div>
  );
};


export default UpdateMyDependant;