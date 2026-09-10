import { useNavigate } from "react-router-dom";

import RegionForm from "../../components/customforms/RegionForm";

import { useRegion } from "../../hooks/useRegion";

import {
  CreateRegionDto,
} from "../../types/RegionType";

export default function CreateRegion() {
  const navigate =
    useNavigate();

  const {
    createRegion,
    loading,
    message,
    clearMessage,
  } = useRegion();

  const handleCreate = async (
    data: {
      name: string;
      code?: string;
      description?: string;
    }
  ) => {
    clearMessage();

    const payload: CreateRegionDto = {
      name: data.name,
      code: data.code ?? "",
      description:
        data.description,
    };

    const success =
      await createRegion(
        payload
      );

    if (success) {
      navigate(
        "/regions"
      );
    }
  };

  return (
    <>
      <RegionForm
        mode="create"
        loading={loading}
        onSubmit={handleCreate}
      />

      {message && (
        <div className="mt-4 text-sm">
          {message}
        </div>
      )}
    </>
  );
}


// import { useNavigate } from "react-router-dom";

// import RegionForm from "../../components/customforms/RegionForm";

// import { useRegion } from "../../hooks/useRegion";

// import {
//   CreateRegionDto,
// } from "../../types/RegionType";

// export default function CreateRegion() {
//   const navigate =
//     useNavigate();

//   const {
//     createRegion,
//     loading,
//     message,
//     clearMessage,
//   } = useRegion();

//   const handleCreate = async (
//     data: CreateRegionDto
//   ) => {
//     clearMessage();

//     const success =
//       await createRegion(data);

//     if (success) {
//       navigate("/regions");
//     }
//   };

//   return (
//     <>
//       <RegionForm
//         mode="create"
//         loading={loading}
//         onSubmit={handleCreate}
//       />

//       {message && (
//         <div className="mt-4 text-sm">
//           {message}
//         </div>
//       )}
//     </>
//   );
// }