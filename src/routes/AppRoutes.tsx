
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import AppLayout from "../layout/AppLayout"
import Home from "../pages/Dashboard/Home";
import NotFound from "../pages/OtherPage/NotFound";
import SignIn from "../pages/AuthPages/SignIn"
import SignUp from "../pages/AuthPages/SignUp"




import Roles from "../pages/RolesPages/Roles";
import CreateRole from "../pages/RolesPages/CreateRoles";
import UpdateRole from "../pages/RolesPages/UpdateRoles";


import { ProtectedRoute, AuthRoute } from "../pages/ProtectedRoute";
import CreateNotification from "../pages/NotificationPages/CreateNotification";
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
import NotificationsPage from "../pages/NotificationPages/NotificationsPage";
import AnnouncementsPage from "../pages/AnnouncementPages/AnnouncementPage";
import CreateAnnouncement from "../pages/AnnouncementPages/CreateAnnouncement";






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

              <Route path="/notifications/create" element={<CreateNotification />} />
              <Route path="/notifications" element={<NotificationsPage />} />

              <Route path="/announcements/create" element={<CreateAnnouncement />} />
              <Route path="/announcements" element={<AnnouncementsPage />} />


              <Route path="*" element={<NotFound />} />

            </Route>
          </Route>

        {/* </Route> */}

        {/* AUTH PAGES */}
        <Route element={<AuthRoute />}>

          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

        </Route>

        {/* NOT FOUND */}

        <Route path="*" element={<NotFound />} />

      </Routes>

    </Router>
  );
};

export default AppRoutes;