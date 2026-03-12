import { AiOutlineCheckCircle, AiOutlineClose, AiOutlineCloseCircle, AiOutlineInfoCircle, AiOutlineWarning } from "react-icons/ai";
import "./toast.css"

const iconStyle = { marginRight: "10px" }

const icons = {
  success: <AiOutlineCheckCircle size={23.5} style={iconStyle} />,
  info: <AiOutlineInfoCircle size={23.5} style={iconStyle} />,
  warning: <AiOutlineWarning size={23.5} style={iconStyle} />,
  error: <AiOutlineCloseCircle size={23.5} style={iconStyle} />
}

const ToastItem = ({ type = "info", animation="slide", message, onClose = () => { } }) => {
  return (
    <div className={`${type} ${animation} toast`}>
      {icons[type]}
      {message}
      <button aria-label="Close" className="closeBtn" onClick={() => onClose()}>
        <AiOutlineClose size={20} aria-hidden="true" color="white" />
      </button>
    </div>
  )
}

export default ToastItem; 