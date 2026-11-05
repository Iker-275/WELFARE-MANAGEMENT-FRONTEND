// import {
//     createContext,
//     ReactNode,
//     useCallback,
//     useRef,
//     useState,
// } from "react";

// import paymentService from "../api/PaymentApi";

// import {
//     CheckMpesaPaymentStatusResponse,
//     CompleteManualPaymentDto,
//     CreatePaymentDto,
//     InitiateMpesaStkPushResponse,
//     MemberPaymentFilters,
//     Payment,
//     PaymentFilters,
//     PaymentTotal,
//     PaymentTotalsFilters,
//     ProviderPaymentFilters,
// } from "../types/PaymentType";

// import { Pagination } from "../types/SharedTypes";
// import { getApiError } from "../utils/apiError";

// interface PaymentContextType {
//     payments: Payment[];
//     selectedPayment: Payment | null;
//     pagination: Pagination | null;
//     totals: PaymentTotal | null;
//     loading: boolean;
//     message: string | null;

//     setMessage: (message: string | null) => void;
//     clearMessage: () => void;

//     fetchPayments: (filters?: PaymentFilters) => Promise<boolean>;
//     fetchPayment: (paymentId: string) => Promise<Payment | null>;

//     fetchPaymentByInternalReference: (
//         internalReference: string,
//     ) => Promise<Payment | null>;

//     fetchPaymentByExternalReference: (
//         externalReference: string,
//     ) => Promise<Payment | null>;

//     fetchMemberPayments: (
//         memberId: string,
//         filters?: MemberPaymentFilters,
//     ) => Promise<boolean>;

//     fetchMemberPaymentTotal: (
//         memberId: string,
//         filters?: MemberPaymentFilters,
//     ) => Promise<PaymentTotal | null>;

//     fetchProviderPayments: (
//         providerId: string,
//         filters?: ProviderPaymentFilters,
//     ) => Promise<boolean>;

//     fetchPaymentsByStatus: (
//         status: string,
//         filters?: PaymentFilters,
//     ) => Promise<boolean>;

//     fetchPaymentTotals: (
//         filters?: PaymentTotalsFilters,
//     ) => Promise<PaymentTotal | null>;

//     createPayment: (
//         payload: CreatePaymentDto,
//     ) => Promise<Payment | null>;

//     initiateMpesaStkPush: (
//         paymentId: string,
//     ) => Promise<InitiateMpesaStkPushResponse | null>;

//     checkMpesaPaymentStatus: (
//         paymentId: string,
//     ) => Promise<CheckMpesaPaymentStatusResponse | null>;

//     completeManualPayment: (
//         paymentId: string,
//         payload: CompleteManualPaymentDto,
//     ) => Promise<boolean>;

//     ensurePaymentsLoaded: () => Promise<boolean>;
// }

// export const PaymentContext =
//     createContext<PaymentContextType | undefined>(undefined);

// interface PaymentProviderProps {
//     children: ReactNode;
// }

// type PaymentListRequest = () => Promise<void>;

// export const PaymentProvider = ({
//     children,
// }: PaymentProviderProps) => {
//     const [payments, setPayments] = useState<Payment[]>([]);
//     const [selectedPayment, setSelectedPayment] =
//         useState<Payment | null>(null);

//     const [pagination, setPagination] =
//         useState<Pagination | null>(null);

//     const [totals, setTotals] = useState<PaymentTotal | null>(null);

//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState<string | null>(null);

//     const lastListRequest = useRef<PaymentListRequest | null>(null);
//     const hasLoadedPayments = useRef(false);

//     const clearMessage = useCallback(() => {
//         setMessage(null);
//     }, []);

//     /**
//      * Updates the current payment in the selected payment state
//      * and in the currently loaded list.
//      */
//     const updatePaymentInState = useCallback((payment: Payment) => {
//         setSelectedPayment((current) =>
//             current?.id === payment.id ? payment : current,
//         );

//         setPayments((current) =>
//             current.map((item) =>
//                 item.id === payment.id ? payment : item,
//             ),
//         );
//     }, []);

//     /**
//      * Shared list loader.
//      *
//      * Silent requests are used when refreshing after a successful
//      * mutation so that the mutation's message is preserved.
//      */
//     const loadPaymentList = useCallback(
//         async (
//             request: () => Promise<{
//                 data: {
//                     data: Payment[];
//                     total: number;
//                     page: number;
//                     limit: number;
//                     totalPages: number;
//                 };
//                 message?: string;
//             }>,
//             silent = false,
//         ): Promise<boolean> => {
//             if (!silent) {
//                 setLoading(true);
//                 setMessage(null);
//             }

//             try {
//                 const response = await request();
//                 const result = response.data;

//                 setPayments(result.data);

//                 setPagination({
//                     page: result.page,
//                     limit: result.limit,
//                     total: result.total,
//                     totalPages: result.totalPages,
//                     hasNextPage: result.page < result.totalPages,
//                     hasPreviousPage: result.page > 1,
//                 });

//                 hasLoadedPayments.current = true;

//                 if (!silent) {
//                     setMessage(response.message ?? null);
//                 }

//                 return true;
//             } catch (error) {
//                 if (!silent) {
//                     setMessage(
//                         getApiError(
//                             error,
                           
//                         ).message
//                     );
//                 }

//                 return false;
//             } finally {
//                 if (!silent) {
//                     setLoading(false);
//                 }
//             }
//         },
//         [],
//     );

//     /**
//      * Refreshes the last loaded payment list without replacing
//      * the current message or showing another loading state.
//      */
//     const refreshLastList = useCallback(async () => {
//         if (!lastListRequest.current) return;

//         try {
//             await lastListRequest.current();
//         } catch {
//             // A background refresh should not replace the result
//             // of the operation that triggered it.
//         }
//     }, []);

//     // ---------------------------------------------------------
//     // LIST PAYMENTS
//     // ---------------------------------------------------------

//     const fetchPayments = useCallback(
//         async (filters: PaymentFilters = {}): Promise<boolean> => {
//             const request = () => paymentService.getAll(filters);

//             lastListRequest.current = async () => {
//                 await loadPaymentList(request, true);
//             };

//             return loadPaymentList(request);
//         },
//         [loadPaymentList],
//     );

//     // ---------------------------------------------------------
//     // GET PAYMENT BY ID
//     // ---------------------------------------------------------

//     const fetchPayment = useCallback(
//         async (paymentId: string): Promise<Payment | null> => {
//             setLoading(true);
//             setMessage(null);

//             try {
//                 const response = await paymentService.getById(paymentId);

//                 setSelectedPayment(response.data);
//                 setMessage(response.message);

//                 return response.data;
//             } catch (error) {
//                 setMessage(
//                     getApiError(error).message,
//                 );

//                 return null;
//             } finally {
//                 setLoading(false);
//             }
//         },
//         [],
//     );

//     // ---------------------------------------------------------
//     // GET PAYMENT BY INTERNAL REFERENCE
//     // ---------------------------------------------------------

//     const fetchPaymentByInternalReference = useCallback(
//         async (
//             internalReference: string,
//         ): Promise<Payment | null> => {
//             setLoading(true);
//             setMessage(null);

//             try {
//                 const response =
//                     await paymentService.getByInternalReference(
//                         internalReference,
//                     );

//                 setSelectedPayment(response.data);
//                 setMessage(response.message);

//                 return response.data;
//             } catch (error) {
//                 setMessage(
//                     getApiError(
//                         error,
                     
//                     ).message,
//                 );

//                 return null;
//             } finally {
//                 setLoading(false);
//             }
//         },
//         [],
//     );

//     // ---------------------------------------------------------
//     // GET PAYMENT BY EXTERNAL REFERENCE
//     // ---------------------------------------------------------

//     const fetchPaymentByExternalReference = useCallback(
//         async (
//             externalReference: string,
//         ): Promise<Payment | null> => {
//             setLoading(true);
//             setMessage(null);

//             try {
//                 const response =
//                     await paymentService.getByExternalReference(
//                         externalReference,
//                     );

//                 setSelectedPayment(response.data);
//                 setMessage(response.message);

//                 return response.data;
//             } catch (error) {
//                 setMessage(
//                     getApiError(
//                         error,
                     
//                     ).message,
//                 );

//                 return null;
//             } finally {
//                 setLoading(false);
//             }
//         },
//         [],
//     );

//     // ---------------------------------------------------------
//     // GET MEMBER PAYMENTS
//     // ---------------------------------------------------------

//     const fetchMemberPayments = useCallback(
//         async (
//             memberId: string,
//             filters: MemberPaymentFilters = {},
//         ): Promise<boolean> => {
//             const request = () =>
//                 paymentService.getByMember(memberId, filters);

//             lastListRequest.current = async () => {
//                 await loadPaymentList(request, true);
//             };

//             return loadPaymentList(request);
//         },
//         [loadPaymentList],
//     );

//     // ---------------------------------------------------------
//     // GET MEMBER PAYMENT TOTAL
//     // ---------------------------------------------------------

//     const fetchMemberPaymentTotal = useCallback(
//         async (
//             memberId: string,
//             filters: MemberPaymentFilters = {},
//         ): Promise<PaymentTotal | null> => {
//             setLoading(true);
//             setMessage(null);

//             try {
//                 const response = await paymentService.getMemberTotal(
//                     memberId,
//                     filters,
//                 );

//                 setMessage(response.message);

//                 return response.data;
//             } catch (error) {
//                 setMessage(
//                     getApiError(
//                         error,
                       
//                     ).message,
//                 );

//                 return null;
//             } finally {
//                 setLoading(false);
//             }
//         },
//         [],
//     );

//     // ---------------------------------------------------------
//     // GET PROVIDER PAYMENTS
//     // ---------------------------------------------------------

//     const fetchProviderPayments = useCallback(
//         async (
//             providerId: string,
//             filters: ProviderPaymentFilters = {},
//         ): Promise<boolean> => {
//             const request = () =>
//                 paymentService.getByProvider(providerId, filters);

//             lastListRequest.current = async () => {
//                 await loadPaymentList(request, true);
//             };

//             return loadPaymentList(request);
//         },
//         [loadPaymentList],
//     );

//     // ---------------------------------------------------------
//     // GET PAYMENTS BY STATUS
//     // ---------------------------------------------------------

//     const fetchPaymentsByStatus = useCallback(
//         async (
//             status: string,
//             filters: PaymentFilters = {},
//         ): Promise<boolean> => {
//             const request = () =>
//                 paymentService.getByStatus(status, filters);

//             lastListRequest.current = async () => {
//                 await loadPaymentList(request, true);
//             };

//             return loadPaymentList(request);
//         },
//         [loadPaymentList],
//     );

//     // ---------------------------------------------------------
//     // GET PAYMENT TOTALS
//     // ---------------------------------------------------------

//     const fetchPaymentTotals = useCallback(
//         async (
//             filters: PaymentTotalsFilters = {},
//         ): Promise<PaymentTotal | null> => {
//             setLoading(true);
//             setMessage(null);

//             try {
//                 const response = await paymentService.getTotals(filters);

//                 setTotals(response.data);
//                 setMessage(response.message);

//                 return response.data;
//             } catch (error) {
//                 setMessage(
//                     getApiError(
//                         error,
                       
//                     ).message,
//                 );

//                 return null;
//             } finally {
//                 setLoading(false);
//             }
//         },
//         [],
//     );

//     // ---------------------------------------------------------
//     // CREATE PAYMENT
//     // ---------------------------------------------------------

//     const createPayment = useCallback(
//         async (
//             payload: CreatePaymentDto,
//         ): Promise<Payment | null> => {
//             setLoading(true);
//             setMessage(null);

//             try {
//                 const response = await paymentService.create(payload);

//                 setSelectedPayment(response.data);
//                 setMessage(response.message);

//                 await refreshLastList();

//                 return response.data;
//             } catch (error) {
//                 setMessage( 
//                      getApiError(error).message,
//                 );

//                 return null;
//             } finally {
//                 setLoading(false);
//             }
//         },
//         [refreshLastList],
//     );

//     // ---------------------------------------------------------
//     // INITIATE M-PESA STK PUSH
//     // ---------------------------------------------------------

//     const initiateMpesaStkPush = useCallback(
//         async (
//             paymentId: string,
//         ): Promise<InitiateMpesaStkPushResponse | null> => {
//             setLoading(true);
//             setMessage(null);

//             try {
//                 const response =
//                     await paymentService.initiateMpesaStkPush(paymentId);

//                 setMessage(response.message);

//                 // The STK response contains initiation details,
//                 // not the complete Payment record.
//                 return response.data;
//             } catch (error) {
//                 setMessage(
//                     getApiError(
//                         error,
                        
//                     ).message,
//                 );

//                 return null;
//             } finally {
//                 setLoading(false);
//             }
//         },
//         [],
//     );

//     // ---------------------------------------------------------
//     // CHECK M-PESA PAYMENT STATUS
//     // ---------------------------------------------------------

//     const checkMpesaPaymentStatus = useCallback(
//         async (
//             paymentId: string,
//         ): Promise<CheckMpesaPaymentStatusResponse | null> => {
//             setLoading(true);
//             setMessage(null);

//             try {
//                 const response =
//                     await paymentService.checkMpesaStatus(paymentId);

//                 setMessage(response.message);

//                 // Refresh the detailed payment after checking its
//                 // provider status so the UI can display its latest state.
//                 try {
//                     const paymentResponse =
//                         await paymentService.getById(paymentId);

//                     setSelectedPayment(paymentResponse.data);
//                     updatePaymentInState(paymentResponse.data);
//                 } catch {
//                     // The status-check result remains useful even if
//                     // retrieving the full payment fails.
//                 }

//                 await refreshLastList();

//                 return response.data;
//             } catch (error) {
//                 setMessage(
//                     getApiError(
//                         error,
                       
//                     ).message,
//                 );

//                 return null;
//             } finally {
//                 setLoading(false);
//             }
//         },
//         [refreshLastList, updatePaymentInState],
//     );

//     // ---------------------------------------------------------
//     // COMPLETE MANUAL PAYMENT
//     // ---------------------------------------------------------

//     const completeManualPayment = useCallback(
//         async (
//             paymentId: string,
//             payload: CompleteManualPaymentDto,
//         ): Promise<boolean> => {
//             setLoading(true);
//             setMessage(null);

//             try {
//                 const response = await paymentService.completeManual(
//                     paymentId,
//                     payload,
//                 );

//                 setSelectedPayment(response.data);
//                 updatePaymentInState(response.data);
//                 setMessage(response.message);

//                 await refreshLastList();

//                 return true;
//             } catch (error) {
//                 setMessage(
//                     getApiError(
//                         error,
//                     ).message,
//                 );

//                 return false;
//             } finally {
//                 setLoading(false);
//             }
//         },
//         [refreshLastList, updatePaymentInState],
//     );

//     // ---------------------------------------------------------
//     // ENSURE PAYMENTS ARE LOADED
//     // ---------------------------------------------------------

//     const ensurePaymentsLoaded = useCallback(async (): Promise<boolean> => {
//         if (hasLoadedPayments.current) {
//             return true;
//         }

//         return fetchPayments();
//     }, [fetchPayments]);

//     return (
//         <PaymentContext.Provider
//             value={{
//                 payments,
//                 selectedPayment,
//                 pagination,
//                 totals,
//                 loading,
//                 message,

//                 setMessage,
//                 clearMessage,

//                 fetchPayments,
//                 fetchPayment,
//                 fetchPaymentByInternalReference,
//                 fetchPaymentByExternalReference,
//                 fetchMemberPayments,
//                 fetchMemberPaymentTotal,
//                 fetchProviderPayments,
//                 fetchPaymentsByStatus,
//                 fetchPaymentTotals,

//                 createPayment,
//                 initiateMpesaStkPush,
//                 checkMpesaPaymentStatus,
//                 completeManualPayment,

//                 ensurePaymentsLoaded,
//             }}
//         >
//             {children}
//         </PaymentContext.Provider>
//     );
// };


import {
  createContext,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from "react";

import paymentService from "../api/PaymentApi";

import {
  CheckMpesaPaymentStatusResponse,
  CompleteManualPaymentDto,
  CreatePaymentDto,
  InitiateMpesaStkPushResponse,
  MemberPaymentFilters,
  Payment,
  PaymentFilters,
  PaymentTotal,
  PaymentTotalsFilters,
  PaymentsResponse,
  ProviderPaymentFilters,
} from "../types/PaymentType";

import { Pagination } from "../types/SharedTypes";
import { getApiError } from "../utils/apiError";

interface PaymentContextType {
  payments: Payment[];
  selectedPayment: Payment | null;
  pagination: Pagination | null;
  totals: PaymentTotal | null;
  loading: boolean;
  message: string | null;

  setMessage: (message: string | null) => void;
  clearMessage: () => void;

  fetchPayments: (filters?: PaymentFilters) => Promise<boolean>;
  fetchPayment: (paymentId: string) => Promise<Payment | null>;

  fetchPaymentByInternalReference: (
    internalReference: string,
  ) => Promise<Payment | null>;

  fetchPaymentByExternalReference: (
    externalReference: string,
  ) => Promise<Payment | null>;

  fetchMemberPayments: (
    memberId: string,
    filters?: MemberPaymentFilters,
  ) => Promise<boolean>;

  fetchMemberPaymentTotal: (
    memberId: string,
    filters?: MemberPaymentFilters,
  ) => Promise<PaymentTotal | null>;

  fetchProviderPayments: (
    providerId: string,
    filters?: ProviderPaymentFilters,
  ) => Promise<boolean>;

  fetchPaymentsByStatus: (
    status: string,
    filters?: PaymentFilters,
  ) => Promise<boolean>;

  fetchPaymentTotals: (
    filters?: PaymentTotalsFilters,
  ) => Promise<PaymentTotal | null>;

  createPayment: (
    payload: CreatePaymentDto,
  ) => Promise<Payment | null>;

  initiateMpesaStkPush: (
    paymentId: string,
  ) => Promise<InitiateMpesaStkPushResponse | null>;

  checkMpesaPaymentStatus: (
    paymentId: string,
  ) => Promise<CheckMpesaPaymentStatusResponse | null>;

  completeManualPayment: (
    paymentId: string,
    payload: CompleteManualPaymentDto,
  ) => Promise<boolean>;

  ensurePaymentsLoaded: () => Promise<boolean>;
}

export const PaymentContext =
  createContext<PaymentContextType | undefined>(undefined);

interface PaymentProviderProps {
  children: ReactNode;
}

type PaymentListRequest = () => Promise<void>;

export const PaymentProvider = ({
  children,
}: PaymentProviderProps) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedPayment, setSelectedPayment] =
    useState<Payment | null>(null);

  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  const [totals, setTotals] = useState<PaymentTotal | null>(null);

  const [loadingCount, setLoadingCount] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  const loading = loadingCount > 0;

  const lastListRequest = useRef<PaymentListRequest | null>(null);
  const hasLoadedPayments = useRef(false);
  const latestListRequestId = useRef(0);

  // ---------------------------------------------------------
  // SHARED HELPERS
  // ---------------------------------------------------------

  const startLoading = useCallback(() => {
    setLoadingCount((current) => current + 1);
  }, []);

  const stopLoading = useCallback(() => {
    setLoadingCount((current) => Math.max(0, current - 1));
  }, []);

  const clearMessage = useCallback(() => {
    setMessage(null);
  }, []);

  const updatePaymentInState = useCallback((payment: Payment) => {
    setSelectedPayment((current) =>
      current?.id === payment.id ? payment : current,
    );

    setPayments((current) =>
      current.map((item) =>
        item.id === payment.id ? payment : item,
      ),
    );
  }, []);

  /**
   * Loads a payment list and updates pagination.
   *
   * Only the latest list request is allowed to update the list.
   * Silent requests are used for background refreshes.
   */
  const loadPaymentList = useCallback(
    async (
      request: () => Promise<PaymentsResponse>,
      silent = false,
    ): Promise<boolean> => {
      const requestId = ++latestListRequestId.current;

      if (!silent) {
        startLoading();
        setMessage(null);
      }

      try {
        const response = await request();

        // Ignore stale responses.
        if (requestId !== latestListRequestId.current) {
          return true;
        }

        const result = response.data;

        setPayments(result.data);

        setPagination({
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
          hasNextPage: result.page < result.totalPages,
          hasPreviousPage: result.page > 1,
        });

        hasLoadedPayments.current = true;

        if (!silent) {
          setMessage(response.message ?? null);
        }

        return true;
      } catch (error) {
        if (!silent && requestId === latestListRequestId.current) {
          setMessage(getApiError(error).message);
        }

        return false;
      } finally {
        if (!silent) {
          stopLoading();
        }
      }
    },
    [startLoading, stopLoading],
  );

  /**
   * Refreshes the last requested list without replacing
   * the message or triggering another loading state.
   */
  const refreshLastList = useCallback(async () => {
    if (!lastListRequest.current) return;

    await lastListRequest.current();
  }, []);

  // ---------------------------------------------------------
  // LIST PAYMENTS
  // ---------------------------------------------------------

  const fetchPayments = useCallback(
    async (filters: PaymentFilters = {}): Promise<boolean> => {
      const request = () => paymentService.getAll(filters);

      lastListRequest.current = async () => {
        await loadPaymentList(request, true);
      };

      return loadPaymentList(request);
    },
    [loadPaymentList],
  );

  // ---------------------------------------------------------
  // GET PAYMENT BY ID
  // ---------------------------------------------------------

  const fetchPayment = useCallback(
    async (paymentId: string): Promise<Payment | null> => {
      startLoading();
      setMessage(null);

      try {
        const response = await paymentService.getById(paymentId);

        setSelectedPayment(response.data);
        setMessage(response.message);

        return response.data;
      } catch (error) {
        setMessage(getApiError(error).message);
        return null;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading],
  );

  // ---------------------------------------------------------
  // GET PAYMENT BY INTERNAL REFERENCE
  // ---------------------------------------------------------

  const fetchPaymentByInternalReference = useCallback(
    async (
      internalReference: string,
    ): Promise<Payment | null> => {
      startLoading();
      setMessage(null);

      try {
        const response =
          await paymentService.getByInternalReference(
            internalReference,
          );

        setSelectedPayment(response.data);
        setMessage(response.message);

        return response.data;
      } catch (error) {
        setMessage(getApiError(error).message);
        return null;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading],
  );

  // ---------------------------------------------------------
  // GET PAYMENT BY EXTERNAL REFERENCE
  // ---------------------------------------------------------

  const fetchPaymentByExternalReference = useCallback(
    async (
      externalReference: string,
    ): Promise<Payment | null> => {
      startLoading();
      setMessage(null);

      try {
        const response =
          await paymentService.getByExternalReference(
            externalReference,
          );

        setSelectedPayment(response.data);
        setMessage(response.message);

        return response.data;
      } catch (error) {
        setMessage(getApiError(error).message);
        return null;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading],
  );

  // ---------------------------------------------------------
  // GET MEMBER PAYMENTS
  // ---------------------------------------------------------

  const fetchMemberPayments = useCallback(
    async (
      memberId: string,
      filters: MemberPaymentFilters = {},
    ): Promise<boolean> => {
      const request = () =>
        paymentService.getByMember(memberId, filters);

      lastListRequest.current = async () => {
        await loadPaymentList(request, true);
      };

      return loadPaymentList(request);
    },
    [loadPaymentList],
  );

  // ---------------------------------------------------------
  // GET MEMBER PAYMENT TOTAL
  // ---------------------------------------------------------

  const fetchMemberPaymentTotal = useCallback(
    async (
      memberId: string,
      filters: MemberPaymentFilters = {},
    ): Promise<PaymentTotal | null> => {
      startLoading();
      setMessage(null);

      try {
        const response = await paymentService.getMemberTotal(
          memberId,
          filters,
        );

        setMessage(response.message);

        return response.data;
      } catch (error) {
        setMessage(getApiError(error).message);
        return null;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading],
  );

  // ---------------------------------------------------------
  // GET PROVIDER PAYMENTS
  // ---------------------------------------------------------

  const fetchProviderPayments = useCallback(
    async (
      providerId: string,
      filters: ProviderPaymentFilters = {},
    ): Promise<boolean> => {
      const request = () =>
        paymentService.getByProvider(providerId, filters);

      lastListRequest.current = async () => {
        await loadPaymentList(request, true);
      };

      return loadPaymentList(request);
    },
    [loadPaymentList],
  );

  // ---------------------------------------------------------
  // GET PAYMENTS BY STATUS
  // ---------------------------------------------------------

  const fetchPaymentsByStatus = useCallback(
    async (
      status: string,
      filters: PaymentFilters = {},
    ): Promise<boolean> => {
      const request = () =>
        paymentService.getByStatus(status, filters);

      lastListRequest.current = async () => {
        await loadPaymentList(request, true);
      };

      return loadPaymentList(request);
    },
    [loadPaymentList],
  );

  // ---------------------------------------------------------
  // GET PAYMENT TOTALS
  // ---------------------------------------------------------

  const fetchPaymentTotals = useCallback(
    async (
      filters: PaymentTotalsFilters = {},
    ): Promise<PaymentTotal | null> => {
      startLoading();
      setMessage(null);

      try {
        const response = await paymentService.getTotals(filters);

        setTotals(response.data);
        setMessage(response.message);

        return response.data;
      } catch (error) {
        setMessage(getApiError(error).message);
        return null;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading],
  );

  // ---------------------------------------------------------
  // CREATE PAYMENT
  // ---------------------------------------------------------

  const createPayment = useCallback(
    async (
      payload: CreatePaymentDto,
    ): Promise<Payment | null> => {
      startLoading();
      setMessage(null);

      try {
        const response = await paymentService.create(payload);

        setSelectedPayment(response.data);
        setMessage(response.message);

        await refreshLastList();

        return response.data;
      } catch (error) {
        setMessage(getApiError(error).message);
        return null;
      } finally {
        stopLoading();
      }
    },
    [refreshLastList, startLoading, stopLoading],
  );

  // ---------------------------------------------------------
  // INITIATE M-PESA STK PUSH
  // ---------------------------------------------------------

  const initiateMpesaStkPush = useCallback(
    async (
      paymentId: string,
    ): Promise<InitiateMpesaStkPushResponse | null> => {
      startLoading();
      setMessage(null);

      try {
        const response =
          await paymentService.initiateMpesaStkPush(paymentId);

        setMessage(response.message);

        // This endpoint returns STK initiation details,
        // not the complete Payment record.
        return response.data;
      } catch (error) {
        setMessage(getApiError(error).message);
        return null;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading],
  );

  // ---------------------------------------------------------
  // CHECK M-PESA PAYMENT STATUS
  // ---------------------------------------------------------

  const checkMpesaPaymentStatus = useCallback(
    async (
      paymentId: string,
    ): Promise<CheckMpesaPaymentStatusResponse | null> => {
      startLoading();
      setMessage(null);

      try {
        const response =
          await paymentService.checkMpesaStatus(paymentId);

        setMessage(response.message);

        // Status check returns a status result, so retrieve
        // the full payment separately for the UI.
        try {
          const paymentResponse =
            await paymentService.getById(paymentId);

          updatePaymentInState(paymentResponse.data);
        } catch {
          // Keep the status-check result even if the detail
          // request fails.
        }

        await refreshLastList();

        return response.data;
      } catch (error) {
        setMessage(getApiError(error).message);
        return null;
      } finally {
        stopLoading();
      }
    },
    [
      refreshLastList,
      startLoading,
      stopLoading,
      updatePaymentInState,
    ],
  );

  // ---------------------------------------------------------
  // COMPLETE MANUAL PAYMENT
  // ---------------------------------------------------------

  const completeManualPayment = useCallback(
    async (
      paymentId: string,
      payload: CompleteManualPaymentDto,
    ): Promise<boolean> => {
      startLoading();
      setMessage(null);

      try {
        const response = await paymentService.completeManual(
          paymentId,
          payload,
        );

        updatePaymentInState(response.data);
        setMessage(response.message);

        await refreshLastList();

        return true;
      } catch (error) {
        setMessage(getApiError(error).message);
        return false;
      } finally {
        stopLoading();
      }
    },
    [
      refreshLastList,
      startLoading,
      stopLoading,
      updatePaymentInState,
    ],
  );

  // ---------------------------------------------------------
  // ENSURE PAYMENTS ARE LOADED
  // ---------------------------------------------------------

  const ensurePaymentsLoaded = useCallback(async (): Promise<boolean> => {
    if (hasLoadedPayments.current) {
      return true;
    }

    return fetchPayments();
  }, [fetchPayments]);

  return (
    <PaymentContext.Provider
      value={{
        payments,
        selectedPayment,
        pagination,
        totals,
        loading,
        message,

        setMessage,
        clearMessage,

        fetchPayments,
        fetchPayment,
        fetchPaymentByInternalReference,
        fetchPaymentByExternalReference,
        fetchMemberPayments,
        fetchMemberPaymentTotal,
        fetchProviderPayments,
        fetchPaymentsByStatus,
        fetchPaymentTotals,

        createPayment,
        initiateMpesaStkPush,
        checkMpesaPaymentStatus,
        completeManualPayment,

        ensurePaymentsLoaded,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};
