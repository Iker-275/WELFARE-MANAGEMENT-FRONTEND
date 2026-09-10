
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
import Menu from "../pages/MenuPages/Menu";
import CreateMenu from "../pages/MenuPages/CreateMenu";
import UpdateMenu from "../pages/MenuPages/UpdateMenu";
import Status from "../pages/StatusPages/Status";
import CreateStatus from "../pages/StatusPages/CreateStatus";
import UpdateStatus from "../pages/StatusPages/UpdateStatus";
import OrdersPage from "../pages/OrderPages/Orders";
import OrderDetailsPage from "../pages/OrderPages/OrderDetails";
import CustomersPage from "../pages/CustomerPages/Customers";
import CustomerDetails from "../pages/CustomerPages/CustomerDetails";
import CreateCustomer from "../pages/CustomerPages/CreateCustomer";
import UpdateCustomer from "../pages/CustomerPages/UpdateCustomer";
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
import RegionUsersPage from "../pages/RegionPages/RegionUserPage";
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
            <Route path="/regions/:id/users" element={<RegionUsersPage />} />

            <Route path="/region-users" element={<RegionUsersPage />} />

            // Membership
            <Route path="/members" element={<Members />} />
            <Route path="/members/create" element={<CreateMember />} />
            <Route path="/members/:memberId" element={<MemberProfile />} />
            <Route
              path="/members/:memberId/employment/create"
              element={<CreateEmployment />}/>

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


            <Route path="/menu" element={<Menu />} />
            <Route path="/menu/create" element={<CreateMenu />} />
            <Route path="/menu/edit/:id" element={<UpdateMenu />} />

            <Route path="/order-status" element={<Status />} />
            <Route path="/order-status/create" element={<CreateStatus />} />
            <Route path="/order-status/edit/:id" element={<UpdateStatus />} />

            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailsPage />} />




            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/customers/:id" element={<CustomerDetails />} />
            <Route path="/customers/create" element={<CreateCustomer />} />

            <Route path="/customers/edit/:id" element={<UpdateCustomer />} />

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