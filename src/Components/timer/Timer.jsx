import { useState, useRef, useEffect } from "react";
import "./timer.css";
import { TimeFactors, Config } from "./utils";

const Timer = () => {
    const [config, setConfig] = useState(structuredClone(Config));
    const [totalSeconds, setTotalSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const interval = useRef(null)

    const OrderOfTimer = [TimeFactors.Hour, TimeFactors.Minute, TimeFactors.Second];

    useEffect(() => {
        if (!isRunning) return;

        interval.current = setInterval(() => {
            setTotalSeconds(prv => {
                if (prv <= 1) {
                    clearInterval(interval.current);

                    setIsRunning(false);
                    setIsPaused(false);
                    setConfig(structuredClone(Config));

                    return 0;
                }

                return prv - 1;
            })
        }, 1000)

        return () => {
            clearInterval(interval.current)
        }
    }, [isRunning])

    const handleChange = (e, { key }) => {
        const value = e.target.value;
        if (value && !/^\d+$/.test(value)) return;

        if ((key === TimeFactors.Minute || key === TimeFactors.Second) && Number(value) > 59) return;

        setConfig((prv) => ({
            ...prv,
            [key]: {
                ...prv[key],
                value
            }
        }));
    }

    const handleStart = () => {
        const hour = Number(config[TimeFactors.Hour].value || 0);
        const minutes = Number(config[TimeFactors.Minute].value || 0);
        const seconds = Number(config[TimeFactors.Second].value || 0);

        const total = hour * 3600 + minutes * 60 + seconds;

        if (total <= 0) return;
        setTotalSeconds(total);
        setIsRunning(true);
    }

    const handlePause = () => {
        clearInterval(interval.current);

        setIsRunning(false);
        setIsPaused(true);
    }

    const handleResume = () => {
        if (totalSeconds <= 0) return;
        setIsRunning(true);
        setIsPaused(false);
    }

    const handleReset = () => {
        clearInterval(interval.current);

        setIsRunning(false);
        setIsPaused(false);
        setTotalSeconds(0);

        setConfig(structuredClone(Config));
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    // const milliseconds = (totalSeconds * 1000) % 1000;

    return (
        <div className="timer-parent">
            <h1>Countdown Timer</h1>

            <div>
                <div className="timer-container">
                    {
                        OrderOfTimer.map((orderKey, index) => {
                            const data = config[orderKey];

                            return <div key={orderKey} className="timer-input-parent-wrapper">
                                    <span className="timer-label">
                                        {orderKey.toUpperCase()}
                                    </span>
                                <div className="timer-input-wrapper">
                                    <input
                                        disabled={isRunning || isPaused}
                                        autoComplete="on"
                                        onChange={(e) => handleChange(e, { key: orderKey })}
                                        value={(isRunning || isPaused) ?
                                            [hours, minutes, seconds][index].toString().padStart(2, "0")
                                            : data.value}
                                        type="text"
                                        placeholder={data.placeholder}
                                        className="timer-output"
                                    />
                                </div>
                            </div>
                        })
                    }
                </div>

                {/* {isRunning && <div className="timer-output">
                    {milliseconds.toString()}
                </div>} */}

                <div className="timer-controls">
                    <button
                        onClick={handleStart}
                        disabled={isPaused || isRunning}
                        className="timer-button timer-button-start"
                    >
                        Start
                    </button>

                    {isRunning && <button onClick={handlePause} className="timer-button timer-button-pause">
                        Pause
                    </button>}

                    {isPaused && <button onClick={handleResume} className="timer-button timer-button-resume">
                        Resume
                    </button>}

                    <button onClick={handleReset} className="timer-button timer-button-reset">
                        Reset
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Timer