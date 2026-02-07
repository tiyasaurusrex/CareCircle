import React from 'react';
import './Badge.css';

export type BadgeVariant = 'pink' | 'yellow' | 'green' | 'blue' | 'dark' | 'light';
export type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
    variant?: BadgeVariant;
    size?: BadgeSize;
    children: React.ReactNode;
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
    variant = 'dark',
    size = 'medium',
    children,
    className = '',
}) => {
    const classes = [
        'badge',
        `badge--${variant}`,
        `badge--${size}`,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return <span className={classes}>{children}</span>;
};
