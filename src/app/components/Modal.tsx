import { ModalProps } from "../lib/interfaces";
import styles from '@/app/styles/styles.json'
import { getStyle } from "../lib/utils";

export default function Modal({ children, onClose, isOpen } : ModalProps) {
    
    if (!isOpen) return null

    return (
        <div 
            className={getStyle('components.modals.backdrop', styles)}
        >
            <div
                className={getStyle('components.modals.backdrop', styles)}
                onClick={onClose}
            >
                {children}
            </div>
        </div>
    )

}