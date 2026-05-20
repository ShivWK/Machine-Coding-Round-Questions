import { useEffect, useRef, useState } from "react";
import "./otp.css";

const Otp = ({ count = 4 }) => {
    const numberOfDigits = Array.from({ length: Number(count) }, (_, i) => i);
    const [otp, setOtp] = useState(new Array(count).fill(""));
    // Filling with "" prevents undefined values.
    // Undefined can cause an uncontrolled → controlled input warning.
    const inputRef = useRef([]);

    const moveFocusRight = (index) => {
        if (inputRef.current[index + 1]) {
            inputRef.current[index + 1].focus();
        }
    }

    const moveFocusLeft = (index) => {
        if (inputRef.current[index - 1]) {
            inputRef.current[index - 1]?.focus();
        }
    }

    const handleInputChange = (e, index) => {
        const value = e.target.value.trim();
        if (value && !/^\d+$/.test(value)) return;

        const newArray = [...otp];
        newArray[index] = value.slice(-1);
        setOtp(newArray);

        if (value) {
            moveFocusRight(index);
        }
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
                            value={otp[index]}
                            inputMode="numeric"
                            onChange={(e) => handleInputChange(e, index)}
                            onKeyDown={(e) => handleOnKeyDown(e, index)}
                            className="otp-input"
                            ref={(ele) => inputRef.current[index] = ele}
                        />
                    })
                }
            </div>
        </div>
    )
}

export default Otp;