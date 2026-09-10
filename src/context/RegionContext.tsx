
import {
  createContext,
  ReactNode,
  useCallback,
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
  ensureRegionsLoaded: () => Promise<boolean>;

  clearMessage: () => void;
}

export const RegionContext =
  createContext<RegionContextType | null>(null);

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
    

  /*
   * ============================================================
   * FETCH REGIONS
   * ============================================================
   */

  const fetchRegions = useCallback(
    async (
      filters?: RegionFilters
    ): Promise<boolean> => {
      try {
        setLoading(true);

        const response =
          await regionService.getAll(
            filters
          );

        setMessage(
          response.message
        );

        if (!response.success) {
          return false;
        }

        setRegions(
          response.data
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

  const ensureRegionsLoaded = useCallback(
  async (): Promise<boolean> => {
    if (regions.length > 0) {
      return true;
    }

    return fetchRegions();
  },
  [regions.length, fetchRegions]
);

  /*
   * ============================================================
   * FETCH SINGLE REGION
   * ============================================================
   */

  const fetchRegion = useCallback(
    async (
      regionId: string
    ): Promise<Region | null> => {
      try {
        setLoading(true);

        const response =
          await regionService.getById(
            regionId
          );

        setMessage(
          response.message
        );

        if (!response.success) {
          return null;
        }

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

  /*
   * ============================================================
   * FETCH REGION USERS
   * ============================================================
   */

  const fetchRegionUsers = useCallback(
    async (
      regionId: string,
      filters?: RegionUserFilters
    ): Promise<boolean> => {
      try {
        setLoading(true);

        const response =
          await regionService.getUsers(
            regionId,
            filters
          );

        setMessage(
          response.message
        );

        if (!response.success) {
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

  /*
   * ============================================================
   * CREATE REGION
   * ============================================================
   */

  const createRegion = useCallback(
    async (
      payload: CreateRegionDto
    ): Promise<boolean> => {
      try {
        setLoading(true);

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

        /*
         * Refresh region collection after
         * successful creation.
         */
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

  /*
   * ============================================================
   * UPDATE REGION
   * ============================================================
   */

  const updateRegion = useCallback(
    async (
      regionId: string,
      payload: UpdateRegionDto
    ): Promise<boolean> => {
      try {
        setLoading(true);

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

  /*
   * ============================================================
   * DELETE REGION
   * ============================================================
   */

  const deleteRegion = useCallback(
    async (
      regionId: string
    ): Promise<boolean> => {
      try {
        setLoading(true);

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

        setRegions(
          (current) =>
            current.filter(
              (region) =>
                region.id !== regionId
            )
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

  /*
   * ============================================================
   * CLEAR MESSAGE
   * ============================================================
   */

  const clearMessage =
    useCallback(() => {
      setMessage("");
    }, []);

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
        ensureRegionsLoaded,

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