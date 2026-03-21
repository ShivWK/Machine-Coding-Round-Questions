import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import "./modalStyle.css";

const Modal = ({
    open,
    onClose,
    children,
    style,
    animation = "pop",
    title,
    description
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
        if (!open || !dialogRef.current) return;

        const focusableElements = dialogRef.current.querySelectorAll(
            'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
        )

        lastFocusedElement.current = document.activeElement;
        lockOutsideAccess()

        if (!focusableElements.length) {
            dialogRef.current?.focus();
            return;
        }

        const firstEle = focusableElements[0];
        const lastEle = focusableElements[focusableElements.length - 1];

        firstEle.focus()

        const handleTab = (e) => {
            if (e.key === "Escape") handleClose();

            if (e.key !== "Tab") return;

            if (e.shiftKey) {
                if (document.activeElement === firstEle) {
                    e.preventDefault();
                    e.stopPropagation();
                    lastEle.focus();
                }
            } else {
                if (document.activeElement === lastEle) {
                    e.preventDefault();
                    e.stopPropagation();
                    firstEle.focus();
                }
            }
        }

        document.addEventListener("keydown", handleTab);

        return () => document.removeEventListener("keydown", handleTab)
    }, [open, handleClose, lockOutsideAccess])

    useEffect(() => {
        return () => {
            allowOutsideAccess();
        };
    }, [allowOutsideAccess]);

    const getModalRoot = () => {
        let root = document.getElementById("modal-root");

        if (!root) {
            root = document.createElement("div");
            root.id = "modal-root";
            document.body.appendChild(root);
        }

        return root;
    }

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
                aria-labelledby='dialog-title'
                aria-describedby='dialog-description'
                aria-modal="true"
                tabIndex={-1}
                ref={dialogRef}
                onClick={(e) => e.stopPropagation()}
                className={`dialog__box ${animation === "slide"
                    ? "slideIn__animation"
                    : "popIn__animation"}`}
                style={style}
            >
                {onClose &&
                    <button
                        aria-label='Close dialog'
                        className="dialog__closeBtn"
                        onClick={handleClose}
                    >
                        <X />
                    </button>}
                <h2 id='dialog-title' className="dialog__heading" >{title}</h2>
                <p id="dialog-description">{description}</p>
                <div className="dialog__content" >{children}</div>
            </div>
        </div>,
        getModalRoot(),
    );
};

export default Modal;
