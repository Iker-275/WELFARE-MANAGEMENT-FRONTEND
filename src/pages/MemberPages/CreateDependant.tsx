import {
  useNavigate,
  useParams,
} from "react-router-dom";

import DependantForm from "../../components/customforms/member/DependantForm";
import { useDependants } from "../../hooks/useDependants";

import {
  CreateDependantPayload,
} from "../../types/DependantType";

const CreateDependant = () => {
  const navigate = useNavigate();

  const { memberId } = useParams<{
    memberId: string;
  }>();

  const {
    createMemberDependant,
    loading,
    message,
    clearMessage,
  } = useDependants();

  const handleSubmit = async (
    payload: CreateDependantPayload
  ): Promise<boolean> => {
    if (!memberId) {
      return false;
    }

    clearMessage();

    const success =
      await createMemberDependant(
        memberId,
        payload
      );

    if (success) {
      navigate(`/members/${memberId}`);
    }

    return success;
  };

  const handleCancel = () => {
    if (memberId) {
      navigate(`/members/${memberId}`);
      return;
    }

    navigate("/members");
  };

  if (!memberId) {
    return (
      <div className="rounded-xl border border-error-200 bg-error-50 p-6 text-error-600">
        Member ID is required.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Add Dependant
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Add dependant information for this member.
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

export default CreateDependant;