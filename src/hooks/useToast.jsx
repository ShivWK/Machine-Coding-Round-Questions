import { useState } from "react";
import ToastItem from "../components/toast/ToastItem";
import { createPortal } from "react-dom";
import "../components/toast/toast.css"

const useToast = (position = "top-right") => {
    const [toasts, setToasts] = useState([]);
    const portalRoot = document.getElementById("toast-root");

    const triggerToast = ({ message, type, duration, animation }) => {
        const id = crypto.randomUUID()
        const newToast = {
            id,
            message,
            type,
            animation
        }
        setToasts((prv) => [...prv, newToast]);

        setTimeout(() => {
            removeToast(id)
        }, duration)
    }

    const removeToast = (id) => {
        setToasts((prv) => prv.filter(t => t.id !== id))
    }

    const ToastContainer = toasts.length !== 0 ? createPortal(
        <div className={`${position}`}>
            {toasts.map((toast) => {
                return <ToastItem
                    key={toast.id}
                    type={toast.type}
                    message={toast.message}
                    animation={toast.animation}
                    onClose={() => removeToast(toast.id)}
                />
            })}
        </div>,
        portalRoot
    ) : null;

    return { ToastContainer, triggerToast }
}

export default useToast