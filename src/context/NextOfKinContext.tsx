import {
  createContext,
  ReactNode,
  useCallback,
  useState,
} from "react";

import nextOfKinService from "../api/NextOfKinApi";

import {
  CreateNextOfKinPayload,
  NextOfKin,
  UpdateNextOfKinPayload,
} from "../types/NextOfKinType";

import { getApiError } from "../utils/apiError";

interface NextOfKinContextType {

  /**
   * Currently authenticated user's NOK.
   */
  myNextOfKin: NextOfKin | null;

  /**
   * NOK currently selected in the admin interface.
   */
  selectedNextOfKin: NextOfKin | null;

  loading: boolean;

  message: string;

  // =========================================================
  // SELF SERVICE
  // =========================================================

  getMyNextOfKin: () => Promise<boolean>;

  createMyNextOfKin: (
    payload: CreateNextOfKinPayload
  ) => Promise<boolean>;

  updateMyNextOfKin: (
    payload: UpdateNextOfKinPayload
  ) => Promise<boolean>;

  deleteMyNextOfKin: (
    nextOfKinId: string
  ) => Promise<boolean>;

  // =========================================================
  // ADMIN
  // =========================================================

  getMemberNextOfKin: (
    memberId: string
  ) => Promise<NextOfKin | null>;

  getNextOfKin: (
    nextOfKinId: string
  ) => Promise<NextOfKin | null>;

  createMemberNextOfKin: (
    memberId: string,
    payload: CreateNextOfKinPayload
  ) => Promise<boolean>;

  updateMemberNextOfKin: (
    memberId: string,
    payload: UpdateNextOfKinPayload
  ) => Promise<boolean>;

  deleteNextOfKin: (
    nextOfKinId: string
  ) => Promise<boolean>;

  clearMessage: () => void;

  clearSelectedNextOfKin: () => void;

  setMessage: React.Dispatch<
    React.SetStateAction<string>
  >;
}

export const NextOfKinContext =
  createContext<
    NextOfKinContextType | undefined
  >(undefined);

interface NextOfKinProviderProps {
  children: ReactNode;
}

export const NextOfKinProvider = ({
  children,
}: NextOfKinProviderProps) => {

  const [myNextOfKin, setMyNextOfKin] =
    useState<NextOfKin | null>(null);

  const [selectedNextOfKin, setSelectedNextOfKin] =
    useState<NextOfKin | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  // =========================================================
  // SELF SERVICE
  // =========================================================

  /**
   * Get my Next of Kin.
   */
  const getMyNextOfKin = useCallback(
    async (): Promise<boolean> => {

      setLoading(true);
      setMessage("");

      try {

        const response =
          await nextOfKinService.getMyNextOfKin();

        if (!response.success) {

          setMessage(
            response.message ||
              "Failed to retrieve your Next of Kin."
          );

          return false;
        }

        setMyNextOfKin(
          response.data
        );

        setMessage(
          response.message
        );

        return true;

      } catch (error) {

        setMessage(
          getApiError(error).message
        );

        return false;

      } finally {

        setLoading(false);
      }
    },
    []
  );

  /**
   * Create my Next of Kin.
   */
  const createMyNextOfKin = useCallback(
    async (
      payload: CreateNextOfKinPayload
    ): Promise<boolean> => {

      setLoading(true);
      setMessage("");

      try {

        const response =
          await nextOfKinService.createMyNextOfKin(
            payload
          );

        if (!response.success) {

          setMessage(
            response.message ||
              "Failed to create your Next of Kin."
          );

          return false;
        }

        setMyNextOfKin(
          response.data
        );

        setMessage(
          response.message
        );

        return true;

      } catch (error) {

        setMessage(
          getApiError(error).message
        );

        return false;

      } finally {

        setLoading(false);
      }
    },
    []
  );

  /**
   * Update my Next of Kin.
   */
  const updateMyNextOfKin = useCallback(
    async (
      payload: UpdateNextOfKinPayload
    ): Promise<boolean> => {

      setLoading(true);
      setMessage("");

      try {

        const response =
          await nextOfKinService.updateMyNextOfKin(
            payload
          );

        if (!response.success) {

          setMessage(
            response.message ||
              "Failed to update your Next of Kin."
          );

          return false;
        }

        setMyNextOfKin(
          response.data
        );

        setMessage(
          response.message
        );

        return true;

      } catch (error) {

        setMessage(
          getApiError(error).message
        );

        return false;

      } finally {

        setLoading(false);
      }
    },
    []
  );

  /**
   * Delete my Next of Kin.
   */
  const deleteMyNextOfKin = useCallback(
    async (
      nextOfKinId: string
    ): Promise<boolean> => {

      setLoading(true);
      setMessage("");

      try {

        const response =
          await nextOfKinService.deleteMyNextOfKin(
            nextOfKinId
          );

        if (!response.success) {

          setMessage(
            response.message ||
              "Failed to delete your Next of Kin."
          );

          return false;
        }

        setMyNextOfKin(null);

        setMessage(
          response.message
        );

        return true;

      } catch (error) {

        setMessage(
          getApiError(error).message
        );

        return false;

      } finally {

        setLoading(false);
      }
    },
    []
  );

  // =========================================================
  // ADMIN
  // =========================================================

  /**
   * Get NOK belonging to a member.
   */
  const getMemberNextOfKin = useCallback(
    async (
      memberId: string
    ): Promise<NextOfKin | null> => {

      setLoading(true);
      setMessage("");

      try {

        const response =
          await nextOfKinService.getMemberNextOfKin(
            memberId
          );

        if (!response.success) {

          setMessage(
            response.message ||
              "Failed to retrieve Next of Kin."
          );

          return null;
        }

        setSelectedNextOfKin(
          response.data
        );

        setMessage(
          response.message
        );

        return response.data;

      } catch (error) {

        setMessage(
          getApiError(error).message
        );

        return null;

      } finally {

        setLoading(false);
      }
    },
    []
  );

  /**
   * Get a specific NOK.
   */
  const getNextOfKin = useCallback(
    async (
      nextOfKinId: string
    ): Promise<NextOfKin | null> => {

      setLoading(true);
      setMessage("");

      try {

        const response =
          await nextOfKinService.getNextOfKin(
            nextOfKinId
          );

        if (!response.success) {

          setMessage(
            response.message ||
              "Failed to retrieve Next of Kin."
          );

          return null;
        }

        setSelectedNextOfKin(
          response.data
        );

        setMessage(
          response.message
        );

        return response.data;

      } catch (error) {

        setMessage(
          getApiError(error).message
        );

        return null;

      } finally {

        setLoading(false);
      }
    },
    []
  );

  /**
   * Create NOK for a member.
   */
  const createMemberNextOfKin = useCallback(
    async (
      memberId: string,
      payload: CreateNextOfKinPayload
    ): Promise<boolean> => {

      setLoading(true);
      setMessage("");

      try {

        const response =
          await nextOfKinService.createMemberNextOfKin(
            memberId,
            payload
          );

        if (!response.success) {

          setMessage(
            response.message ||
              "Failed to create Next of Kin."
          );

          return false;
        }

        setSelectedNextOfKin(
          response.data
        );

        setMessage(
          response.message
        );

        return true;

      } catch (error) {

        setMessage(
          getApiError(error).message
        );

        return false;

      } finally {

        setLoading(false);
      }
    },
    []
  );

  /**
   * Update NOK for a member.
   */
  const updateMemberNextOfKin = useCallback(
    async (
      memberId: string,
      payload: UpdateNextOfKinPayload
    ): Promise<boolean> => {

      setLoading(true);
      setMessage("");

      try {

        const response =
          await nextOfKinService.updateMemberNextOfKin(
            memberId,
            payload
          );

        if (!response.success) {

          setMessage(
            response.message ||
              "Failed to update Next of Kin."
          );

          return false;
        }

        setSelectedNextOfKin(
          response.data
        );

        setMessage(
          response.message
        );

        return true;

      } catch (error) {

        setMessage(
          getApiError(error).message
        );

        return false;

      } finally {

        setLoading(false);
      }
    },
    []
  );

  /**
   * Delete NOK from admin side.
   */
  const deleteNextOfKin = useCallback(
    async (
      nextOfKinId: string
    ): Promise<boolean> => {

      setLoading(true);
      setMessage("");

      try {

        const response =
          await nextOfKinService.deleteNextOfKin(
            nextOfKinId
          );

        if (!response.success) {

          setMessage(
            response.message ||
              "Failed to delete Next of Kin."
          );

          return false;
        }

        setSelectedNextOfKin(null);

        setMessage(
          response.message
        );

        return true;

      } catch (error) {

        setMessage(
          getApiError(error).message
        );

        return false;

      } finally {

        setLoading(false);
      }
    },
    []
  );

  // =========================================================
  // HELPERS
  // =========================================================

  const clearMessage = useCallback(() => {

    setMessage("");

  }, []);

  const clearSelectedNextOfKin =
    useCallback(() => {

      setSelectedNextOfKin(null);

    }, []);

  return (
    <NextOfKinContext.Provider
      value={{
        myNextOfKin,
        selectedNextOfKin,

        loading,
        message,

        getMyNextOfKin,
        createMyNextOfKin,
        updateMyNextOfKin,
        deleteMyNextOfKin,

        getMemberNextOfKin,
        getNextOfKin,
        createMemberNextOfKin,
        updateMemberNextOfKin,
        deleteNextOfKin,

        clearMessage,
        clearSelectedNextOfKin,

        setMessage,
      }}
    >
      {children}
    </NextOfKinContext.Provider>
  );
};

export default NextOfKinProvider;