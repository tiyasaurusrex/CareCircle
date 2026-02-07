import React from 'react';
import './Button.css';
export type ButtonVariant = 'primary' | 'secondary' | 'outlined';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: React.ReactNode;
    icon?: React.ReactNode;
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'medium',
    children,
    icon,
    fullWidth = false,
    className = '',
    disabled = false,
    ...props
}) => {
    const classes = [
        'btn',
        `btn--${variant}`,
        `btn--${size}`,
        fullWidth ? 'btn--full-width' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button className={classes} disabled={disabled} {...props}>
            {icon && <span className="btn__icon">{icon}</span>}
            <span className="btn__text">{children}</span>
        </button>
    );
};
