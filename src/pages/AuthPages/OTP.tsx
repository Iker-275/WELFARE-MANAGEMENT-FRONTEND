import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import OtpInput from "../../components/customforms/OTPForm";
import Button from "../../components/ui/button/Button";

import { useAuth } from "../../hooks/useAuth";

import {
  OtpChannel,
} from "../../types/AuthTypes";

interface VerifyOtpLocationState {
  flow: "signup" | "signin";

  email?: string;

  identifier?: string;

  otpChannel?: OtpChannel;
}

export default function VerifyOtp() {
  const nav = useNavigate();
  const location = useLocation();

  const {
    verifyEmail,
    verifyLogin,
    loading,
    message,
    setMessage,
  } = useAuth();

  const state =
    location.state as
      | VerifyOtpLocationState
      | null;

  const flow = state?.flow;

  const email =
    state?.email;

  const identifier =
    state?.identifier;

  const otpChannel =
    state?.otpChannel;

  const [otp, setOtp] =
    useState("");

  const [resetKey, setResetKey] =
    useState(0);

  /*
   * ======================================================
   * CLEAR MESSAGE WHEN USER STARTS TYPING
   * ======================================================
   */

  useEffect(() => {
    if (otp.length > 0) {
      setMessage("");
    }
  }, [
    otp,
    setMessage,
  ]);

  /*
   * ======================================================
   * VALIDATE ROUTE STATE
   * ======================================================
   */

  useEffect(() => {
    if (!flow) {
      setMessage(
        "Authentication session not found. Please try again."
      );
    }
  }, [
    flow,
    setMessage,
  ]);

  /*
   * ======================================================
   * VERIFY
   * ======================================================
   */

  const handleVerify = async () => {
    /*
     * SIGN UP
     */

    if (flow === "signup") {
      if (!email) {
        setMessage(
          "Email not found. Please register again."
        );
        return;
      }

      if (otp.length !== 6) {
        setMessage(
          "Please enter the 6-digit OTP code."
        );
        return;
      }

      const success =
        await verifyEmail({
          email,
          otp,
        });

      if (success) {
        nav("/");
      } else {
        resetOtp();
      }

      return;
    }

    /*
     * SIGN IN
     */

    if (flow === "signin") {
      if (!identifier) {
        setMessage(
          "Login identifier not found. Please sign in again."
        );
        return;
      }

      if (otp.length !== 6) {
        setMessage(
          "Please enter the 6-digit OTP code."
        );
        return;
      }

      const success =
        await verifyLogin({
          identifier,
          otp,
        });

      if (success) {
        nav("/");
      } else {
        resetOtp();
      }

      return;
    }

    setMessage(
      "Invalid authentication flow. Please try again."
    );
  };

  /*
   * ======================================================
   * RESET OTP
   * ======================================================
   */

  const resetOtp = () => {
    setOtp("");
    setResetKey(
      (previous) =>
        previous + 1
    );
  };

  /*
   * ======================================================
   * INVALID SESSION
   * ======================================================
   */

  if (!flow) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <p className="mb-4 text-red-500">
            Authentication session not found.
          </p>

          <Button
            onClick={() =>
              nav("/signin")
            }
          >
            Return to Sign In
          </Button>
        </div>
      </div>
    );
  }

  /*
   * ======================================================
   * DISPLAY TARGET
   * ======================================================
   */

  const verificationTarget =
    flow === "signup"
      ? email
      : identifier;

  const channelLabel =
    otpChannel === "SMS"
      ? "SMS"
      : otpChannel === "WHATSAPP"
      ? "WhatsApp"
      : "email";

  /*
   * ======================================================
   * UI
   * ======================================================
   */

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">

      <div className="w-full max-w-md text-center">

        <h2 className="mb-2 text-xl font-semibold">
          Verify your account
        </h2>

        <p className="text-sm text-gray-500">
          Enter the 6-digit verification code
          sent via{" "}
          <b>{channelLabel}</b>{" "}
          to{" "}
          <b>{verificationTarget}</b>
        </p>

      </div>

      {/* MESSAGE */}

      {message && (
        <div className="w-full max-w-md rounded bg-gray-50 p-3 text-center text-sm text-gray-700">
          {message}
        </div>
      )}

      {/* OTP */}

      <OtpInput
        onChange={setOtp}
        resetKey={resetKey}
      />

      {/* VERIFY */}

      <Button
        onClick={handleVerify}
        disabled={
          loading ||
          otp.length !== 6
        }
        className="w-64"
      >
        {loading
          ? "Verifying..."
          : "Verify OTP"}
      </Button>

    </div>
  );
}