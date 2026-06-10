// import { useLocation, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import OtpInput from "../../components/customforms/OTPForm";
// import Button from "../../components/ui/button/Button";
// import { useAuth } from "../../hooks/useAuth";

// export default function VerifyOtp() {
//   const nav = useNavigate();
//   const location = useLocation();

//   const email = location.state?.email;

//   const { verifyEmail, loading, message, setMessage } =
//     useAuth();

//   const [otp, setOtp] = useState("");

//   // Clear message when user types again
//   useEffect(() => {
//     if (otp.length > 0) {
//       setMessage("");
//     }
//   }, [otp]);

//   const handleVerify = async () => {
//     if (!email) {
//       setMessage("Email not found. Please register again.");
//       return;
//     }

//     if (otp.length !== 6) {
//       setMessage("Please enter the 6-digit OTP code.");
//       return;
//     }

//     const success = await verifyEmail({
//       email,
//       otp,
//     });

//     if (success) {
//       setMessage("OTP verified successfully. Redirecting...");

//       setTimeout(() => {
//         nav("/");
//       }, 1200);
//     } else {
//       setMessage("Invalid OTP. Please try again.");
//       setOtp("");
//     }
//   };

//   if (!email) {
//     return (
//       <div className="text-center mt-10 text-red-500">
//         Email not found. Please register again.
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
//       <h2 className="text-xl font-semibold">
//         Verify your email
//       </h2>

//       <p className="text-sm text-gray-500 text-center">
//         Enter the 6-digit code sent to <b>{email}</b>
//       </p>

//       {/* MESSAGE AREA (simple + clear) */}
//       {message && (
//         <div className="text-sm text-center text-gray-700">
//           {message}
//         </div>
//       )}

//       <OtpInput onChange={setOtp} />

//       <Button
//         onClick={handleVerify}
//         disabled={loading || otp.length !== 6}
//         className="w-64"
//       >
//         {loading ? "Verifying..." : "Verify OTP"}
//       </Button>
//     </div>
//   );
// }

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import OtpInput from "../../components/customforms/OTPForm";
import Button from "../../components/ui/button/Button";
import { useAuth } from "../../hooks/useAuth";

export default function VerifyOtp() {
  const nav = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const { verifyEmail, loading, message, setMessage } =
    useAuth();

  const [otp, setOtp] = useState("");
  const [resetKey, setResetKey] = useState(0); // 👈 NEW

  useEffect(() => {
    if (otp.length > 0) {
      setMessage("");
    }
  }, [otp]);

  const handleVerify = async () => {
    if (!email) {
      setMessage("Email not found. Please register again.");
      return;
    }

    if (otp.length !== 6) {
      setMessage("Please enter the 6-digit OTP code.");
      return;
    }

    const success = await verifyEmail({
      email,
      otp,
    });

    if (success) {
      setMessage("OTP verified successfully. Redirecting...");

      setTimeout(() => {
        nav("/");
      }, 1200);
    } else {
      setMessage("Invalid OTP. Please try again.");

      // 👇 RESET OTP FIELDS
      setResetKey((prev) => prev + 1);
      setOtp("");
    }
  };

  if (!email) {
    return (
      <div className="text-center mt-10 text-red-500">
        Email not found. Please register again.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
      <h2 className="text-xl font-semibold">
        Verify your email
      </h2>

      <p className="text-sm text-gray-500 text-center">
        Enter the 6-digit code sent to <b>{email}</b>
      </p>

      {message && (
        <div className="text-sm text-center text-gray-700">
          {message}
        </div>
      )}

      <OtpInput
        onChange={setOtp}
        resetKey={resetKey} // 👈 IMPORTANT
      />

      <Button
        onClick={handleVerify}
        disabled={loading || otp.length !== 6}
        className="w-64"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </Button>
    </div>
  );
}