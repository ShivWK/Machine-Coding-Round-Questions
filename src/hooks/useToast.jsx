import { useState } from "react";
import ToastItem from "../components/toast/ToastItem";
import { createPortal } from "react-dom";
import "../components/toast/toast.css";

const useToast = (position = "top-right") => {
    const [toasts, setToasts] = useState([]);
    const portalRoot = document.getElementById("toast-root");

    const triggerToast = ({ message, type, duration, animation }) => {
        const isDuplicate = toasts.some(t => t.message === message);
        if (isDuplicate) return;
        const id = crypto.randomUUID()
        const newToast = {
            id,
            message,
            type,
            animation,
            duration
        }

        const MAX_SIZE = 5;

        setToasts((prv) => {
            const upload = [...prv, newToast];

            if (prv.length >= MAX_SIZE) {
                upload.shift()
            }

            return upload
        });
    }

    const removeToast = (id) => {
        setToasts((prv) => prv.filter(t => t.id !== id))
    }

    const ToastContainer = toasts.length !== 0 ? createPortal(
        <div className={`${position}`} aria-live="polite" aria-atomic="true">
            {toasts.map((toast) => {
                return <ToastItem
                    key={toast.id}
                    id={toast.id}
                    type={toast.type}
                    message={toast.message}
                    animation={toast.animation}
                    duration={toast.duration}
                    onClose={() => removeToast(toast.id)}
                />
            })}
        </div>,
        portalRoot
    ) : null;

    return { ToastContainer, triggerToast }
}

export default useToast