import api from "./api";
import {
  ApiResponse,
  PaginatedResponse,
} from "../types/SharedTypes";

import {
  Region,
  RegionUser,
  CreateRegionDto,
  UpdateRegionDto,
  RegionFilters,
  RegionUserFilters,
} from "../types/RegionType";


export const createRegion = async (
  payload: CreateRegionDto
) => {
  const response =
    await api.post<ApiResponse<Region>>(
      "/regions",
      payload
    );

  return response.data;
};

export const getRegions = async (
  filters?: RegionFilters
) => {

  const response =
    await api.get<ApiResponse<Region[]>>(
      "/regions",
      {
        params: filters,
      }
    );

  return response.data;
};

export const getRegionUsers = async (
  regionId: string,
  filters?: RegionUserFilters
) => {

  const response =
    await api.get<
      PaginatedResponse<RegionUser>
    >(
      `/regions/${regionId}/users`,
      {
        params: filters,
      }
    );

  return response.data;
};

export const updateRegion = async (
  regionId: string,
  payload: UpdateRegionDto
) => {

  const response =
    await api.patch<ApiResponse<Region>>(
      `/regions/${regionId}`,
      payload
    );

  return response.data;
};
export const deleteRegion = async (
  regionId: string
) => {

  const response =
    await api.delete<
      ApiResponse<null>
    >(
      `/regions/${regionId}`
    );

  return response.data;
};