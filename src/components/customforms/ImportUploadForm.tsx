import {
  ChangeEvent,
  useState,
} from "react";

import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import ImportTypeDropdown from "../customDropdowns/ImportTypeDropdown";



interface ImportUploadFormProps {
  loading?: boolean;

  onSubmit: (
    file: File,
    type: string
  ) => void;
}

export default function ImportUploadForm({
  loading = false,
  onSubmit,
}: ImportUploadFormProps) {

  const [
    file,
    setFile,
  ] = useState<File | null>(
    null
  );

  const [
    type,
    setType,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {

    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const extension =
      selectedFile.name
        .split(".")
        .pop()
        ?.toLowerCase();

    if (
      extension !== "xlsx" &&
      extension !== "xls"
    ) {

      setFile(null);

      setError(
        "Please select a valid Excel file (.xlsx or .xls)."
      );

      event.target.value = "";

      return;
    }

    setError("");

    setFile(
      selectedFile
    );
  };

  const handleSubmit = () => {

    if (!type) {

      setError(
        "Import type is required."
      );

      return;
    }

    if (!file) {

      setError(
        "Excel file is required."
      );

      return;
    }

    setError("");

    onSubmit(
      file,
      type
    );
  };

  return (
    <ComponentCard
      title="Upload Import"
    >

      <div className="space-y-6">

        {/* Import Type */}
        <ImportTypeDropdown
          value={type}
          onChange={value => {
            setType(value);
            setError("");
          }}
          required
          disabled={loading}
        />

        {/* File */}
        <div>

          <Label>
            Excel File
          </Label>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={
              handleFileChange
            }
            disabled={loading}
            className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white text-sm text-gray-700 file:mr-4 file:border-0 file:bg-gray-100 file:px-4 file:py-2.5 file:text-sm file:font-medium dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-300 dark:file:bg-white/[0.06]"
          />

          <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            Supported formats: .xlsx and .xls
          </p>

          {file && (
            <div className="mt-3 rounded-lg bg-gray-50 p-3 dark:bg-white/[0.03]">

              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {file.name}
              </p>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {(file.size / 1024).toFixed(1)} KB
              </p>

            </div>
          )}

        </div>

        {error && (
          <div className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
            {error}
          </div>
        )}

        <div className="flex justify-end">

          <Button
            variant="primary"
            onClick={
              handleSubmit
            }
            disabled={loading}
          >
            {loading
              ? "Preparing Preview..."
              : "Preview Import"}
          </Button>

        </div>

      </div>

    </ComponentCard>
  );
}