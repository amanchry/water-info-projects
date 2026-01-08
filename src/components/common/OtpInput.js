import { useState, useRef, useEffect, createRef } from "react";
import { Flex, TextField } from "@radix-ui/themes";

function OtpInput({ register, errors, setValue, otpError }) {
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  useEffect(() => {
    inputRefs.current = Array(6)
      .fill()
      .map((_, i) => inputRefs.current[i] || createRef());
  }, []);

  // Set initial empty value
  useEffect(() => {
    setValue("otp", "", { shouldValidate: false });
  }, [setValue]);

  // Keep updating the form value whenever OTP changes
  useEffect(() => {
    const otpValue = otp.join("");
    setValue("otp", otpValue, { shouldValidate: true });
  }, [otp, setValue]);

  const handleChange = (index, value) => {
    // ✅ Handle full OTP paste
    if (value.length === 6 && /^[0-9]{6}$/.test(value)) {
      const newOtp = value.split("");
      setOtp(newOtp);
      inputRefs.current[5].current.focus(); // focus last input
      return;
    }

    // ✅ Handle single-digit input only
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if typed
    if (value && index < 5) {
      inputRefs.current[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Go back when pressing Backspace on empty field
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").trim();
    if (/^[0-9]{6}$/.test(paste)) {
      const newOtp = paste.split("");
      setOtp(newOtp);
      inputRefs.current[5].current.focus();
      e.preventDefault();
    }
  };

  return (
    <Flex gap="2" justify="between" align="stretch" height="74px" width="100%">
      {otp.map((digit, index) => (
        <TextField.Root
          key={index}
          ref={inputRefs.current[index]}
          size="3"
          variant={errors.otp || otpError ? "soft" : "surface"}
         className={`${
            errors.otp || otpError
              ? "!bg-[#FBECEC] focus-within:!outline-[#DC4242] !border-0"
              : "focus-within:!outline-[#3F7FC0] focus-within:!bg-transparent !border-0"
          } mb-1 !text-center !spaceGrotesk !border !border-[#988b8b] !text-[40px] !font-medium !h-full !pr-2`}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste} // ✅ now handles full OTP paste
          maxLength={1}
        />
      ))}

      {/* Hidden input for form submission */}
      <input
        type="hidden"
        {...register("otp", {
          required: "Verification code is required",
          pattern: {
            value: /^[0-9]{6}$/,
            message: "Must be a 6-digit number",
          },
        })}
      />
    </Flex>
  );
}

export default OtpInput;
