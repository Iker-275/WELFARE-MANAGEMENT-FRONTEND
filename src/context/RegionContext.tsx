import {
  createContext,
  useState,
  ReactNode,
} from "react";

import {
  createRegion,
  getRegions,
  updateRegion,
  deleteRegion,
  getRegionUsers,
} from "../api/RegionApi";

import {
  Region,
  RegionUser,
  CreateRegionDto,
  UpdateRegionDto,
  RegionFilters,
  RegionUserFilters,
} from "../types/RegionType";

import { Pagination } from "../types/SharedTypes";

interface RegionContextType {
  regions: Region[];
  regionUsers: RegionUser[];
  pagination: Pagination | null;
  loading: boolean;
  message: string;

  fetchRegions: (
    filters?: RegionFilters
  ) => Promise<void>;

  fetchRegionUsers: (
    regionId: string,
    filters?: RegionUserFilters
  ) => Promise<void>;

  createRegionHandler: (
    payload: CreateRegionDto
  ) => Promise<any>;

  updateRegionHandler: (
    regionId: string,
    payload: UpdateRegionDto
  ) => Promise<any>;

  deleteRegionHandler: (
    regionId: string
  ) => Promise<any>;
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
  const fetchRegions = async (
    filters?: RegionFilters
  ) => {
    setLoading(true);

    try {
      const response =
        await getRegions(filters);

      setRegions(response.data);

    } finally {
      setLoading(false);
    }
  };

  const fetchRegionUsers = async (
    regionId: string,
    filters?: RegionUserFilters
  ) => {
    setLoading(true);

    try {
      const response =
        await getRegionUsers(
          regionId,
          filters
        );

      setRegionUsers(response.data);
      setPagination(
        response.pagination
      );
    } finally {
      setLoading(false);
    }
  };

  const createRegionHandler = async (
    payload: CreateRegionDto
  ) => {
    setLoading(true);

    try {
      const response =
        await createRegion(payload);

      await fetchRegions();

       if (response.message) {
        setMessage(
          response.message
        );
      }
      console.log("Create region response:", response);

      return response;
    }catch(error){
      console.log("Error creating region:", error);
      setMessage("An error occurred while creating the region.");
    } finally {
      setLoading(false);
    }
  };

  const updateRegionHandler = async (
    regionId: string,
    payload: UpdateRegionDto
  ) => {
    setLoading(true);

    try {
      const response =
        await updateRegion(
          regionId,
          payload
        );

      await fetchRegions();

       if (response.message) {
        setMessage(
          response.message
        );
      }

      return response;
    }catch(error){
      
      setMessage("An error occurred while updating the region.");
    } finally {
      setLoading(false);
    }
  };

  const deleteRegionHandler = async (
    regionId: string
  ) => {
    setLoading(true);

    try {
      const response =
        await deleteRegion(regionId);

      await fetchRegions();

       if (response.message) {
        setMessage(
          response.message
        );
      }

      return response;
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegionContext.Provider
      value={{
        regions,
        regionUsers,
        pagination,
        loading,
        message,

        fetchRegions,
        fetchRegionUsers,

        createRegionHandler,
        updateRegionHandler,
        deleteRegionHandler,
      }}
    >
      {children}
    </RegionContext.Provider>
  );
};


