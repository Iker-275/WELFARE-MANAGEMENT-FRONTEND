

import {
  createContext,
  ReactNode,
  useCallback,
  useState,
} from "react";

import memberService from "../api/MemberApi";

import {
  Member,
  MemberDetails,
  MemberFilters,
  MemberPagination,
  MemberProfile,
  CreateMemberDto,
  UpdateMemberProfileDto,
  MemberActionReasonDto,
} from "../types/MemberType";

import { getApiError } from "../utils/apiError";

interface MemberContextType {
  members: Member[];
  selectedMember: Member | MemberDetails | null;
  memberProfile: MemberProfile | null;
  pagination: MemberPagination | null;

  loading: boolean;
  message: string;

  setMessage: React.Dispatch<React.SetStateAction<string>>;

  fetchMembers: (filters?: MemberFilters) => Promise<boolean>;

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

export const MemberContext = createContext<
  MemberContextType | undefined
>(undefined);

interface MemberProviderProps {
  children: ReactNode;
}

export const MemberProvider = ({
  children,
}: MemberProviderProps) => {
  const [members, setMembers] = useState<Member[]>([]);

  const [selectedMember, setSelectedMember] = useState<
    Member | MemberDetails | null
  >(null);

  const [memberProfile, setMemberProfile] =
    useState<MemberProfile | null>(null);

  const [pagination, setPagination] =
    useState<MemberPagination | null>(null);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  /**
   * Fetch members
   *
   * Collection fetching is intentionally controlled by the page.
   */
  const fetchMembers = useCallback(
    async (filters?: MemberFilters): Promise<boolean> => {
      setLoading(true);
      setMessage("");

      try {
        const response = await memberService.getAll(filters);

        setMembers(response.data);
        setPagination(response.pagination);

        return true;
      } catch (error) {
        setMessage(getApiError(error).message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Fetch a single member.
   *
   * This is used primarily by the member profile/details page.
   */
  const fetchMember = useCallback(
    async (
      memberId: string
    ): Promise<Member | MemberDetails | null> => {
      setLoading(true);
      setMessage("");

      try {
        const response = await memberService.getById(memberId);

        setSelectedMember(response.data);

        return response.data;
      } catch (error) {
        setMessage(getApiError(error).message);
        setSelectedMember(null);

        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Fetch member profile information.
   */
  const fetchMemberProfile = useCallback(
    async (
      memberId: string
    ): Promise<MemberProfile | null> => {
      setLoading(true);
      setMessage("");

      try {
        const response =
          await memberService.getProfile(memberId);

        setMemberProfile(response.data);

        return response.data;
      } catch (error) {
        setMessage(getApiError(error).message);
        setMemberProfile(null);

        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Fetch member using the associated user ID.
   */
  const fetchMemberByUserId = useCallback(
    async (
      userId: string
    ): Promise<Member | MemberDetails | null> => {
      setLoading(true);
      setMessage("");

      try {
        const response =
          await memberService.getByUserId(userId);

        setSelectedMember(response.data);

        return response.data;
      } catch (error) {
        setMessage(getApiError(error).message);
        setSelectedMember(null);

        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Create a member.
   */
  const createMember = useCallback(
    async (
      payload: CreateMemberDto
    ): Promise<boolean> => {
      setLoading(true);
      setMessage("");

      try {
        const response =
          await memberService.create(payload);

        setMessage(response.message);

        await fetchMembers();

        return true;
      } catch (error) {
        setMessage(getApiError(error).message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchMembers]
  );

  /**
   * Update member profile.
   */
  const updateMemberProfile = useCallback(
    async (
      memberId: string,
      payload: UpdateMemberProfileDto
    ): Promise<boolean> => {
      setLoading(true);
      setMessage("");

      try {
        const response =
          await memberService.updateProfile(
            memberId,
            payload
          );

        setMessage(response.message);

        /**
         * Refresh the currently selected member so
         * the profile page immediately reflects changes.
         */
        const updatedMember =
          await memberService.getById(memberId);

        setSelectedMember(updatedMember.data);

        setMemberProfile(updatedMember.data.profile);

        await fetchMembers();

        return true;
      } catch (error) {
        setMessage(getApiError(error).message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchMembers]
  );

  /**
   * Activate member.
   */
  const activateMember = useCallback(
    async (memberId: string): Promise<boolean> => {
      setLoading(true);
      setMessage("");

      try {
        const response =
          await memberService.activate(memberId);

        setMessage(response.message);

        const updatedMember =
          await memberService.getById(memberId);

        setSelectedMember(updatedMember.data);

        await fetchMembers();

        return true;
      } catch (error) {
        setMessage(getApiError(error).message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchMembers]
  );

  /**
   * Suspend member.
   */
  const suspendMember = useCallback(
    async (
      memberId: string,
      payload: MemberActionReasonDto
    ): Promise<boolean> => {
      setLoading(true);
      setMessage("");

      try {
        const response =
          await memberService.suspend(
            memberId,
            payload
          );

        setMessage(response.message);

        const updatedMember =
          await memberService.getById(memberId);

        setSelectedMember(updatedMember.data);

        await fetchMembers();

        return true;
      } catch (error) {
        setMessage(getApiError(error).message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchMembers]
  );

  /**
   * Reinstate member.
   */
  const reinstateMember = useCallback(
    async (
      memberId: string,
      payload: MemberActionReasonDto
    ): Promise<boolean> => {
      setLoading(true);
      setMessage("");

      try {
        const response =
          await memberService.reinstate(
            memberId,
            payload
          );

        setMessage(response.message);

        const updatedMember =
          await memberService.getById(memberId);

        setSelectedMember(updatedMember.data);

        await fetchMembers();

        return true;
      } catch (error) {
        setMessage(getApiError(error).message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchMembers]
  );

  /**
   * Retire member.
   */
  const retireMember = useCallback(
    async (
      memberId: string,
      payload: MemberActionReasonDto
    ): Promise<boolean> => {
      setLoading(true);
      setMessage("");

      try {
        const response =
          await memberService.retire(
            memberId,
            payload
          );

        setMessage(response.message);

        const updatedMember =
          await memberService.getById(memberId);

        setSelectedMember(updatedMember.data);

        await fetchMembers();

        return true;
      } catch (error) {
        setMessage(getApiError(error).message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchMembers]
  );

  /**
   * Resign member.
   */
  const resignMember = useCallback(
    async (
      memberId: string,
      payload: MemberActionReasonDto
    ): Promise<boolean> => {
      setLoading(true);
      setMessage("");

      try {
        const response =
          await memberService.resign(
            memberId,
            payload
          );

        setMessage(response.message);

        const updatedMember =
          await memberService.getById(memberId);

        setSelectedMember(updatedMember.data);

        await fetchMembers();

        return true;
      } catch (error) {
        setMessage(getApiError(error).message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchMembers]
  );

  /**
   * Clear context message.
   */
  const clearMessage = useCallback(() => {
    setMessage("");
  }, []);

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