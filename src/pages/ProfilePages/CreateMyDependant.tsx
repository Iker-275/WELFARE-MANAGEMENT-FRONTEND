import {
  useNavigate,
} from "react-router-dom";

import DependantForm from "../../components/customforms/member/DependantForm";

import {
  useDependants,
} from "../../hooks/useDependants";

import {
  CreateDependantPayload,
} from "../../types/DependantType";


const CreateMyDependant = () => {

  const navigate =
    useNavigate();


  const {
    createMyDependant,
    loading,
    message,
    clearMessage,
  } = useDependants();


  const handleSubmit = async (
    payload: CreateDependantPayload
  ): Promise<boolean> => {

    clearMessage();


    const success =
      await createMyDependant(
        payload
      );


    if (success) {

      navigate(
        "/profile"
      );
    }


    return success;
  };


  const handleCancel = () => {

    navigate(
      "/profile"
    );
  };


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
          Add Dependant
        </h1>


        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Add dependant information.
        </p>

      </div>


      {message && (
        <div className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-600">
          {message}
        </div>
      )}


      <DependantForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />

    </div>
  );
};


export default CreateMyDependant;