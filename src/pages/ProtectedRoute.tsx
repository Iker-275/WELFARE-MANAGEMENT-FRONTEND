

// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";

// function ProtectedRoute() {

//   const { token} = useAuth();
  
  

//   // if (loading) return null;

//   if (!token) {
//     return <Navigate to="/signin" replace />;
//   }
  
// // logout();
//   return <Outlet />;
// }


//  function AuthRoute() {

//   const { token} = useAuth();

//   // if (loading) return null;

//   if (token) {
//     return <Navigate to="/" replace />;
//   }
  
  

//   return <Outlet />;
// }

// export{AuthRoute,ProtectedRoute}


import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { tokenService } from "../services/tokenService";
import { authToken } from "../services/authToken";

function ProtectedRoute() {
  const { user } = useAuth();

  const accessToken = tokenService.getAccessToken();

  if (!user || !accessToken) {
    return <Navigate to="/signin" replace />;
  }

  if (authToken.isExpired(accessToken)) {
    tokenService.clearTokens();
    localStorage.removeItem("user");

    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}

function AuthRoute() {
  const accessToken = tokenService.getAccessToken();

  if (
    accessToken &&
    !authToken.isExpired(accessToken)
  ) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export { ProtectedRoute, AuthRoute };