
export interface StatementMember {
    id: string;
    membershipNumber: string;
    status: string;
    userId: string;
}

export interface StatementPeriod {
    from: string | null;
    to: string | null;
}

export interface StatementSummary {
    completedPayments: number;
    allocatedPayments: number;
    unallocatedPayments: number;

    contributionCharges: number;
    contributionPaid: number;
    contributionOutstanding: number;

    penaltyCharges: number;
    penaltyPaid: number;
    penaltyOutstanding: number;

    totalCharges: number;
    totalApplied: number;
    totalOutstanding: number;
    netMemberCredit: number;
}

export type StatementLedgerType =
    | "CONTRIBUTION_CHARGE"
    | "CONTRIBUTION_PAYMENT"
    | "PENALTY_CHARGE"
    | (string & {});

export interface StatementLedgerEntry {
    date: string;
    type: StatementLedgerType;
    reference: string;

    paymentId?: string | null;
    receiptNumber?: string | null;
    receiptStatus?: string | null;

    description: string;

    debit: number;
    credit: number;
    currency: string;

    contributionId?: string | null;
    allocationId?: string | null;
    penaltyId?: string | null;

    status?: string | null;
}

export interface StatementReconciliationIssue {
    code: string;
    paymentId: string;
    internalReference: string;
}

export interface StatementReconciliation {
    isBalanced: boolean;
    issueCount: number;
    issues: StatementReconciliationIssue[];
}

export interface MemberStatement {
    member: StatementMember;
    period: StatementPeriod;
    currency: string;
    summary: StatementSummary;
    ledger: StatementLedgerEntry[];
    reconciliation: StatementReconciliation;
    generatedAt: string;
}

export interface MemberStatementFilters {
    from?: string;
    to?: string;
}

export interface MemberStatementApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    code?: string | null;
    errors?: unknown;
}
