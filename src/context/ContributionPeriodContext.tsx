// import {
//     createContext,
//     ReactNode,
//     useCallback,
//     useRef,
//     useState,
// } from "react";

// import contributionPeriodService from "../api/ContributionPeriodApi";

// import {
//     ContributionPeriod,
//     ContributionPeriodListData,
//     GenerateContributionPeriodDto,
//     GenerateContributionPeriodsBatchDto,
// } from "../types/ContributionPeriodType";

// import { Pagination } from "../types/SharedTypes";
// import { getApiError } from "../utils/apiError";

// type PeriodFetchMode = "ALL" | "PLAN";

// interface ContributionPeriodContextType {
//     periods: ContributionPeriod[];
//     pagination: Pagination | null;
//     loading: boolean;
//     message: string | null;

//     setMessage: (message: string | null) => void;
//     clearMessage: () => void;

//     fetchPeriods: () => Promise<boolean>;
//     fetchPeriodsByPlan: (planId: string) => Promise<boolean>;
//     fetchPeriod: (periodId: string) => Promise<ContributionPeriod | null>;

//     ensurePeriodsLoaded: () => Promise<boolean>;

//     generatePeriod: (
//         payload: GenerateContributionPeriodDto
//     ) => Promise<boolean>;

//     generateBatch: (
//         payload: GenerateContributionPeriodsBatchDto
//     ) => Promise<boolean>;

//     openPeriod: (periodId: string) => Promise<boolean>;
//     closePeriod: (periodId: string) => Promise<boolean>;
//     markPeriodDue: (periodId: string) => Promise<boolean>;
//     markPeriodOverdue: (periodId: string) => Promise<boolean>;
// }

// export const ContributionPeriodContext =
//     createContext<ContributionPeriodContextType | undefined>(undefined);

// interface ContributionPeriodProviderProps {
//     children: ReactNode;
// }

// export const ContributionPeriodProvider = ({
//     children,
// }: ContributionPeriodProviderProps) => {
//     const [periods, setPeriods] = useState<ContributionPeriod[]>([]);
//     const [pagination, setPagination] = useState<Pagination | null>(null);
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState<string | null>(null);

//     /**
//      * Keeps track of the last list request.
//      * This allows mutations to refresh the same list
//      * without replacing the mutation's success message.
//      */
//     const fetchModeRef = useRef<PeriodFetchMode>("ALL");
//     const planIdRef = useRef<string | null>(null);
//     const hasFetchedRef = useRef(false);

//     const updatePeriodsAndPagination = useCallback(
//         (data: ContributionPeriodListData) => {
//             setPeriods(data.data);

//             setPagination({
//                 page: data.page,
//                 limit: data.limit,
//                 total: data.total,
//                 totalPages: data.totalPages,
//                 hasNextPage: data.page < data.totalPages,
//                 hasPreviousPage: data.page > 1,
//             });
//         },
//         []
//     );

//     /**
//      * Fetch all contribution periods.
//      */
//     const fetchPeriods = useCallback(async (): Promise<boolean> => {
//         setLoading(true);
//         fetchModeRef.current = "ALL";
//         planIdRef.current = null;

//         try {
//             const response = await contributionPeriodService.getAll();

//             setMessage(response.message);

//             if (!response.success) {
//                 return false;
//             }

//             updatePeriodsAndPagination(response.data);
//             hasFetchedRef.current = true;

//             return true;
//         } catch (error) {
//             const apiError = getApiError(error);
//             setMessage(apiError.message);

//             return false;
//         } finally {
//             setLoading(false);
//         }
//     }, [updatePeriodsAndPagination]);

//     /**
//      * Fetch periods belonging to a specific contribution plan.
//      */
//     const fetchPeriodsByPlan = useCallback(
//         async (planId: string): Promise<boolean> => {
//             setLoading(true);
//             fetchModeRef.current = "PLAN";
//             planIdRef.current = planId;

//             try {
//                 const response =
//                     await contributionPeriodService.getByPlan(planId);

//                 setMessage(response.message);

//                 if (!response.success) {
//                     return false;
//                 }

//                 updatePeriodsAndPagination(response.data);
//                 hasFetchedRef.current = true;

//                 return true;
//             } catch (error) {
//                 const apiError = getApiError(error);
//                 setMessage(apiError.message);

//                 return false;
//             } finally {
//                 setLoading(false);
//             }
//         },
//         [updatePeriodsAndPagination]
//     );

//     /**
//      * Fetch one contribution period.
//      */
//     const fetchPeriod = useCallback(
//         async (
//             periodId: string
//         ): Promise<ContributionPeriod | null> => {
//             setLoading(true);

//             try {
//                 const response =
//                     await contributionPeriodService.getById(periodId);

//                 setMessage(response.message);

//                 if (!response.success) {
//                     return null;
//                 }

//                 return response.data;
//             } catch (error) {
//                 const apiError = getApiError(error);
//                 setMessage(apiError.message);

//                 return null;
//             } finally {
//                 setLoading(false);
//             }
//         },
//         []
//     );

//     /**
//      * Refresh the last requested list without changing
//      * the current message or loading state.
//      *
//      * This is intentionally silent so a successful mutation
//      * message is not replaced by the subsequent GET message.
//      */
//     const refreshPeriodsSilently = useCallback(async (): Promise<void> => {
//         try {
//             const response =
//                 fetchModeRef.current === "PLAN" && planIdRef.current
//                     ? await contributionPeriodService.getByPlan(
//                         planIdRef.current
//                     )
//                     : await contributionPeriodService.getAll();

//             if (response.success) {
//                 updatePeriodsAndPagination(response.data);
//                 hasFetchedRef.current = true;
//             }
//         } catch {
//             // Do not overwrite the successful mutation message.
//         }
//     }, [updatePeriodsAndPagination]);

//     /**
//      * Ensure periods have been fetched at least once.
//      */
//     const ensurePeriodsLoaded = useCallback(async (): Promise<boolean> => {
//         if (hasFetchedRef.current) {
//             return true;
//         }

//         return fetchPeriods();
//     }, [fetchPeriods]);

//     /**
//      * Generate one contribution period.
//      */
//     const generatePeriod = useCallback(
//         async (
//             payload: GenerateContributionPeriodDto
//         ): Promise<boolean> => {
//             setLoading(true);

//             try {
//                 const response =
//                     await contributionPeriodService.generate(payload);

//                 setMessage(response.message);

//                 if (!response.success) {
//                     return false;
//                 }

//                 await refreshPeriodsSilently();

//                 return true;
//             } catch (error) {
//                 const apiError = getApiError(error);
//                 setMessage(apiError.message);

//                 return false;
//             } finally {
//                 setLoading(false);
//             }
//         },
//         [refreshPeriodsSilently]
//     );

//     /**
//      * Generate multiple contribution periods automatically.
//      */
//     const generateBatch = useCallback(
//         async (
//             payload: GenerateContributionPeriodsBatchDto
//         ): Promise<boolean> => {
//             setLoading(true);

//             try {
//                 const response =
//                     await contributionPeriodService.generateBatch(payload);

//                 setMessage(response.message);

//                 if (!response.success) {
//                     return false;
//                 }

//                 await refreshPeriodsSilently();

//                 return true;
//             } catch (error) {
//                 const apiError = getApiError(error);
//                 setMessage(apiError.message);

//                 return false;
//             } finally {
//                 setLoading(false);
//             }
//         },
//         [refreshPeriodsSilently]
//     );

//     /**
//      * Shared handler for period status actions.
//      */
//     const executePeriodAction = useCallback(
//         async (
//             action: () => Promise<{
//                 success: boolean;
//                 message: string;
//             }>
//         ): Promise<boolean> => {
//             setLoading(true);

//             try {
//                 const response = await action();

//                 setMessage(response.message);

//                 if (!response.success) {
//                     return false;
//                 }

//                 await refreshPeriodsSilently();

//                 return true;
//             } catch (error) {
//                 const apiError = getApiError(error);
//                 setMessage(apiError.message);

//                 return false;
//             } finally {
//                 setLoading(false);
//             }
//         },
//         [refreshPeriodsSilently]
//     );

//     /**
//      * Open a contribution period.
//      */
//     const openPeriod = useCallback(
//         async (periodId: string): Promise<boolean> => {
//             return executePeriodAction(() =>
//                 contributionPeriodService.open(periodId)
//             );
//         },
//         [executePeriodAction]
//     );

//     const closePeriod = useCallback(
//         (periodId: string) => executePeriodAction(
//             () => contributionPeriodService.close(periodId)
//         ),
//         [executePeriodAction]
//     );



//     /**
//      * Mark a contribution period as due.
//      */
//     const markPeriodDue = useCallback(
//         async (periodId: string): Promise<boolean> => {
//             return executePeriodAction(() =>
//                 contributionPeriodService.markDue(periodId)
//             );
//         },
//         [executePeriodAction]
//     );

//     /**
//      * Mark a contribution period as overdue.
//      */
//     const markPeriodOverdue = useCallback(
//         async (periodId: string): Promise<boolean> => {
//             return executePeriodAction(() =>
//                 contributionPeriodService.markOverdue(periodId)
//             );
//         },
//         [executePeriodAction]
//     );

//     const clearMessage = useCallback(() => {
//         setMessage(null);
//     }, []);

//     return (
//         <ContributionPeriodContext.Provider
//             value={{
//                 periods,
//                 pagination,
//                 loading,
//                 message,

//                 setMessage,
//                 clearMessage,

//                 fetchPeriods,
//                 fetchPeriodsByPlan,
//                 fetchPeriod,
//                 ensurePeriodsLoaded,

//                 generatePeriod,
//                 generateBatch,

//                 openPeriod,
//                 closePeriod,
//                 markPeriodDue,
//                 markPeriodOverdue,
//             }}
//         >
//             {children}
//         </ContributionPeriodContext.Provider>
//     );
// };



import {
    createContext,
    ReactNode,
    useCallback,
    useRef,
    useState,
} from "react";

import contributionPeriodService from "../api/ContributionPeriodApi";

import {
    ContributionPeriod,
    ContributionPeriodListData,
    GenerateContributionPeriodDto,
    GenerateContributionPeriodsBatchDto,
} from "../types/ContributionPeriodType";

import { Pagination } from "../types/SharedTypes";
import { getApiError } from "../utils/apiError";

type PeriodFetchMode = "ALL" | "PLAN";

interface ContributionPeriodContextType {
    periods: ContributionPeriod[];
    pagination: Pagination | null;
    loading: boolean;
    message: string | null;

    setMessage: (message: string | null) => void;
    clearMessage: () => void;

    fetchPeriods: (page?: number, limit?: number) => Promise<boolean>;
    fetchPeriodsByPlan: (
        planId: string,
        page?: number,
        limit?: number
    ) => Promise<boolean>;

    fetchPeriod: (periodId: string) => Promise<ContributionPeriod | null>;

    ensurePeriodsLoaded: () => Promise<boolean>;

    generatePeriod: (
        payload: GenerateContributionPeriodDto
    ) => Promise<boolean>;

    generateBatch: (
        payload: GenerateContributionPeriodsBatchDto
    ) => Promise<boolean>;

    openPeriod: (periodId: string) => Promise<boolean>;
    closePeriod: (periodId: string) => Promise<boolean>;
    markPeriodDue: (periodId: string) => Promise<boolean>;
    markPeriodOverdue: (periodId: string) => Promise<boolean>;
}

export const ContributionPeriodContext =
    createContext<ContributionPeriodContextType | undefined>(undefined);

interface ContributionPeriodProviderProps {
    children: ReactNode;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const ContributionPeriodProvider = ({
    children,
}: ContributionPeriodProviderProps) => {
    const [periods, setPeriods] = useState<ContributionPeriod[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    /**
     * Keeps track of the last list request.
     */
    const fetchModeRef = useRef<PeriodFetchMode>("ALL");
    const planIdRef = useRef<string | null>(null);
    const pageRef = useRef(DEFAULT_PAGE);
    const limitRef = useRef(DEFAULT_LIMIT);
    const hasFetchedRef = useRef(false);

    /**
     * Update periods and pagination from the backend.
     */
    const updatePeriodsAndPagination = useCallback(
        (data: ContributionPeriodListData) => {
            setPeriods(data.data);

            setPagination({
                page: data.page,
                limit: data.limit,
                total: data.total,
                totalPages: data.totalPages,
                hasNextPage: data.page < data.totalPages,
                hasPreviousPage: data.page > 1,
            });

            pageRef.current = data.page;
            limitRef.current = data.limit;
        },
        []
    );

    /**
     * Fetch all contribution periods.
     */
    const fetchPeriods = useCallback(
        async (
            page: number = DEFAULT_PAGE,
            limit: number = DEFAULT_LIMIT
        ): Promise<boolean> => {
            setLoading(true);

            fetchModeRef.current = "ALL";
            planIdRef.current = null;
            pageRef.current = page;
            limitRef.current = limit;

            try {
                const response = await contributionPeriodService.getAll(
                    page,
                    limit
                );

                setMessage(response.message);

                if (!response.success) {
                    return false;
                }

                updatePeriodsAndPagination(response.data);
                hasFetchedRef.current = true;

                return true;
            } catch (error) {
                const apiError = getApiError(error);
                setMessage(apiError.message);

                return false;
            } finally {
                setLoading(false);
            }
        },
        [updatePeriodsAndPagination]
    );

    /**
     * Fetch periods belonging to a specific contribution plan.
     */
    const fetchPeriodsByPlan = useCallback(
        async (
            planId: string,
            page: number = DEFAULT_PAGE,
            limit: number = DEFAULT_LIMIT
        ): Promise<boolean> => {
            setLoading(true);

            fetchModeRef.current = "PLAN";
            planIdRef.current = planId;
            pageRef.current = page;
            limitRef.current = limit;

            try {
                const response =
                    await contributionPeriodService.getByPlan(
                        planId,
                        page,
                        limit
                    );

                setMessage(response.message);

                if (!response.success) {
                    return false;
                }

                updatePeriodsAndPagination(response.data);
                hasFetchedRef.current = true;

                return true;
            } catch (error) {
                const apiError = getApiError(error);
                setMessage(apiError.message);

                return false;
            } finally {
                setLoading(false);
            }
        },
        [updatePeriodsAndPagination]
    );

    /**
     * Fetch one contribution period.
     */
    const fetchPeriod = useCallback(
        async (
            periodId: string
        ): Promise<ContributionPeriod | null> => {
            setLoading(true);

            try {
                const response =
                    await contributionPeriodService.getById(periodId);

                setMessage(response.message);

                if (!response.success) {
                    return null;
                }

                return response.data;
            } catch (error) {
                const apiError = getApiError(error);
                setMessage(apiError.message);

                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * Refresh the last requested list without replacing
     * the current operation message.
     */
    const refreshPeriodsSilently = useCallback(async (): Promise<void> => {
        try {
            const response =
                fetchModeRef.current === "PLAN" && planIdRef.current
                    ? await contributionPeriodService.getByPlan(
                        planIdRef.current,
                        pageRef.current,
                        limitRef.current
                    )
                    : await contributionPeriodService.getAll(
                        pageRef.current,
                        limitRef.current
                    );

            if (response.success) {
                updatePeriodsAndPagination(response.data);
                hasFetchedRef.current = true;
            }
        } catch {
            // Preserve the mutation message.
        }
    }, [updatePeriodsAndPagination]);

    /**
     * Ensure periods have been fetched at least once.
     */
    const ensurePeriodsLoaded = useCallback(async (): Promise<boolean> => {
        if (hasFetchedRef.current) {
            return true;
        }

        return fetchPeriods();
    }, [fetchPeriods]);

    /**
     * Generate one contribution period.
     */
    const generatePeriod = useCallback(
        async (
            payload: GenerateContributionPeriodDto
        ): Promise<boolean> => {
            setLoading(true);

            try {
                const response =
                    await contributionPeriodService.generate(payload);

                setMessage(response.message);

                if (!response.success) {
                    return false;
                }

                await refreshPeriodsSilently();

                return true;
            } catch (error) {
                const apiError = getApiError(error);
                setMessage(apiError.message);

                return false;
            } finally {
                setLoading(false);
            }
        },
        [refreshPeriodsSilently]
    );

    /**
     * Generate multiple contribution periods.
     */
    const generateBatch = useCallback(
        async (
            payload: GenerateContributionPeriodsBatchDto
        ): Promise<boolean> => {
            setLoading(true);

            try {
                const response =
                    await contributionPeriodService.generateBatch(payload);

                setMessage(response.message);

                if (!response.success) {
                    return false;
                }

                await refreshPeriodsSilently();

                return true;
            } catch (error) {
                const apiError = getApiError(error);
                setMessage(apiError.message);

                return false;
            } finally {
                setLoading(false);
            }
        },
        [refreshPeriodsSilently]
    );

    /**
     * Shared handler for period status actions.
     */
    const executePeriodAction = useCallback(
        async (
            action: () => Promise<{
                success: boolean;
                message: string;
            }>
        ): Promise<boolean> => {
            setLoading(true);

            try {
                const response = await action();

                setMessage(response.message);

                if (!response.success) {
                    return false;
                }

                await refreshPeriodsSilently();

                return true;
            } catch (error) {
                const apiError = getApiError(error);
                setMessage(apiError.message);

                return false;
            } finally {
                setLoading(false);
            }
        },
        [refreshPeriodsSilently]
    );

    /**
     * Open a contribution period.
     */
    const openPeriod = useCallback(
        async (periodId: string): Promise<boolean> => {
            return executePeriodAction(() =>
                contributionPeriodService.open(periodId)
            );
        },
        [executePeriodAction]
    );

    /**
     * Close a contribution period.
     */
    const closePeriod = useCallback(
        async (periodId: string): Promise<boolean> => {
            return executePeriodAction(() =>
                contributionPeriodService.close(periodId)
            );
        },
        [executePeriodAction]
    );

    /**
     * Mark a contribution period as due.
     */
    const markPeriodDue = useCallback(
        async (periodId: string): Promise<boolean> => {
            return executePeriodAction(() =>
                contributionPeriodService.markDue(periodId)
            );
        },
        [executePeriodAction]
    );

    /**
     * Mark a contribution period as overdue.
     */
    const markPeriodOverdue = useCallback(
        async (periodId: string): Promise<boolean> => {
            return executePeriodAction(() =>
                contributionPeriodService.markOverdue(periodId)
            );
        },
        [executePeriodAction]
    );

    const clearMessage = useCallback(() => {
        setMessage(null);
    }, []);

    return (
        <ContributionPeriodContext.Provider
            value={{
                periods,
                pagination,
                loading,
                message,

                setMessage,
                clearMessage,

                fetchPeriods,
                fetchPeriodsByPlan,
                fetchPeriod,
                ensurePeriodsLoaded,

                generatePeriod,
                generateBatch,

                openPeriod,
                closePeriod,
                markPeriodDue,
                markPeriodOverdue,
            }}
        >
            {children}
        </ContributionPeriodContext.Provider>
    );
};
