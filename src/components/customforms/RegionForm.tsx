// import { useEffect, useState } from "react";

// import ComponentCard from "../common/ComponentCard";

// import Label from "../form/Label";

// import Input from "../form/input/InputField";

// import Button from "../ui/button/Button";

// interface RegionFormProps {
//   mode: "create" | "edit";

//   initialData?: {
//     name: string;
//     code?: string;
//     description?: string;
//   };

//   onSubmit: (data: {
//     name: string;
//     code?: string;
//     description?: string;
//   }) => void;
// }

// export default function RegionForm({
//   mode,
//   initialData,
//   onSubmit,
// }: RegionFormProps) {
//   const [name, setName] =
//     useState("");

//   const [code, setCode] =
//     useState("");

//   const [description, setDescription] =
//     useState("");

//   const [errors, setErrors] =
//     useState<any>({});

//   useEffect(() => {
//     if (initialData) {
//       setName(
//         initialData.name || ""
//       );

//       setCode(
//         initialData.code || ""
//       );

//       setDescription(
//         initialData.description || ""
//       );
//     }
//   }, [initialData]);

//   const validate = () => {
//     const error: any = {};

//     if (!name.trim()) {
//       error.name =
//         "Region name is required";
//     }

//     setErrors(error);

//     return (
//       Object.keys(error).length === 0
//     );
//   };

//   const handleSubmit = () => {
//     if (!validate()) {
//       return;
//     }

//     onSubmit({
//       name,
//       code,
//       description,
//     });
//   };

//   return (
//     <ComponentCard
//       title={
//         mode === "create"
//           ? "Create Region"
//           : "Update Region"
//       }
//     >
      
//       <div className="space-y-6">
//         <div>
//           <Label>
//             Region Name
//           </Label>

//           <Input
//             placeholder="Enter region name"
//             value={name}
//             onChange={(e: any) =>
//               setName(e.target.value)
//             }
//           />

//           {errors.name && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.name}
//             </p>
//           )}
//         </div>

//         <div>
//           <Label>
//             Region Code
//           </Label>

//           <Input
//             placeholder="Enter region code"
//             value={code}
//             onChange={(e: any) =>
//               setCode(e.target.value)
//             }
//           />
//         </div>

//         <div>
//           <Label>
//             Description
//           </Label>

//           <textarea
//             value={description}
//             onChange={(e) =>
//               setDescription(
//                 e.target.value
//               )
//             }
//             rows={4}
//             className="w-full rounded-lg border border-gray-300 px-4 py-3"
//             placeholder="Enter description"
//           />
//         </div>
//       </div>

//       <div className="flex justify-end gap-3 pt-6 border-t mt-6">
//         <Button
//           variant="outline"
//           onClick={handleSubmit}
//         >
//           {mode === "create"
//             ? "Create Region"
//             : "Update Region"}
//         </Button>
//       </div>
//     </ComponentCard>
//   );
// }

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

interface RegionFormData {
  name: string;
  code?: string;
  description?: string;
}

interface RegionFormProps {
  mode: "create" | "edit";

  initialData?: RegionFormData;

  loading?: boolean;

  onSubmit: (
    data: RegionFormData
  ) => void;
}

interface RegionFormErrors {
  name?: string;
  code?: string;
  description?: string;
}

export default function RegionForm({
  mode,
  initialData,
  loading = false,
  onSubmit,
}: RegionFormProps) {
  const [name, setName] =
    useState("");

  const [code, setCode] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [errors, setErrors] =
    useState<RegionFormErrors>({});

  useEffect(() => {
    setName(
      initialData?.name ?? ""
    );

    setCode(
      initialData?.code ?? ""
    );

    setDescription(
      initialData?.description ?? ""
    );

    setErrors({});
  }, [initialData]);

  const validate = (): boolean => {
    const nextErrors: RegionFormErrors =
      {};

    if (!name.trim()) {
      nextErrors.name =
        "Region name is required.";
    }

    if (!code.trim()) {
      nextErrors.code =
        "Region code is required.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      name: name.trim(),
      code: code.trim(),
      description:
        description.trim() || undefined,
    });
  };

  const isCreate =
    mode === "create";

  return (
    <ComponentCard
      title={
        isCreate
          ? "Create Region"
          : "Update Region"
      }
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div>
          <Label>
            Region Name
          </Label>

          <Input
            placeholder="Enter region name"
            value={name}
            onChange={(event) =>
              setName(
                event.target.value
              )
            }
            disabled={loading}
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-500">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <Label>
            Region Code
          </Label>

          <Input
            placeholder="Enter region code"
            value={code}
            onChange={(event) =>
              setCode(
                event.target.value
              )
            }
            disabled={loading}
          />

          {errors.code && (
            <p className="mt-1 text-sm text-red-500">
              {errors.code}
            </p>
          )}
        </div>

        <div>
          <Label>
            Description
          </Label>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            rows={4}
            disabled={loading}
            placeholder="Enter description"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-900"
          />
        </div>

        <div className="flex justify-end gap-3 border-t pt-6">
          <Button
         
            variant="outline"
            disabled={loading}
          >
            {loading
              ? isCreate
                ? "Creating..."
                : "Updating..."
              : isCreate
                ? "Create Region"
                : "Update Region"}
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
}