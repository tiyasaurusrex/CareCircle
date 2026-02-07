import React from 'react';
import './Card.css';

export type CardColor = 'yellow' | 'pink' | 'green' | 'blue' | 'white';
export type CardPadding = 'none' | 'small' | 'medium' | 'large';

interface CardProps {
    color?: CardColor;
    padding?: CardPadding;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
    color = 'white',
    padding = 'medium',
    children,
    className = '',
    onClick,
}) => {
    const classes = [
        'card',
        `card--${color}`,
        `card--padding-${padding}`,
        onClick ? 'card--clickable' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classes} onClick={onClick}>
            {children}
        </div>
    );
};
