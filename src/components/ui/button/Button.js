'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function Button({
    children,
    icon,
    variant = 'primary',
    className = '',
    ...props
}) {
    const baseStyles =
        'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors';

    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
        ghost: 'text-blue-600 hover:underline',
    };

    return (
        <button
            className={classNames(baseStyles, variants[variant], className)}
            {...props}
        >
            {icon && <FontAwesomeIcon icon={icon} className="w-4 h-4" />}
            {children}
        </button>
    );
}

Button.propTypes = {
    children: PropTypes.node.isRequired,
    icon: PropTypes.object,
    variant: PropTypes.oneOf(['primary', 'outline', 'ghost']),
    className: PropTypes.string,
};
