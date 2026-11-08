import { useEffect, useState } from "react";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import PaymentMemberDropdown from "../../components/customDropdowns/PaymentMemberDropdown";
import MemberStatementFilters from "../../components/customComponents/MemberStatementFilters";
import PdfPreviewModal from "../../components/customComponents/PDFPreview";

import { useMemberStatementContext } from "../../hooks/useMemberStatement";

import { MemberStatementFilters
    as MemberStatementFiltersType 
} from "../../types/MemberStatementType";



const AdminMemberStatementPage = () => {
    const {
        loading,
        message,
        fetchMemberStatementPdf,
        clearMessage,
    } = useMemberStatementContext();

    const [memberId, setMemberId] = useState("");
    const [filters, setFilters] = useState<MemberStatementFiltersType>({});

    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);

    // Revoke generated object URLs when replaced or when the page unmounts.
    useEffect(() => {
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [pdfUrl]);

    const handleMemberChange = (value: string) => {
        setMemberId(value);
        closePreview();
        clearMessage();
    };

    const handleGenerateStatement = async () => {
        if (!memberId) {
            return;
        }

        closePreview();
        clearMessage();

        const blob = await fetchMemberStatementPdf(memberId, filters);

        if (!blob) {
            return;
        }

        const url = URL.createObjectURL(blob);

        setPdfUrl(url);
        setPreviewOpen(true);
    };

    const handleResetFilters = () => {
        setFilters({});
    };

    const closePreview = () => {
        setPreviewOpen(false);
        setPdfUrl(null);
    };

    return (
        <>
            <PageMeta
                title="Member Statement | Budgeti"
                description="Generate and view member financial statements."
            />

            <PageBreadcrumb pageTitle="Member Statement" />

            <div className="space-y-6">
                <ComponentCard title="Generate Member Statement">
                    <div className="space-y-6">
                        {/* Member Selection */}
                        <div>
                            <PaymentMemberDropdown
                                value={memberId}
                                onChange={handleMemberChange}
                                label="Select Member"
                                placeholder="Select a member"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Date Filters */}
                        <div>
                            <h3 className="mb-4 text-sm font-medium text-gray-800 dark:text-white/90">
                                Statement Period
                            </h3>

                            <MemberStatementFilters
                                filters={filters}
                                onChange={setFilters}
                                onApply={handleGenerateStatement}
                                onReset={handleResetFilters}
                                loading={loading}
                            />
                        </div>

                        {/* Messages */}
                        {message && (
                            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                {message}
                            </div>
                        )}

                        {/* Generate Button */}
                        {/* <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleGenerateStatement}
                                disabled={!memberId || loading}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Generating...
                                    </>
                                ) : (
                                    "Generate Statement PDF"
                                )}
                            </button>
                        </div> */}
                    </div>
                </ComponentCard>
            </div>

            {/* PDF Preview */}
            <PdfPreviewModal
                open={previewOpen}
                url={pdfUrl}
                onClose={closePreview}
            />
        </>
    );
};

export default AdminMemberStatementPage;