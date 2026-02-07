import React from 'react';
import './SideNav.css';

export interface NavItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    active?: boolean;
    onClick?: () => void;
}

export interface SideNavProps {
    items?: any[];
    bottomActions?: NavItem[];
    className?: string;
    logoText?: string;
}

const LogOutIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
);

export const SideNav: React.FC<SideNavProps> = ({
    items = [],
    bottomActions = [{ id: 'logout', label: 'Log out', icon: <LogOutIcon /> }] as NavItem[],
    className = '',
    logoText = 'CareCircle'
}) => {
    const renderNavList = () => {
        if (items.length === 0) return null;

        const isSections = items[0] && 'section' in items[0];

        if (isSections) {
            return items.map((section: any, idx: number) => (
                <React.Fragment key={idx}>
                    <div className="sidenav__section-title">{section.section}</div>
                    <div className="sidenav__list">
                        {section.items.map((item: NavItem) => (
                            <div
                                key={item.id}
                                className={`sidenav__item ${item.active ? 'sidenav__item--active' : ''}`}
                                onClick={item.onClick}
                            >
                                <span className="sidenav__icon">{item.icon}</span>
                                <span>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </React.Fragment>
            ));
        } else {
            return (
                <div className="sidenav__list">
                    {items.map((item: any) => (
                        <div
                            key={item.id}
                            className={`sidenav__item ${item.active ? 'sidenav__item--active' : ''}`}
                            onClick={item.onClick}
                        >
                            <span className="sidenav__icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </div>
                    ))}
                </div>
            );
        }
    };

    return (
        <aside className={`sidenav ${className}`}>
            <div className="sidenav__logo">
                {logoText}
                <span style={{ color: 'var(--color-pink)', marginLeft: '2px', fontSize: '30px', lineHeight: 0 }}>.</span>
            </div>
            <nav style={{ flex: 1, overflowY: 'auto' }}>
                {renderNavList()}
            </nav>
            <div className="sidenav__footer">
                {bottomActions?.map((action) => (
                    <div key={action.id} className="sidenav__item" onClick={action.onClick}>
                        <span className="sidenav__icon">{action.icon}</span>
                        <span>{action.label}</span>
                    </div>
                ))}
            </div>
        </aside>
    );
};
