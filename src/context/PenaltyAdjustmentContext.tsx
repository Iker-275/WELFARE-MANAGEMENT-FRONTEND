
import {
    createContext,
    ReactNode,
    useCallback,
    useState,
} from "react";

import { penaltyAdjustmentService } from "../api/PenaltyAdjustmentApi";

import {
    CreatePenaltyAdjustmentDto,
    PenaltyAdjustment,
    PenaltyAdjustmentListData,
    PenaltyAdjustmentListFilters,
    PenaltyAdjustmentPagination,
    PenaltyAdjustmentType,
} from "../types/PenaltyAdjustmentType";

import { getApiError } from "../utils/apiError";

interface PenaltyAdjustmentContextType {
    adjustments: PenaltyAdjustment[];
    selectedAdjustment: PenaltyAdjustment | null;
    pagination: PenaltyAdjustmentPagination | null;
    loading: boolean;
    message: string | null;

    fetchPendingAdjustments: (
        filters?: PenaltyAdjustmentListFilters
    ) => Promise<boolean>;

    fetchAdjustmentsByPenalty: (
        penaltyId: string,
        filters?: PenaltyAdjustmentListFilters
    ) => Promise<boolean>;

    fetchAdjustmentsByType: (
        type: PenaltyAdjustmentType,
        filters?: PenaltyAdjustmentListFilters
    ) => Promise<boolean>;

    fetchAdjustmentsByCreator: (
        createdById: string,
        filters?: PenaltyAdjustmentListFilters
    ) => Promise<boolean>;

    fetchAdjustmentsByApprover: (
        approvedById: string,
        filters?: PenaltyAdjustmentListFilters
    ) => Promise<boolean>;

    fetchAdjustment: (id: string) => Promise<PenaltyAdjustment | null>;

    createAdjustment: (
        data: CreatePenaltyAdjustmentDto
    ) => Promise<boolean>;

    approveAdjustment: (id: string) => Promise<boolean>;

    clearSelectedAdjustment: () => void;
    clearMessage: () => void;
}

export const PenaltyAdjustmentContext =
    createContext<PenaltyAdjustmentContextType | undefined>(undefined);

interface PenaltyAdjustmentProviderProps {
    children: ReactNode;
}

export const PenaltyAdjustmentProvider = ({
    children,
}: PenaltyAdjustmentProviderProps) => {
    const [adjustments, setAdjustments] = useState<PenaltyAdjustment[]>([]);
    const [selectedAdjustment, setSelectedAdjustment] =
        useState<PenaltyAdjustment | null>(null);

    const [pagination, setPagination] =
        useState<PenaltyAdjustmentPagination | null>(null);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleListResponse = useCallback(
        (data: PenaltyAdjustmentListData) => {
            setAdjustments(data.items ?? []);
            setPagination(data.pagination ?? null);
        },
        []
    );

    // Shared list request handler
    const fetchList = useCallback(
        async (
            request: () => Promise<{
                success: boolean;
                message: string;
                data: PenaltyAdjustmentListData;
            }>
        ): Promise<boolean> => {
            setLoading(true);
            setMessage(null);

            try {
                const response = await request();

                if (!response.success) {
                    setMessage(response.message);
                    return false;
                }

                handleListResponse(response.data);
                setMessage(response.message);

                return true;
            } catch (error) {
                setMessage(getApiError(error).message);
                return false;
            } finally {
                setLoading(false);
            }
        },
        [handleListResponse]
    );

    // Get pending adjustments
    const fetchPendingAdjustments = useCallback(
        (filters?: PenaltyAdjustmentListFilters) =>
            fetchList(() =>
                penaltyAdjustmentService.getPending(filters)
            ),
        [fetchList]
    );

    // Get adjustments by penalty
    const fetchAdjustmentsByPenalty = useCallback(
        (penaltyId: string, filters?: PenaltyAdjustmentListFilters) =>
            fetchList(() =>
                penaltyAdjustmentService.getByPenalty(penaltyId, filters)
            ),
        [fetchList]
    );

    // Get adjustments by type
    const fetchAdjustmentsByType = useCallback(
        (type: PenaltyAdjustmentType, filters?: PenaltyAdjustmentListFilters) =>
            fetchList(() =>
                penaltyAdjustmentService.getByType(type, filters)
            ),
        [fetchList]
    );

    // Get adjustments by creator
    const fetchAdjustmentsByCreator = useCallback(
        (createdById: string, filters?: PenaltyAdjustmentListFilters) =>
            fetchList(() =>
                penaltyAdjustmentService.getByCreator(
                    createdById,
                    filters
                )
            ),
        [fetchList]
    );

    // Get adjustments by approver
    const fetchAdjustmentsByApprover = useCallback(
        (approvedById: string, filters?: PenaltyAdjustmentListFilters) =>
            fetchList(() =>
                penaltyAdjustmentService.getByApprover(
                    approvedById,
                    filters
                )
            ),
        [fetchList]
    );

    // Get a single adjustment
    const fetchAdjustment = useCallback(
        async (id: string): Promise<PenaltyAdjustment | null> => {
            setLoading(true);
            setMessage(null);

            try {
                const response =
                    await penaltyAdjustmentService.getById(id);

                if (!response.success) {
                    setMessage(response.message);
                    return null;
                }

                setSelectedAdjustment(response.data);
                setMessage(response.message);

                return response.data;
            } catch (error) {
                setMessage(getApiError(error).message);
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // Create an adjustment
    const createAdjustment = useCallback(
        async (data: CreatePenaltyAdjustmentDto): Promise<boolean> => {
            setLoading(true);
            setMessage(null);

            try {
                const response =
                    await penaltyAdjustmentService.create(data);

                if (!response.success) {
                    setMessage(response.message);
                    return false;
                }

                setSelectedAdjustment(response.data);
                setMessage(response.message);

                // Add the new adjustment to the current list if not already present.
                setAdjustments((previous) => {
                    const exists = previous.some(
                        (item) => item.id === response.data.id
                    );

                    return exists
                        ? previous.map((item) =>
                              item.id === response.data.id
                                  ? response.data
                                  : item
                          )
                        : [response.data, ...previous];
                });

                return true;
            } catch (error) {
                setMessage(getApiError(error).message);
                return false;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // Approve an adjustment
    const approveAdjustment = useCallback(
        async (id: string): Promise<boolean> => {
            setLoading(true);
            setMessage(null);

            try {
                const response =
                    await penaltyAdjustmentService.approve(id);

                if (!response.success) {
                    setMessage(response.message);
                    return false;
                }

                setSelectedAdjustment(response.data);

                setAdjustments((previous) =>
                    previous.map((item) =>
                        item.id === response.data.id
                            ? response.data
                            : item
                    )
                );

                setMessage(response.message);

                return true;
            } catch (error) {
                // Includes backend business-rule errors, such as
                // a user attempting to approve their own adjustment.
                setMessage(getApiError(error).message);
                return false;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const clearSelectedAdjustment = useCallback(() => {
        setSelectedAdjustment(null);
    }, []);

    const clearMessage = useCallback(() => {
        setMessage(null);
    }, []);

    return (
        <PenaltyAdjustmentContext.Provider
            value={{
                adjustments,
                selectedAdjustment,
                pagination,
                loading,
                message,

                fetchPendingAdjustments,
                fetchAdjustmentsByPenalty,
                fetchAdjustmentsByType,
                fetchAdjustmentsByCreator,
                fetchAdjustmentsByApprover,
                fetchAdjustment,

                createAdjustment,
                approveAdjustment,

                clearSelectedAdjustment,
                clearMessage,
            }}
        >
            {children}
        </PenaltyAdjustmentContext.Provider>
    );
};


