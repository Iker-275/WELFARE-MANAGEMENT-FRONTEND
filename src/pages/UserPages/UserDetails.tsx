import {
  useEffect,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import {
  useUser,
} from "../../hooks/useUser";


const getUserName = (
  firstName: string | null,
  lastName: string | null,
  email: string
) => {
  const name = [
    firstName,
    lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return name || email;
};


const getStatusClasses = (
  status: string
) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";

    case "PENDING":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400";

    case "SUSPENDED":
      return "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";

    case "DEACTIVATED":
      return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";

    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400";
  }
};


const getVerificationClasses = (
  verified: boolean
) => {
  return verified
    ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
    : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";
};


const formatDate = (
  value: string
) => {
  return new Date(value).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
};


const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => {
  return (
    <div>
      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
        {label}
      </p>

      <p className="font-medium text-gray-800 dark:text-white/90">
        {value || "—"}
      </p>
    </div>
  );
};


export default function UserDetails() {

  const {
    userId,
  } = useParams<{
    userId: string;
  }>();

  const {
    selectedUser,
    profileCompletion,
    loading,
    message,
    fetchUser,
    fetchProfileCompletion,
  } = useUser();


  useEffect(() => {
    if (!userId) {
      return;
    }

    void fetchUser(userId);
    void fetchProfileCompletion(userId);
  }, [
    userId,
    fetchUser,
    fetchProfileCompletion,
  ]);


  if (loading && !selectedUser) {
    return (
      <>
        <PageMeta
          title="User Details"
          description="View user details"
        />

        <PageBreadcrumb
          pageTitle="User Details"
        />

        <ComponentCard title="User Details">
          <div className="flex items-center justify-center py-12">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Loading user...
            </div>
          </div>
        </ComponentCard>
      </>
    );
  }


  if (!selectedUser) {
    return (
      <>
        <PageMeta
          title="User Details"
          description="View user details"
        />

        <PageBreadcrumb
          pageTitle="User Details"
        />

        <ComponentCard title="User Details">
          <div className="py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {message || "User not found."}
            </p>

            <Link
              to="/users"
              className="mt-4 inline-flex rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              Back to Users
            </Link>
          </div>
        </ComponentCard>
      </>
    );
  }


  const userName = getUserName(
    selectedUser.firstName,
    selectedUser.lastName,
    selectedUser.email
  );


  return (
    <>
      <PageMeta
        title={`${userName} - User Details`}
        description="View user account details"
      />

      <PageBreadcrumb
        pageTitle="User Details"
      />


      <div className="space-y-6">

        {/* Header */}
        <ComponentCard title={selectedUser.firstName ?? ""}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-xl font-semibold text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                {userName
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                  {userName}
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {selectedUser.email}
                </p>

                <div className="mt-2 flex flex-wrap gap-2">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                      selectedUser.accountStatus
                    )}`}
                  >
                    {selectedUser.accountStatus}
                  </span>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-500/10 dark:text-gray-400">
                    {selectedUser.userType}
                  </span>

                </div>
              </div>

            </div>


            <Link
              to="/users"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.03]"
            >
              Back to Users
            </Link>

          </div>
        </ComponentCard>


        {/* Account Information */}
        <ComponentCard title="Account Information">

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            <DetailItem
              label="Email"
              value={selectedUser.email}
            />

            <DetailItem
              label="Phone Number"
              value={selectedUser.phoneNumber}
            />

            <DetailItem
              label="User Type"
              value={selectedUser.userType}
            />

            <DetailItem
              label="Role"
              value={selectedUser.role?.name}
            />

            <DetailItem
              label="Region"
              value={
                selectedUser.region?.name
              }
            />

            <DetailItem
              label="Gender"
              value={selectedUser.gender}
            />

          </div>

        </ComponentCard>


        {/* Verification */}
        <ComponentCard title="Verification">

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            <DetailItem
              label="Email Verification"
              value={
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getVerificationClasses(
                    selectedUser.emailVerified
                  )}`}
                >
                  {selectedUser.emailVerified
                    ? "Verified"
                    : "Not Verified"}
                </span>
              }
            />

            <DetailItem
              label="Phone Verification"
              value={
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getVerificationClasses(
                    selectedUser.phoneVerified
                  )}`}
                >
                  {selectedUser.phoneVerified
                    ? "Verified"
                    : "Not Verified"}
                </span>
              }
            />

          </div>

        </ComponentCard>


        {/* Profile Completion */}
        <ComponentCard title="Profile Completion">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Profile status
              </p>

              <p className="mt-1 font-medium text-gray-800 dark:text-white/90">
                {profileCompletion?.isComplete
                  ? "Complete"
                  : "Incomplete"}
              </p>
            </div>


            <span
              className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${
                profileCompletion?.isComplete
                  ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"
              }`}
            >
              {profileCompletion?.isComplete
                ? "Complete"
                : "Incomplete"}
            </span>

          </div>

        </ComponentCard>


        {/* Account Dates */}
        <ComponentCard title="Account Activity">

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            <DetailItem
              label="Account Created"
              value={formatDate(
                selectedUser.createdAt
              )}
            />

            <DetailItem
              label="Last Updated"
              value={formatDate(
                selectedUser.updatedAt
              )}
            />

          </div>

        </ComponentCard>

      </div>
    </>
  );
}