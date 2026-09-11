import {
  useCallback,
  useEffect,
} from "react";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

import ComponentCard from "../../components/common/ComponentCard";
import ImportUploadForm from "../../components/customforms/ImportUploadForm";
import ImportPreview from "../../components/customComponents/ImportPreview";
import ImportsTable from "../../components/tables/BasicTables/BasicTableOne";


import {
  useImports,
} from "../../hooks/useImports";

import {
  ImportType,
} from "../../types/ImportTypes";


export default function Imports() {

  const {
    imports,

    selectedImport,

    preview,

    loading,

    message,

    previewImport,
    executeImport,
    fetchImports,

    clearPreview,
    clearMessage,
  } = useImports();

  /*
   * ============================================================
   * FETCH IMPORTS
   * ============================================================
   */

  useEffect(() => {

    void fetchImports();

  }, [
    fetchImports,
  ]);

  /*
   * ============================================================
   * CLEAR MESSAGE
   * ============================================================
   */

  useEffect(() => {

    return () => {
      clearMessage();
    };

  }, [
    clearMessage,
  ]);

  /*
   * ============================================================
   * PREVIEW
   * ============================================================
   */

  const handlePreview = useCallback(
    async (
      file: File,
      type: string
    ) => {

      await previewImport({
        file,

        type:
          type as ImportType,
      });

    },
    [
      previewImport,
    ]
  );

  /*
   * ============================================================
   * EXECUTE
   * ============================================================
   */

  const handleExecute =
    useCallback(
      async () => {

        if (!selectedImport) {
          return;
        }

        const success =
          await executeImport(
            selectedImport.id
          );

        if (success) {

          clearPreview();

          await fetchImports();
        }

      },
      [
        selectedImport,
        executeImport,
        clearPreview,
        fetchImports,
      ]
    );

  return (
    <>
      <PageMeta
        title="Imports"
        description="Upload and manage spreadsheet imports"
      />

      <PageBreadcrumb
        pageTitle="Imports"
      />

      <div className="space-y-6">

        {/* Header */}
        <div>

          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Imports
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Upload Excel files, validate their contents, preview the results, and execute valid imports.
          </p>

        </div>

        {/* Message */}
        {message && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300">
            {message}
          </div>
        )}

        {/* Upload / Preview */}
        {preview ? (

          <ImportPreview
            preview={preview}
            loading={loading}
            onExecute={
              handleExecute
            }
            onCancel={
              clearPreview
            }
          />

        ) : (

          <ImportUploadForm
            loading={loading}
            onSubmit={
              handlePreview
            }
          />

        )}

        {/* Import History */}
        <ComponentCard
          title="Import History"
        >

          <ImportsTable
            imports={imports}
            loading={loading}
          />

        </ComponentCard>

      </div>
    </>
  );
}