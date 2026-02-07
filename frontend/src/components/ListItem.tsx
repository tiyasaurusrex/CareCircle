import React from 'react';
import './ListItem.css';

export type AvatarColor = 'pink' | 'blue' | 'green' | 'yellow' | 'purple';

interface ListItemProps {
    avatar?: React.ReactNode;
    avatarColor?: AvatarColor;
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

export const ListItem: React.FC<ListItemProps> = ({
    avatar,
    avatarColor = 'pink',
    title,
    subtitle,
    action,
    onClick,
    className = '',
}) => {
    const classes = [
        'list-item',
        onClick ? 'list-item--clickable' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classes} onClick={onClick}>
            {avatar && (
                <div className={`list-item__avatar list-item__avatar--${avatarColor}`}>
                    {avatar}
                </div>
            )}

            <div className="list-item__content">
                <div className="list-item__title">{title}</div>
                {subtitle && <div className="list-item__subtitle">{subtitle}</div>}
            </div>

            {action && <div className="list-item__action">{action}</div>}
        </div>
    );
};
