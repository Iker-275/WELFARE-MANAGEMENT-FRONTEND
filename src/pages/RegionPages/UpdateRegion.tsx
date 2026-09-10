import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import RegionForm from "../../components/customforms/RegionForm";

import { useRegion } from "../../hooks/useRegion";

import {
  Region,
  UpdateRegionDto,
} from "../../types/RegionType";

export default function UpdateRegion() {
  const { id } =
    useParams<{ id: string }>();

  const navigate =
    useNavigate();

  const {
    fetchRegion,
    updateRegion,
    loading,
    message,
    clearMessage,
  } = useRegion();

  const [region, setRegion] =
    useState<Region | null>(null);

  const [loadingRegion, setLoadingRegion] =
    useState(true);

  useEffect(() => {
    if (!id) {
      return;
    }

    let mounted = true;

    const loadRegion =
      async () => {
        setLoadingRegion(true);

        const result =
          await fetchRegion(id);

        if (mounted) {
          setRegion(result);
          setLoadingRegion(false);
        }
      };

    loadRegion();

    return () => {
      mounted = false;
    };
  }, [
    id,
    fetchRegion,
  ]);

  const handleUpdate = async (
    data: UpdateRegionDto
  ) => {
    if (!id) {
      return;
    }

    clearMessage();

    const success =
      await updateRegion(
        id,
        data
      );

    if (success) {
      navigate("/regions");
    }
  };

  if (
    loadingRegion ||
    !region
  ) {
    return (
      <div className="p-6">
        Loading region...
      </div>
    );
  }

  return (
    <>
      <RegionForm
        mode="edit"
        loading={loading}
        initialData={{
          name: region.name,
          code: region.code ?? "",
          description:
            region.description ?? "",
        }}
        onSubmit={handleUpdate}
      />

      {message && (
        <div className="mt-4 text-sm">
          {message}
        </div>
      )}
    </>
  );
}