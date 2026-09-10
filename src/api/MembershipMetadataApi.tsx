import api from "./api";

import {
  MembershipMetadataResponse,
} from "../types/MembershipMetadataType";

export const membershipMetadataApi = {

  getMembershipStatuses:
    async (): Promise<MembershipMetadataResponse> => {

      const {
        data,
      } = await api.get<MembershipMetadataResponse>(
        "/membership/membership-statuses"
      );

      return data;
    },

  getEmploymentStatuses:
    async (): Promise<MembershipMetadataResponse> => {

      const {
        data,
      } = await api.get<MembershipMetadataResponse>(
        "/membership/employment-statuses"
      );

      return data;
    },

  getDependantRelationships:
    async (): Promise<MembershipMetadataResponse> => {

      const {
        data,
      } = await api.get<MembershipMetadataResponse>(
        "/membership/dependant-relationships"
      );

      return data;
    },

};

export default membershipMetadataApi;