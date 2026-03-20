import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from "./modal.module.css";
import { X } from 'lucide-react';

const Modal = ({
    open,
    onClose,
    children,
    className,
    showClasses,
    hideClasses,
    title
}) => {
    const drawer = useRef(null);
    const lastFocusedElement = useRef(null);

    useEffect(() => {
        if (open) {
            lastFocusedElement.current = document.activeElement;
            document.getElementsByTagName('main')[0]?.setAttribute('inert', '');
            document.getElementsByTagName('header')[0]?.setAttribute('inert', '');
            document.body.style.overflow = 'hidden';
            drawer.current?.focus();
        } else {
            document.getElementsByTagName('main')[0]?.removeAttribute('inert');
            document.getElementsByTagName('header')[0]?.removeAttribute('inert');
            document.body.style.overflow = 'auto';
            lastFocusedElement.current?.focus();
        }
    }, [open, drawer, lastFocusedElement]);

    useEffect(() => {
        if (!open) return;

        const handleKeyPress = (e) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [open, onClose]);

    return createPortal(
        <div
            onClick={onClose}
            aria-hidden="true"
            className={`${styles["dialog__overlay"]}`}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                ref={drawer}
                aria-modal="true"
                aria-hidden={!open}
                role="dialog"
                tabIndex={-1}
                className={`${styles["dialog__box"]} ${className} ${open ? showClasses : hideClasses}`}
            >
                <button className={`${styles["dialog__closeBtn"]}`} onClick={onClose}><X /></button>
                <h2 className={`${styles["dialog__heading"]}`}>{title}</h2>
                <div className={`${styles["dialog__content"]}`}>{children}</div>
            </div>
        </div>,
        document.getElementById("modal-root"),
    );
};

export default Modal;
