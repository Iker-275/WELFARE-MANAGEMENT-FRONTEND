import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import { useAuth } from "../../hooks/useAuth";

export default function ForgotPassword() {
  const nav = useNavigate();
  const { forgotPassword, loading, message, setMessage } = useAuth();

  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage("Email is required");
      return;
    }

    const success = await forgotPassword({ email });

    if (success) {
      setMessage("OTP sent to your email. Proceed to reset password.");

      nav("/reset-password", {
        state: { email },
      });
    } else {
      setMessage("Failed to send reset OTP. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h2 className="text-xl font-semibold mb-4">
        Forgot Password
      </h2>

      {message && (
        <div className="text-sm text-center text-gray-700 mb-4">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />
        </div>

        <Button className="w-full" disabled={loading}>
          {loading ? "Sending OTP..." : "Send Reset OTP"}
        </Button>
      </form>
    </div>
  );
}