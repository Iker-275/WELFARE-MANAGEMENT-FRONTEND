
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import AppLayout from "../layout/AppLayout"
import Home from "../pages/Dashboard/Home";
import NotFound from "../pages/OtherPage/NotFound";
import SignIn from "../pages/AuthPages/SignIn"
import SignUp from "../pages/AuthPages/SignUp"




import Roles from "../pages/RolesPages/Roles";
import CreateRole from "../pages/RolesPages/CreateRoles";
import UpdateRole from "../pages/RolesPages/UpdateRoles";


// import { ProtectedRoute, AuthRoute } from "../pages/ProtectedRoute";
// import CreateNotification from "../pages/NotificationPages/CreateNotification";

// import { RoleRoute } from "../pages/GuardedRoutes/RoleRoutes";
import VerifyOtp from "../pages/AuthPages/OTP";
import ResetPassword from "../pages/AuthPages/ResetPassword";
import ForgotPassword from "../pages/AuthPages/Forgot";

import AnnouncementsPage from "../pages/AnnouncementPages/AnnouncementPage";
import CreateAnnouncement from "../pages/AnnouncementPages/CreateAnnouncement";
import CreatePermission from "../pages/PermissionPages/CreatePermission";
import PermissionsPage from "../pages/PermissionPages/PermissionsPage";
import RolePermissionsPage from "../pages/RolesPages/RolePermissionsPage";
import CreateRegion from "../pages/RegionPages/CreateRegion";
import RegionsPage from "../pages/RegionPages/RegionPages";
import UpdateRegion from "../pages/RegionPages/UpdateRegion";
import ProtectedRoute from "../pages/ProtectedRoute";
import UpdatePermission from "../pages/PermissionPages/UpdatePermission";
import Members from "../pages/MemberPages/Members";
import CreateMember from "../pages/MemberPages/CreateMember";
import UpdateMember from "../pages/MemberPages/UpdateMember";
import MemberProfile from "../pages/MemberPages/MemberProfile";
import CreateEmployment from "../pages/MemberPages/CreateEmployment";
import UpdateEmployment from "../pages/MemberPages/UpdateEmployment";
import CreateNextOfKin from "../pages/MemberPages/CreateNextOfKin";
import UpdateNextOfKin from "../pages/MemberPages/UpdateNextOfKin";
import CreateDependant from "../pages/MemberPages/CreateDependant";
import UpdateDependant from "../pages/MemberPages/UpdateDependant";
import UpdateMyDependant from "../pages/ProfilePages/UpdateMyDependant";
import CreateMyDependant from "../pages/ProfilePages/CreateMyDependant";
import UpdateMyNextOfKin from "../pages/ProfilePages/UpdateMyNextOfKin";
import CreateMyNextOfKin from "../pages/ProfilePages/CreateMyNextOfKin";
import UpdateMyEmployment from "../pages/ProfilePages/UpdateMyEmployment";
import CreateMyEmployment from "../pages/ProfilePages/CreateMyEmployment";
import UpdateMyProfile from "../pages/ProfilePages/UpdateMyProfile";
import MyProfile from "../pages/ProfilePages/MyProfile";
import RegionMembers from "../pages/RegionPages/RegionMembers";
import Users from "../pages/UserPages/Users";
import UserDetails from "../pages/UserPages/UserDetails";
import UpdateUser from "../pages/UserPages/UpdateUsers";
import ImportErrors from "../pages/ImportPages/ImportErrors";
import ImportDetails from "../pages/ImportPages/ImportDetails";
import Imports from "../pages/ImportPages/Imports";
import CreateContributionPlan from "../pages/ContributionPlanPages/CreateContributionPlan";
import UpdateContributionPlan from "../pages/ContributionPlanPages/UpdateContributionPlan";
import ContributionPlans from "../pages/ContributionPlanPages/ContributionPlans";
import CreateContributionRulePage from "../pages/ContributionRulePages/CreateContributionRule";
import EditContributionRulePage from "../pages/ContributionRulePages/UpdateContributionRule";
import ContributionRulesPage from "../pages/ContributionRulePages/ContributionRules";
import ContributionPeriodsPage from "../pages/ContributionPeriodPages/ContributionPeriodsPage";
import GenerateContributionPeriodPage from "../pages/ContributionPeriodPages/GenerateContributionPeriodPage";
import GenerateContributionPeriodsBatchPage from "../pages/ContributionPeriodPages/GenerateContributionPeriodsBatchPage";
import MemberContributionsPage from "../pages/MemberContributionPages/MemberContributionsPage";
import GenerateMemberContributionPage from "../pages/MemberContributionPages/GenerateMemberContributionPage";
import GenerateBulkMemberContributionsPage from "../pages/MemberContributionPages/GenerateBulkMemberContributionsPage";
import CreatePaymentProviderPage from "../pages/PaymentProviderPages/CreatePaymentProviderPage";
import PaymentProvidersPage from "../pages/PaymentProviderPages/PaymentProvidersPage";
import MemberPaymentsPage from "../pages/Payments/Member/MemberPaymentsPage";
import CreateMemberPaymentPage from "../pages/Payments/Member/CreateMemberPaymentPage";
import MemberPaymentDetailsPage from "../pages/Payments/Member/MemberPaymentDetailsPage";
import AdminPaymentsPage from "../pages/Payments/Admin/PaymentsPage";
import CreateAdminPaymentPage from "../pages/Payments/Admin/CreatePaymentPage";
import AdminPaymentDetailsPage from "../pages/Payments/Admin/PaymentDetailsPage";
import MyContributionsPage from "../pages/MemberContributionPages/MEMBER/MyContributionsPage";






const AppRoutes = () => {
  return (
    <Router>

      <Routes>

        {/* PROTECTED DASHBOARD */}

        <Route element={<ProtectedRoute />}>

          <Route element={<AppLayout />}>

            {/* <Route element={<RoleRoute />}> */}
            <Route path="/" element={<Home />} />

            {/* <Route path="/users" element={<Users />} /> */}



            <Route path="/roles" element={<Roles />} />
            <Route path="/roles/create" element={<CreateRole />} />
            <Route path="/roles/edit/:id" element={<UpdateRole />} />


            <Route path="/roles/:id/permissions" element={<RolePermissionsPage />} />

            <Route path="/permissions" element={<PermissionsPage />} />
            <Route path="/permissions/create" element={<CreatePermission />} />
            <Route path="/permissions/edit/:id" element={<UpdatePermission />} />

            <Route path="/regions" element={<RegionsPage />} />

            <Route path="/regions/create" element={<CreateRegion />} />
            <Route path="/regions/edit/:id" element={<UpdateRegion />} />
            <Route path="/regions/:regionId/members" element={<RegionMembers />} />



            // Membership
            <Route path="/members" element={<Members />} />
            <Route path="/members/create" element={<CreateMember />} />
            <Route path="/members/:memberId" element={<MemberProfile />} />
            <Route
              path="/members/:memberId/employment/create"
              element={<CreateEmployment />} />

            <Route
              path="/members/:memberId/employment/edit/:employmentId"
              element={<UpdateEmployment />}
            />

            <Route
              path="/members/:memberId/next-of-kin/create"
              element={<CreateNextOfKin />}
            />

            <Route
              path="/members/:memberId/next-of-kin/edit/:nextOfKinId"
              element={<UpdateNextOfKin />}
            />

            <Route
              path="/members/:memberId/dependants/create"
              element={<CreateDependant />}
            />

            <Route
              path="/members/:memberId/dependants/edit/:dependantId"
              element={<UpdateDependant />}
            />
            <Route path="/members/edit/:memberId" element={<UpdateMember />} />

            <Route path="/profile" element={<MyProfile />} />
            <Route path="/profile/edit" element={<UpdateMyProfile />} />
            <Route path="/profile/employment/create" element={<CreateMyEmployment />} />
            <Route path="/profile/employment/edit" element={<UpdateMyEmployment />} />
            <Route path="/profile/next-of-kin/create" element={<CreateMyNextOfKin />} />
            <Route path="/profile/next-of-kin/edit" element={<UpdateMyNextOfKin />} />
            <Route path="/profile/dependants/create" element={<CreateMyDependant />} />
            <Route path="/profile/dependants/edit/:dependantId" element={<UpdateMyDependant />} />

            <Route path="/users" element={<Users />} />
            <Route path="/users/:userId" element={<UserDetails />} />
            <Route path="/users/edit/:userId" element={<UpdateUser />} />

            <Route path="/imports" element={<Imports />} />
            <Route path="/imports/:importId" element={<ImportDetails />} />
            <Route path="/imports/:importId/errors" element={<ImportErrors />} />

            {/* contribution plans */}

            <Route path="/contribution-plans/create" element={<CreateContributionPlan />} />
            <Route path="/contribution-plans/edit/:planId" element={<UpdateContributionPlan />} />
            <Route path="/contribution-plans" element={<ContributionPlans />} />

            {/* contribution rules */}
            <Route path="/contribution-rules/create" element={<CreateContributionRulePage />} />
            <Route path="/contribution-rules/edit/:ruleId" element={<EditContributionRulePage />} />
            <Route path="/contribution-rules" element={<ContributionRulesPage />} />

            {/* contribution periods */}
            <Route
              path="/contribution-periods"
              element={<ContributionPeriodsPage />}
            />

            <Route
              path="/contribution-periods/generate"
              element={<GenerateContributionPeriodPage />}
            />

            <Route
              path="/contribution-periods/generate-batch"
              element={<GenerateContributionPeriodsBatchPage />}
            />

            {/* member contributions */}
            <Route
              path="/member-contributions"
              element={<MemberContributionsPage />}
            />

            <Route
              path="/my-contributions"
              element={<MyContributionsPage />}
            />

            <Route
              path="/member-contributions/generate"
              element={<GenerateMemberContributionPage />}
            />

            <Route
              path="/member-contributions/generate-bulk"
              element={<GenerateBulkMemberContributionsPage />}
            />

            {/* payment providers */}
            <Route
              path="/payment-providers"
              element={<PaymentProvidersPage />}
            />

            <Route
              path="/payment-providers/create"
              element={<CreatePaymentProviderPage />}
            />

            {/* <Route
              path="/payment-providers/:id/edit"
              element={<EditPaymentProviderPage />}
            /> */}

            {/* member-payment */}
            <Route
              path="/member-payments"
              element={<MemberPaymentsPage />}
            />

            <Route
              path="/member-payments/:memberId/payments/create"
              element={<CreateMemberPaymentPage />}
            />

            <Route
              path="/member-payments/:memberId/payments/:paymentId"
              element={<MemberPaymentDetailsPage />}
            />

            {/* admin payments */}
            <Route
              path="/payments"
              element={<AdminPaymentsPage />}
            />

            <Route
              path="/payments/create"
              element={<CreateAdminPaymentPage />}
            />

            <Route
              path="/payments/:paymentId"
              element={<AdminPaymentDetailsPage />}
            />
            {/* <Route path="/notifications/create" element={<CreateNotification />} />
            <Route path="/notifications" element={<NotificationsPage />} /> */}

            <Route path="/announcements/create" element={<CreateAnnouncement />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />


            <Route path="*" element={<NotFound />} />

          </Route>
        </Route>

        {/* </Route> */}

        {/* AUTH PAGES */}
        {/* <Route element={<AuthRoute />}> */}

        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* </Route> */}

        {/* NOT FOUND */}

        <Route path="*" element={<NotFound />} />

      </Routes>

    </Router>
  );
};

export default AppRoutes;