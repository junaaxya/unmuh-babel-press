'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const ProfileSection = ({
    title,
    children,
    className = '',
    titleClassName = '',
    icon = null,
    subtitle = null,
}) => {
    return (
        <section className={`py-12 ${className}`}>
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    {icon && (
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                            <FontAwesomeIcon
                                icon={icon}
                                className="text-2xl text-blue-600 dark:text-blue-400"
                            />
                        </div>
                    )}
                    <h2
                        className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 ${titleClassName}`}
                    >
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Section Content */}
                <div className="max-w-6xl mx-auto">{children}</div>
            </div>
        </section>
    );
};

// Vision Mission Component
const VisionMissionContent = ({ data }) => {
    if (!data || (!data.vision && !data.missions?.length)) {
        return (
            <p className="text-center text-gray-600 dark:text-gray-300">
                Data visi dan misi belum tersedia.
            </p>
        );
    }

    return (
        <div className="grid md:grid-cols-2 gap-12">
            {/* Vision */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-6 text-center">
                    Visi
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-center italic">
                    &quot;{data.vision}&quot;
                </p>
            </div>

            {/* Mission */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-purple-800 dark:text-purple-200 mb-6 text-center">
                    Misi
                </h3>
                <ul className="space-y-4">
                    {(data.missions || []).map((mission, index) => (
                        <li key={index} className="flex items-start space-x-3">
                            <FontAwesomeIcon
                                icon={faCheckCircle}
                                className="text-purple-600 dark:text-purple-400 text-sm mt-1 flex-shrink-0"
                            />
                            <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {typeof mission === 'string' ? mission : mission.text}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

// Export compound component
ProfileSection.VisionMission = VisionMissionContent;

export default ProfileSection;
