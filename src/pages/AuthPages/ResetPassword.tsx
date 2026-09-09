import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";

import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";

import { useAuth } from "../../hooks/useAuth";
import { OtpChannel } from "../../types/AuthTypes";

interface ResetPasswordLocationState {
  identifier?: string;
  otpChannel?: OtpChannel;
}

export default function ResetPassword() {
  const nav = useNavigate();
  const location = useLocation();

  const state =
    location.state as
      | ResetPasswordLocationState
      | null;

  const identifier = state?.identifier;
  const otpChannel = state?.otpChannel;

  const {
    resetPassword,
    loading,
    message,
    setMessage,
  } = useAuth();

  const [otp, setOtp] = useState("");
  const [password, setPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!identifier) {
      setMessage(
        "Email is missing. Please restart the password reset process."
      );
      return;
    }

    if (!otp || otp.length !== 6) {
      setMessage(
        "Enter the valid 6-digit OTP."
      );
      return;
    }

    if (!password || !confirmPassword) {
      setMessage(
        "Password fields are required."
      );
      return;
    }

    if (password !== confirmPassword) {
      setMessage(
        "Passwords do not match."
      );
      return;
    }

    const success =
      await resetPassword({
        identifier,
        otp,
        newPassword: password,
        confirmPassword,
      });

    if (success) {
      setMessage(
        "Password reset successful. Redirecting..."
      );

      setTimeout(() => {
        nav("/signin");
      }, 1500);

      return;
    }

    setMessage(
      "Password reset failed. Check the OTP or try again."
    );
  };

  if (!identifier) {
    return (
      <div className="mt-10 text-center text-red-500">
        Missing email. Please restart the password
        reset process.
      </div>
    );
  }

  const channelLabel =
    otpChannel === "SMS"
      ? "SMS"
      : "email";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <h2 className="mb-4 text-xl font-semibold">
        Reset Password
      </h2>

      {message && (
        <div className="mb-4 text-center text-sm text-gray-700">
          {message}
        </div>
      )}

      <div className="mb-4 text-center text-sm text-gray-500">
        Enter the 6-digit OTP sent via{" "}
        <span className="font-medium">
          {channelLabel}
        </span>
        .
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4"
      >
        <div>
          <Label>Email</Label>

          <Input
            value={identifier}
            disabled
          />
        </div>

        <div>
          <Label>OTP</Label>

          <Input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) =>
              setOtp(
                e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 6)
              )
            }
            disabled={loading}
          />
        </div>

        <div>
          <Label>New Password</Label>

          <Input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            disabled={loading}
          />
        </div>

        <div>
          <Label>Confirm Password</Label>

          <Input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            disabled={loading}
          />
        </div>

        <Button
          className="w-full"
          disabled={
            loading ||
            otp.length !== 6
          }
        >
          {loading
            ? "Resetting..."
            : "Reset Password"}
        </Button>
      </form>
    </div>
  );
}