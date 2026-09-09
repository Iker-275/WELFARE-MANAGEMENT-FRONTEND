import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import OtpChannelDropdown from "../../components/customDropdowns/OtpChannelDropdown";

import { useAuth } from "../../hooks/useAuth";
import { OtpChannel } from "../../types/AuthTypes";

export default function ForgotPassword() {
  const nav = useNavigate();

  const {
    forgotPassword,
    loading,
    message,
    setMessage,
  } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [otpChannel, setOtpChannel] =
    useState<OtpChannel>("EMAIL");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const trimmedIdentifier =
      identifier.trim();

    if (!trimmedIdentifier) {
      setMessage("Email is required.");
      return;
    }

    const success = await forgotPassword({
      identifier: trimmedIdentifier,
      otpChannel,
    });

    if (success) {
      setMessage(
        `OTP sent via ${
          otpChannel === "EMAIL"
            ? "email"
            : "SMS"
        }.`
      );

      nav("/reset-password", {
        state: {
          identifier: trimmedIdentifier,
          otpChannel,
        },
      });

      return;
    }

    setMessage(
      "Failed to send reset OTP. Please try again."
    );
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <h2 className="mb-4 text-xl font-semibold">
        Forgot Password
      </h2>

      {message && (
        <div className="mb-4 text-center text-sm text-gray-700">
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4"
      >
        <div>
          <Label>Email</Label>

          <Input
            type="email"
            placeholder="Enter your email"
            value={identifier}
            onChange={(e) =>
              setIdentifier(e.target.value)
            }
            disabled={loading}
          />
        </div>

        <OtpChannelDropdown
          value={otpChannel}
          onChange={setOtpChannel}
          label="Send reset code via"
          placeholder="Select verification method"
          required
          disabled={loading}
        />

        <Button
          className="w-full"
          disabled={loading}
        >
          {loading
            ? "Sending OTP..."
            : "Send Reset OTP"}
        </Button>
      </form>
    </div>
  );
}