import { useState, useRef, useEffect } from "react";
import "./timer.css";
import { TimeFactors, Config, OrderOfTimer } from "./utils";

const Timer = () => {
    const [config, setConfig] = useState(structuredClone(Config));
    const [totalMilliSeconds, setTotalMilliSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const interval = useRef(null);

    const stopTimer = () => {
        clearInterval(interval.current);
        interval.current = null;

        setIsRunning(false);
        setIsPaused(false);
    }

    useEffect(() => {
        if (!isRunning) return;

        interval.current = setInterval(() => {
            setTotalMilliSeconds(prv => {
                if (prv <= 10) {
                    stopTimer();
                    setConfig(structuredClone(Config));

                    return 0;
                }

                return Math.max(0, prv - 10);
            })
        }, 10)

        return () => {
            clearInterval(interval.current)
            interval.current = null;
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

        const total = hour * 3600 * 1000 + minutes * 60 * 1000 + seconds * 1000;

        if (total <= 0) return;

        setTotalMilliSeconds(total);
        setIsRunning(true);
    }

    const handlePause = () => {
        clearInterval(interval.current);
        interval.current = null;

        setIsRunning(false);
        setIsPaused(true);
    }

    const handleResume = () => {
        if (totalMilliSeconds <= 0) return;
        setIsRunning(true);
        setIsPaused(false);
    }

    const handleReset = () => {
        stopTimer();
        setTotalMilliSeconds(0);

        setConfig(structuredClone(Config));
    }

    const hours = Math.floor(totalMilliSeconds / (3600 * 1000));
    const minutes = Math.floor((totalMilliSeconds % (3600 * 1000)) / (60 * 1000));
    const seconds = Math.floor((totalMilliSeconds % (60 * 1000)) / 1000);
    // const milliseconds = (totalMilliSeconds % 1000) / 10;

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

                {/* {(isRunning || isPaused) && (
                    <div className="timer-seconds-output">
                        <p className="timer-seconds">{milliseconds.toString().padStart(2, "0")}</p>
                    </div>
                )} */}
            </div>

            <div className="timer-controls">
                {(!isPaused && !isRunning) && <button
                    onClick={handleStart}
                    className="timer-button timer-button-start"
                >
                    Start
                </button>}

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
    )
}

export default Timer