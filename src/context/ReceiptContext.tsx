
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useState,
} from "react";

import { receiptService } from "../api/ReceiptApi";

import {
    Receipt,
    ReceiptFilters,
    ReceiptPagination,
    VoidReceiptDto,
} from "../types/ReceiptType";

import { getApiError } from "../utils/apiError";

interface ReceiptContextType {
    receipts: Receipt[];
    selectedReceipt: Receipt | null;
    pagination: ReceiptPagination | null;
    loading: boolean;
    message: string | null;

    fetchReceipts: (filters?: ReceiptFilters) => Promise<boolean>;
    fetchReceipt: (id: string) => Promise<Receipt | null>;
    fetchReceiptByNumber: (
        receiptNumber: string
    ) => Promise<Receipt | null>;
    fetchReceiptByPaymentId: (
        paymentId: string
    ) => Promise<Receipt | null>;

    issueReceipt: (paymentId: string) => Promise<boolean>;
    voidReceipt: (
        id: string,
        data: VoidReceiptDto
    ) => Promise<boolean>;

    fetchReceiptPdf: (id: string) => Promise<Blob | null>;

    clearSelectedReceipt: () => void;
    clearMessage: () => void;
}

export const ReceiptContext = createContext<ReceiptContextType | undefined>(
    undefined
);

interface ReceiptProviderProps {
    children: ReactNode;
}

export const ReceiptProvider = ({
    children,
}: ReceiptProviderProps) => {
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [selectedReceipt, setSelectedReceipt] =
        useState<Receipt | null>(null);

    const [pagination, setPagination] =
        useState<ReceiptPagination | null>(null);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    // Keep the selected receipt and the list synchronized.
    const updateReceiptInList = useCallback((receipt: Receipt) => {
        setReceipts((previous) => {
            const exists = previous.some(
                (item) => item.id === receipt.id
            );

            if (!exists) {
                return previous;
            }

            return previous.map((item) =>
                item.id === receipt.id ? receipt : item
            );
        });

        setSelectedReceipt((previous) =>
            previous?.id === receipt.id ? receipt : previous
        );
    }, []);

    // List receipts
    const fetchReceipts = useCallback(
        async (filters?: ReceiptFilters): Promise<boolean> => {
            setLoading(true);
            setMessage(null);

            try {
                const response = await receiptService.getAll(filters);

                if (!response.success) {
                    setMessage(response.message);
                    return false;
                }

                setReceipts(response.data.data ?? []);
                setPagination(response.data.pagination ?? null);
                setMessage(response.message);

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

    // Shared handler for retrieving one receipt
    const fetchSingleReceipt = useCallback(
        async (
            request: () => Promise<{
                success: boolean;
                message: string;
                data: Receipt;
            }>
        ): Promise<Receipt | null> => {
            setLoading(true);
            setMessage(null);

            try {
                const response = await request();

                if (!response.success) {
                    setMessage(response.message);
                    return null;
                }

                setSelectedReceipt(response.data);
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

    // Get receipt by ID
    const fetchReceipt = useCallback(
        (id: string) =>
            fetchSingleReceipt(() => receiptService.getById(id)),
        [fetchSingleReceipt]
    );

    // Get receipt by receipt number
    const fetchReceiptByNumber = useCallback(
        (receiptNumber: string) =>
            fetchSingleReceipt(() =>
                receiptService.getByNumber(receiptNumber)
            ),
        [fetchSingleReceipt]
    );

    // Get receipt by payment ID
    const fetchReceiptByPaymentId = useCallback(
        (paymentId: string) =>
            fetchSingleReceipt(() =>
                receiptService.getByPaymentId(paymentId)
            ),
        [fetchSingleReceipt]
    );

    // Issue receipt for a payment
    const issueReceipt = useCallback(
        async (paymentId: string): Promise<boolean> => {
            setLoading(true);
            setMessage(null);

            try {
                const response = await receiptService.issue(paymentId);

                if (!response.success) {
                    setMessage(response.message);
                    return false;
                }

                setSelectedReceipt(response.data);
                updateReceiptInList(response.data);
                setMessage(response.message);

                return true;
            } catch (error) {
                setMessage(getApiError(error).message);
                return false;
            } finally {
                setLoading(false);
            }
        },
        [updateReceiptInList]
    );

    // Void receipt
    const voidReceipt = useCallback(
        async (
            id: string,
            data: VoidReceiptDto
        ): Promise<boolean> => {
            setLoading(true);
            setMessage(null);

            try {
                const response = await receiptService.void(id, data);

                if (!response.success) {
                    setMessage(response.message);
                    return false;
                }

                setSelectedReceipt(response.data);
                updateReceiptInList(response.data);
                setMessage(response.message);

                return true;
            } catch (error) {
                setMessage(getApiError(error).message);
                return false;
            } finally {
                setLoading(false);
            }
        },
        [updateReceiptInList]
    );

    // Retrieve receipt PDF
    const fetchReceiptPdf = useCallback(
        async (id: string): Promise<Blob | null> => {
            setLoading(true);
            setMessage(null);

            try {
                const blob = await receiptService.getPdf(id);

                setMessage("Receipt PDF retrieved successfully.");

                return blob;
            } catch (error) {
                setMessage(getApiError(error).message);
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const clearSelectedReceipt = useCallback(() => {
        setSelectedReceipt(null);
    }, []);

    const clearMessage = useCallback(() => {
        setMessage(null);
    }, []);

    return (
        <ReceiptContext.Provider
            value={{
                receipts,
                selectedReceipt,
                pagination,
                loading,
                message,

                fetchReceipts,
                fetchReceipt,
                fetchReceiptByNumber,
                fetchReceiptByPaymentId,

                issueReceipt,
                voidReceipt,
                fetchReceiptPdf,

                clearSelectedReceipt,
                clearMessage,
            }}
        >
            {children}
        </ReceiptContext.Provider>
    );
};


