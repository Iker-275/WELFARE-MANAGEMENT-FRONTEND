import {
  useEffect,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import DependantForm from "../../components/customforms/member/DependantForm";
import { useDependants } from "../../hooks/useDependants";

import {
  UpdateDependantPayload,
} from "../../types/DependantType";

const UpdateDependant = () => {
  const navigate = useNavigate();

  const {
    memberId,
    dependantId,
  } = useParams<{
    memberId: string;
    dependantId: string;
  }>();

  const {
    memberDependants,
    selectedDependant,
    loading,
    message,
    getMemberDependants,
    getDependant,
    updateDependant,
    clearMessage,
  } = useDependants();

  useEffect(() => {
    if (!memberId) {
      return;
    }

    void getMemberDependants(memberId);
  }, [
    memberId,
    getMemberDependants,
  ]);

  useEffect(() => {
    if (!dependantId) {
      return;
    }

    void getDependant(dependantId);
  }, [
    dependantId,
    getDependant,
  ]);

  const dependant =
    selectedDependant ??
    memberDependants.find(
      (item) => item.id === dependantId
    ) ??
    null;

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

    if (success && memberId) {
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

  if (!memberId || !dependantId) {
    return (
      <div className="rounded-xl border border-error-200 bg-error-50 p-6 text-error-600">
        Member and dependant IDs are required.
      </div>
    );
  }

  if (loading && !dependant) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading dependant information...
        </p>
      </div>
    );
  }

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
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Update Dependant
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Update dependant information for this member.
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

export default UpdateDependant;