import {
    createContext,
    ReactNode,
    useCallback,
    useRef,
    useState,
} from "react";

import { penaltyApi } from "../api/PenaltyApi";
import { getApiError } from "../utils/apiError";
import { Pagination } from "../types/SharedTypes";

import {
    CreatePenaltyDto,
    GenerateBatchPenaltiesDto,
    GenerateBatchPenaltiesResponse,
    GeneratePenaltyDto,
    MemberOutstandingPenaltiesResponse,
    Penalty,
    PenaltyFilters,
    PenaltyOutstandingAmount,
    PenaltyResponse,
    UpdatePenaltyDto,
    WaivePenaltyDto,
} from "../types/PenaltyType";

interface PenaltyContextType {
    penalties: Penalty[];
    selectedPenalty: Penalty | null;
    pagination: Pagination | null;
    outstandingAmount: PenaltyOutstandingAmount | null;
    memberOutstanding: MemberOutstandingPenaltiesResponse["data"] | null;
    loading: boolean;
    message: string | null;

    fetchPenalties: (filters?: PenaltyFilters) => Promise<boolean>;
    fetchPenaltiesByMember: (
        memberId: string,
        filters?: PenaltyFilters,
    ) => Promise<boolean>;
    fetchMemberOutstanding: (
        memberId: string,
        filters?: PenaltyFilters,
    ) => Promise<boolean>;
    fetchPenaltiesByContribution: (
        contributionId: string,
        filters?: PenaltyFilters,
    ) => Promise<boolean>;
    fetchPenaltiesByRule: (
        ruleId: string,
        filters?: PenaltyFilters,
    ) => Promise<boolean>;
    fetchPenaltiesByStatus: (
        status: string,
        filters?: PenaltyFilters,
    ) => Promise<boolean>;
    fetchPenaltiesBySource: (
        source: string,
        filters?: PenaltyFilters,
    ) => Promise<boolean>;

    fetchPenalty: (id: string) => Promise<Penalty | null>;
    fetchBasicPenalty: (id: string) => Promise<Penalty | null>;
    fetchPenaltyOutstanding: (
        id: string,
    ) => Promise<PenaltyOutstandingAmount | null>;

    createPenalty: (payload: CreatePenaltyDto) => Promise<boolean>;
    generatePenalty: (payload: GeneratePenaltyDto) => Promise<Penalty | null>;
    generateBatchPenalties: (
        payload: GenerateBatchPenaltiesDto,
    ) => Promise<GenerateBatchPenaltiesResponse["data"] | null>;

    updatePenalty: (
        id: string,
        payload: UpdatePenaltyDto,
    ) => Promise<boolean>;
    activatePenalty: (id: string) => Promise<boolean>;
    payPenalty: (id: string) => Promise<boolean>;
    cancelPenalty: (id: string) => Promise<boolean>;
    waivePenalty: (
        id: string,
        payload: WaivePenaltyDto,
    ) => Promise<boolean>;

    clearSelectedPenalty: () => void;
    clearMessage: () => void;
}

export const PenaltyContext = createContext<PenaltyContextType | undefined>(
    undefined,
);

type ListMode =
    | "ALL"
    | "MEMBER"
    | "MEMBER_OUTSTANDING"
    | "CONTRIBUTION"
    | "RULE"
    | "STATUS"
    | "SOURCE";

interface LastListRequest {
    mode: ListMode;
    id?: string;
    filters: PenaltyFilters;
}

interface PenaltyProviderProps {
    children: ReactNode;
}

export const PenaltyProvider = ({ children }: PenaltyProviderProps) => {
    const [penalties, setPenalties] = useState<Penalty[]>([]);
    const [selectedPenalty, setSelectedPenalty] = useState<Penalty | null>(
        null,
    );
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [outstandingAmount, setOutstandingAmount] =
        useState<PenaltyOutstandingAmount | null>(null);
    const [memberOutstanding, setMemberOutstanding] =
        useState<MemberOutstandingPenaltiesResponse["data"] | null>(null);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const lastListRequest = useRef<LastListRequest | null>(null);

    const applyListResponse = useCallback(
        (response: {
            data: {
                items: Penalty[];
                pagination: Pagination;
            };
            message?: string;
        }) => {
            setPenalties(response.data.items ?? []);
            setPagination(response.data.pagination ?? null);
            if (response.message) setMessage(response.message);
        },
        [],
    );

    const runListRequest = useCallback(
        async (
            request: LastListRequest,
            silent = false,
        ): Promise<boolean> => {
            if (!silent) {
                setLoading(true);
                setMessage(null);
            }

            try {
                let response;

                switch (request.mode) {
                    case "ALL":
                        response = await penaltyApi.getAll(request.filters);
                        applyListResponse(response);
                        break;

                    case "MEMBER":
                        response = await penaltyApi.getByMember(
                            request.id!,
                            request.filters,
                        );
                        applyListResponse(response);
                        break;

                    case "CONTRIBUTION":
                        response = await penaltyApi.getByContribution(
                            request.id!,
                            request.filters,
                        );
                        applyListResponse(response);
                        break;

                    case "RULE":
                        response = await penaltyApi.getByRule(
                            request.id!,
                            request.filters,
                        );
                        applyListResponse(response);
                        break;

                    case "STATUS":
                        response = await penaltyApi.getByStatus(
                            request.id!,
                            request.filters,
                        );
                        applyListResponse(response);
                        break;

                    case "SOURCE":
                        response = await penaltyApi.getBySource(
                            request.id!,
                            request.filters,
                        );
                        applyListResponse(response);
                        break;

                    case "MEMBER_OUTSTANDING": {
                        const outstandingResponse =
                            await penaltyApi.getMemberOutstanding(
                                request.id!,
                                request.filters,
                            );

                        setMemberOutstanding(outstandingResponse.data);

                        if (
                            "items" in outstandingResponse.data &&
                            Array.isArray(outstandingResponse.data.items)
                        ) {
                            setPenalties(outstandingResponse.data.items);
                        }

                        if (
                            "pagination" in outstandingResponse.data &&
                            outstandingResponse.data.pagination
                        ) {
                            setPagination(
                                outstandingResponse.data.pagination,
                            );
                        }

                        if (!silent) {
                            setMessage(outstandingResponse.message);
                        }
                        break;
                    }
                }

                return true;
            } catch (error) {
                if (!silent) setMessage(getApiError(error).message);
                return false;
            } finally {
                if (!silent) setLoading(false);
            }
        },
        [applyListResponse],
    );

    const fetchPenalties = useCallback(
        async (filters: PenaltyFilters = {}) => {
            const request: LastListRequest = {
                mode: "ALL",
                filters,
            };

            lastListRequest.current = request;
            return runListRequest(request);
        },
        [runListRequest],
    );

    const fetchPenaltiesByMember = useCallback(
        async (memberId: string, filters: PenaltyFilters = {}) => {
            const request: LastListRequest = {
                mode: "MEMBER",
                id: memberId,
                filters,
            };

            lastListRequest.current = request;
            return runListRequest(request);
        },
        [runListRequest],
    );

    const fetchMemberOutstanding = useCallback(
        async (memberId: string, filters: PenaltyFilters = {}) => {
            const request: LastListRequest = {
                mode: "MEMBER_OUTSTANDING",
                id: memberId,
                filters,
            };

            lastListRequest.current = request;
            return runListRequest(request);
        },
        [runListRequest],
    );

    const fetchPenaltiesByContribution = useCallback(
        async (contributionId: string, filters: PenaltyFilters = {}) => {
            const request: LastListRequest = {
                mode: "CONTRIBUTION",
                id: contributionId,
                filters,
            };

            lastListRequest.current = request;
            return runListRequest(request);
        },
        [runListRequest],
    );

    const fetchPenaltiesByRule = useCallback(
        async (ruleId: string, filters: PenaltyFilters = {}) => {
            const request: LastListRequest = {
                mode: "RULE",
                id: ruleId,
                filters,
            };

            lastListRequest.current = request;
            return runListRequest(request);
        },
        [runListRequest],
    );

    const fetchPenaltiesByStatus = useCallback(
        async (status: string, filters: PenaltyFilters = {}) => {
            const request: LastListRequest = {
                mode: "STATUS",
                id: status,
                filters,
            };

            lastListRequest.current = request;
            return runListRequest(request);
        },
        [runListRequest],
    );

    const fetchPenaltiesBySource = useCallback(
        async (source: string, filters: PenaltyFilters = {}) => {
            const request: LastListRequest = {
                mode: "SOURCE",
                id: source,
                filters,
            };

            lastListRequest.current = request;
            return runListRequest(request);
        },
        [runListRequest],
    );

    const fetchPenalty = useCallback(async (id: string) => {
        setLoading(true);
        setMessage(null);

        try {
            const response = await penaltyApi.getById(id);
            setSelectedPenalty(response.data);
            setMessage(response.message);
            return response.data;
        } catch (error) {
            setMessage(getApiError(error).message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchBasicPenalty = useCallback(async (id: string) => {
        setLoading(true);
        setMessage(null);

        try {
            const response = await penaltyApi.getBasicById(id);
            setSelectedPenalty(response.data);
            setMessage(response.message);
            return response.data;
        } catch (error) {
            setMessage(getApiError(error).message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPenaltyOutstanding = useCallback(async (id: string) => {
        setLoading(true);
        setMessage(null);

        try {
            const response = await penaltyApi.getOutstanding(id);
            setOutstandingAmount(response.data);
            setMessage(response.message);
            return response.data;
        } catch (error) {
            setMessage(getApiError(error).message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshLastList = useCallback(async () => {
        if (lastListRequest.current) {
            await runListRequest(lastListRequest.current, true);
        }
    }, [runListRequest]);

    const handleMutation = useCallback(
        async (
            request: () => Promise<PenaltyResponse>,
            fallbackMessage: string,
        ): Promise<boolean> => {
            setLoading(true);
            setMessage(null);

            try {
                const response = await request();

                if (selectedPenalty?.id === response.data.id) {
                    setSelectedPenalty(response.data);
                }

                await refreshLastList();

                setMessage(response.message || fallbackMessage);
                return true;
            } catch (error) {
                setMessage(getApiError(error).message);
                return false;
            } finally {
                setLoading(false);
            }
        },
        [refreshLastList, selectedPenalty?.id],
    );

    const createPenalty = useCallback(
        async (payload: CreatePenaltyDto) => {
            return handleMutation(
                () => penaltyApi.create(payload),
                "Penalty created successfully.",
            );
        },
        [handleMutation],
    );

    const generatePenalty = useCallback(
        async (payload: GeneratePenaltyDto): Promise<Penalty | null> => {
            setLoading(true);
            setMessage(null);

            try {
                const response = await penaltyApi.generate(payload);

                setSelectedPenalty(response.data);
                await refreshLastList();

                setMessage(response.message);
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

    const generateBatchPenalties = useCallback(
        async (
            payload: GenerateBatchPenaltiesDto,
        ): Promise<GenerateBatchPenaltiesResponse["data"] | null> => {
            setLoading(true);
            setMessage(null);

            try {
                const response = await penaltyApi.generateBatch(payload);

                await refreshLastList();
                setMessage(response.message);

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

    const updatePenalty = useCallback(
        async (id: string, payload: UpdatePenaltyDto) =>
            handleMutation(
                () => penaltyApi.update(id, payload),
                "Penalty updated successfully.",
            ),
        [handleMutation],
    );

    const activatePenalty = useCallback(
        async (id: string) =>
            handleMutation(
                () => penaltyApi.activate(id),
                "Penalty activated successfully.",
            ),
        [handleMutation],
    );

    const payPenalty = useCallback(
        async (id: string) =>
            handleMutation(
                () => penaltyApi.pay(id),
                "Penalty marked as paid successfully.",
            ),
        [handleMutation],
    );

    const cancelPenalty = useCallback(
        async (id: string) =>
            handleMutation(
                () => penaltyApi.cancel(id),
                "Penalty cancelled successfully.",
            ),
        [handleMutation],
    );

    const waivePenalty = useCallback(
        async (id: string, payload: WaivePenaltyDto) =>
            handleMutation(
                () => penaltyApi.waive(id, payload),
                "Penalty waived successfully.",
            ),
        [handleMutation],
    );

    const clearSelectedPenalty = useCallback(() => {
        setSelectedPenalty(null);
        setOutstandingAmount(null);
    }, []);

    const clearMessage = useCallback(() => {
        setMessage(null);
    }, []);

    return (
        <PenaltyContext.Provider
            value={{
                penalties,
                selectedPenalty,
                pagination,
                outstandingAmount,
                memberOutstanding,
                loading,
                message,

                fetchPenalties,
                fetchPenaltiesByMember,
                fetchMemberOutstanding,
                fetchPenaltiesByContribution,
                fetchPenaltiesByRule,
                fetchPenaltiesByStatus,
                fetchPenaltiesBySource,

                fetchPenalty,
                fetchBasicPenalty,
                fetchPenaltyOutstanding,

                createPenalty,
                generatePenalty,
                generateBatchPenalties,

                updatePenalty,
                activatePenalty,
                payPenalty,
                cancelPenalty,
                waivePenalty,

                clearSelectedPenalty,
                clearMessage,
            }}
        >
            {children}
        </PenaltyContext.Provider>
    );
};

