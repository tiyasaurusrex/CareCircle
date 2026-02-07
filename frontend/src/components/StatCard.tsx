import React from 'react';
import { Card } from './Card';
import type { CardColor } from './Card';
import './StatCard.css';

interface StatItem {
    label: string;
    value: string | number;
    sublabel?: string;
}

interface StatCardProps {
    title: string;
    stats: StatItem[];
    color?: CardColor;
    icon?: React.ReactNode;
    chart?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    stats,
    color = 'yellow',
    icon,
    chart,
}) => {
    return (
        <Card color={color} padding="large">
            <div className="stat-card">
                <div className="stat-card__header">
                    {icon && <span className="stat-card__icon">{icon}</span>}
                    <h3 className="stat-card__title">{title}</h3>
                </div>

                <div className="stat-card__stats">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-card__stat-item">
                            <div className="stat-card__stat-value">{stat.value}</div>
                            <div className="stat-card__stat-label">{stat.label}</div>
                            {stat.sublabel && (
                                <div className="stat-card__stat-sublabel">{stat.sublabel}</div>
                            )}
                        </div>
                    ))}
                </div>

                {chart && <div className="stat-card__chart">{chart}</div>}
            </div>
        </Card>
    );
};
