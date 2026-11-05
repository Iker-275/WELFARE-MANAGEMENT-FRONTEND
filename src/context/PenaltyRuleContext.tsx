import {
    createContext,
    ReactNode,
    useCallback,
    useRef,
    useState,
} from "react";

import penaltyRuleService from "../api/PenaltyRuleApi";

import {
    CreatePenaltyRuleDto,
    PenaltyRule,
    PenaltyRuleFilters,
} from "../types/PenaltyRuleType";

import { Pagination } from "../types/SharedTypes";
import { getApiError } from "../utils/apiError";

interface PenaltyRuleContextType {
    penaltyRules: PenaltyRule[];
    applicableRules: PenaltyRule[];
    planRules: PenaltyRule[];

    selectedPenaltyRule: PenaltyRule | null;

    pagination: Pagination | null;
    planPagination: Pagination | null;

    loading: boolean;
    message: string | null;

    setMessage: (message: string | null) => void;
    clearMessage: () => void;

    fetchPenaltyRules: (
        filters?: PenaltyRuleFilters,
    ) => Promise<Boolean>;

    fetchApplicablePenaltyRules: () => Promise<PenaltyRule[] | null>;

    fetchPenaltyRule: (
        penaltyRuleId: string,
    ) => Promise<PenaltyRule | null>;

    fetchPenaltyRuleByCode: (
        code: string,
    ) => Promise<PenaltyRule | null>;

    fetchPenaltyRulesByPlan: (
        contributionPlanId: string,
        filters?: PenaltyRuleFilters,
    ) => Promise<boolean>;

    createPenaltyRule: (
        payload: CreatePenaltyRuleDto,
    ) => Promise<PenaltyRule | null>;

    activatePenaltyRule: (
        penaltyRuleId: string,
    ) => Promise<boolean>;

    deactivatePenaltyRule: (
        penaltyRuleId: string,
    ) => Promise<boolean>;

    ensurePenaltyRulesLoaded: () => Promise<boolean>;
}

export const PenaltyRuleContext =
    createContext<PenaltyRuleContextType | undefined>(undefined);

interface PenaltyRuleProviderProps {
    children: ReactNode;
}

type PenaltyRuleListResponse = {
    message: string;
    data: {
        data: PenaltyRule[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
};

type PenaltyRuleListRequest = () => Promise<PenaltyRuleListResponse>;

export const PenaltyRuleProvider = ({
    children,
}: PenaltyRuleProviderProps) => {
    const [penaltyRules, setPenaltyRules] = useState<PenaltyRule[]>([]);
    const [applicableRules, setApplicableRules] = useState<PenaltyRule[]>(
        [],
    );
    const [planRules, setPlanRules] = useState<PenaltyRule[]>([]);

    const [selectedPenaltyRule, setSelectedPenaltyRule] =
        useState<PenaltyRule | null>(null);

    const [pagination, setPagination] =
        useState<Pagination | null>(null);

    const [planPagination, setPlanPagination] =
        useState<Pagination | null>(null);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const lastListRequest =
        useRef<PenaltyRuleListRequest | null>(null);

    const hasLoadedRules = useRef(false);

    const clearMessage = useCallback(() => {
        setMessage(null);
    }, []);

    // ---------------------------------------------------------
    // UPDATE RULE IN ALL RELEVANT STATE COLLECTIONS
    // ---------------------------------------------------------

    const updateRuleInState = useCallback((rule: PenaltyRule) => {
        setSelectedPenaltyRule((current) =>
            current?.id === rule.id ? rule : current,
        );

        setPenaltyRules((current) =>
            current.map((item) =>
                item.id === rule.id ? rule : item,
            ),
        );

        setApplicableRules((current) =>
            rule.isActive
                ? current.map((item) =>
                      item.id === rule.id ? rule : item,
                  )
                : current.filter((item) => item.id !== rule.id),
        );

        setPlanRules((current) =>
            current.map((item) =>
                item.id === rule.id ? rule : item,
            ),
        );
    }, []);

    // ---------------------------------------------------------
    // SHARED PAGINATED LIST LOADER
    // ---------------------------------------------------------

    const loadPenaltyRuleList = useCallback(
        async (
            request: PenaltyRuleListRequest,
            target: "GENERAL" | "PLAN",
            silent = false,
        ): Promise<boolean> => {
            if (!silent) {
                setLoading(true);
                setMessage(null);
            }

            try {
                const response = await request();
                const result = response.data;

                const paginationData: Pagination = {
                    page: result.page,
                    limit: result.limit,
                    total: result.total,
                    totalPages: result.totalPages,
                    hasNextPage: result.page < result.totalPages,
                    hasPreviousPage: result.page > 1,
                };

                if (target === "GENERAL") {
                    setPenaltyRules(result.data);
                    setPagination(paginationData);
                    hasLoadedRules.current = true;
                } else {
                    setPlanRules(result.data);
                    setPlanPagination(paginationData);
                }

                if (!silent) {
                    setMessage(response.message);
                }

                return true;
            } catch (error) {
                if (!silent) {
                    setMessage(
                        getApiError(
                            error,
                           
                        ).message,
                    );
                }

                return false;
            } finally {
                if (!silent) {
                    setLoading(false);
                }
            }
        },
        [],
    );

    // ---------------------------------------------------------
    // REFRESH LAST PAGINATED LIST
    // ---------------------------------------------------------

    const refreshLastList = useCallback(async () => {
        if (!lastListRequest.current) return;

        try {
            await lastListRequest.current();
        } catch {
            // Keep the original mutation message.
        }
    }, []);

    // ---------------------------------------------------------
    // GET ALL PENALTY RULES
    // ---------------------------------------------------------

    const fetchPenaltyRules = useCallback(
        async (
            filters: PenaltyRuleFilters = {},
        ): Promise<boolean> => {
            const request = () => penaltyRuleService.getAll(filters);

            // lastListRequest.current = async () => {
            //     await loadPenaltyRuleList(request, "GENERAL", true);
            // };

            return loadPenaltyRuleList(request, "GENERAL");
        },
        [loadPenaltyRuleList],
    );

  const fetchPenaltyRulesByPlan = useCallback(
        async (
            contributionPlanId: string,
            filters: PenaltyRuleFilters = {},
        ): Promise<boolean> => {
            const request = () =>
                penaltyRuleService.getByPlan(
                    contributionPlanId,
                    filters,
                );

            return loadPenaltyRuleList(request, "PLAN");
        },
        [loadPenaltyRuleList],
    );



    // ---------------------------------------------------------
    // GET APPLICABLE PENALTY RULES
    // ---------------------------------------------------------

    const fetchApplicablePenaltyRules = useCallback(
        async (): Promise<PenaltyRule[] | null> => {
            setLoading(true);
            setMessage(null);

            try {
                const response =
                    await penaltyRuleService.getApplicable();

                setApplicableRules(response.data);
                setMessage(response.message);

                return response.data;
            } catch (error) {
                setMessage(
                    getApiError(
                        error,
                      
                    ).message,
                );

                return null;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    // ---------------------------------------------------------
    // GET PENALTY RULE BY ID
    // ---------------------------------------------------------

    const fetchPenaltyRule = useCallback(
        async (
            penaltyRuleId: string,
        ): Promise<PenaltyRule | null> => {
            setLoading(true);
            setMessage(null);

            try {
                const response =
                    await penaltyRuleService.getById(penaltyRuleId);

                setSelectedPenaltyRule(response.data);
                setMessage(response.message);

                return response.data;
            } catch (error) {
                setMessage(
                    getApiError(
                        error,
                       
                    ).message,
                );

                return null;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    // ---------------------------------------------------------
    // GET PENALTY RULE BY CODE
    // ---------------------------------------------------------

    const fetchPenaltyRuleByCode = useCallback(
        async (code: string): Promise<PenaltyRule | null> => {
            setLoading(true);
            setMessage(null);

            try {
                const response = await penaltyRuleService.getByCode(code);

                setSelectedPenaltyRule(response.data);
                setMessage(response.message);

                return response.data;
            } catch (error) {
                setMessage(
                    getApiError(
                        error,
                       
                    ).message,
                );

                return null;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    // ---------------------------------------------------------
    // GET PENALTY RULES BY CONTRIBUTION PLAN
    // ---------------------------------------------------------

  
    // ---------------------------------------------------------
    // CREATE PENALTY RULE
    // ---------------------------------------------------------

    const createPenaltyRule = useCallback(
        async (
            payload: CreatePenaltyRuleDto,
        ): Promise<PenaltyRule | null> => {
            setLoading(true);
            setMessage(null);

            try {
                const response =
                    await penaltyRuleService.create(payload);

                setSelectedPenaltyRule(response.data);
                setMessage(response.message);

                await refreshLastList();

                return response.data;
            } catch (error) {
                setMessage(
                    getApiError(
                        error,
                      
                    ).message,
                );

                return null;
            } finally {
                setLoading(false);
            }
        },
        [refreshLastList],
    );

    // ---------------------------------------------------------
    // SHARED ACTIVATE / DEACTIVATE HANDLER
    // ---------------------------------------------------------

    const changePenaltyRuleStatus = useCallback(
        async (
            penaltyRuleId: string,
            action: "activate" | "deactivate",
        ): Promise<boolean> => {
            setLoading(true);
            setMessage(null);

            try {
                const response =
                    action === "activate"
                        ? await penaltyRuleService.activate(penaltyRuleId)
                        : await penaltyRuleService.deactivate(penaltyRuleId);

                updateRuleInState(response.data);
                setMessage(response.message);

                await refreshLastList();

                return true;
            } catch (error) {
                setMessage(
                    getApiError(
                        error,
                       
                    ).message,
                );

                return false;
            } finally {
                setLoading(false);
            }
        },
        [refreshLastList, updateRuleInState],
    );

    // ---------------------------------------------------------
    // ACTIVATE PENALTY RULE
    // ---------------------------------------------------------

    const activatePenaltyRule = useCallback(
        async (penaltyRuleId: string): Promise<boolean> => {
            return changePenaltyRuleStatus(
                penaltyRuleId,
                "activate",
            );
        },
        [changePenaltyRuleStatus],
    );

    // ---------------------------------------------------------
    // DEACTIVATE PENALTY RULE
    // ---------------------------------------------------------

    const deactivatePenaltyRule = useCallback(
        async (penaltyRuleId: string): Promise<boolean> => {
            return changePenaltyRuleStatus(
                penaltyRuleId,
                "deactivate",
            );
        },
        [changePenaltyRuleStatus],
    );

    // ---------------------------------------------------------
    // ENSURE RULES ARE LOADED
    // ---------------------------------------------------------

    const ensurePenaltyRulesLoaded = useCallback(async (): Promise<boolean> => {
        if (hasLoadedRules.current) {
            return true;
        }

        return fetchPenaltyRules();
    }, [fetchPenaltyRules]);

    return (
        <PenaltyRuleContext.Provider
            value={{
                penaltyRules,
                applicableRules,
                planRules,

                selectedPenaltyRule,

                pagination,
                planPagination,

                loading,
                message,

                setMessage,
                clearMessage,

                fetchPenaltyRules,
                fetchApplicablePenaltyRules,
                fetchPenaltyRule,
                fetchPenaltyRuleByCode,
                fetchPenaltyRulesByPlan,

                createPenaltyRule,
                activatePenaltyRule,
                deactivatePenaltyRule,

                ensurePenaltyRulesLoaded,
            }}
        >
            {children}
        </PenaltyRuleContext.Provider>
    );
};

