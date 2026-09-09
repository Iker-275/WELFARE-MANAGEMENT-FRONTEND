import api from "./api";

import {
  MembersResponse,
  MemberResponse,
  MemberProfileResponse,
  MemberActionResponse,

  MemberFilters,

  CreateMemberDto,
  UpdateMemberProfileDto,
  MemberActionReasonDto,
} from "../types/MemberType";

export const memberService = {

  /**
   * Get all members
   */
  getAll: async (
    filters?: MemberFilters
  ): Promise<MembersResponse> => {

    const { data } =
      await api.get<MembersResponse>(
        "/members",
        {
          params: filters,
        }
      );

    return data;
  },

  /**
   * Get member by ID
   */
  getById: async (
    memberId: string
  ): Promise<MemberResponse> => {

    const { data } =
      await api.get<MemberResponse>(
        `/members/${memberId}`
      );

    return data;
  },

  /**
   * Get member profile
   */
  getProfile: async (
    memberId: string
  ): Promise<MemberProfileResponse> => {

    const { data } =
      await api.get<MemberProfileResponse>(
        `/members/${memberId}/profile`
      );

    return data;
  },

  /**
   * Get member by user ID
   */
  getByUserId: async (
    userId: string
  ): Promise<MemberResponse> => {

    const { data } =
      await api.get<MemberResponse>(
        `/members/user/${userId}`
      );

    return data;
  },

  /**
   * Create member
   */
  create: async (
    payload: CreateMemberDto
  ): Promise<MemberResponse> => {

    const { data } =
      await api.post<MemberResponse>(
        "/members",
        payload
      );

    return data;
  },

  /**
   * Update member profile
   */
  updateProfile: async (
    memberId: string,
    payload: UpdateMemberProfileDto
  ): Promise<MemberResponse> => {

    const { data } =
      await api.patch<MemberResponse>(
        `/members/${memberId}/profile`,
        payload
      );

    return data;
  },

  /**
   * Activate member
   */
  activate: async (
    memberId: string
  ): Promise<MemberActionResponse> => {

    const { data } =
      await api.patch<MemberActionResponse>(
        `/members/${memberId}/activate`
      );

    return data;
  },

  /**
   * Suspend member
   */
  suspend: async (
    memberId: string,
    payload: MemberActionReasonDto
  ): Promise<MemberActionResponse> => {

    const { data } =
      await api.patch<MemberActionResponse>(
        `/members/${memberId}/suspend`,
        payload
      );

    return data;
  },

  /**
   * Reinstate member
   */
  reinstate: async (
    memberId: string,
    payload: MemberActionReasonDto
  ): Promise<MemberActionResponse> => {

    const { data } =
      await api.patch<MemberActionResponse>(
        `/members/${memberId}/reinstate`,
        payload
      );

    return data;
  },

  /**
   * Retire member
   */
  retire: async (
    memberId: string,
    payload: MemberActionReasonDto
  ): Promise<MemberActionResponse> => {

    const { data } =
      await api.patch<MemberActionResponse>(
        `/members/${memberId}/retire`,
        payload
      );

    return data;
  },

  /**
   * Resign member
   */
  resign: async (
    memberId: string,
    payload: MemberActionReasonDto
  ): Promise<MemberActionResponse> => {

    const { data } =
      await api.patch<MemberActionResponse>(
        `/members/${memberId}/resign`,
        payload
      );

    return data;
  },
};

export default memberService;