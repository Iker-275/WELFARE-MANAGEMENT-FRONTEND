import {
  useEffect,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";

import {
  useImports,
} from "../../hooks/useImports";

export default function ImportErrors() {

  const {
    importId,
  } = useParams<{
    importId: string;
  }>();

  const navigate =
    useNavigate();

  const {
    errors,
    loading,
    message,
    fetchImportErrors,
    clearMessage,
  } = useImports();

  useEffect(() => {

    if (!importId) {
      return;
    }

    void fetchImportErrors(
      importId
    );

  }, [
    importId,
    fetchImportErrors,
  ]);

  useEffect(() => {

    return () => {
      clearMessage();
    };

  }, [
    clearMessage,
  ]);

  return (
    <>
      <PageMeta
        title="Import Errors"
        description="View import validation errors"
      />

      <PageBreadcrumb
        pageTitle="Import Errors"
      />

      <div className="space-y-6">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Import Errors
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Validation and processing errors returned for this import.
            </p>

          </div>

          <Button
            variant="outline"
            onClick={() =>
              navigate(
                `/imports/${importId}`
              )
            }
          >
            Back to Import
          </Button>

        </div>

        {message && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-white/[0.03]">
            {message}
          </div>
        )}

        <ComponentCard
          title={`Errors (${errors.length})`}
        >

          {loading ? (

            <div className="py-8 text-center">

              <p className="text-sm text-gray-500">
                Loading errors...
              </p>

            </div>

          ) : errors.length === 0 ? (

            <div className="py-8 text-center">

              <p className="text-sm text-gray-500 dark:text-gray-400">
                No errors found for this import.
              </p>

            </div>

          ) : (

            <div className="space-y-3">

              {errors.map(
                (error, index) => {

                  const message =
                    typeof error === "string"
                      ? error
                      : error.message;

                  return (
                    <div
                      key={index}
                      className="rounded-lg border border-error-200 bg-error-50 p-4 dark:border-error-500/20 dark:bg-error-500/10"
                    >

                      <p className="text-sm text-error-600 dark:text-error-400">
                        {message}
                      </p>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </ComponentCard>

      </div>
    </>
  );
}