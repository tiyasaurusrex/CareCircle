import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { patientApi } from '../services/api';
import './Login.css';

export interface ProfileData {
    name: string;
    age: number;
    gender: string;
    condition: string;
    caregiverPhone: string;
}

interface ProfileSetupProps {
    email: string;
    onProfileComplete: (profileData: ProfileData, patientId: string) => void;
}

export const ProfileSetup: React.FC<ProfileSetupProps> = ({ email, onProfileComplete }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('other');
    const [condition, setCondition] = useState('');
    const [caregiverPhone, setCaregiverPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name || !age || !condition || !caregiverPhone) {
            setError('Please fill in all fields');
            return;
        }

        const ageNum = parseInt(age);
        if (isNaN(ageNum) || ageNum <= 0 || ageNum > 150) {
            setError('Please enter a valid age');
            return;
        }

        setLoading(true);
        try {
            const patient = await patientApi.create({
                name,
                age: ageNum,
                gender,
                condition,
                caregiverPhone,
            });
            onProfileComplete({ name, age: ageNum, gender, condition, caregiverPhone }, patient._id);
        } catch (err) {
            const localPatientId = `local-${Date.now()}`;
            onProfileComplete({ name, age: ageNum, gender, condition, caregiverPhone }, localPatientId);
        } finally {
            setLoading(false);
        }
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
                            <label className="login__label">Gender</label>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="login__input"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
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
                        <div className="login__form-group">
                            <label className="login__label">Caregiver's Mobile Number</label>
                            <input
                                type="tel"
                                value={caregiverPhone}
                                onChange={(e) => setCaregiverPhone(e.target.value)}
                                className="login__input"
                                placeholder="e.g., +91 9876543210"
                                required
                            />
                        </div>

                        <Button variant="primary" type="submit" fullWidth disabled={loading}>
                            {loading ? 'Setting up...' : 'Complete Setup'}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};
