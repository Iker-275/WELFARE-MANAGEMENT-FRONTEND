
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

  /**
   * Create region
   */
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

  /**
   * Get all regions
   */
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

  /**
   * Get single region
   */
  getById: async (
    regionId: string
  ): Promise<RegionResponse> => {
    const { data } =
      await api.get<RegionResponse>(
        `/regions/${regionId}`
      );

    return data;
  },

  /**
   * Update region
   */
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

  /**
   * Delete region
   */
  delete: async (
    regionId: string
  ): Promise<RegionActionResponse> => {
    const { data } =
      await api.delete<RegionActionResponse>(
        `/regions/${regionId}`
      );

    return data;
  },

  /**
   * Get members/users assigned to region
   *
   * Keep this only if the backend still exposes
   * GET /regions/:regionId/users.
   */
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

