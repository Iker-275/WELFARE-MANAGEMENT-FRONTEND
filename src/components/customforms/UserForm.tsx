
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
  UpdateUserDto,
  User,
} from "../../types/UserType";


interface UserFormProps {
  user: User;

  loading?: boolean;

  onSubmit: (
    data: UpdateUserDto
  ) => void;

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
    user.roleId ||
    user.role?.id ||
    ""
  );


  const [
    accountStatus,
    setAccountStatus,
  ] = useState(
    user.accountStatus ||
    ""
  );


  const [
    errors,
    setErrors,
  ] = useState<{
    roleId?: string;
    accountStatus?: string;
  }>({});


  /*
   * Synchronize form state whenever
   * a different user is loaded.
   */
  useEffect(() => {

    setRoleId(
      user.roleId ||
      user.role?.id ||
      ""
    );

    setAccountStatus(
      user.accountStatus ||
      ""
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
        "Please select a role.";
    }


    if (!accountStatus) {
      newErrors.accountStatus =
        "Please select an account status.";
    }


    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };


  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();


    if (!validate()) {
      return;
    }


    const payload: UpdateUserDto = {
      accountStatus,
      roleId,
    };


    onSubmit(payload);
  };


  return (
    <ComponentCard
      title="User Information"
    >

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* User Information */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          <div>

            <Label>
              Email
            </Label>

            <Input
              type="email"
              value={user.email}
              disabled
            />

          </div>


          <div>

            <Label>
              User Type
            </Label>

            <Input
              type="text"
              value={user.userType || ""}
              disabled
            />

          </div>


          <div>

            <Label>
              First Name
            </Label>

            <Input
              type="text"
              value={user.firstName || ""}
              disabled
            />

          </div>


          <div>

            <Label>
              Last Name
            </Label>

            <Input
              type="text"
              value={user.lastName || ""}
              disabled
            />

          </div>


          <div>

            <Label>
              Phone Number
            </Label>

            <Input
              type="text"
              value={user.phoneNumber || ""}
              disabled
            />

          </div>


          <div>

            <Label>
              Gender
            </Label>

            <Input
              type="text"
              value={user.gender || ""}
              disabled
            />

          </div>

        </div>


        {/* Account Management */}

        <div className="border-t border-gray-200 pt-6 dark:border-gray-800">

          <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
            Account Management
          </h3>


          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <RoleDropdown
              value={roleId}
              onChange={(
                selectedRoleId
              ) => {
                setRoleId(
                  selectedRoleId
                );

                setErrors(
                  (previous) => ({
                    ...previous,
                    roleId: undefined,
                  })
                );
              }}
              label="Role"
              placeholder="Select role"
              disabled={loading}
              required
              error={errors.roleId}
            />


            <AccountStatusDropdown
              value={accountStatus}
              onChange={(
                selectedStatus
              ) => {
                setAccountStatus(
                  selectedStatus
                );

                setErrors(
                  (previous) => ({
                    ...previous,
                    accountStatus: undefined,
                  })
                );
              }}
              label="Account Status"
              placeholder="Select account status"
              disabled={loading}
              required
              error={
                errors.accountStatus
              }
            />

          </div>

        </div>


        {/* Membership Information */}

        {user.member && (
          <div className="border-t border-gray-200 pt-6 dark:border-gray-800">

            <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
              Membership Information
            </h3>


            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div>

                <Label>
                  Membership Number
                </Label>

                <Input
                  type="text"
                  value={
                    user.member.membershipNumber
                  }
                  disabled
                />

              </div>


              <div>

                <Label>
                  Membership Status
                </Label>

                <Input
                  type="text"
                  value={
                    user.member.status
                  }
                  disabled
                />

              </div>

            </div>

          </div>
        )}


        {/* Actions */}

        <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-6 dark:border-gray-800">

          <Button
          
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>


          <Button
            disabled={loading}
          >
            {loading
              ? "Updating..."
              : "Update User"}
          </Button>

        </div>

      </form>

    </ComponentCard>
  );
}