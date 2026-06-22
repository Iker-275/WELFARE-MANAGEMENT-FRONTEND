import { useEffect, useState, } from "react";
import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";



interface RoleFormProps {
  mode: "create" | "edit";
  initialData?: { name: string; };
  onSubmit: (data: { name: string; }) => void;
}



export default function RoleForm({ mode, initialData, onSubmit }: RoleFormProps) {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<any>({});
  useEffect(() => {
    if (initialData) {
      setName(
        initialData.name
      );
    }
  }, [initialData]);


  const validate = () => {
    const error: any = {};
    if (!name.trim()) {
      error.name =
        "Role name is required";

    }

    setErrors(error);

    return Object.keys(error).length === 0;
  };


  const handleSubmit = () => {
    if (!validate())
      return;
    onSubmit({
      name
    });
  };

  return (
    <ComponentCard title={mode === "create" ? "Create Role" : "Update Role"}>

      <div className="space-y-6">
        <div>
          <Label>Role Name</Label>

          <Input placeholder="Enter role name" value={name} onChange={(e: any) => setName(e.target.value)} />



          {errors.name && <p className=" text-red-500 text-sm mt-1 ">{errors.name}</p>}
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-6 border-t mt-6">
        <Button variant="outline" onClick={handleSubmit}>

          {mode === "create" ? "Create Role" : "Update Role"}
        </Button>
      </div>
    </ComponentCard>
  );



}