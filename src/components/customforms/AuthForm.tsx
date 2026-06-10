import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { useAuth } from "../../hooks/useAuth";

interface Props {
  mode: "signin" | "signup";
}

export default function AuthForm({ mode }: Props) {
  const nav = useNavigate();

  // ✅ FIXED: correct function names from context
  const {
    login,
    register,
    loading,
    message,
    setMessage,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [isChecked, setIsChecked] =
    useState(false);

  const isSignup = mode === "signup";

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setMessage(""); // clear old message

    let success = false;

    if (isSignup) {
      success = await register({
        email,
        password,
      });
      if (success) {
  nav("/verify-otp", {
    state: { email },
  });
}
    } else {
      success = await login({
        email,
        password,
      });
        if (success) {
      nav("/");
    }
    }

   
  
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2">
      {/* GLOBAL MESSAGE DISPLAY */}
      {message && (
        <div className="mb-4 text-sm text-center text-brand-600 bg-brand-50 p-2 rounded">
          {message}
        </div>
      )}

      {/* LOADING INDICATOR */}
      {loading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin h-8 w-8 border-b-2 border-brand-500 rounded-full" />
        </div>
      )}

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-6">
          <h1 className="mb-2 font-semibold text-title-md">
            {isSignup ? "Sign Up" : "Sign In"}
          </h1>

          <p className="text-sm text-gray-500">
            {isSignup
              ? "Create your account"
              : "Enter your credentials to continue"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* EMAIL */}
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e: any) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            {/* PASSWORD */}
            <div>
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={
                    showPassword ? "text" : "password"
                  }
                  placeholder="Enter password"
                  value={password}
                  onChange={(e: any) =>
                    setPassword(e.target.value)
                  }
                />

                <span
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="size-5" />
                  ) : (
                    <EyeCloseIcon className="size-5" />
                  )}
                </span>
              </div>
            </div>

            {/* REMEMBER / TERMS */}
            {!isSignup ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                  <span className="text-sm text-gray-600">
                    Keep me logged in
                  </span>
                </div>

                <Link
                  to="/forgot-password"
                  className="text-sm text-brand-500"
                >
                  Forgot password?
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={isChecked}
                  onChange={setIsChecked}
                />
                <p className="text-sm text-gray-500">
                  Agree to Terms & Privacy Policy
                </p>
              </div>
            )}

            {/* BUTTON */}
            <Button
            //   type="submit"
              variant="outline"
              className="w-full"
              size="sm"
              disabled={loading}
            >
              {loading
                ? isSignup
                  ? "Creating Account..."
                  : "Signing In..."
                : isSignup
                ? "Create Account"
                : "Sign In"}
            </Button>
          </div>
        </form>

        {/* SWITCH */}
        <div className="mt-6 text-sm text-center">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-brand-500"
              >
                Sign In
              </Link>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-brand-500"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}