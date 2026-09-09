import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  EyeCloseIcon,
  EyeIcon,
} from "../../icons";

import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";

import NotificationChannelDropdown from "../customDropdowns/NotificationChannelDropdown";

import { useAuth } from "../../hooks/useAuth";

import {
  Gender,
  OtpChannel,
} from "../../types/AuthTypes";

import OtpChannelDropdown from "../customDropdowns/OtpChannelDropdown";

interface Props {
  mode: "signin" | "signup";
}

export default function AuthForm({
  mode,
}: Props) {
  const nav = useNavigate();

  const {
    login,
    register,
    loading,
    message,
    setMessage,
  } = useAuth();

  const isSignup = mode === "signup";

  /*
   * ======================================================
   * FORM STATE
   * ======================================================
   */

  const [email, setEmail] =
    useState("");

  const [phoneNumber, setPhoneNumber] =
    useState("");

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [gender, setGender] =
    useState<Gender | "">("");

  const [password, setPassword] =
    useState("");

  const [otpChannel, setOtpChannel] =
    useState<OtpChannel>("EMAIL");

  const [showPassword, setShowPassword] =
    useState(false);

  const [isChecked, setIsChecked] =
    useState(false);

  /*
   * ======================================================
   * SUBMIT
   * ======================================================
   */

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setMessage("");

    /*
     * ------------------------------------------------------
     * SIGN UP
     * ------------------------------------------------------
     */

    if (isSignup) {
      if (!firstName.trim()) {
        setMessage("First name is required.");
        return;
      }

      if (!lastName.trim()) {
        setMessage("Last name is required.");
        return;
      }

      if (!phoneNumber.trim()) {
        setMessage("Phone number is required.");
        return;
      }

      if (!gender) {
        setMessage("Please select your gender.");
        return;
      }

      if (!isChecked) {
        setMessage(
          "Please agree to the Terms & Privacy Policy."
        );
        return;
      }

      const success = await register({
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        password,
        otpChannel,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        gender,
      });

      if (success) {
        nav("/verify-otp", {
          state: {
            flow: "signup",
            email: email.trim(),
            otpChannel,
          },
        });
      }

      return;
    }

    /*
     * ------------------------------------------------------
     * SIGN IN
     * ------------------------------------------------------
     */

    if (!email.trim()) {
      setMessage("Email is required.");
      return;
    }

    if (!password) {
      setMessage("Password is required.");
      return;
    }

    const success = await login({
      identifier: email.trim(),
      password,
      otpChannel,
    });

    if (success) {
      nav("/verify-otp", {
        state: {
          flow: "signin",
          identifier: email.trim(),
          otpChannel,
        },
      });
    }
  };

  /*
   * ======================================================
   * UI
   * ======================================================
   */

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2">

      {/* GLOBAL MESSAGE */}
      {message && (
        <div className="mb-4 rounded bg-brand-50 p-2 text-center text-sm text-brand-600">
          {message}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center py-6">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-brand-500" />
        </div>
      )}

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="mb-2 font-semibold text-title-md">
            {isSignup
              ? "Sign Up"
              : "Sign In"}
          </h1>

          <p className="text-sm text-gray-500">
            {isSignup
              ? "Create your account"
              : "Enter your credentials to continue"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">

            {/* ==================================================
                SIGN UP FIELDS
            ================================================== */}

            {isSignup && (
              <>
                {/* FIRST NAME */}
                <div>
                  <Label>
                    First Name
                  </Label>

                  <Input
                    type="text"
                    placeholder="Enter first name"
                    value={firstName}
                    onChange={(e) =>
                      setFirstName(
                        e.target.value
                      )
                    }
                  />
                </div>

                {/* LAST NAME */}
                <div>
                  <Label>
                    Last Name
                  </Label>

                  <Input
                    type="text"
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={(e) =>
                      setLastName(
                        e.target.value
                      )
                    }
                  />
                </div>

                {/* PHONE */}
                <div>
                  <Label>
                    Phone Number
                  </Label>

                  <Input
                    type="tel"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) =>
                      setPhoneNumber(
                        e.target.value
                      )
                    }
                  />
                </div>

                {/* GENDER */}
                <div>
                  <Label>
                    Gender
                  </Label>

                  <select
                    value={gender}
                    onChange={(e) =>
                      setGender(
                        e.target.value as Gender
                      )
                    }
                    className="
                      w-full
                      rounded-lg
                      border
                      border-gray-300
                      bg-white
                      px-4
                      py-2.5
                      text-sm
                      text-gray-800
                      outline-none
                      focus:border-brand-500
                      focus:ring-2
                      focus:ring-brand-500/20
                      dark:border-gray-700
                      dark:bg-gray-dark
                      dark:text-white
                    "
                  >
                    <option value="">
                      Select gender
                    </option>

                    <option value="MALE">
                      Male
                    </option>

                    <option value="FEMALE">
                      Female
                    </option>

                    <option value="OTHER">
                      Other
                    </option>
                  </select>
                </div>
              </>
            )}

            {/* ==================================================
                EMAIL / IDENTIFIER
            ================================================== */}

            <div>
              <Label>
                Email
              </Label>

              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
              />
            </div>

            {/* ==================================================
                PASSWORD
            ================================================== */}

            <div>
              <Label>
                Password
              </Label>

              <div className="relative">
                <Input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                  "
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeIcon className="size-5" />
                  ) : (
                    <EyeCloseIcon className="size-5" />
                  )}
                </button>
              </div>
            </div>

            {/* ==================================================
                OTP / NOTIFICATION CHANNEL
            ================================================== */}

            {/* <NotificationChannelDropdown
              value={otpChannel}
              onChange={(value) =>
                setOtpChannel(
                  value as OtpChannel
                )
              }
              label="Send verification code via"
              placeholder="Select notification channel"
              required
              disabled={loading}
            /> */}
            <OtpChannelDropdown
              value={otpChannel}
              onChange={setOtpChannel}
              label="Send verification code via"
              placeholder="Select verification method"
              required
              disabled={loading}
            />

            {/* ==================================================
                REMEMBER / TERMS
            ================================================== */}

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

            {/* ==================================================
                SUBMIT
            ================================================== */}

            <Button
              // type="submit"
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

        {/* ====================================================
            SWITCH AUTH MODE
        ==================================================== */}

        <div className="mt-6 text-center text-sm">
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