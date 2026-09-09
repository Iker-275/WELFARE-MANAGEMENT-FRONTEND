import {
  createContext,
  ReactNode,
  useState,
} from "react";

import employmentService from "../api/EmploymentApi";

import {
  CreateEmploymentPayload,
  Employment,
  UpdateEmploymentPayload,
} from "../types/EmploymentType";

import { getApiError } from "../utils/apiError";


interface EmploymentContextType {

  // ============================================================
  // STATE
  // ============================================================

  myEmployment: Employment | null;

  memberEmployment: Employment | null;

  selectedEmployment: Employment | null;

  loading: boolean;

  message: string;


  // ============================================================
  // SELF-SERVICE
  // ============================================================

  getMyEmployment: () => Promise<boolean>;

  createMyEmployment: (
    payload: CreateEmploymentPayload
  ) => Promise<boolean>;

  updateMyEmployment: (
    payload: UpdateEmploymentPayload
  ) => Promise<boolean>;

  deleteMyEmployment: () => Promise<boolean>;


  // ============================================================
  // ADMIN / MEMBER
  // ============================================================

  createMemberEmployment: (
    memberId: string,
    payload: CreateEmploymentPayload
  ) => Promise<boolean>;

  getMemberEmployment: (
    memberId: string
  ) => Promise<boolean>;

  updateMemberEmployment: (
    memberId: string,
    payload: UpdateEmploymentPayload
  ) => Promise<boolean>;

  getEmployment: (
    employmentId: string
  ) => Promise<Employment | null>;

  deleteEmployment: (
    employmentId: string
  ) => Promise<boolean>;


  // ============================================================
  // UTILITIES
  // ============================================================

  clearMessage: () => void;

  clearSelectedEmployment: () => void;

  setMessage: (message: string) => void;
}


export const EmploymentContext =
  createContext<EmploymentContextType | undefined>(
    undefined
  );


interface EmploymentProviderProps {
  children: ReactNode;
}


export const EmploymentProvider = ({
  children,
}: EmploymentProviderProps) => {

  // ============================================================
  // STATE
  // ============================================================

  const [
    myEmployment,
    setMyEmployment,
  ] = useState<Employment | null>(null);


  const [
    memberEmployment,
    setMemberEmployment,
  ] = useState<Employment | null>(null);


  const [
    selectedEmployment,
    setSelectedEmployment,
  ] = useState<Employment | null>(null);


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    message,
    setMessageState,
  ] = useState("");


  // ============================================================
  // SELF-SERVICE
  // ============================================================

  const getMyEmployment = async (): Promise<boolean> => {

    setLoading(true);
    setMessageState("");

    try {

      const response =
        await employmentService.getMyEmployment();

      if (!response.success) {

        setMessageState(
          response.message ||
          "Failed to retrieve employment information."
        );

        return false;
      }

      setMyEmployment(
        response.data
      );

      setMessageState(
        response.message
      );

      return true;

    } catch (error) {

      setMessageState(
        getApiError(error).message
      );

      return false;

    } finally {

      setLoading(false);
    }
  };


  const createMyEmployment = async (
    payload: CreateEmploymentPayload
  ): Promise<boolean> => {

    setLoading(true);
    setMessageState("");

    try {

      const response =
        await employmentService.createMyEmployment(
          payload
        );

      if (!response.success) {

        setMessageState(
          response.message ||
          "Failed to create employment information."
        );

        return false;
      }

      setMyEmployment(
        response.data
      );

      setMessageState(
        response.message
      );

      return true;

    } catch (error) {

      setMessageState(
        getApiError(error).message
      );

      return false;

    } finally {

      setLoading(false);
    }
  };


  const updateMyEmployment = async (
    payload: UpdateEmploymentPayload
  ): Promise<boolean> => {

    setLoading(true);
    setMessageState("");

    try {

      const response =
        await employmentService.updateMyEmployment(
          payload
        );

      if (!response.success) {

        setMessageState(
          response.message ||
          "Failed to update employment information."
        );

        return false;
      }

      setMyEmployment(
        response.data
      );

      setMessageState(
        response.message
      );

      return true;

    } catch (error) {

      setMessageState(
        getApiError(error).message
      );

      return false;

    } finally {

      setLoading(false);
    }
  };


  const deleteMyEmployment = async (): Promise<boolean> => {

    setLoading(true);
    setMessageState("");

    try {

      const response =
        await employmentService.deleteMyEmployment();

      if (!response.success) {

        setMessageState(
          response.message ||
          "Failed to delete employment information."
        );

        return false;
      }

      setMyEmployment(null);

      setMessageState(
        response.message
      );

      return true;

    } catch (error) {

      setMessageState(
        getApiError(error).message
      );

      return false;

    } finally {

      setLoading(false);
    }
  };


  // ============================================================
  // ADMIN / MEMBER MANAGEMENT
  // ============================================================

  const createMemberEmployment = async (
    memberId: string,
    payload: CreateEmploymentPayload
  ): Promise<boolean> => {

    setLoading(true);
    setMessageState("");

    try {

      const response =
        await employmentService.createMemberEmployment(
          memberId,
          payload
        );

      if (!response.success) {

        setMessageState(
          response.message ||
          "Failed to create employment information."
        );

        return false;
      }

      setMemberEmployment(
        response.data
      );

      setSelectedEmployment(
        response.data
      );

      setMessageState(
        response.message
      );

      return true;

    } catch (error) {

      setMessageState(
        getApiError(error).message
      );

      return false;

    } finally {

      setLoading(false);
    }
  };


  const getMemberEmployment = async (
    memberId: string
  ): Promise<boolean> => {

    setLoading(true);
    setMessageState("");

    try {

      const response =
        await employmentService.getMemberEmployment(
          memberId
        );

      if (!response.success) {

        setMessageState(
          response.message ||
          "Failed to retrieve employment information."
        );

        return false;
      }

      setMemberEmployment(
        response.data
      );

      setSelectedEmployment(
        response.data
      );

      setMessageState(
        response.message
      );

      return true;

    } catch (error) {

      setMessageState(
        getApiError(error).message
      );

      return false;

    } finally {

      setLoading(false);
    }
  };


  const updateMemberEmployment = async (
    memberId: string,
    payload: UpdateEmploymentPayload
  ): Promise<boolean> => {

    setLoading(true);
    setMessageState("");

    try {

      const response =
        await employmentService.updateMemberEmployment(
          memberId,
          payload
        );

      if (!response.success) {

        setMessageState(
          response.message ||
          "Failed to update employment information."
        );

        return false;
      }

      setMemberEmployment(
        response.data
      );

      setSelectedEmployment(
        response.data
      );

      setMessageState(
        response.message
      );

      return true;

    } catch (error) {

      setMessageState(
        getApiError(error).message
      );

      return false;

    } finally {

      setLoading(false);
    }
  };


  const getEmployment = async (
    employmentId: string
  ): Promise<Employment | null> => {

    setLoading(true);
    setMessageState("");

    try {

      const response =
        await employmentService.getEmployment(
          employmentId
        );

      if (!response.success) {

        setMessageState(
          response.message ||
          "Employment record not found."
        );

        return null;
      }

      setSelectedEmployment(
        response.data
      );

      setMessageState(
        response.message
      );

      return response.data;

    } catch (error) {

      setMessageState(
        getApiError(error).message
      );

      return null;

    } finally {

      setLoading(false);
    }
  };


  const deleteEmployment = async (
    employmentId: string
  ): Promise<boolean> => {

    setLoading(true);
    setMessageState("");

    try {

      const response =
        await employmentService.deleteEmployment(
          employmentId
        );

      if (!response.success) {

        setMessageState(
          response.message ||
          "Failed to delete employment information."
        );

        return false;
      }

      setMemberEmployment(null);

      setSelectedEmployment(null);

      setMessageState(
        response.message
      );

      return true;

    } catch (error) {

      setMessageState(
        getApiError(error).message
      );

      return false;

    } finally {

      setLoading(false);
    }
  };


  // ============================================================
  // UTILITIES
  // ============================================================

  const clearMessage = () => {
    setMessageState("");
  };


  const clearSelectedEmployment = () => {
    setSelectedEmployment(null);
  };


  const setMessage = (value: string) => {
    setMessageState(value);
  };


  // ============================================================
  // PROVIDER
  // ============================================================

  return (
    <EmploymentContext.Provider
      value={{
        myEmployment,

        memberEmployment,

        selectedEmployment,

        loading,

        message,


        getMyEmployment,

        createMyEmployment,

        updateMyEmployment,

        deleteMyEmployment,


        createMemberEmployment,

        getMemberEmployment,

        updateMemberEmployment,

        getEmployment,

        deleteEmployment,


        clearMessage,

        clearSelectedEmployment,

        setMessage,
      }}
    >
      {children}
    </EmploymentContext.Provider>
  );
};