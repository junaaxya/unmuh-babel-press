'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

const ProfileCard = ({
    title,
    description,
    icon,
    image,
    features = [],
    className = '',
    variant = 'default', // default, team, service
}) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'team':
                return 'bg-white dark:bg-gray-800 hover:shadow-2xl transform hover:-translate-y-2';
            case 'service':
                return 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-xl border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-700';
            default:
                return 'bg-white dark:bg-gray-800 hover:shadow-lg';
        }
    };

    return (
        <div
            className={`
        ${getVariantStyles()}
        rounded-xl shadow-md transition-all duration-300 overflow-hidden
        ${className}
      `}
        >
            {/* Team Card Layout */}
            {variant === 'team' && (
                <>
                    {/* Image */}
                    <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500">
                        {image ? (
                            <Image
                                src={image}
                                alt={title}
                                fill
                                className="object-cover"
                                sizes="100vw"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="text-6xl text-white opacity-80"
                                />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {title}
                        </h3>
                        {description && (
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>
                </>
            )}

            {/* Service Card Layout */}
            {variant === 'service' && (
                <div className="p-8">
                    {/* Icon */}
                    {icon && (
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-6">
                            <FontAwesomeIcon
                                icon={icon}
                                className="text-2xl text-blue-600 dark:text-blue-400"
                            />
                        </div>
                    )}

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        {title}
                    </h3>

                    {/* Description */}
                    {description && (
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                            {description}
                        </p>
                    )}

                    {/* Features */}
                    {features.length > 0 && (
                        <ul className="space-y-2">
                            {features.map((feature, index) => (
                                <li
                                    key={index}
                                    className="flex items-center space-x-3"
                                >
                                    <FontAwesomeIcon
                                        icon={faCheckCircle}
                                        className="text-green-500 text-sm flex-shrink-0"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                                        {feature}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* Default Card Layout */}
            {variant === 'default' && (
                <div className="p-6">
                    {/* Icon */}
                    {icon && (
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mb-4">
                            <FontAwesomeIcon
                                icon={icon}
                                className="text-lg text-blue-600 dark:text-blue-400"
                            />
                        </div>
                    )}

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        {title}
                    </h3>

                    {/* Description */}
                    {description && (
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {description}
                        </p>
                    )}

                    {/* Features */}
                    {features.length > 0 && (
                        <ul className="mt-4 space-y-2">
                            {features.map((feature, index) => (
                                <li
                                    key={index}
                                    className="flex items-start space-x-2"
                                >
                                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                                        {feature}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfileCard;
