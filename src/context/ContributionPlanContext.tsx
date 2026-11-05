
import {
  createContext,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from "react";

import contributionPlanService from "../api/ContributionPlanApi";

import {
  ContributionPlan,
  CreateContributionPlanDto,
  UpdateContributionPlanDto,
  ContributionPlanFilters,
} from "../types/ContributionPlanType";

import { Pagination } from "../types/SharedTypes";

import { getApiError } from "../utils/apiError";


interface ContributionPlanContextType {

  plans: ContributionPlan[];

  pagination: Pagination | null;

  loading: boolean;

  message: string;

  setMessage: React.Dispatch<
    React.SetStateAction<string>
  >;

  fetchPlans: (
    filters?: ContributionPlanFilters
  ) => Promise<boolean>;

  fetchPlan: (
    planId: string
  ) => Promise<ContributionPlan | null>;

  fetchPlanByCode: (
    code: string
  ) => Promise<ContributionPlan | null>;

  ensurePlansLoaded: () => Promise<boolean>;

  createPlan: (
    payload: CreateContributionPlanDto
  ) => Promise<boolean>;

  updatePlan: (
    planId: string,
    payload: UpdateContributionPlanDto
  ) => Promise<boolean>;

  activatePlan: (
    planId: string
  ) => Promise<boolean>;

  deactivatePlan: (
    planId: string
  ) => Promise<boolean>;

  archivePlan: (
    planId: string
  ) => Promise<boolean>;

  clearMessage: () => void;
}


export const ContributionPlanContext =
  createContext<ContributionPlanContextType | null>(
    null
  );


interface ContributionPlanProviderProps {
  children: ReactNode;
}


export const ContributionPlanProvider = ({
  children,
}: ContributionPlanProviderProps) => {

  const [plans, setPlans] =
    useState<ContributionPlan[]>([]);


  const [pagination, setPagination] =
    useState<Pagination | null>(null);


  const [loading, setLoading] =
    useState(false);


  const [message, setMessage] =
    useState("");


  /*
   * Preserve the latest filters so that
   * refreshing after a mutation does not
   * unexpectedly reset the current list.
   */
  const filtersRef =
    useRef<ContributionPlanFilters>({});


  /*
   * ============================================================
   * INTERNAL: REFRESH PLANS WITHOUT REPLACING MESSAGE
   * ============================================================
   */

  const refreshPlansSilently = useCallback(
    async (): Promise<void> => {

      try {

        const response =
          await contributionPlanService.getAll(
            filtersRef.current
          );

        if (!response.success) {
          return;
        }

        setPlans(
          response.data.data
        );

        setPagination({
          page: response.data.page,
          limit: response.data.limit,
          total: response.data.total,
          totalPages: response.data.totalPages,

          hasNextPage:
            response.data.page <
            response.data.totalPages,

          hasPreviousPage:
            response.data.page > 1,
        });

      } catch {
        /*
         * The mutation may have succeeded.
         * Do not replace its API message with
         * a secondary list-refresh error.
         */
      }

    },
    []
  );


  /*
   * ============================================================
   * FETCH ALL CONTRIBUTION PLANS
   * GET /contribution-plans
   * ============================================================
   */

  const fetchPlans = useCallback(
    async (
      filters?: ContributionPlanFilters
    ): Promise<boolean> => {

      try {

        setLoading(true);

        const appliedFilters =
          filters ?? {};

        filtersRef.current =
          appliedFilters;

        const response =
          await contributionPlanService.getAll(
            appliedFilters
          );

        setMessage(
          response.message
        );

        if (!response.success) {
          return false;
        }

        setPlans(
          response.data.data
        );

        setPagination({

          page: response.data.page,

          limit: response.data.limit,

          total: response.data.total,

          totalPages: response.data.totalPages,

          hasNextPage:
            response.data.page <
            response.data.totalPages,

          hasPreviousPage:
            response.data.page > 1,

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
   * FETCH SINGLE CONTRIBUTION PLAN
   * GET /contribution-plans/:id
   * ============================================================
   */

  const fetchPlan = useCallback(
    async (
      planId: string
    ): Promise<ContributionPlan | null> => {

      try {

        setLoading(true);

        const response =
          await contributionPlanService.getById(
            planId
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
   * FETCH CONTRIBUTION PLAN BY CODE
   * GET /contribution-plans/code/:code
   * ============================================================
   */

  const fetchPlanByCode = useCallback(
    async (
      code: string
    ): Promise<ContributionPlan | null> => {

      try {

        setLoading(true);

        const response =
          await contributionPlanService.getByCode(
            code
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
   * ENSURE PLANS ARE LOADED
   * ============================================================
   */

  const ensurePlansLoaded = useCallback(
    async (): Promise<boolean> => {

      if (plans.length > 0) {
        return true;
      }

      return fetchPlans();

    },
    [
      plans.length,
      fetchPlans,
    ]
  );


  /*
   * ============================================================
   * CREATE CONTRIBUTION PLAN
   * POST /contribution-plans
   * ============================================================
   */

  const createPlan = useCallback(
    async (
      payload: CreateContributionPlanDto
    ): Promise<boolean> => {

      try {

        setLoading(true);

        const response =
          await contributionPlanService.create(
            payload
          );

        setMessage(
          response.message
        );

        if (!response.success) {
          return false;
        }

        await refreshPlansSilently();

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
    [
      refreshPlansSilently,
    ]
  );


  /*
   * ============================================================
   * UPDATE CONTRIBUTION PLAN
   * PATCH /contribution-plans/:id
   * ============================================================
   */

  const updatePlan = useCallback(
    async (
      planId: string,
      payload: UpdateContributionPlanDto
    ): Promise<boolean> => {

      try {

        setLoading(true);

        const response =
          await contributionPlanService.update(
            planId,
            payload
          );

        setMessage(
          response.message
        );

        if (!response.success) {
          return false;
        }

        await refreshPlansSilently();

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
    [
      refreshPlansSilently,
    ]
  );


  /*
   * ============================================================
   * ACTIVATE CONTRIBUTION PLAN
   * PATCH /contribution-plans/:id/activate
   * ============================================================
   */

  const activatePlan = useCallback(
    async (
      planId: string
    ): Promise<boolean> => {

      try {

        setLoading(true);

        const response =
          await contributionPlanService.activate(
            planId
          );

        setMessage(
          response.message
        );

        if (!response.success) {
          return false;
        }

        await refreshPlansSilently();

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
    [
      refreshPlansSilently,
    ]
  );


  /*
   * ============================================================
   * DEACTIVATE CONTRIBUTION PLAN
   * PATCH /contribution-plans/:id/deactivate
   * ============================================================
   */

  const deactivatePlan = useCallback(
    async (
      planId: string
    ): Promise<boolean> => {

      try {

        setLoading(true);

        const response =
          await contributionPlanService.deactivate(
            planId
          );

        setMessage(
          response.message
        );

        if (!response.success) {
          return false;
        }

        await refreshPlansSilently();

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
    [
      refreshPlansSilently,
    ]
  );


  /*
   * ============================================================
   * ARCHIVE CONTRIBUTION PLAN
   * PATCH /contribution-plans/:id/archive
   * ============================================================
   */

  const archivePlan = useCallback(
    async (
      planId: string
    ): Promise<boolean> => {

      try {

        setLoading(true);

        const response =
          await contributionPlanService.archive(
            planId
          );

        setMessage(
          response.message
        );

        if (!response.success) {
          return false;
        }

        await refreshPlansSilently();

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
    [
      refreshPlansSilently,
    ]
  );


  /*
   * ============================================================
   * CLEAR MESSAGE
   * ============================================================
   */

  const clearMessage = useCallback(
    () => {

      setMessage("");

    },
    []
  );


  return (

    <ContributionPlanContext.Provider

      value={{

        plans,

        pagination,

        loading,

        message,

        setMessage,

        fetchPlans,

        fetchPlan,

        fetchPlanByCode,

        ensurePlansLoaded,

        createPlan,

        updatePlan,

        activatePlan,

        deactivatePlan,

        archivePlan,

        clearMessage,

      }}

    >

      {children}

    </ContributionPlanContext.Provider>

  );

};
