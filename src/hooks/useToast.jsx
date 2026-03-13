import { useState } from "react";
import ToastItem from "../components/toast/ToastItem";
import { createPortal } from "react-dom";
import "../components/toast/toast.css"

const useToast = (position = "top-right") => {
    const [toasts, setToasts] = useState([]);
    const portalRoot = document.getElementById("toast-root");
    // const toastQueue = useRef([]);

    const triggerToast = ({ message, type, duration, animation }) => {
        // const isDuplicate = toasts.some(t => t.message === message);
        // if (isDuplicate) return;

        const id = crypto.randomUUID()
        const newToast = {
            id,
            message,
            type,
            animation,
            duration
        }

        const MAX_SIZE = 5;

        // Without Queue start
        setToasts((prv) => {
            const upload = [...prv, newToast];

            if (prv.length >= MAX_SIZE) {
                upload.shift()
            }

            return upload
        });

        setTimeout(() => {
            removeToast(id)
        }, duration)
        // end

        // // with Queue  
        // setToasts((prv) => {
        //     if (prv.length >= MAX_SIZE) {
        //         toastQueue.current.push(newToast);
        //         return prv;
        //     }

        //     setTimeout(() => {
        //         removeToast(newToast.id)
        //     }, newToast.duration)

        //     return [...prv, newToast];
        // })
    }

    // without Queue system
    const removeToast = (id) => {
        setToasts((prv) => prv.filter(t => t.id !== id))
    }

    // Queue system remover
    // const removeToast = (id) => {
    //     setToasts((prv) => {
    //         const updated = prv.filter(t => t.id !== id);

    //         if (toastQueue.current.length === 0) {
    //             return updated
    //         }

    //         const pendingToast = toastQueue.current.shift();

    //         setTimeout(() => {
    //             removeToast(pendingToast.id)
    //         }, pendingToast.duration)

    //         return [...updated, pendingToast]

    //     });
    // }

    const ToastContainer = toasts.length !== 0 ? createPortal(
        <div className={`${position}`} aria-live="polite" aria-atomic="true">
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