import {
  useNavigate,
} from "react-router-dom";

import NextOfKinForm from "../../components/customforms/member/NextOfKinForm";

import {
  useNextOfKin,
} from "../../hooks/useNextOfKin";

import {
  CreateNextOfKinPayload,
} from "../../types/NextOfKinType";


const CreateMyNextOfKin = () => {

  const navigate =
    useNavigate();


  const {
    createMyNextOfKin,
    loading,
    message,
    clearMessage,
  } = useNextOfKin();


  const handleSubmit = async (
    payload: CreateNextOfKinPayload
  ): Promise<boolean> => {

    clearMessage();


    const success =
      await createMyNextOfKin(
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
          Add Next of Kin
        </h1>


        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Add your next of kin information.
        </p>

      </div>


      {message && (
        <div className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-600">
          {message}
        </div>
      )}


      <NextOfKinForm
        onSubmit={handleSubmit}
    
        loading={loading}
      />

    </div>
  );
};


export default CreateMyNextOfKin;