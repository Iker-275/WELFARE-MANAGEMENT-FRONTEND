import {
  useEffect,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";

import {
  useImports,
} from "../../hooks/useImports";

const formatValue = (
  value: unknown
) => {

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

export default function ImportDetails() {

  const {
    importId,
  } = useParams<{
    importId: string;
  }>();

  const navigate =
    useNavigate();

  const {
    selectedImport,
    loading,
    message,
    fetchImport,
    clearMessage,
  } = useImports();

  useEffect(() => {

    if (!importId) {
      return;
    }

    void fetchImport(
      importId
    );

  }, [
    importId,
    fetchImport,
  ]);

  useEffect(() => {

    return () => {
      clearMessage();
    };

  }, [
    clearMessage,
  ]);

  if (
    loading &&
    !selectedImport
  ) {

    return (
      <>
        <PageMeta
          title="Import Details"
          description="View import job"
        />

        <PageBreadcrumb
          pageTitle="Import Details"
        />

        <div className="py-12 text-center">

          <p className="text-sm text-gray-500">
            Loading import...
          </p>

        </div>
      </>
    );
  }

  if (!selectedImport) {

    return (
      <>
        <PageMeta
          title="Import Details"
          description="View import job"
        />

        <PageBreadcrumb
          pageTitle="Import Details"
        />

        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">

          <div className="text-center">

            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Import not found
            </h3>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {message ||
                "The requested import could not be found."}
            </p>

            <Button
              variant="primary"
              onClick={() =>
                navigate("/imports")
              }
              className="mt-5"
            >
              Back to Imports
            </Button>

          </div>

        </div>
      </>
    );
  }

  const columns = Object.keys(
    selectedImport.rows[0]?.data || {}
  );

  return (
    <>
      <PageMeta
        title="Import Details"
        description="View import job details"
      />

      <PageBreadcrumb
        pageTitle="Import Details"
      />

      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>

            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              {selectedImport.originalName}
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Import type: {selectedImport.type}
            </p>

          </div>

          <Button
            variant="outline"
            onClick={() =>
              navigate(
                `/imports/${selectedImport.id}/errors`
              )
            }
          >
            View Errors
          </Button>

        </div>

        {/* Summary */}
        <ComponentCard
          title="Import Summary"
        >

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">

            <div>
              <p className="text-xs text-gray-500">
                Status
              </p>

              <p className="mt-1 font-semibold text-gray-800 dark:text-white/90">
                {selectedImport.status}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Total Rows
              </p>

              <p className="mt-1 font-semibold text-gray-800 dark:text-white/90">
                {selectedImport.totalRows}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Valid
              </p>

              <p className="mt-1 font-semibold text-success-600">
                {selectedImport.validRows}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Invalid
              </p>

              <p className="mt-1 font-semibold text-error-600">
                {selectedImport.invalidRows}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Successful
              </p>

              <p className="mt-1 font-semibold text-success-600">
                {selectedImport.successfulRows}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Failed
              </p>

              <p className="mt-1 font-semibold text-error-600">
                {selectedImport.failedRows}
              </p>
            </div>

          </div>

          {selectedImport.errorMessage && (
            <div className="mt-5 rounded-lg border border-error-200 bg-error-50 p-4 text-sm text-error-600 dark:border-error-500/20 dark:bg-error-500/10 dark:text-error-400">
              {selectedImport.errorMessage}
            </div>
          )}

        </ComponentCard>

        {/* Processed Rows */}
        <ComponentCard
          title="Processed Rows"
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

                </tr>

              </thead>

              <tbody>

                {selectedImport.rows.map(
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
                            {formatValue(
                              row.data[
                                column
                              ]
                            )}
                          </td>
                        )
                      )}

                      <td className="px-4 py-3">

                        <span
                          className={
                            row.valid
                              ? "rounded-full bg-success-50 px-2.5 py-1 text-xs font-medium text-success-600 dark:bg-success-500/10 dark:text-success-400"
                              : "rounded-full bg-error-50 px-2.5 py-1 text-xs font-medium text-error-600 dark:bg-error-500/10 dark:text-error-400"
                          }
                        >
                          {row.valid
                            ? "Valid"
                            : "Invalid"}
                        </span>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </ComponentCard>

      </div>
    </>
  );
}