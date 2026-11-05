
import {
    createContext,
    ReactNode,
    useCallback,
    useRef,
    useState,
} from "react";

import { paymentProviderService } from "../api/PaymentProviderApi";

import {
    PaymentProvider,
    PaymentProviderFilters,
    PaymentProviderListData,
    CreatePaymentProviderDto,
    PaymentProviderType,
} from "../types/PaymentProviderType";

import { Pagination } from "../types/SharedTypes";
import { getApiError } from "../utils/apiError";

interface PaymentProviderContextType {
    providers: PaymentProvider[];
    activeProviders: PaymentProvider[];
    providersByType: PaymentProvider[];
    activeProvidersByType: PaymentProvider[];

    pagination: Pagination | null;
    loading: boolean;
    message: string;

    setMessage: (message: string) => void;
    clearMessage: () => void;

    fetchProviders: (
        filters?: PaymentProviderFilters,
    ) => Promise<boolean>;

    fetchActiveProviders: () => Promise<PaymentProvider[] | null>;

    fetchActiveProvidersByType: (
        type: PaymentProviderType,
    ) => Promise<PaymentProvider[] | null>;

    fetchProvidersByType: (
        type: PaymentProviderType,
    ) => Promise<PaymentProvider[] | null>;

    fetchPaymentProvider: (
        providerId: string,
    ) => Promise<PaymentProvider | null>;

    fetchPaymentProviderByCode: (
        code: string,
    ) => Promise<PaymentProvider | null>;

    createPaymentProvider: (
        payload: CreatePaymentProviderDto,
    ) => Promise<PaymentProvider | null>;

    activatePaymentProvider: (
        providerId: string,
    ) => Promise<boolean>;

    deactivatePaymentProvider: (
        providerId: string,
    ) => Promise<boolean>;

    ensureProvidersLoaded: () => Promise<boolean>;
}

export const PaymentProviderContext =
    createContext<PaymentProviderContextType | undefined>(undefined);

interface PaymentProviderProviderProps {
    children: ReactNode;
}

interface LastFetchState {
    filters: PaymentProviderFilters;
    hasFetched: boolean;
}

const initialLastFetchState: LastFetchState = {
    filters: {},
    hasFetched: false,
};

export const PaymentProviderProvider = ({
    children,
}: PaymentProviderProviderProps) => {
    const [providers, setProviders] = useState<PaymentProvider[]>([]);
    const [activeProviders, setActiveProviders] = useState<
        PaymentProvider[]
    >([]);
    const [providersByType, setProvidersByType] = useState<
        PaymentProvider[]
    >([]);
    const [activeProvidersByType, setActiveProvidersByType] = useState<
        PaymentProvider[]
    >([]);

    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const lastFetchRef = useRef<LastFetchState>(
        initialLastFetchState,
    );

    const hasFetchedRef = useRef(false);

    const clearMessage = useCallback(() => {
        setMessage("");
    }, []);

    /**
     * Update the paginated provider list and pagination state.
     */
    const updateListState = useCallback(
        (listData: PaymentProviderListData) => {
            setProviders(listData.data);

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
     * Fetch all payment providers with optional filters.
     */
    const fetchProviders = useCallback(
        async (
            filters: PaymentProviderFilters = {},
        ): Promise<boolean> => {
            setLoading(true);

            lastFetchRef.current = {
                filters: { ...filters },
                hasFetched: true,
            };

            try {
                const response =
                    await paymentProviderService.getAll(filters);

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
     * Fetch all active payment providers.
     */
    const fetchActiveProviders = useCallback(
        async (): Promise<PaymentProvider[] | null> => {
            setLoading(true);

            try {
                const response =
                    await paymentProviderService.getActive();

                if (!response.success) {
                    setMessage(response.message);
                    return null;
                }

                setActiveProviders(response.data);
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
     * Fetch active payment providers by type.
     */
    const fetchActiveProvidersByType = useCallback(
        async (
            type: PaymentProviderType,
        ): Promise<PaymentProvider[] | null> => {
            setLoading(true);

            try {
                const response =
                    await paymentProviderService.getActiveByType(type);

                if (!response.success) {
                    setMessage(response.message);
                    return null;
                }

                setActiveProvidersByType(response.data);
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
     * Fetch all payment providers matching a type.
     */
    const fetchProvidersByType = useCallback(
        async (
            type: PaymentProviderType,
        ): Promise<PaymentProvider[] | null> => {
            setLoading(true);

            try {
                const response =
                    await paymentProviderService.getByType(type);

                if (!response.success) {
                    setMessage(response.message);
                    return null;
                }

                setProvidersByType(response.data);
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
     * Fetch one payment provider by ID.
     */
    const fetchPaymentProvider = useCallback(
        async (
            providerId: string,
        ): Promise<PaymentProvider | null> => {
            setLoading(true);

            try {
                const response =
                    await paymentProviderService.getById(providerId);

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
     * Fetch one payment provider by code.
     */
    const fetchPaymentProviderByCode = useCallback(
        async (
            code: string,
        ): Promise<PaymentProvider | null> => {
            setLoading(true);

            try {
                const response =
                    await paymentProviderService.getByCode(code);

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
     * Refresh the most recently requested paginated provider list.
     *
     * This operation is silent and does not overwrite mutation messages.
     */
    const refreshLastList = useCallback(async (): Promise<void> => {
        const lastFetch = lastFetchRef.current;

        if (!lastFetch.hasFetched) {
            return;
        }

        try {
            const response = await paymentProviderService.getAll(
                lastFetch.filters,
            );

            if (response.success) {
                updateListState(response.data);
            }
        } catch {
            // Keep the original mutation message.
        }
    }, [updateListState]);

    /**
     * Load providers only if the paginated list has not been fetched.
     */
    const ensureProvidersLoaded = useCallback(async () => {
        if (hasFetchedRef.current) {
            return true;
        }

        return fetchProviders();
    }, [fetchProviders]);

    /**
     * Update a provider in any currently loaded provider collections.
     */
    const updateProviderInState = useCallback(
        (updatedProvider: PaymentProvider) => {
            const updateCollection = (
                current: PaymentProvider[],
            ): PaymentProvider[] =>
                current.map((provider) =>
                    provider.id === updatedProvider.id
                        ? { ...provider, ...updatedProvider }
                        : provider,
                );

            setProviders(updateCollection);
            setActiveProviders(updateCollection);
            setProvidersByType(updateCollection);
            setActiveProvidersByType(updateCollection);
        },
        [],
    );

    /**
     * Create a payment provider.
     */
    const createPaymentProvider = useCallback(
        async (
            payload: CreatePaymentProviderDto,
        ): Promise<PaymentProvider | null> => {
            setLoading(true);

            try {
                const response =
                    await paymentProviderService.create(payload);

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
     * Shared handler for provider activation and deactivation.
     */
    const executeProviderAction = useCallback(
        async (
            action: () => Promise<{
                success: boolean;
                message: string;
                data: PaymentProvider;
            }>,
        ): Promise<boolean> => {
            setLoading(true);

            try {
                const response = await action();

                setMessage(response.message);

                if (!response.success) {
                    return false;
                }

                updateProviderInState(response.data);

                await refreshLastList();

                return true;
            } catch (error) {
                setMessage(getApiError(error).message);
                return false;
            } finally {
                setLoading(false);
            }
        },
        [refreshLastList, updateProviderInState],
    );

    /**
     * Activate a payment provider.
     */
    const activatePaymentProvider = useCallback(
        (providerId: string) =>
            executeProviderAction(() =>
                paymentProviderService.activate(providerId),
            ),
        [executeProviderAction],
    );

    /**
     * Deactivate a payment provider.
     */
    const deactivatePaymentProvider = useCallback(
        (providerId: string) =>
            executeProviderAction(() =>
                paymentProviderService.deactivate(providerId),
            ),
        [executeProviderAction],
    );

    return (
        <PaymentProviderContext.Provider
            value={{
                providers,
                activeProviders,
                providersByType,
                activeProvidersByType,

                pagination,
                loading,
                message,

                setMessage,
                clearMessage,

                fetchProviders,
                fetchActiveProviders,
                fetchActiveProvidersByType,
                fetchProvidersByType,
                fetchPaymentProvider,
                fetchPaymentProviderByCode,

                createPaymentProvider,
                activatePaymentProvider,
                deactivatePaymentProvider,

                ensureProvidersLoaded,
            }}
        >
            {children}
        </PaymentProviderContext.Provider>
    );
};
