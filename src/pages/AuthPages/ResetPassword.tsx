import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import { useAuth } from "../../hooks/useAuth";

export default function ResetPassword() {
  const nav = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const { resetPassword, loading, message, setMessage } = useAuth();

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage("Email missing. Restart process.");
      return;
    }

    if (!otp || otp.length !== 6) {
      setMessage("Enter valid OTP");
      return;
    }

    if (!password || !confirmPassword) {
      setMessage("Password fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const success = await resetPassword({
      email,
      otp,
      newPassword: password,
    });

    if (success) {
      setMessage("Password reset successful. Redirecting...");

      setTimeout(() => {
        nav("/signin");
      }, 1500);
    } else {
      setMessage("Password reset failed. Check OTP or try again.");
    }
  };

  if (!email) {
    return (
      <div className="text-center mt-10 text-red-500">
        Missing email. Please restart password reset.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h2 className="text-xl font-semibold mb-4">
        Reset Password
      </h2>

      {message && (
        <div className="text-sm text-center text-gray-700 mb-4">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div>
          <Label>Email</Label>
          <Input value={email} disabled />
        </div>

        <div>
          <Label>OTP</Label>
          <Input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e: any) => setOtp(e.target.value)}
          />
        </div>

        <div>
          <Label>New Password</Label>
          <Input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <Label>Confirm Password</Label>
          <Input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e: any) =>
              setConfirmPassword(e.target.value)
            }
          />
        </div>

        <Button className="w-full" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
}