import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import './Login.css';

export interface ProfileData {
    name: string;
    age: number;
    condition: string;
}

interface ProfileSetupProps {
    email: string;
    onProfileComplete: (profileData: ProfileData) => void;
}

export const ProfileSetup: React.FC<ProfileSetupProps> = ({ email, onProfileComplete }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [condition, setCondition] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name || !age || !condition) {
            setError('Please fill in all fields');
            return;
        }

        const ageNum = parseInt(age);
        if (isNaN(ageNum) || ageNum <= 0 || ageNum > 150) {
            setError('Please enter a valid age');
            return;
        }

        onProfileComplete({
            name,
            age: ageNum,
            condition
        });
    };

    return (
        <div className="login">
            <div className="login__container">
                <div className="login__header">
                    <h1 className="login__logo">CareCircle</h1>
                    <p className="login__tagline">Complete Your Profile</p>
                </div>

                <Card color="white" padding="large">
                    <h2 className="login__title">Welcome!</h2>
                    <p className="login__subtitle">
                        Let's set up your profile to personalize your care experience
                    </p>
                    <div className="login__email-badge">
                        📧 {email}
                    </div>
                    {error && <div className="login__error">{error}</div>}
                    <form onSubmit={handleSubmit} className="login__form">
                        <div className="login__form-group">
                            <label className="login__label">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="login__input"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div className="login__form-group">
                            <label className="login__label">Age</label>
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                className="login__input"
                                placeholder="e.g., 65"
                                required
                            />
                        </div>
                        <div className="login__form-group">
                            <label className="login__label">Medical Condition</label>
                            <input
                                type="text"
                                value={condition}
                                onChange={(e) => setCondition(e.target.value)}
                                className="login__input"
                                placeholder="e.g., Post-Surgery Recovery"
                                required
                            />
                        </div>

                        <Button variant="primary" type="submit" fullWidth>
                            Complete Setup
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};
