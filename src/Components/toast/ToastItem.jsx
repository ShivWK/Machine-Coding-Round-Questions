import { AiOutlineCheckCircle, AiOutlineClose, AiOutlineCloseCircle, AiOutlineInfoCircle, AiOutlineWarning } from "react-icons/ai";
import { memo, useEffect, useRef } from "react";
import "./toast.css"

const iconStyle = { marginRight: "10px" }

const icons = {
  success: <AiOutlineCheckCircle size={23.5} style={iconStyle} />,
  info: <AiOutlineInfoCircle size={23.5} style={iconStyle} />,
  warning: <AiOutlineWarning size={23.5} style={iconStyle} />,
  error: <AiOutlineCloseCircle size={23.5} style={iconStyle} />
}

const ToastItem = memo(({ type = "info", animation = "slide", message, onClose = () => { } }) => {
  const closeRef = useRef();

  useEffect(() => {
    closeRef?.current?.focus();
  }, [])

  return (
    <div className={`${type} ${animation} toast`} role={(type === "success" || type === "info") ? "status" : "alert"} >
      {icons[type]}
      <p className="toast-msg">{message}</p>
      <button ref={closeRef} aria-label="Close" className="closeBtn" onClick={() => onClose()}>
        <AiOutlineClose size={20} aria-hidden="true" color="white" />
      </button>
    </div>
  )
})

export default ToastItem; 