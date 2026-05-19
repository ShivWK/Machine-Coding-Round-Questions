import { useEffect, useRef, useState } from "react";
import "./otp.css";

const Otp = ({ count = 4 }) => {
    const numberOfDigits = Array.from({ length: Number(count) }, (_, i) => i);
    const [otp, setOtp] = useState(new Array(count).fill(""));
    const inputRef = useRef([]);

    const handleInputChange = (e, index) => {
        const value = e.target.value.trim();
        if (isNaN(value)) return;

        const newArray = [...otp];
        newArray[index] = value.slice(-1);
        setOtp(newArray);

        if (index !== otp.length - 1 && value) {
            inputRef.current[index + 1].focus();
        }
    }

    const handelOnKeyDown = (e, index) => {
        const value = e.target.value;
        if (!value && e.key === "Backspace") {
            if (index !== 0) {
                inputRef.current[index - 1]?.focus();
            }
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
                    numberOfDigits.map((input, index) => {
                        return <input
                            key={index}
                            type="text"
                            value={otp[index]}
                            onChange={(e) => handleInputChange(e, index)}
                            onKeyDown={(e) => handelOnKeyDown(e, index)}
                            className="otp-input"
                            ref={(input) => inputRef.current[index] = input}
                        />
                    })
                }
            </div>
        </div>
    )
}

export default Otp;