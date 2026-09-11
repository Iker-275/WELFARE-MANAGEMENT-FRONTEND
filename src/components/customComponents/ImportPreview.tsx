import {
  ImportPreview as ImportPreviewType,
} from "../../types/ImportTypes";

import ComponentCard from "../common/ComponentCard";
import Button from "../ui/button/Button";

interface ImportPreviewProps {
  preview: ImportPreviewType;

  loading?: boolean;

  onExecute: () => void;
  onCancel: () => void;
}

const formatCellValue = (
  value: unknown
): string => {

  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  if (
    typeof value === "object"
  ) {
    return JSON.stringify(
      value
    );
  }

  return String(value);
};

export default function ImportPreview({
  preview,
  loading = false,
  onExecute,
  onCancel,
}: ImportPreviewProps) {

  const {
    summary,
    columns,
    rows,
    errors,
  } = preview;

  return (
    <div className="space-y-6">

      {/* Summary */}
      <ComponentCard
        title="Import Summary"
      >

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total Rows
            </p>

            <p className="mt-1 text-xl font-semibold text-gray-800 dark:text-white/90">
              {summary.totalRows}
            </p>

          </div>

          <div className="rounded-lg border border-success-200 bg-success-50 p-4 dark:border-success-500/20 dark:bg-success-500/10">

            <p className="text-xs text-success-600 dark:text-success-400">
              Valid Rows
            </p>

            <p className="mt-1 text-xl font-semibold text-success-700 dark:text-success-400">
              {summary.validRows}
            </p>

          </div>

          <div className="rounded-lg border border-error-200 bg-error-50 p-4 dark:border-error-500/20 dark:bg-error-500/10">

            <p className="text-xs text-error-600 dark:text-error-400">
              Invalid Rows
            </p>

            <p className="mt-1 text-xl font-semibold text-error-700 dark:text-error-400">
              {summary.invalidRows}
            </p>

          </div>

          <div
            className={`rounded-lg border p-4 ${
              summary.ready
                ? "border-success-200 bg-success-50 dark:border-success-500/20 dark:bg-success-500/10"
                : "border-warning-200 bg-warning-50 dark:border-warning-500/20 dark:bg-warning-500/10"
            }`}
          >

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Status
            </p>

            <p className="mt-1 text-sm font-semibold">
              {summary.ready
                ? "Ready to Import"
                : "Requires Correction"}
            </p>

          </div>

        </div>

        {errors.length > 0 && (
          <div className="mt-5 rounded-lg border border-error-200 bg-error-50 p-4 dark:border-error-500/20 dark:bg-error-500/10">

            <p className="text-sm font-medium text-error-700 dark:text-error-400">
              Preview Errors
            </p>

            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-error-600 dark:text-error-400">

              {errors.map(
                (error, index) => (
                  <li key={index}>
                    {typeof error === "string"
                      ? error
                      : error.message}
                  </li>
                )
              )}

            </ul>

          </div>
        )}

      </ComponentCard>

      {/* Dynamic Preview Table */}
      <ComponentCard
        title="Import Preview"
      >

        <div className="overflow-x-auto">

          <table className="min-w-full text-left text-sm">

            <thead>

              <tr className="border-b border-gray-200 dark:border-gray-800">

                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">
                  #
                </th>

                {columns.map(
                  column => (
                    <th
                      key={column}
                      className="whitespace-nowrap px-4 py-3 font-medium text-gray-600 dark:text-gray-300"
                    >
                      {column}
                    </th>
                  )
                )}

                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">
                  Status
                </th>

                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">
                  Errors
                </th>

              </tr>

            </thead>

            <tbody>

              {rows.length === 0 ? (

                <tr>

                  <td
                    colSpan={
                      columns.length + 3
                    }
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No preview rows available.
                  </td>

                </tr>

              ) : (

                rows.map(
                  row => (
                    <tr
                      key={row.rowNumber}
                      className="border-b border-gray-100 dark:border-gray-800"
                    >

                      <td className="px-4 py-3 text-gray-500">
                        {row.rowNumber}
                      </td>

                      {columns.map(
                        column => (
                          <td
                            key={column}
                            className="whitespace-nowrap px-4 py-3 text-gray-700 dark:text-gray-300"
                          >
                            {formatCellValue(
                              row.data[
                                column
                              ]
                            )}
                          </td>
                        )
                      )}

                      <td className="px-4 py-3">

                        {row.valid ? (

                          <span className="rounded-full bg-success-50 px-2.5 py-1 text-xs font-medium text-success-600 dark:bg-success-500/10 dark:text-success-400">
                            Valid
                          </span>

                        ) : (

                          <span className="rounded-full bg-error-50 px-2.5 py-1 text-xs font-medium text-error-600 dark:bg-error-500/10 dark:text-error-400">
                            Invalid
                          </span>

                        )}

                      </td>

                      <td className="px-4 py-3">

                        {row.errors.length === 0 ? (

                          <span className="text-gray-400">
                            —
                          </span>

                        ) : (

                          <div className="max-w-xs space-y-1">

                            {row.errors.map(
                              (error, index) => (
                                <p
                                  key={index}
                                  className="text-xs text-error-500"
                                >
                                  {typeof error === "string"
                                    ? error
                                    : error.message}
                                </p>
                              )
                            )}

                          </div>

                        )}

                      </td>

                    </tr>
                  )
                )

              )}

            </tbody>

          </table>

        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-800">

          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={onExecute}
            disabled={
              loading ||
              !summary.ready
            }
          >
            {loading
              ? "Executing..."
              : "Execute Import"}
          </Button>

        </div>

      </ComponentCard>

    </div>
  );
}