import {
  createContext,
  ReactNode,
  useCallback,
  useState,
} from "react";

import membershipMetadataApi
  from "../api/MembershipMetadataApi";

import {
  MembershipMetadata,
} from "../types/MembershipMetadataType";

import {
  getApiError,
} from "../utils/apiError";


interface MembershipMetadataContextType {

  membershipStatuses:
    MembershipMetadata[];

  employmentStatuses:
    MembershipMetadata[];

  dependantRelationships:
    MembershipMetadata[];

  membershipStatusesLoading:
    boolean;

  employmentStatusesLoading:
    boolean;

  dependantRelationshipsLoading:
    boolean;

  loading:
    boolean;

  message:
    string;

  loadMembershipStatuses():
    Promise<boolean>;

  loadEmploymentStatuses():
    Promise<boolean>;

  loadDependantRelationships():
    Promise<boolean>;

  loadAll():
    Promise<boolean>;

  clearMessage():
    void;
}


interface MembershipMetadataProviderProps {
  children: ReactNode;
}


export const MembershipMetadataContext =
  createContext<
    MembershipMetadataContextType | null
  >(null);


export const MembershipMetadataProvider = ({
  children,
}: MembershipMetadataProviderProps) => {

  const [
    membershipStatuses,
    setMembershipStatuses,
  ] = useState<MembershipMetadata[]>([]);


  const [
    employmentStatuses,
    setEmploymentStatuses,
  ] = useState<MembershipMetadata[]>([]);


  const [
    dependantRelationships,
    setDependantRelationships,
  ] = useState<MembershipMetadata[]>([]);


  const [
    membershipStatusesLoading,
    setMembershipStatusesLoading,
  ] = useState(false);


  const [
    employmentStatusesLoading,
    setEmploymentStatusesLoading,
  ] = useState(false);


  const [
    dependantRelationshipsLoading,
    setDependantRelationshipsLoading,
  ] = useState(false);


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    message,
    setMessage,
  ] = useState("");


  /*
   * MEMBERSHIP STATUSES
   */
  const loadMembershipStatuses =
    useCallback(
      async (): Promise<boolean> => {

        try {

          setMembershipStatusesLoading(
            true
          );

          setMessage("");

          const response =
            await membershipMetadataApi
              .getMembershipStatuses();

          setMessage(
            response.message
          );

          if (
            response.success
          ) {

            setMembershipStatuses(
              response.data
            );

          }

          return response.success;

        } catch (error) {

          const apiError =
            getApiError(error);

          setMessage(
            apiError.message
          );

          return false;

        } finally {

          setMembershipStatusesLoading(
            false
          );

        }

      },
      []
    );


  /*
   * EMPLOYMENT STATUSES
   */
  const loadEmploymentStatuses =
    useCallback(
      async (): Promise<boolean> => {

        try {

          setEmploymentStatusesLoading(
            true
          );

          setMessage("");

          const response =
            await membershipMetadataApi
              .getEmploymentStatuses();

          setMessage(
            response.message
          );

          if (
            response.success
          ) {

            setEmploymentStatuses(
              response.data
            );

          }

          return response.success;

        } catch (error) {

          const apiError =
            getApiError(error);

          setMessage(
            apiError.message
          );

          return false;

        } finally {

          setEmploymentStatusesLoading(
            false
          );

        }

      },
      []
    );


  /*
   * DEPENDANT RELATIONSHIPS
   */
  const loadDependantRelationships =
    useCallback(
      async (): Promise<boolean> => {

        try {

          setDependantRelationshipsLoading(
            true
          );

          setMessage("");

          const response =
            await membershipMetadataApi
              .getDependantRelationships();

          setMessage(
            response.message
          );

          if (
            response.success
          ) {

            setDependantRelationships(
              response.data
            );

          }

          return response.success;

        } catch (error) {

          const apiError =
            getApiError(error);

          setMessage(
            apiError.message
          );

          return false;

        } finally {

          setDependantRelationshipsLoading(
            false
          );

        }

      },
      []
    );


  /*
   * LOAD ALL
   */
  const loadAll =
    useCallback(
      async (): Promise<boolean> => {

        try {

          setLoading(true);

          setMessage("");

          const [
            membershipResponse,
            employmentResponse,
            relationshipResponse,
          ] = await Promise.all([
            membershipMetadataApi
              .getMembershipStatuses(),

            membershipMetadataApi
              .getEmploymentStatuses(),

            membershipMetadataApi
              .getDependantRelationships(),
          ]);


          if (
            membershipResponse.success
          ) {

            setMembershipStatuses(
              membershipResponse.data
            );

          }


          if (
            employmentResponse.success
          ) {

            setEmploymentStatuses(
              employmentResponse.data
            );

          }


          if (
            relationshipResponse.success
          ) {

            setDependantRelationships(
              relationshipResponse.data
            );

          }


          /*
           * Preserve the backend message.
           *
           * If one of the requests failed,
           * display that backend message.
           */
          const failedResponse = [
            membershipResponse,
            employmentResponse,
            relationshipResponse,
          ].find(
            (response) =>
              !response.success
          );


          setMessage(
            failedResponse?.message ??
            membershipResponse.message
          );


          return !failedResponse;

        } catch (error) {

          const apiError =
            getApiError(error);

          setMessage(
            apiError.message
          );

          return false;

        } finally {

          setLoading(false);

        }

      },
      []
    );


  const clearMessage =
    useCallback(() => {
      setMessage("");
    }, []);


  const value:
    MembershipMetadataContextType = {

    membershipStatuses,

    employmentStatuses,

    dependantRelationships,

    membershipStatusesLoading,

    employmentStatusesLoading,

    dependantRelationshipsLoading,

    loading,

    message,

    loadMembershipStatuses,

    loadEmploymentStatuses,

    loadDependantRelationships,

    loadAll,

    clearMessage,
  };


  return (
    <MembershipMetadataContext.Provider
      value={value}
    >
      {children}
    </MembershipMetadataContext.Provider>
  );
};