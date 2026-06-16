

import { useEffect, useRef, useState } from "react";

interface Props {
  length?: number;
  onChange: (otp: string) => void;
  resetKey?: number; // 👈 NEW
}

export default function OtpInput({
  length = 6,
  onChange,
  resetKey,
}: Props) {
  const [values, setValues] = useState<string[]>(
    Array(length).fill("")
  );

  const inputsRef = useRef<(HTMLInputElement | null | undefined)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // 👇 RESET OTP WHEN resetKey CHANGES
  useEffect(() => {
    setValues(Array(length).fill(""));
    onChange("");
    inputsRef.current[0]?.focus();
  }, [resetKey]);

  const emitChange = (vals: string[]) => {
    onChange(vals.join(""));
  };

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newValues = [...values];
    newValues[index] = value;

    setValues(newValues);
    emitChange(newValues);

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (!values[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();

    const paste = e.clipboardData
      .getData("text")
      .slice(0, length)
      .split("");

    const newValues = Array(length).fill("");

    paste.forEach((v, i) => {
      if (/^[0-9]$/.test(v)) {
        newValues[i] = v;
      }
    });

    setValues(newValues);
    emitChange(newValues);
  };

  return (
    <div className="flex gap-3 justify-center">
      {values.map((val, i) => (
        <input
          key={i}
          
          ref={(el) => {
  inputsRef.current[i] = el;
}}
          value={val}
          onChange={(e) =>
            handleChange(e.target.value, i)
          }
          onKeyDown={(e) =>
            handleKeyDown(e, i)
          }
          onPaste={handlePaste}
          maxLength={1}
          className="w-12 h-12 text-center text-xl border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      ))}
    </div>
  );
}