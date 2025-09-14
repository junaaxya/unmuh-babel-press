import { useState, useEffect, useCallback } from 'react';

export default function Notification({
    id,
    type,
    message,
    onClose,
    autoClose = true,
    duration = 5000,
    position = 'top-right',
}) {
    const [isVisible, setIsVisible] = useState(true);
    const [isClosing, setIsClosing] = useState(false);

    // **Perubahan:** stabilkan handleClose dengan useCallback
    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, 300); // Match animation duration
    }, [onClose]);

    // **Perubahan:** effect auto-close sekarang juga tergantung pada handleClose
    useEffect(() => {
        if (autoClose && duration > 0) {
            const timer = setTimeout(() => {
                handleClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [autoClose, duration, handleClose]);

    // Reset visibility saat ID berubah
    useEffect(() => {
        setIsVisible(true);
        setIsClosing(false);
    }, [id]);

    const getNotificationConfig = (type) => {
        const configs = {
            success: {
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200',
                textColor: 'text-green-800',
                iconBg: 'bg-green-100',
                iconColor: 'text-green-600',
                progressColor: 'bg-green-500',
                icon: (
                    <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                ),
            },
            error: {
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200',
                textColor: 'text-red-800',
                iconBg: 'bg-red-100',
                iconColor: 'text-red-600',
                progressColor: 'bg-red-500',
                icon: (
                    <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
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
                ),
            },
            warning: {
                bgColor: 'bg-yellow-50',
                borderColor: 'border-yellow-200',
                textColor: 'text-yellow-800',
                iconBg: 'bg-yellow-100',
                iconColor: 'text-yellow-600',
                progressColor: 'bg-yellow-500',
                icon: (
                    <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                    </svg>
                ),
            },
            info: {
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200',
                textColor: 'text-blue-800',
                iconBg: 'bg-blue-100',
                iconColor: 'text-blue-600',
                progressColor: 'bg-blue-500',
                icon: (
                    <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                ),
            },
        };

        return configs[type] || configs.info;
    };

    const getPositionClasses = (position) => {
        const positions = {
            // Kita akan mengubah z-50 menjadi z-[9999] agar selalu di paling atas
            'top-right': 'fixed top-4 right-4 z-[9999]',
            'top-left': 'fixed top-4 left-4 z-[9999]',
            'top-center':
                'fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999]',
            'bottom-right': 'fixed bottom-4 right-4 z-[9999]',
            'bottom-left': 'fixed bottom-4 left-4 z-[9999]',
            'bottom-center':
                'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[9999]',
        };

        return positions[position] || positions['top-right'];
    };

    if (!isVisible) return null;

    const config = getNotificationConfig(type);
    const positionClasses = getPositionClasses(position);

    return (
        <div
            className={`${positionClasses} w-full max-w-[calc(100vw-2rem)] sm:max-w-sm`}
        >
            <div
                className={`
          ${config.bgColor} ${config.borderColor} ${config.textColor}
          border rounded-xl shadow-lg backdrop-blur-sm
          transform transition-all duration-300 ease-out
          ${
              isClosing
                  ? 'translate-x-full opacity-0 scale-95'
                  : 'translate-x-0 opacity-100 scale-100'
          }
          hover:shadow-xl hover:scale-[1.02]
        `}
            >
                {/* Progress bar for auto-close */}
                {autoClose && duration > 0 && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-t-xl overflow-hidden">
                        <div
                            className={`h-full ${config.progressColor} rounded-t-xl transition-all ease-linear`}
                            style={{
                                animation: `shrink ${duration}ms linear forwards`,
                                transformOrigin: 'left',
                            }}
                        />
                    </div>
                )}

                <div className="p-3 sm:p-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                        {/* Icon */}
                        <div
                            className={`
                ${config.iconBg} ${config.iconColor}
                w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5
              `}
                        >
                            {config.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium leading-5 break-words">
                                {message}
                            </p>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            className={`
                ${config.iconColor} hover:bg-white/50
                w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center flex-shrink-0
                transition-all duration-200 hover:scale-110
                focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current
              `}
                            aria-label="Tutup notifikasi"
                        >
                            <svg
                                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
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
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes shrink {
                    from {
                        transform: scaleX(1);
                    }
                    to {
                        transform: scaleX(0);
                    }
                }
            `}</style>
        </div>
    );
}
