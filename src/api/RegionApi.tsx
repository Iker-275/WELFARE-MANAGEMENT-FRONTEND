import api from "./api";

import {
  RegionResponse,
  RegionsResponse,
  RegionUsersResponse,
  RegionActionResponse,
  CreateRegionDto,
  UpdateRegionDto,
  RegionFilters,
  RegionUserFilters,
} from "../types/RegionType";

export const regionService = {

  create: async (
    payload: CreateRegionDto
  ): Promise<RegionResponse> => {

    const { data } =
      await api.post<RegionResponse>(
        "/regions",
        payload
      );

    return data;
  },

  getAll: async (
    filters?: RegionFilters
  ): Promise<RegionsResponse> => {

    const { data } =
      await api.get<RegionsResponse>(
        "/regions",
        {
          params: filters,
        }
      );

    return data;
  },

  getById: async (
    regionId: string
  ): Promise<RegionResponse> => {

    const { data } =
      await api.get<RegionResponse>(
        `/regions/${regionId}`
      );

    return data;
  },

  update: async (
    regionId: string,
    payload: UpdateRegionDto
  ): Promise<RegionResponse> => {

    const { data } =
      await api.patch<RegionResponse>(
        `/regions/${regionId}`,
        payload
      );

    return data;
  },

  delete: async (
    regionId: string
  ): Promise<RegionActionResponse> => {

    const { data } =
      await api.delete<RegionActionResponse>(
        `/regions/${regionId}`
      );

    return data;
  },

  getUsers: async (
    regionId: string,
    filters?: RegionUserFilters
  ): Promise<RegionUsersResponse> => {

    const { data } =
      await api.get<RegionUsersResponse>(
        `/regions/${regionId}/users`,
        {
          params: filters,
        }
      );

    return data;
  },
};

export default regionService;