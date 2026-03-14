import { AiOutlineCheckCircle, AiOutlineClose, AiOutlineCloseCircle, AiOutlineInfoCircle, AiOutlineWarning } from "react-icons/ai";
import { memo, useEffect, useRef } from "react";
import "./toast.css"

const icons = {
  success: <AiOutlineCheckCircle className="icon" size={23.5} />,
  info: <AiOutlineInfoCircle className="icon" size={23.5} />,
  warning: <AiOutlineWarning className="icon" size={23.5} />,
  error: <AiOutlineCloseCircle className="icon" size={23.5} />
}

const ToastItem = memo(({
  type = "info",
  animation = "slide",
  message,
  duration,
  onClose
}) => {
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const remainingTimeRef = useRef(duration);

  const startTimer = () => {
    startTimeRef.current = Date.now();

    timerRef.current = setTimeout(() => {
      onClose()
    }, remainingTimeRef.current)
  }

  const pauseTimer = () => {
    clearTimeout(timerRef.current);

    const elapsedTime = Date.now() - startTimeRef.current;
    remainingTimeRef.current = remainingTimeRef.current - elapsedTime;
  }

  const resumeTimer = () => {
    startTimer()
  }

  useEffect(() => {
    startTimer();
    return () => clearTimeout(timerRef.current)
  }, [])

  return (
    <div
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
      className={`${type} ${animation} toast`}
      role={(type === "success" || type === "info") ? "status" : "alert"}
    >
      {icons[type]}
      <p className="toast-msg">{message}</p>

      <button aria-label="Close" className="closeBtn" onClick={() => onClose()}>
        <AiOutlineClose size={20} aria-hidden="true" color="white" />
      </button>

      <div className="progress" style={{
        animationDuration: `${duration}ms`
      }}></div>
    </div>
  )
})

export default ToastItem; 