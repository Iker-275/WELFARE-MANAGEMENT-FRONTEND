
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useState,
} from "react";

import { memberStatementService } from "../api/MemberStatementApi";

import {
    MemberStatement,
    MemberStatementFilters,
} from "../types/MemberStatementType";

import { getApiError } from "../utils/apiError";

interface MemberStatementContextType {
    statement: MemberStatement | null;
    loading: boolean;
    message: string | null;

    fetchMyStatement: (
        filters?: MemberStatementFilters
    ) => Promise<MemberStatement | null>;

    fetchMemberStatement: (
        memberId: string,
        filters?: MemberStatementFilters
    ) => Promise<MemberStatement | null>;

    fetchMyStatementPdf: (
        filters?: MemberStatementFilters
    ) => Promise<Blob | null>;

    fetchMemberStatementPdf: (
        memberId: string,
        filters?: MemberStatementFilters
    ) => Promise<Blob | null>;

    clearStatement: () => void;
    clearMessage: () => void;
}

export const MemberStatementContext =
    createContext<MemberStatementContextType | undefined>(undefined);

interface MemberStatementProviderProps {
    children: ReactNode;
}

export const MemberStatementProvider = ({
    children,
}: MemberStatementProviderProps) => {
    const [statement, setStatement] =
        useState<MemberStatement | null>(null);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    // Shared handler for retrieving statement data
    const fetchStatement = useCallback(
        async (
            request: () => Promise<{
                success: boolean;
                message: string;
                data: MemberStatement;
            }>
        ): Promise<MemberStatement | null> => {
            setLoading(true);
            setMessage(null);

            try {
                const response = await request();

                if (!response.success) {
                    setMessage(response.message);
                    return null;
                }

                setStatement(response.data);
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

    // Get authenticated member's statement
    const fetchMyStatement = useCallback(
        (filters?: MemberStatementFilters) =>
            fetchStatement(() =>
                memberStatementService.getMyStatement(filters)
            ),
        [fetchStatement]
    );

    // Get another member's statement
    const fetchMemberStatement = useCallback(
        (memberId: string, filters?: MemberStatementFilters) =>
            fetchStatement(() =>
                memberStatementService.getMemberStatement(
                    memberId,
                    filters
                )
            ),
        [fetchStatement]
    );

    // Shared PDF retrieval handler
    const fetchStatementPdf = useCallback(
        async (
            request: () => Promise<Blob>
        ): Promise<Blob | null> => {
            setLoading(true);
            setMessage(null);

            try {
                const blob = await request();

                setMessage("Member statement PDF retrieved successfully.");

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

    // Get authenticated member's statement PDF
    const fetchMyStatementPdf = useCallback(
        (filters?: MemberStatementFilters) =>
            fetchStatementPdf(() =>
                memberStatementService.getMyStatementPdf(filters)
            ),
        [fetchStatementPdf]
    );

    // Get another member's statement PDF
    const fetchMemberStatementPdf = useCallback(
        (memberId: string, filters?: MemberStatementFilters) =>
            fetchStatementPdf(() =>
                memberStatementService.getMemberStatementPdf(
                    memberId,
                    filters
                )
            ),
        [fetchStatementPdf]
    );

    const clearStatement = useCallback(() => {
        setStatement(null);
    }, []);

    const clearMessage = useCallback(() => {
        setMessage(null);
    }, []);

    return (
        <MemberStatementContext.Provider
            value={{
                statement,
                loading,
                message,

                fetchMyStatement,
                fetchMemberStatement,

                fetchMyStatementPdf,
                fetchMemberStatementPdf,

                clearStatement,
                clearMessage,
            }}
        >
            {children}
        </MemberStatementContext.Provider>
    );
};


