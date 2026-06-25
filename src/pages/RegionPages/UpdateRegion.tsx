import { useNavigate, useParams } from "react-router-dom";

import RegionForm from "../../components/customforms/RegionForm";

import { useRegion } from "../../hooks/useRegion";

export default function UpdateRegion() {
  const { id } = useParams();

  const navigate = useNavigate();

  const {
    regions,
    updateRegionHandler,message
  } = useRegion();

  const region =
    regions.find(
      (r: any) => r.id === id
    );

  if (!region) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  const handleUpdate = async (
    data: {
      name: string;
      code?: string;
      description?: string;
    }
  ) => {
    const response =
      await updateRegionHandler(
        id!,
        data
      );

    if (response?.success) {
      navigate("/regions");
    }
  };

  return (
    <>
    <RegionForm
      mode="edit"
      initialData={{
        name: region.name,
        code: region.code || "",
        description:
          region.description || "",
      }}
      onSubmit={handleUpdate}
    />
     {message && (
    <div className="text-sm mt-4">
      {message}
    </div>
  )}
  </>
  );
}