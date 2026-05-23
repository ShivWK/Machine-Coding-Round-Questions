import { useState } from "react";
import "./timer.css";
import { TimeFactors, Config } from "./utils";

const Timer = () => {
    const [config, setConfig] = useState(structuredClone(Config));

    const OrderOfTimer = [TimeFactors.Hour, TimeFactors.Minute, TimeFactors.Second];

    const handleChange = (e, { key }) => {
        const value = e.target.value;
        if (value && !/^\d+$/.test(value)) return;

        setConfig((prv) => ({
            ...prv,
            [key]: {
                ...prv[key],
                value
            }
        }));
    }

    const handleStart = () => {

    }

    const handlePause = () => {

    }

    const handleReset = () => {

    }

    return (
        <div className="timer-parent">
            <h1>Timer</h1>

            <div>
                <div className="timer-container">
                    {
                        OrderOfTimer.map((orderKey, index) => {
                            const data = config[orderKey];

                            return <div key={orderKey} className="timer-input-wrapper">
                                <input
                                    onChange={(e) => handleChange(e, { key: orderKey, index })}
                                    value={data.value}
                                    type="text"
                                    placeholder={data.placeholder}
                                    className="timer-output"
                                />
                            </div>
                        })
                    }
                </div>

                <div className="timer-controls">
                    <button onClick={handleStart} className="timer-button">
                        Pause
                    </button>

                    <button onClick={handlePause} className="timer-button">
                        Resume
                    </button>

                    <button onClick={handleReset} className="timer-button">
                        Reset
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Timer