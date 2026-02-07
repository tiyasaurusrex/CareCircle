import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import type { PatientUser } from './Login';
import './Profile.css';

interface ProfileProps {
    user: PatientUser;
    onLogout: () => void;
    onUpdateProfile: (updatedUser: PatientUser) => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onLogout, onUpdateProfile }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState<PatientUser>(user);
    const [error, setError] = useState('');

    const handleEdit = () => {
        setIsEditing(true);
        setEditedUser(user);
        setError('');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedUser(user);
        setError('');
    };

    const handleSave = () => {
        setError('');
        
        if (!editedUser.name || !editedUser.age || !editedUser.condition) {
            setError('Please fill in all fields');
            return;
        }

        if (editedUser.age <= 0 || editedUser.age > 150) {
            setError('Please enter a valid age');
            return;
        }

        onUpdateProfile(editedUser);
        setIsEditing(false);
    };

    return (
        <div className="profile">
            <section className="profile__section">
                <Card color="blue" padding="large">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 className="profile__title" style={{ margin: 0 }}>My Profile</h2>
                        {!isEditing && (
                            <Button variant="primary" onClick={handleEdit}>
                                Edit Profile
                            </Button>
                        )}
                    </div>
                    {error && <div className="login__error" style={{ marginBottom: '1rem' }}>{error}</div>}
                    <div className="profile__info-card">
                        <div className="profile__avatar">
                            {editedUser.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="profile__details">
                            <div className="profile__info-row">
                                <span className="profile__label">Name</span>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedUser.name}
                                        onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                                        className="login__input"
                                        style={{ flex: 1 }}
                                    />
                                ) : (
                                    <span className="profile__value">{user.name}</span>
                                )}
                            </div>
                            <div className="profile__info-row">
                                <span className="profile__label">Email</span>
                                <span className="profile__value">{user.email}</span>
                            </div>
                            <div className="profile__info-row">
                                <span className="profile__label">Age</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={editedUser.age}
                                        onChange={(e) => setEditedUser({ ...editedUser, age: parseInt(e.target.value) || 0 })}
                                        className="login__input"
                                        style={{ flex: 1 }}
                                    />
                                ) : (
                                    <span className="profile__value">{user.age} years</span>
                                )}
                            </div>
                            <div className="profile__info-row">
                                <span className="profile__label">Condition</span>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedUser.condition}
                                        onChange={(e) => setEditedUser({ ...editedUser, condition: e.target.value })}
                                        className="login__input"
                                        style={{ flex: 1 }}
                                    />
                                ) : (
                                    <Badge variant="pink">{user.condition}</Badge>
                                )}
                            </div>
                        </div>
                    </div>
                    {isEditing && (
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <Button variant="primary" onClick={handleSave} fullWidth>
                                Save Changes
                            </Button>
                            <Button variant="secondary" onClick={handleCancel} fullWidth>
                                Cancel
                            </Button>
                        </div>
                    )}
                </Card>
            </section>
            <section className="profile__section">
                <Card color="white" padding="large">
                    <h2 className="profile__title">Account Actions</h2>
                    <div className="profile__actions">
                        <Button variant="secondary" onClick={onLogout}>
                            Logout
                        </Button>
                    </div>
                </Card>
            </section>
        </div>
    );
};
