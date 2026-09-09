
import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import { useAuth } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";

import tokenService from "../services/tokenService";
import authToken from "../services/authToken";
import authStorage from "../services/authStorage";


function ProtectedRoute() {
  const {
    user,
    authReady,
  } = useAuth();

  const {
    profileCompletion,
    fetchProfileCompletion,
  } = useUser();

  const location =
    useLocation();

  const [
    checkingProfile,
    setCheckingProfile,
  ] = useState(false);

  const accessToken =
    tokenService.getAccessToken();


  /*
   * ------------------------------------------------------------
   * PROFILE COMPLETION
   * ------------------------------------------------------------
   */

  useEffect(() => {
    if (
      !authReady ||
      !user?.id ||
      !accessToken ||
      authToken.isExpired(accessToken) ||
      profileCompletion !== null
    ) {
      return;
    }

    let mounted = true;

    const checkProfile =
      async () => {
        setCheckingProfile(true);

        try {
          await fetchProfileCompletion(
            user.id
          );
        } finally {
          if (mounted) {
            setCheckingProfile(false);
          }
        }
      };

    checkProfile();

    return () => {
      mounted = false;
    };

  }, [
    authReady,
    user?.id,
    accessToken,
    profileCompletion,
    fetchProfileCompletion,
  ]);


  /*
   * ------------------------------------------------------------
   * AUTH RESTORATION
   * ------------------------------------------------------------
   */

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-gray-500">
          Restoring session...
        </div>
      </div>
    );
  }


  /*
   * ------------------------------------------------------------
   * NOT AUTHENTICATED
   * ------------------------------------------------------------
   */

  if (!accessToken || !user) {
    return (
      <Navigate
        to="/signin"
        replace
        state={{
          from: location,
        }}
      />
    );
  }


  /*
   * ------------------------------------------------------------
   * EXPIRED TOKEN
   * ------------------------------------------------------------
   */

  if (
    authToken.isExpired(accessToken)
  ) {
    tokenService.clearTokens();
    authStorage.clearUser();

    return (
      <Navigate
        to="/signin"
        replace
        state={{
          from: location,
        }}
      />
    );
  }


  /*
   * ------------------------------------------------------------
   * PROFILE CHECKING
   * ------------------------------------------------------------
   */

  if (
    checkingProfile ||
    profileCompletion === null
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-gray-500">
          Checking profile...
        </div>
      </div>
    );
  }


  /*
   * ------------------------------------------------------------
   * PROFILE INCOMPLETE
   * ------------------------------------------------------------
   */

  if (
    !profileCompletion.isComplete &&
    location.pathname !== "/profile"
  ) {
    return (
      <Navigate
        to="/profile"
        replace
        state={{
          required: true,
        }}
      />
    );
  }


  /*
   * ------------------------------------------------------------
   * ACCESS GRANTED
   * ------------------------------------------------------------
   */

  return <Outlet />;
}


export default ProtectedRoute;