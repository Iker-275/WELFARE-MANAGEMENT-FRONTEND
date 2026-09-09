import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

import regionService from "../api/RegionApi";

import {
  Region,
  RegionUser,
  CreateRegionDto,
  UpdateRegionDto,
  RegionFilters,
  RegionUserFilters,
} from "../types/RegionType";

import { Pagination } from "../types/SharedTypes";

import { getApiError } from "../utils/apiError";

interface RegionContextType {
  regions: Region[];
  regionUsers: RegionUser[];

  pagination: Pagination | null;

  loading: boolean;

  message: string;

  setMessage: React.Dispatch<
    React.SetStateAction<string>
  >;

  fetchRegions: (
    filters?: RegionFilters
  ) => Promise<boolean>;

  fetchRegion: (
    regionId: string
  ) => Promise<Region | null>;

  fetchRegionUsers: (
    regionId: string,
    filters?: RegionUserFilters
  ) => Promise<boolean>;

  createRegion: (
    payload: CreateRegionDto
  ) => Promise<boolean>;

  updateRegion: (
    regionId: string,
    payload: UpdateRegionDto
  ) => Promise<boolean>;

  deleteRegion: (
    regionId: string
  ) => Promise<boolean>;

  clearMessage: () => void;
}

export const RegionContext =
  createContext<RegionContextType | null>(
    null
  );

interface RegionProviderProps {
  children: ReactNode;
}

export const RegionProvider = ({
  children,
}: RegionProviderProps) => {

  const [regions, setRegions] =
    useState<Region[]>([]);

  const [regionUsers, setRegionUsers] =
    useState<RegionUser[]>([]);

  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  /**
   * Get all regions
   */
  const fetchRegions = useCallback(
    async (
      filters?: RegionFilters
    ): Promise<boolean> => {

      setLoading(true);

      try {

        const response =
          await regionService.getAll(
            filters
          );

        if (!response.success) {

          setMessage(
            response.message
          );

          return false;
        }

        setRegions(
          response.data
        );

        setMessage(
          response.message
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
   * Get a single region
   */
  const fetchRegion = useCallback(
    async (
      regionId: string
    ): Promise<Region | null> => {

      setLoading(true);

      try {

        const response =
          await regionService.getById(
            regionId
          );

        if (!response.success) {

          setMessage(
            response.message
          );

          return null;
        }

        setMessage(
          response.message
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
   * Get users belonging to a region
   */
  const fetchRegionUsers = useCallback(
    async (
      regionId: string,
      filters?: RegionUserFilters
    ): Promise<boolean> => {

      setLoading(true);

      try {

        const response =
          await regionService.getUsers(
            regionId,
            filters
          );

        if (!response.success) {

          setMessage(
            response.message
          );

          return false;
        }

        setRegionUsers(
          response.data
        );


        setPagination({
          ...response.pagination,
          hasNextPage:
            response.pagination.page <
            response.pagination.totalPages,

          hasPreviousPage:
            response.pagination.page > 1,
        });
        setMessage(
          response.message
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
   * Create region
   */
  const createRegion = useCallback(
    async (
      payload: CreateRegionDto
    ): Promise<boolean> => {

      setLoading(true);

      try {

        const response =
          await regionService.create(
            payload
          );

        setMessage(
          response.message
        );

        if (!response.success) {
          return false;
        }

        await fetchRegions();

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
    [fetchRegions]
  );

  /**
   * Update region
   */
  const updateRegion = useCallback(
    async (
      regionId: string,
      payload: UpdateRegionDto
    ): Promise<boolean> => {

      setLoading(true);

      try {

        const response =
          await regionService.update(
            regionId,
            payload
          );

        setMessage(
          response.message
        );

        if (!response.success) {
          return false;
        }

        await fetchRegions();

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
    [fetchRegions]
  );

  /**
   * Delete region
   */
  const deleteRegion = useCallback(
    async (
      regionId: string
    ): Promise<boolean> => {

      setLoading(true);

      try {

        const response =
          await regionService.delete(
            regionId
          );

        setMessage(
          response.message
        );

        if (!response.success) {
          return false;
        }

        await fetchRegions();

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
    [fetchRegions]
  );

  /**
   * Clear backend feedback message
   */
  const clearMessage = useCallback(() => {
    setMessage("");
  }, []);

  /**
   * Initial region loading
   */
  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  return (
    <RegionContext.Provider
      value={{
        regions,
        regionUsers,
        pagination,

        loading,
        message,
        setMessage,

        fetchRegions,
        fetchRegion,
        fetchRegionUsers,

        createRegion,
        updateRegion,
        deleteRegion,

        clearMessage,
      }}
    >
      {children}
    </RegionContext.Provider>
  );
};