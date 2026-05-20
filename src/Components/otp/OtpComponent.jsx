import { useEffect, useRef, useState } from "react";
import "./otp.css";

const Otp = ({ count = 4, onComplete }) => {
    const numberOfDigits = Array.from({ length: Number(count) }, (_, i) => i);
    const [otp, setOtp] = useState(new Array(count).fill(""));
    // Filling with "" prevents undefined values.
    // Undefined can cause an uncontrolled → controlled input warning.
    const inputRef = useRef([]);

    const moveFocusRight = (index) => {
        inputRef.current[index + 1]?.focus();
    }

    const moveFocusLeft = (index) => {
        inputRef.current[index - 1]?.focus();
    }

    const checkCompletion = (updatedOtp) => {
        if (updatedOtp.every(val => val !== "")) {
            onComplete?.(updatedOtp.join(""));
        }
    }

    const handleInputChange = (e, index) => {
        const value = e.target.value.trim();
        if (value && !/^\d+$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value) {
            moveFocusRight(index);
        }

        checkCompletion(newOtp);
    }

    const handleOnKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            e.preventDefault();

            const newOtp = [...otp];

            if (otp[index]) {
                newOtp[index] = "";
            } else if (index > 0) {
                newOtp[index - 1] = "";
                moveFocusLeft(index);
            }

            setOtp(newOtp);
        } else if (e.key === "ArrowRight") {
            moveFocusRight(index);
        } else if (e.key === "ArrowLeft") {
            moveFocusLeft(index);
        }
    }

    const handlePaste = (e) => {
        e.preventDefault();

        const pastedData = e.clipboardData.getData("text").replace(/\D+/g, "").trim();

        const pastedArray = pastedData.slice(0, count).split("");
        const newOtp = [...otp];

        pastedArray.forEach((digit, index) => {
            newOtp[index] = digit;
        })

        setOtp(newOtp);
        const lastIndex = Math.min(pastedArray.length, count) - 1;

        inputRef.current[lastIndex]?.focus();

        checkCompletion(newOtp);
    }

    useEffect(() => {
        inputRef.current[0]?.focus();
    }, [])

    return (
        <div className="otp-parent">
            <h1>Validate OTP</h1>
            <div className="otp-container">
                {
                    numberOfDigits.map((_, index) => {
                        return <input
                            key={index}
                            type="text"
                            maxLength={1} // may give error verify by the frontend master
                            aria-label={`OTP digit ${index + 1}`}
                            autoComplete="one-time-code"
                            value={otp[index]}
                            inputMode="numeric"
                            onChange={(e) => handleInputChange(e, index)}
                            onKeyDown={(e) => handleOnKeyDown(e, index)}
                            onPaste={handlePaste}
                            className="otp-input"
                            ref={(ele) => inputRef.current[index] = ele}
                        />
                    })
                }
            </div>

            <button onClick={() => onComplete(otp.join(""))} disabled={!otp.every(value => value !== "")} className="otp-verification-btn">
                Verify OTP
            </button>
        </div>
    )
}

export default Otp;