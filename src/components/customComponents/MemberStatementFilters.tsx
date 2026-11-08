import { FormEvent } from "react";

import { MemberStatementFilters as MemberStatementFiltersType } from "../../types/MemberStatementType";

interface MemberStatementFiltersProps {
    filters: MemberStatementFiltersType;
    onChange: (filters: MemberStatementFiltersType) => void;
    onApply: () => void;
    onReset: () => void;
    loading?: boolean;
}

const MemberStatementFilters = ({
    filters,
    onChange,
    onApply,
    onReset,
    loading = false,
}: MemberStatementFiltersProps) => {
    const handleChange = (
        field: keyof MemberStatementFiltersType,
        value: string
    ) => {
        onChange({
            ...filters,
            [field]: value || undefined,
        });
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onApply();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label
                        htmlFor="statement-from"
                        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >
                        From Date
                    </label>

                    <input
                        id="statement-from"
                        type="date"
                        value={filters.from ?? ""}
                        onChange={(event) =>
                            handleChange("from", event.target.value)
                        }
                        max={filters.to || undefined}
                        disabled={loading}
                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs outline-none focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                    />
                </div>

                <div>
                    <label
                        htmlFor="statement-to"
                        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >
                        To Date
                    </label>

                    <input
                        id="statement-to"
                        type="date"
                        value={filters.to ?? ""}
                        onChange={(event) =>
                            handleChange("to", event.target.value)
                        }
                        min={filters.from || undefined}
                        disabled={loading}
                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs outline-none focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                    />
                </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3">
                <button
                    type="button"
                    onClick={onReset}
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
                >
                    Reset
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Generating..." : "Generate Statement"}
                </button>
            </div>
        </form>
    );
};

export default MemberStatementFilters;