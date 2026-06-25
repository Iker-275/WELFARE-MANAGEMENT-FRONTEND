import { useNavigate } from "react-router-dom";

import RegionForm from "../../components/customforms/RegionForm";

import { useRegion } from "../../hooks/useRegion";

export default function CreateRegion() {
  const navigate = useNavigate();

  const {
    createRegionHandler,message
  } = useRegion();

  const handleCreate = async (
    data: {
      name: string;
      code?: string;
      description?: string;
    }
  ) => {
    const response =
      await createRegionHandler(data);

    if (response?.success) {
      navigate("/regions");
    }
  };

  return (
    <>
    
    <RegionForm
      mode="create"
      onSubmit={handleCreate}
    />

     {message && (
    <div className="text-sm mt-4">
      {message}
    </div>
  )}
  </>
  );
}