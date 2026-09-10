
import {
  useEffect,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import EmploymentForm from "../../components/customforms/member/EmploymentForm";
import { useEmployment } from "../../hooks/useEmployment";

import {
  UpdateEmploymentPayload,
} from "../../types/EmploymentType";

const UpdateEmployment = () => {
  const navigate = useNavigate();

  const {
    memberId,
    employmentId,
  } = useParams<{
    memberId: string;
    employmentId: string;
  }>();

  const {
    selectedEmployment,
    loading,
    message,
    getMemberEmployment,
    updateMemberEmployment,
    clearMessage,
  } = useEmployment();

  useEffect(() => {
    if (!memberId) {
      return;
    }

    void getMemberEmployment(memberId);
  }, [
    memberId,
    getMemberEmployment,
  ]);

  const handleSubmit = async (
    payload: UpdateEmploymentPayload
  ): Promise<boolean> => {
    if (!memberId) {
      return false;
    }

    clearMessage();

    const success =
      await updateMemberEmployment(
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

  if (!memberId || !employmentId) {
    return (
      <div className="rounded-xl border border-error-200 bg-error-50 p-6 text-error-600">
        Member and employment IDs are required.
      </div>
    );
  }

  if (loading && !selectedEmployment) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading employment information...
        </p>
      </div>
    );
  }

  if (!selectedEmployment) {
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
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Update Employment
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Update employment information for this member.
        </p>
      </div>

      {message && (
        <div className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-600">
          {message}
        </div>
      )}

      <EmploymentForm
        initialData={selectedEmployment}
        onSubmit={handleSubmit}
        
        loading={loading}
      />
    </div>
  );
};

export default UpdateEmployment;