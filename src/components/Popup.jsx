import React, { useEffect } from 'react';

const Popup = ({
    isOpen,
    onClose,
    title,
    children,
    showCloseButton = true,
    className = '',
}) => {
    // Debug logging
    useEffect(() => {
        console.log("Popup component rendered with isOpen:", isOpen);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={(e) => {
                // Close popup when clicking outside
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                className={`
                    bg-white rounded-2xl p-6 max-w-md w-full mx-4 
                    shadow-xl transform transition-all duration-200 
                    ${className}
                `}
            >
                <div className="flex justify-between items-center mb-4">
                    {title && (
                        <h2 className="text-xl font-bold text-gray-900">
                            {title}
                        </h2>
                    )}
                    {showCloseButton && (
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Stäng"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    )}
                </div>
                <div className="mt-2">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Popup;