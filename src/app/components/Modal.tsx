import { ModalProps } from "../lib/interfaces";

export default function Modal({ children, onClose, isOpen } : ModalProps) {
    
    if (!isOpen) return null

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center z-50"
        >
            <div
                className="bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center"
                onClick={onClose}
            >
                {children}
            </div>
        </div>
    )

}