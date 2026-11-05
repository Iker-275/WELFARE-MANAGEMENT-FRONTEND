
import {
    createContext,
    ReactNode,
    useCallback,
    useRef,
    useState,
} from "react";

import { memberContributionService } from "../api/MemberContributionApi";

import {
    MemberContribution,
    MemberContributionFilters,
    MemberContributionListData,
    PayMemberContributionDto,
    PeriodContributionFilters,
    WaiveMemberContributionDto,
    GenerateMemberContributionDto,
    GenerateBulkMemberContributionsDto,
    BulkGenerationResult,
    OverdueContributionFilters,
    ContributionTotalsFilters,
    ContributionTotals,
    ContributionStatusCountFilters,
    ContributionStatusCount,
    MemberContributionHistoryFilters,
    PlanContributionFilters,
} from "../types/MemberContributionType";

import { Pagination } from "../types/SharedTypes";
import { getApiError } from "../utils/apiError";

type MemberContributionContextType = {
    contributions: MemberContribution[];
    pagination: Pagination | null;
    loading: boolean;
    message: string;

    totals: ContributionTotals | null;
    statusCounts: ContributionStatusCount[];

    setMessage: (message: string) => void;
    clearMessage: () => void;

    fetchContributions: (
        filters?: MemberContributionFilters,
    ) => Promise<boolean>;

    fetchPeriodContributions: (
        periodId: string,
        filters?: PeriodContributionFilters,
    ) => Promise<boolean>;

    fetchContribution: (
        contributionId: string,
    ) => Promise<MemberContribution | null>;

    fetchOverdueContributions: (
        filters?: OverdueContributionFilters,
    ) => Promise<boolean>;

    fetchContributionTotals: (
        filters?: ContributionTotalsFilters,
    ) => Promise<ContributionTotals | null>;

    fetchContributionStatusCounts: (
        filters?: ContributionStatusCountFilters,
    ) => Promise<ContributionStatusCount[] | null>;

    fetchMemberContributionHistory: (
        memberId: string,
        filters?: MemberContributionHistoryFilters,
    ) => Promise<boolean>;

    fetchPlanContributions: (
        planId: string,
        filters?: PlanContributionFilters,
    ) => Promise<boolean>;

    generateContribution: (
        payload: GenerateMemberContributionDto,
    ) => Promise<MemberContribution | null>;

    generateBulkContributions: (
        payload: GenerateBulkMemberContributionsDto,
    ) => Promise<BulkGenerationResult | null>;

    ensureContributionsLoaded: () => Promise<boolean>;

    payContribution: (
        contributionId: string,
        payload: PayMemberContributionDto,
    ) => Promise<boolean>;

    markContributionOverdue: (
        contributionId: string,
    ) => Promise<boolean>;

    waiveContribution: (
        contributionId: string,
        payload: WaiveMemberContributionDto,
    ) => Promise<boolean>;

    cancelContribution: (
        contributionId: string,
    ) => Promise<boolean>;
};

export const MemberContributionContext =
    createContext<MemberContributionContextType | undefined>(undefined);

interface MemberContributionProviderProps {
    children: ReactNode;
}

type LastFetchMode =
    | "ALL"
    | "PERIOD"
    | "OVERDUE"
    | "MEMBER_HISTORY"
    | "PLAN"
    | null;

type LastFetchFilters =
    | MemberContributionFilters
    | PeriodContributionFilters
    | OverdueContributionFilters
    | MemberContributionHistoryFilters
    | PlanContributionFilters;

interface LastFetchState {
    mode: LastFetchMode;
    filters: LastFetchFilters;
    resourceId: string | null;
}

const initialLastFetchState: LastFetchState = {
    mode: null,
    filters: {},
    resourceId: null,
};

export const MemberContributionProvider = ({
    children,
}: MemberContributionProviderProps) => {
    const [contributions, setContributions] = useState<MemberContribution[]>(
        [],
    );

    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [totals, setTotals] = useState<ContributionTotals | null>(null);

    const [statusCounts, setStatusCounts] = useState<
        ContributionStatusCount[]
    >([]);

    const lastFetchRef = useRef<LastFetchState>(
        initialLastFetchState,
    );

    const hasFetchedRef = useRef(false);

    const clearMessage = useCallback(() => {
        setMessage("");
    }, []);

    /**
     * Update the contribution list and shared pagination state.
     */
    const updateListState = useCallback(
        (listData: MemberContributionListData) => {
            setContributions(listData.data);

            setPagination({
                page: listData.page,
                limit: listData.limit,
                total: listData.total,
                totalPages: listData.totalPages,
                hasNextPage: listData.page < listData.totalPages,
                hasPreviousPage: listData.page > 1,
            });

            hasFetchedRef.current = true;
        },
        [],
    );

    /**
     * Fetch all member contributions.
     */
    const fetchContributions = useCallback(
        async (
            filters: MemberContributionFilters = {},
        ): Promise<boolean> => {
            setLoading(true);

            lastFetchRef.current = {
                mode: "ALL",
                filters: { ...filters },
                resourceId: null,
            };

            try {
                const response =
                    await memberContributionService.getAll(filters);

                if (!response.success) {
                    setMessage(response.message);
                    return false;
                }

                updateListState(response.data);
                setMessage(response.message);

                return true;
            } catch (error) {
                setMessage(getApiError(error).message);
                return false;
            } finally {
                setLoading(false);
            }
        },
        [updateListState],
    );

    /**
     * Fetch contributions belonging to a specific period.
     */
    const fetchPeriodContributions = useCallback(
        async (
            periodId: string,
            filters: PeriodContributionFilters = {},
        ): Promise<boolean> => {
            setLoading(true);

            lastFetchRef.current = {
                mode: "PERIOD",
                filters: { ...filters },
                resourceId: periodId,
            };

            try {
                const response =
                    await memberContributionService.getByPeriod(
                        periodId,
                        filters,
                    );

                if (!response.success) {
                    setMessage(response.message);
                    return false;
                }

                updateListState(response.data);
                setMessage(response.message);

                return true;
            } catch (error) {
                setMessage(getApiError(error).message);
                return false;
            } finally {
                setLoading(false);
            }
        },
        [updateListState],
    );

    /**
     * Fetch one contribution and return its detailed record.
     *
     * This does not replace the current list.
     */
    const fetchContribution = useCallback(
        async (
            contributionId: string,
        ): Promise<MemberContribution | null> => {
            setLoading(true);

            try {
                const response =
                    await memberContributionService.getById(
                        contributionId,
                    );

                if (!response.success) {
                    setMessage(response.message);
                    return null;
                }

                setMessage(response.message);

                return response.data;
            } catch (error) {
                setMessage(getApiError(error).message);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    /**
     * Fetch overdue contributions.
     */
    const fetchOverdueContributions = useCallback(
        async (
            filters: OverdueContributionFilters = {},
        ): Promise<boolean> => {
            setLoading(true);

            lastFetchRef.current = {
                mode: "OVERDUE",
                filters: { ...filters },
                resourceId: null,
            };

            try {
                const response =
                    await memberContributionService.getOverdue(filters);

                if (!response.success) {
                    setMessage(response.message);
                    return false;
                }

                updateListState(response.data);
                setMessage(response.message);

                return true;
            } catch (error) {
                setMessage(getApiError(error).message);
                return false;
            } finally {
                setLoading(false);
            }
        },
        [updateListState],
    );

    /**
     * Fetch aggregated contribution totals.
     */
    const fetchContributionTotals = useCallback(
        async (
            filters: ContributionTotalsFilters = {},
        ): Promise<ContributionTotals | null> => {
            setLoading(true);

            try {
                const response =
                    await memberContributionService.getTotals(filters);

                if (!response.success) {
                    setMessage(response.message);
                    return null;
                }

                setTotals(response.data);
                setMessage(response.message);

                return response.data;
            } catch (error) {
                setMessage(getApiError(error).message);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    /**
     * Fetch contribution counts grouped by status.
     */
    const fetchContributionStatusCounts = useCallback(
        async (
            filters: ContributionStatusCountFilters = {},
        ): Promise<ContributionStatusCount[] | null> => {
            setLoading(true);

            try {
                const response =
                    await memberContributionService.getStatusCounts(filters);

                if (!response.success) {
                    setMessage(response.message);
                    return null;
                }

                setStatusCounts(response.data);
                setMessage(response.message);

                return response.data;
            } catch (error) {
                setMessage(getApiError(error).message);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    /**
     * Fetch contribution history for a specific member.
     */
    const fetchMemberContributionHistory = useCallback(
        async (
            memberId: string,
            filters: MemberContributionHistoryFilters = {},
        ): Promise<boolean> => {
            setLoading(true);

            lastFetchRef.current = {
                mode: "MEMBER_HISTORY",
                filters: { ...filters },
                resourceId: memberId,
            };

            try {
                const response =
                    await memberContributionService.getMemberHistory(
                        memberId,
                        filters,
                    );

                if (!response.success) {
                    setMessage(response.message);
                    return false;
                }

                updateListState(response.data);
                setMessage(response.message);

                return true;
            } catch (error) {
                setMessage(getApiError(error).message);
                return false;
            } finally {
                setLoading(false);
            }
        },
        [updateListState],
    );

    /**
     * Fetch contributions belonging to a specific plan.
     */
    const fetchPlanContributions = useCallback(
        async (
            planId: string,
            filters: PlanContributionFilters = {},
        ): Promise<boolean> => {
            setLoading(true);

            lastFetchRef.current = {
                mode: "PLAN",
                filters: { ...filters },
                resourceId: planId,
            };

            try {
                const response =
                    await memberContributionService.getByPlan(
                        planId,
                        filters,
                    );

                if (!response.success) {
                    setMessage(response.message);
                    return false;
                }

                updateListState(response.data);
                setMessage(response.message);

                return true;
            } catch (error) {
                setMessage(getApiError(error).message);
                return false;
            } finally {
                setLoading(false);
            }
        },
        [updateListState],
    );

    /**
     * Refresh the list that was most recently requested.
     *
     * This refresh is silent so it does not overwrite the message
     * returned by the preceding mutation.
     */
    const refreshLastList = useCallback(async (): Promise<void> => {
        const lastFetch = lastFetchRef.current;

        try {
            let response;

            switch (lastFetch.mode) {
                case "ALL":
                    response = await memberContributionService.getAll(
                        lastFetch.filters as MemberContributionFilters,
                    );
                    break;

                case "PERIOD":
                    if (!lastFetch.resourceId) return;

                    response = await memberContributionService.getByPeriod(
                        lastFetch.resourceId,
                        lastFetch.filters as PeriodContributionFilters,
                    );
                    break;

                case "OVERDUE":
                    response = await memberContributionService.getOverdue(
                        lastFetch.filters as OverdueContributionFilters,
                    );
                    break;

                case "MEMBER_HISTORY":
                    if (!lastFetch.resourceId) return;

                    response =
                        await memberContributionService.getMemberHistory(
                            lastFetch.resourceId,
                            lastFetch.filters as MemberContributionHistoryFilters,
                        );
                    break;

                case "PLAN":
                    if (!lastFetch.resourceId) return;

                    response = await memberContributionService.getByPlan(
                        lastFetch.resourceId,
                        lastFetch.filters as PlanContributionFilters,
                    );
                    break;

                default:
                    return;
            }

            if (response.success) {
                updateListState(response.data);
            }
        } catch {
            // Keep the original mutation or generation message.
            // A failed background refresh should not replace it.
        }
    }, [updateListState]);

    /**
     * Load contributions only when no list has previously been loaded.
     */
    const ensureContributionsLoaded = useCallback(async () => {
        if (hasFetchedRef.current) {
            return true;
        }

        return fetchContributions();
    }, [fetchContributions]);

    /**
     * Generate a contribution for one member.
     */
    const generateContribution = useCallback(
        async (
            payload: GenerateMemberContributionDto,
        ): Promise<MemberContribution | null> => {
            setLoading(true);

            try {
                const response =
                    await memberContributionService.generate(payload);

                setMessage(response.message);

                if (!response.success) {
                    return null;
                }

                await refreshLastList();

                return response.data;
            } catch (error) {
                setMessage(getApiError(error).message);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [refreshLastList],
    );

    /**
     * Generate contributions for multiple members.
     */
    const generateBulkContributions = useCallback(
        async (
            payload: GenerateBulkMemberContributionsDto,
        ): Promise<BulkGenerationResult | null> => {
            setLoading(true);

            try {
                const response =
                    await memberContributionService.generateBulk(payload);

                setMessage(response.message);

                if (!response.success) {
                    return null;
                }

                await refreshLastList();

                return response.data;
            } catch (error) {
                setMessage(getApiError(error).message);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [refreshLastList],
    );

    /**
     * Shared mutation handler.
     */
    const executeAction = useCallback(
        async (
            action: () => Promise<{
                success: boolean;
                message: string;
            }>,
        ): Promise<boolean> => {
            setLoading(true);

            try {
                const response = await action();

                setMessage(response.message);

                if (!response.success) {
                    return false;
                }

                await refreshLastList();

                return true;
            } catch (error) {
                setMessage(getApiError(error).message);
                return false;
            } finally {
                setLoading(false);
            }
        },
        [refreshLastList],
    );

    /**
     * Pay a member contribution.
     */
    const payContribution = useCallback(
        (
            contributionId: string,
            payload: PayMemberContributionDto,
        ) =>
            executeAction(() =>
                memberContributionService.pay(
                    contributionId,
                    payload,
                ),
            ),
        [executeAction],
    );

    /**
     * Mark a member contribution as overdue.
     */
    const markContributionOverdue = useCallback(
        (contributionId: string) =>
            executeAction(() =>
                memberContributionService.markOverdue(
                    contributionId,
                ),
            ),
        [executeAction],
    );

    /**
     * Waive a member contribution.
     */
    const waiveContribution = useCallback(
        (
            contributionId: string,
            payload: WaiveMemberContributionDto,
        ) =>
            executeAction(() =>
                memberContributionService.waive(
                    contributionId,
                    payload,
                ),
            ),
        [executeAction],
    );

    /**
     * Cancel a member contribution.
     */
    const cancelContribution = useCallback(
        (contributionId: string) =>
            executeAction(() =>
                memberContributionService.cancel(
                    contributionId,
                ),
            ),
        [executeAction],
    );

    return (
        <MemberContributionContext.Provider
            value={{
                contributions,
                pagination,
                loading,
                message,

                totals,
                statusCounts,

                setMessage,
                clearMessage,

                fetchContributions,
                fetchPeriodContributions,
                fetchContribution,
                fetchOverdueContributions,
                fetchContributionTotals,
                fetchContributionStatusCounts,
                fetchMemberContributionHistory,
                fetchPlanContributions,

                generateContribution,
                generateBulkContributions,

                ensureContributionsLoaded,

                payContribution,
                markContributionOverdue,
                waiveContribution,
                cancelContribution,
            }}
        >
            {children}
        </MemberContributionContext.Provider>
    );
};
