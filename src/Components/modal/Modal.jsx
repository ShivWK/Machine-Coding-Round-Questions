import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import "./modal.css";

const Modal = ({
    open,
    onClose,
    children,
    className,
    animation = "slide",
    title
}) => {
    const lastFocusedElement = useRef(null);
    const backdropRef = useRef(null);
    const dialogRef = useRef(null);
    const elementsRef = useRef([]);

    useEffect(() => {
        elementsRef.current = [
            document.getElementById('root'),
            document.getElementById("toast-root"),
        ].filter(Boolean)
    }, [])

    const lockOutsideAccess = useCallback(() => {
        document.body.style.overflow = 'hidden';

        elementsRef.current.forEach((ele) => {
            ele.setAttribute("inert", "")
            ele.setAttribute("aria-hidden", "true")
        })
    }, [])

    const allowOutsideAccess = useCallback(() => {
        document.body.style.overflow = 'auto';

        elementsRef.current.forEach((ele) => {
            ele.removeAttribute("inert")
            ele.removeAttribute("aria-hidden")
        })
    }, [])

    const handleClose = useCallback(() => {
        const appliedAnimation = animation === "pop" ? "popOut__animation" : "slideOut__animation";

        backdropRef.current.classList.add("fadeOut__animation");
        dialogRef.current.classList.add(appliedAnimation);

        const handleAnimationEnd = () => {
            allowOutsideAccess()
            lastFocusedElement.current?.focus();
            onClose()
        }

        dialogRef.current.addEventListener("animationend", handleAnimationEnd, {
            once: true
        })
    }, [animation, onClose, allowOutsideAccess])

    useEffect(() => {
        if (open) {
            lastFocusedElement.current = document.activeElement;
            dialogRef.current?.focus();
            lockOutsideAccess()
        }

        // Below will not run on time, before which component will unmount. When open becomes false, the modal unmounts before the effect can run, so the cleanup logic inside the effect never executes.

        // else {
        //     allowOutsideAccess()
        //     lastFocusedElement.current?.focus();
        // }
    }, [open, lockOutsideAccess]);

    useEffect(() => {
        if (!open) return;

        const handleKeyPress = (e) => {
            if (e.key === 'Escape') handleClose();
        };

        document.addEventListener('keyup', handleKeyPress);
        return () => {
            document.removeEventListener('keyup', handleKeyPress);
        };
    }, [open, handleClose]);

    useEffect(() => {
        return () => {
            allowOutsideAccess();
        };
    }, [allowOutsideAccess]);

    return createPortal(
        <div
            role='presentation'
            aria-hidden="true"
            ref={backdropRef}
            onClick={handleClose}
            className="dialog__backdrop"
        >
            <div
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
                ref={dialogRef}
                tabIndex={-1}
                className={`dialog__box ${className} ${animation === "slide"
                    ? "slideIn__animation"
                    : "popIn__animation"}`}
            >
                {onClose && <button className="dialog__closeBtn" onClick={handleClose}><X /></button>}
                <h2 className="dialog__heading" >{title}</h2>
                <div className="dialog__content" >{children}</div>
            </div>
        </div>,
        document.getElementById("modal-root"),
    );
};

export default Modal;
