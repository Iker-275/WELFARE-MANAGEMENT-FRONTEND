import { useEffect, useState } from "react";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import MemberStatementFilters from "../../components/customComponents/MemberStatementFilters";
import PdfPreviewModal from "../../components/customComponents/PDFPreview";

import { useMemberStatementContext } from "../../hooks/useMemberStatement";

import { MemberStatementFilters as MemberStatementFiltersType } from "../../types/MemberStatementType";

const MyMemberStatementPage = () => {
    const {
        loading,
        message,
        fetchMyStatementPdf,
        clearMessage,
    } = useMemberStatementContext();

    const [filters, setFilters] = useState<MemberStatementFiltersType>({});

    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);

    // Revoke the previous PDF URL when replaced or when the page unmounts.
    useEffect(() => {
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [pdfUrl]);

    const closePreview = () => {
        setPreviewOpen(false);
        setPdfUrl(null);
    };

    const handleGenerateStatement = async () => {
        closePreview();
        clearMessage();

        const blob = await fetchMyStatementPdf(filters);

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

    return (
        <>
            <PageMeta
                title="My Statement | Budgeti"
                description="Generate and view your member financial statement."
            />

            <PageBreadcrumb pageTitle="My Statement" />

            <div className="space-y-6">
                <ComponentCard title="My Member Statement">
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Generate your financial statement to review
                                your contributions, payments, penalties, and
                                outstanding balances.
                            </p>
                        </div>

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

                        {message && (
                            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                {message}
                            </div>
                        )}
                    </div>
                </ComponentCard>
            </div>

            <PdfPreviewModal
                open={previewOpen}
                url={pdfUrl}
                onClose={closePreview}
            />
        </>
    );
};

export default MyMemberStatementPage;