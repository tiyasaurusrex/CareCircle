import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { authApi } from '../services/api';
import './Login.css';

export interface PatientUser {
    email: string;
    name: string;
    age: number;
    gender: string;
    condition: string;
    caregiverPhone: string;
}

interface LoginProps {
    onLogin: (email: string, token: string) => void;
}
export const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        if (isRegister && password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!email.includes('@') || password.length < 6) {
            setError('Invalid email or password (min 6 characters)');
            return;
        }

        setLoading(true);
        try {
            if (isRegister) {
                await authApi.register(email, password);
            }
            const data = await authApi.login(email, password);
            onLogin(email, data.token);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login">
            <div className="login__container">
                <div className="login__header">
                    <h1 className="login__logo">CareCircle</h1>
                    <p className="login__tagline">Recovery Dashboard - Home Care Management</p>
                </div>

                <Card color="white" padding="large">
                    <h2 className="login__title">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
                    <p className="login__subtitle">
                        {isRegister ? 'Sign up to manage your recovery journey' : 'Sign in to view your dashboard'}
                    </p>
                    {error && <div className="login__error">{error}</div>}
                    <form onSubmit={handleSubmit} className="login__form">
                        <div className="login__form-group">
                            <label className="login__label">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="login__input"
                                placeholder="your@email.com"
                                required
                            />
                        </div>
                        <div className="login__form-group">
                            <label className="login__label">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="login__input"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        {isRegister && (
                            <div className="login__form-group">
                                <label className="login__label">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="login__input"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        )}

                        <Button variant="primary" type="submit" fullWidth disabled={loading}>
                            {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
                        </Button>
                    </form>
                    <div className="login__toggle">
                        <span>{isRegister ? 'Already have an account?' : "Don't have an account?"}</span>
                        <button
                            type="button"
                            onClick={() => {
                                setIsRegister(!isRegister);
                                setError('');
                            }}
                            className="login__toggle-btn"
                        >
                            {isRegister ? 'Sign In' : 'Register'}
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};
