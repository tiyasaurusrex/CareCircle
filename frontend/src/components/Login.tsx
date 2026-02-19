import React, { useState } from 'react';
import { Card } from './Card';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import './Login.css';

const googleProvider = new GoogleAuthProvider();

export interface PatientUser {
    email: string;
    name: string;
    age: number;
    gender: string;
    condition: string;
    caregiverPhone: string;
}

export interface BackendUser {
    _id: string;
    firebaseUID: string;
    name: string;
    email: string;
    photoURL?: string;
    age?: number;
    gender?: string;
    condition?: string;
    caregiverPhone?: string;
    profileComplete: boolean;
}

interface LoginProps {
    onLogin: (email: string, token: string, backendUser: BackendUser) => void;
}
export const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            // 1. Google popup login
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // 2. Get Firebase ID token
            const idToken = await user.getIdToken();

            // 3. Send token to backend via Vite proxy
            const response = await fetch("/api/auth/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: idToken }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Google login failed");
            }

            // 4. Trigger the onLogin callback with backend user data
            onLogin(user.email || '', idToken, data.user);

        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : 'Google login failed');
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
                    <h2 className="login__title">Welcome Back</h2>
                    <p className="login__subtitle">
                        Sign in to view your dashboard
                    </p>
                    {error && <div className="login__error">{error}</div>}

                    <button 
                        type="button" 
                        onClick={handleGoogleLogin} 
                        disabled={loading}
                        className="login__google-btn"
                    >
                        <svg className="login__google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        {loading ? 'Signing in...' : 'Sign in with Google'}
                    </button>
                </Card>
            </div>
        </div>
    );
};
