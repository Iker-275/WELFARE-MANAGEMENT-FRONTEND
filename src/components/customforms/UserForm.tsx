import {
  useEffect,
  useState,
} from "react";

import ComponentCard from "../common/ComponentCard";

import Label from "../form/Label";

import Input from "../form/input/InputField";

import Button from "../ui/button/Button";

import RoleDropdown from "../customDropdowns/RoleDropdown";

import AccountStatusDropdown from "../customDropdowns/AccountStatusDropdown";

import {
  User,
} from "../../types/UserType";


interface UserFormProps {
  user: User;

  loading?: boolean;

  onSubmit: (data: {
    roleId: string;
    accountStatus: string;
  }) => void;

  onCancel: () => void;
}


export default function UserForm({
  user,
  loading = false,
  onSubmit,
  onCancel,
}: UserFormProps) {

  const [
    roleId,
    setRoleId,
  ] = useState(
    user.roleId || ""
  );


  const [
    accountStatus,
    setAccountStatus,
  ] = useState(
    user.accountStatus || ""
  );


  const [
    errors,
    setErrors,
  ] = useState<{
    roleId?: string;
    accountStatus?: string;
  }>({});


  useEffect(() => {
    setRoleId(
      user.roleId || ""
    );

    setAccountStatus(
      user.accountStatus || ""
    );

    setErrors({});
  }, [user]);


  const validate = () => {
    const newErrors: {
      roleId?: string;
      accountStatus?: string;
    } = {};


    if (!roleId) {
      newErrors.roleId =
        "Role is required";
    }


    if (!accountStatus) {
      newErrors.accountStatus =
        "Account status is required";
    }


    setErrors(newErrors);


    return (
      Object.keys(newErrors)
        .length === 0
    );
  };


  const handleSubmit = () => {
    if (!validate()) {
      return;
    }


    onSubmit({
      roleId,
      accountStatus,
    });
  };


  return (
    <ComponentCard
      title="Update User"
    >

      <div className="space-y-6">

        {/* Email */}
        <div>
          <Label>
            Email
          </Label>

          <Input
            type="email"
            value={user.email}
            disabled
          />

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Email cannot be changed from this screen.
          </p>
        </div>


        {/* Name */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          <div>
            <Label>
              First Name
            </Label>

            <Input
              type="text"
              value={
                user.firstName || ""
              }
              disabled
            />
          </div>


          <div>
            <Label>
              Last Name
            </Label>

            <Input
              type="text"
              value={
                user.lastName || ""
              }
              disabled
            />
          </div>

        </div>


        {/* Role */}
        <RoleDropdown
          value={roleId}
          onChange={(value) => {
            setRoleId(value);

            setErrors(
              previous => ({
                ...previous,
                roleId:
                  undefined,
              })
            );
          }}
          label="Role"
          placeholder="Select role"
          required
          error={errors.roleId}
          disabled={loading}
        />


        {/* Account Status */}
        <AccountStatusDropdown
          value={accountStatus}
          onChange={(value) => {
            setAccountStatus(value);

            setErrors(
              previous => ({
                ...previous,
                accountStatus:
                  undefined,
              })
            );
          }}
          label="Account Status"
          placeholder="Select account status"
          required
          error={
            errors.accountStatus
          }
          disabled={loading}
        />


        {/* Read-only information */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          <div>
            <Label>
              User Type
            </Label>

            <Input
              type="text"
              value={
                user.userType
              }
              disabled
            />
          </div>


          <div>
            <Label>
              Region
            </Label>

            <Input
              type="text"
              value={
                user.region?.name ||
                "Not assigned"
              }
              disabled
            />
          </div>

        </div>

      </div>


      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">

        <Button
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>


        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? "Updating..."
            : "Update User"}
        </Button>

      </div>

    </ComponentCard>
  );
}