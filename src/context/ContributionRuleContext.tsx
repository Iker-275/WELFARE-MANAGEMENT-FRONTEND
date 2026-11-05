import {
  createContext,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from "react";

import contributionRuleService from "../api/ContributionRuleApi";

import {
  ContributionRule,
  CreateContributionRuleDto,
  UpdateContributionRuleDto,
  ContributionRuleFilters,
} from "../types/ContributionRuleType";

import { Pagination } from "../types/SharedTypes";
import { getApiError } from "../utils/apiError";

interface ContributionRuleContextType {
  rules: ContributionRule[];

  pagination: Pagination | null;

  loading: boolean;

  message: string;

  setMessage: React.Dispatch<
    React.SetStateAction<string>
  >;

  fetchRules: (
    filters?: ContributionRuleFilters
  ) => Promise<boolean>;

  fetchRule: (
    ruleId: string
  ) => Promise<ContributionRule | null>;

  createRule: (
    payload: CreateContributionRuleDto
  ) => Promise<boolean>;

  updateRule: (
    ruleId: string,
    payload: UpdateContributionRuleDto
  ) => Promise<boolean>;

  activateRule: (
    ruleId: string
  ) => Promise<boolean>;

  deactivateRule: (
    ruleId: string
  ) => Promise<boolean>;

  deleteRule: (
    ruleId: string
  ) => Promise<boolean>;

  ensureRulesLoaded: () => Promise<boolean>;

  clearMessage: () => void;
}

export const ContributionRuleContext =
  createContext<ContributionRuleContextType | null>(
    null
  );

interface ContributionRuleProviderProps {
  children: ReactNode;
}

export const ContributionRuleProvider = ({
  children,
}: ContributionRuleProviderProps) => {

  const [rules, setRules] =
    useState<ContributionRule[]>([]);

  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  /**
   * Preserve the latest filters so that
   * mutations refresh the currently displayed list.
   */
  const filtersRef =
    useRef<ContributionRuleFilters | undefined>(
      undefined
    );

  /*
   * ============================================================
   * SILENTLY REFRESH RULES
   *
   * This refresh deliberately does not update message.
   * It prevents a successful mutation message from being
   * replaced by the message returned by GET /contribution-rules.
   * ============================================================
   */

  const refreshRulesSilently = useCallback(
    async (): Promise<void> => {

      try {

        const response =
          await contributionRuleService.getAll(
            filtersRef.current
          );

        if (!response.success) {
          return;
        }

        setRules(
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
        /**
         * Do not overwrite the successful mutation
         * message if the background refresh fails.
         */
      }
    },
    []
  );

  /*
   * ============================================================
   * FETCH CONTRIBUTION RULES
   * ============================================================
   */

  const fetchRules = useCallback(
    async (
      filters?: ContributionRuleFilters
    ): Promise<boolean> => {

      try {

        setLoading(true);

        filtersRef.current = filters;

        const response =
          await contributionRuleService.getAll(
            filters
          );

        setMessage(
          response.message
        );

        if (!response.success) {
          return false;
        }

        setRules(
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
   * ENSURE RULES ARE LOADED
   * ============================================================
   */

  const ensureRulesLoaded = useCallback(
    async (): Promise<boolean> => {

      if (rules.length > 0) {
        return true;
      }

      return fetchRules();
    },
    [
      rules.length,
      fetchRules,
    ]
  );

  /*
   * ============================================================
   * FETCH SINGLE CONTRIBUTION RULE
   * ============================================================
   */

  const fetchRule = useCallback(
    async (
      ruleId: string
    ): Promise<ContributionRule | null> => {

      try {

        setLoading(true);

        const response =
          await contributionRuleService.getById(
            ruleId
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
   * CREATE CONTRIBUTION RULE
   * ============================================================
   */

  const createRule = useCallback(
    async (
      payload: CreateContributionRuleDto
    ): Promise<boolean> => {

      try {

        setLoading(true);

        const response =
          await contributionRuleService.create(
            payload
          );

        setMessage(
          response.message
        );

        if (!response.success) {
          return false;
        }

        /**
         * Refresh the collection without replacing
         * the creation success message.
         */
        await refreshRulesSilently();

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
      refreshRulesSilently,
    ]
  );

  /*
   * ============================================================
   * UPDATE CONTRIBUTION RULE
   * ============================================================
   */

  const updateRule = useCallback(
    async (
      ruleId: string,
      payload: UpdateContributionRuleDto
    ): Promise<boolean> => {

      try {

        setLoading(true);

        const response =
          await contributionRuleService.update(
            ruleId,
            payload
          );

        setMessage(
          response.message
        );

        if (!response.success) {
          return false;
        }

        await refreshRulesSilently();

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
      refreshRulesSilently,
    ]
  );

  /*
   * ============================================================
   * ACTIVATE CONTRIBUTION RULE
   * ============================================================
   */

  const activateRule = useCallback(
    async (
      ruleId: string
    ): Promise<boolean> => {

      try {

        setLoading(true);

        const response =
          await contributionRuleService.activate(
            ruleId
          );

        setMessage(
          response.message
        );

        if (!response.success) {
          return false;
        }

        await refreshRulesSilently();

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
      refreshRulesSilently,
    ]
  );

  /*
   * ============================================================
   * DEACTIVATE CONTRIBUTION RULE
   * ============================================================
   */

  const deactivateRule = useCallback(
    async (
      ruleId: string
    ): Promise<boolean> => {

      try {

        setLoading(true);

        const response =
          await contributionRuleService.deactivate(
            ruleId
          );

        setMessage(
          response.message
        );

        if (!response.success) {
          return false;
        }

        await refreshRulesSilently();

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
      refreshRulesSilently,
    ]
  );

  /*
   * ============================================================
   * DELETE CONTRIBUTION RULE
   * ============================================================
   */

  const deleteRule = useCallback(
    async (
      ruleId: string
    ): Promise<boolean> => {

      try {

        setLoading(true);

        const response =
          await contributionRuleService.delete(
            ruleId
          );

        setMessage(
          response.message
        );

        if (!response.success) {
          return false;
        }

        /**
         * Refresh the collection so pagination
         * and totals remain accurate.
         *
         * The delete success message is preserved.
         */
        await refreshRulesSilently();

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
      refreshRulesSilently,
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
    <ContributionRuleContext.Provider
      value={{
        rules,

        pagination,

        loading,
        message,
        setMessage,

        fetchRules,
        fetchRule,
        ensureRulesLoaded,

        createRule,
        updateRule,
        activateRule,
        deactivateRule,
        deleteRule,

        clearMessage,
      }}
    >
      {children}
    </ContributionRuleContext.Provider>
  );
};