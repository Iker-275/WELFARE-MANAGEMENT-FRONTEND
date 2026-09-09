import {
  createContext,
  ReactNode,
  useCallback,
  useState,
} from "react";

import dependantService from "../api/DependantApi";

import {
  CreateDependantPayload,
  Dependant,
  UpdateDependantPayload,
} from "../types/DependantType";

import { getApiError } from "../utils/apiError";

interface DependantContextType {

  /**
   * Dependants belonging to the
   * currently authenticated member.
   */
  myDependants: Dependant[];

  /**
   * Dependants currently selected for
   * an admin/member-management view.
   */
  memberDependants: Dependant[];

  /**
   * Currently selected dependant.
   */
  selectedDependant: Dependant | null;

  loading: boolean;

  message: string;


  // =========================================================
  // SELF SERVICE
  // =========================================================

  getMyDependants: () => Promise<boolean>;

  createMyDependant: (
    payload: CreateDependantPayload
  ) => Promise<boolean>;

  updateMyDependant: (
    dependantId: string,
    payload: UpdateDependantPayload
  ) => Promise<boolean>;

  deleteMyDependant: (
    dependantId: string
  ) => Promise<boolean>;


  // =========================================================
  // ADMIN
  // =========================================================

  getMemberDependants: (
    memberId: string
  ) => Promise<boolean>;

  getDependant: (
    dependantId: string
  ) => Promise<Dependant | null>;

  createMemberDependant: (
    memberId: string,
    payload: CreateDependantPayload
  ) => Promise<boolean>;

  updateDependant: (
    dependantId: string,
    payload: UpdateDependantPayload
  ) => Promise<boolean>;

  deleteDependant: (
    dependantId: string
  ) => Promise<boolean>;


  // =========================================================
  // HELPERS
  // =========================================================

  clearMessage: () => void;

  clearSelectedDependant: () => void;

  setMessage: React.Dispatch<
    React.SetStateAction<string>
  >;
}

export const DependantContext =
  createContext<
    DependantContextType | undefined
  >(undefined);

interface DependantProviderProps {
  children: ReactNode;
}

export const DependantProvider = ({
  children,
}: DependantProviderProps) => {

  const [myDependants, setMyDependants] =
    useState<Dependant[]>([]);

  const [memberDependants, setMemberDependants] =
    useState<Dependant[]>([]);

  const [selectedDependant, setSelectedDependant] =
    useState<Dependant | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");


  // =========================================================
  // SELF SERVICE
  // =========================================================

  /**
   * Get my dependants.
   */
  const getMyDependants = useCallback(
    async (): Promise<boolean> => {

      setLoading(true);
      setMessage("");

      try {

        const response =
          await dependantService.getMyDependants();

        if (!response.success) {

          setMessage(
            response.message ||
              "Failed to retrieve your dependants."
          );

          return false;
        }

        setMyDependants(
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
   * Create my dependant.
   */
  const createMyDependant = useCallback(
    async (
      payload: CreateDependantPayload
    ): Promise<boolean> => {

      setLoading(true);
      setMessage("");

      try {

        const response =
          await dependantService.createMyDependant(
            payload
          );

        if (!response.success) {

          setMessage(
            response.message ||
              "Failed to create dependant."
          );

          return false;
        }

        if (response.data) {

          setMyDependants(
            (current) => [
              ...current,
              response.data!,
            ]
          );
        }

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
   * Update my dependant.
   */
  const updateMyDependant = useCallback(
    async (
      dependantId: string,
      payload: UpdateDependantPayload
    ): Promise<boolean> => {

      setLoading(true);
      setMessage("");

      try {

        const response =
          await dependantService.updateMyDependant(
            dependantId,
            payload
          );

        if (!response.success) {

          setMessage(
            response.message ||
              "Failed to update dependant."
          );

          return false;
        }

        if (response.data) {

          setMyDependants(
            (current) =>
              current.map(
                (dependant) =>
                  dependant.id === dependantId
                    ? response.data!
                    : dependant
              )
          );
        }

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
   * Delete my dependant.
   */
  const deleteMyDependant = useCallback(
    async (
      dependantId: string
    ): Promise<boolean> => {

      setLoading(true);
      setMessage("");

      try {

        const response =
          await dependantService.deleteMyDependant(
            dependantId
          );

        if (!response.success) {

          setMessage(
            response.message ||
              "Failed to delete dependant."
          );

          return false;
        }

        setMyDependants(
          (current) =>
            current.filter(
              (dependant) =>
                dependant.id !== dependantId
            )
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


  // =========================================================
  // ADMIN
  // =========================================================

  /**
   * Get all dependants for a member.
   */
  const getMemberDependants = useCallback(
    async (
      memberId: string
    ): Promise<boolean> => {

      setLoading(true);
      setMessage("");

      try {

        const response =
          await dependantService.getMemberDependants(
            memberId
          );

        if (!response.success) {

          setMessage(
            response.message ||
              "Failed to retrieve member dependants."
          );

          return false;
        }

        setMemberDependants(
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
   * Get a specific dependant.
   */
  const getDependant = useCallback(
    async (
      dependantId: string
    ): Promise<Dependant | null> => {

      setLoading(true);
      setMessage("");

      try {

        const response =
          await dependantService.getDependant(
            dependantId
          );

        if (!response.success) {

          setMessage(
            response.message ||
              "Failed to retrieve dependant."
          );

          return null;
        }

        setSelectedDependant(
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
   * Create dependant for a member.
   */
  const createMemberDependant = useCallback(
    async (
      memberId: string,
      payload: CreateDependantPayload
    ): Promise<boolean> => {

      setLoading(true);
      setMessage("");

      try {

        const response =
          await dependantService.createMemberDependant(
            memberId,
            payload
          );

        if (!response.success) {

          setMessage(
            response.message ||
              "Failed to create dependant."
          );

          return false;
        }

        if (response.data) {

          setMemberDependants(
            (current) => [
              ...current,
              response.data!,
            ]
          );
        }

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
   * Update dependant from admin side.
   */
  const updateDependant = useCallback(
    async (
      dependantId: string,
      payload: UpdateDependantPayload
    ): Promise<boolean> => {

      setLoading(true);
      setMessage("");

      try {

        const response =
          await dependantService.updateDependant(
            dependantId,
            payload
          );

        if (!response.success) {

          setMessage(
            response.message ||
              "Failed to update dependant."
          );

          return false;
        }

        if (response.data) {

          setMemberDependants(
            (current) =>
              current.map(
                (dependant) =>
                  dependant.id === dependantId
                    ? response.data!
                    : dependant
              )
          );

          setSelectedDependant(
            response.data
          );
        }

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
   * Delete dependant from admin side.
   */
  const deleteDependant = useCallback(
    async (
      dependantId: string
    ): Promise<boolean> => {

      setLoading(true);
      setMessage("");

      try {

        const response =
          await dependantService.deleteDependant(
            dependantId
          );

        if (!response.success) {

          setMessage(
            response.message ||
              "Failed to delete dependant."
          );

          return false;
        }

        setMemberDependants(
          (current) =>
            current.filter(
              (dependant) =>
                dependant.id !== dependantId
            )
        );

        setSelectedDependant(null);

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

  const clearSelectedDependant =
    useCallback(() => {

      setSelectedDependant(null);

    }, []);


  return (
    <DependantContext.Provider
      value={{
        myDependants,
        memberDependants,
        selectedDependant,

        loading,
        message,

        getMyDependants,
        createMyDependant,
        updateMyDependant,
        deleteMyDependant,

        getMemberDependants,
        getDependant,
        createMemberDependant,
        updateDependant,
        deleteDependant,

        clearMessage,
        clearSelectedDependant,

        setMessage,
      }}
    >
      {children}
    </DependantContext.Provider>
  );
};

export default DependantProvider;