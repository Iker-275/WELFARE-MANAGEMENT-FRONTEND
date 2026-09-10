import {
  useNavigate,
  useParams,
} from "react-router-dom";

import EmploymentForm from "../../components/customforms/member/EmploymentForm";
import { useEmployment } from "../../hooks/useEmployment";

import {
  CreateEmploymentPayload,
} from "../../types/EmploymentType";

const CreateEmployment = () => {
  const navigate = useNavigate();
  const { memberId } = useParams<{
    memberId: string;
  }>();

  const {
    createMemberEmployment,
    loading,
    message,
    clearMessage,
  } = useEmployment();

  const handleSubmit = async (
    payload: CreateEmploymentPayload
  ): Promise<boolean> => {
    if (!memberId) {
      return false;
    }

    clearMessage();

    const success = await createMemberEmployment(
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
          Add Employment
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Add employment information for this member.
        </p>
      </div>

      {message && (
        <div className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-600">
          {message}
        </div>
      )}

      <EmploymentForm
        onSubmit={handleSubmit}
        // onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
};

export default CreateEmployment;