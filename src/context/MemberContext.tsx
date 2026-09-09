import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

import memberService from "../api/MemberApi";

import {
  Member,
  MemberDetails,
  MemberProfile,
  MemberFilters,

  CreateMemberDto,
  UpdateMemberProfileDto,
  MemberActionReasonDto,

  MemberPagination,
} from "../types/MemberType";

import { getApiError } from "../utils/apiError";

interface MemberContextType {

  members: Member[];

  selectedMember:
    Member | MemberDetails | null;

  memberProfile:
    MemberProfile | null;

  pagination:
    MemberPagination | null;

  loading: boolean;

  message: string;

  setMessage: React.Dispatch<
    React.SetStateAction<string>
  >;

  fetchMembers: (
    filters?: MemberFilters
  ) => Promise<boolean>;

  fetchMember: (
    memberId: string
  ) => Promise<Member | MemberDetails | null>;

  fetchMemberProfile: (
    memberId: string
  ) => Promise<MemberProfile | null>;

  fetchMemberByUserId: (
    userId: string
  ) => Promise<Member | MemberDetails | null>;

  createMember: (
    payload: CreateMemberDto
  ) => Promise<boolean>;

  updateMemberProfile: (
    memberId: string,
    payload: UpdateMemberProfileDto
  ) => Promise<boolean>;

  activateMember: (
    memberId: string
  ) => Promise<boolean>;

  suspendMember: (
    memberId: string,
    payload: MemberActionReasonDto
  ) => Promise<boolean>;

  reinstateMember: (
    memberId: string,
    payload: MemberActionReasonDto
  ) => Promise<boolean>;

  retireMember: (
    memberId: string,
    payload: MemberActionReasonDto
  ) => Promise<boolean>;

  resignMember: (
    memberId: string,
    payload: MemberActionReasonDto
  ) => Promise<boolean>;

  clearMessage: () => void;
}

export const MemberContext =
  createContext<MemberContextType | null>(
    null
  );

interface MemberProviderProps {
  children: ReactNode;
}

export const MemberProvider = ({
  children,
}: MemberProviderProps) => {

  const [members, setMembers] =
    useState<Member[]>([]);

  const [selectedMember, setSelectedMember] =
    useState<
      Member | MemberDetails | null
    >(null);

  const [memberProfile, setMemberProfile] =
    useState<MemberProfile | null>(
      null
    );

  const [pagination, setPagination] =
    useState<MemberPagination | null>(
      null
    );

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  /**
   * Get all members
   */
  const fetchMembers = useCallback(
    async (
      filters?: MemberFilters
    ): Promise<boolean> => {

      setLoading(true);

      try {

        const response =
          await memberService.getAll(
            filters
          );

        if (!response.success) {

          setMessage(
            response.message ?? ""
          );

          return false;
        }

        setMembers(
          response.data
        );

        setPagination(
          response.pagination
        );

        setMessage(
          response.message ?? ""
        );

        return true;

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

  /**
   * Get member by ID
   */
  const fetchMember = useCallback(
    async (
      memberId: string
    ): Promise<
      Member | MemberDetails | null
    > => {

      setLoading(true);

      try {

        const response =
          await memberService.getById(
            memberId
          );

        if (!response.success) {

          setMessage(
            response.message ?? ""
          );

          return null;
        }

        setSelectedMember(
          response.data
        );

        setMessage(
          response.message ?? ""
        );

        return response.data;

      } catch (error) {

        const apiError =
          getApiError(error);

        setMessage(
          apiError.message
        );

        return null;

      } finally {

        setLoading(false);
      }
    },
    []
  );

  /**
   * Get member profile
   */
  const fetchMemberProfile =
    useCallback(
      async (
        memberId: string
      ): Promise<MemberProfile | null> => {

        setLoading(true);

        try {

          const response =
            await memberService.getProfile(
              memberId
            );

          if (!response.success) {

            setMessage(
              response.message ?? ""
            );

            return null;
          }

          setMemberProfile(
            response.data
          );

          setMessage(
            response.message ?? ""
          );

          return response.data;

        } catch (error) {

          const apiError =
            getApiError(error);

          setMessage(
            apiError.message
          );

          return null;

        } finally {

          setLoading(false);
        }
      },
      []
    );

  /**
   * Get member using user ID
   */
  const fetchMemberByUserId =
    useCallback(
      async (
        userId: string
      ): Promise<
        Member | MemberDetails | null
      > => {

        setLoading(true);

        try {

          const response =
            await memberService.getByUserId(
              userId
            );

          if (!response.success) {

            setMessage(
              response.message ?? ""
            );

            return null;
          }

          setSelectedMember(
            response.data
          );

          setMessage(
            response.message ?? ""
          );

          return response.data;

        } catch (error) {

          const apiError =
            getApiError(error);

          setMessage(
            apiError.message
          );

          return null;

        } finally {

          setLoading(false);
        }
      },
      []
    );

  /**
   * Create member
   */
  const createMember = useCallback(
    async (
      payload: CreateMemberDto
    ): Promise<boolean> => {

      setLoading(true);

      try {

        const response =
          await memberService.create(
            payload
          );

        setMessage(
          response.message ?? ""
        );

        if (!response.success) {
          return false;
        }

        await fetchMembers();

        return true;

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
    [fetchMembers]
  );

  /**
   * Update member profile
   */
  const updateMemberProfile =
    useCallback(
      async (
        memberId: string,
        payload: UpdateMemberProfileDto
      ): Promise<boolean> => {

        setLoading(true);

        try {

          const response =
            await memberService.updateProfile(
              memberId,
              payload
            );

          setMessage(
            response.message ?? ""
          );

          if (!response.success) {
            return false;
          }

          setSelectedMember(
            response.data
          );

          await fetchMembers();

          return true;

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
      [fetchMembers]
    );

  /**
   * Activate member
   */
  const activateMember = useCallback(
    async (
      memberId: string
    ): Promise<boolean> => {

      setLoading(true);

      try {

        const response =
          await memberService.activate(
            memberId
          );

        setMessage(
          response.message ?? ""
        );

        if (!response.success) {
          return false;
        }

        setSelectedMember(
          response.data
        );

        await fetchMembers();

        return true;

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
    [fetchMembers]
  );

  /**
   * Suspend member
   */
  const suspendMember = useCallback(
    async (
      memberId: string,
      payload: MemberActionReasonDto
    ): Promise<boolean> => {

      setLoading(true);

      try {

        const response =
          await memberService.suspend(
            memberId,
            payload
          );

        setMessage(
          response.message ?? ""
        );

        if (!response.success) {
          return false;
        }

        setSelectedMember(
          response.data
        );

        await fetchMembers();

        return true;

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
    [fetchMembers]
  );

  /**
   * Reinstate member
   */
  const reinstateMember =
    useCallback(
      async (
        memberId: string,
        payload: MemberActionReasonDto
      ): Promise<boolean> => {

        setLoading(true);

        try {

          const response =
            await memberService.reinstate(
              memberId,
              payload
            );

          setMessage(
            response.message ?? ""
          );

          if (!response.success) {
            return false;
          }

          setSelectedMember(
            response.data
          );

          await fetchMembers();

          return true;

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
      [fetchMembers]
    );

  /**
   * Retire member
   */
  const retireMember = useCallback(
    async (
      memberId: string,
      payload: MemberActionReasonDto
    ): Promise<boolean> => {

      setLoading(true);

      try {

        const response =
          await memberService.retire(
            memberId,
            payload
          );

        setMessage(
          response.message ?? ""
        );

        if (!response.success) {
          return false;
        }

        setSelectedMember(
          response.data
        );

        await fetchMembers();

        return true;

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
    [fetchMembers]
  );

  /**
   * Resign member
   */
  const resignMember = useCallback(
    async (
      memberId: string,
      payload: MemberActionReasonDto
    ): Promise<boolean> => {

      setLoading(true);

      try {

        const response =
          await memberService.resign(
            memberId,
            payload
          );

        setMessage(
          response.message ?? ""
        );

        if (!response.success) {
          return false;
        }

        setSelectedMember(
          response.data
        );

        await fetchMembers();

        return true;

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
    [fetchMembers]
  );

  /**
   * Clear message
   */
  const clearMessage = useCallback(() => {
    setMessage("");
  }, []);

  /**
   * Load members on provider initialization.
   */
  useEffect(() => {

    fetchMembers();

  }, [fetchMembers]);

  return (
    <MemberContext.Provider
      value={{

        members,

        selectedMember,

        memberProfile,

        pagination,

        loading,

        message,

        setMessage,

        fetchMembers,

        fetchMember,

        fetchMemberProfile,

        fetchMemberByUserId,

        createMember,

        updateMemberProfile,

        activateMember,

        suspendMember,

        reinstateMember,

        retireMember,

        resignMember,

        clearMessage,
      }}
    >
      {children}
    </MemberContext.Provider>
  );
};