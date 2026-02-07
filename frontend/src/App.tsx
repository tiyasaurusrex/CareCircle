import { useState } from 'react';
import './App.css';
import {
  SideNav,
  Dashboard,
  MedicineTracker,
  SymptomLog,
  Login,
  ProfileSetup,
  Profile,
  CareTasks
} from './components';
import type { PatientUser } from './components/Login';
import type { ProfileData } from './components/ProfileSetup';

type Page = 'dashboard' | 'medicines' | 'symptoms' | 'tasks' | 'profile';
const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" rx="1"></rect>
    <rect x="14" y="3" width="7" height="5" rx="1"></rect>
    <rect x="14" y="12" width="7" height="9" rx="1"></rect>
    <rect x="3" y="16" width="7" height="5" rx="1"></rect>
  </svg>
);

const MedicinesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.5 20.5L3.5 13.5a4.95 4.95 0 1 1 7-7l7 7a4.95 4.95 0 0 1-7 7z"></path>
    <path d="M8.5 8.5l7 7"></path>
  </svg>
);

const SymptomsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
  </svg>
);

const TasksIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4"></path>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
  </svg>
);

const ProfileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [profileComplete, setProfileComplete] = useState(false);
  const [currentUser, setCurrentUser] = useState<PatientUser | null>(null);

  const handleLogin = (email: string) => {
    setUserEmail(email);
    setIsLoggedIn(true);
  };

  const handleProfileComplete = (profileData: ProfileData) => {
    const user: PatientUser = {
      email: userEmail,
      ...profileData
    };
    setCurrentUser(user);
    setProfileComplete(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setProfileComplete(false);
    setUserEmail('');
    setCurrentPage('dashboard');
  };

  const handleUpdateProfile = (updatedUser: PatientUser) => {
    setCurrentUser(updatedUser);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  if (!profileComplete) {
    return <ProfileSetup email={userEmail} onProfileComplete={handleProfileComplete} />;
  }
  const navItems = [
    {
      section: 'General',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, active: currentPage === 'dashboard', onClick: () => setCurrentPage('dashboard') },
        { id: 'medicines', label: 'Medicines', icon: <MedicinesIcon />, active: currentPage === 'medicines', onClick: () => setCurrentPage('medicines') },
        { id: 'symptoms', label: 'Symptoms', icon: <SymptomsIcon />, active: currentPage === 'symptoms', onClick: () => setCurrentPage('symptoms') },
        { id: 'tasks', label: 'Tasks', icon: <TasksIcon />, active: currentPage === 'tasks', onClick: () => setCurrentPage('tasks') },
      ]
    },
    {
      section: 'Tools',
      items: [
        { id: 'profile', label: 'Profile', icon: <ProfileIcon />, active: currentPage === 'profile', onClick: () => setCurrentPage('profile') },
      ]
    }
  ];

  const bottomActions = [
    { id: 'logout', label: 'Log out', icon: <LogoutIcon />, onClick: handleLogout }
  ];

  return (
    <div className="app">
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <SideNav
          items={navItems}
          bottomActions={bottomActions}
          logoText="CareCircle"
        />
        <div className="app-container" style={{ flex: 1, height: '100vh', overflowY: 'auto' }}>
          <header className="app-header">
            <h1>CareCircle</h1>
            <p className="app-subtitle">
              Home Care Management Dashboard
            </p>
          </header>
          {currentPage === 'dashboard' && <Dashboard patient={currentUser} />}
          {currentPage === 'medicines' && <MedicineTracker />}
          {currentPage === 'symptoms' && <SymptomLog />}
          {currentPage === 'tasks' && <CareTasks />}
          {currentPage === 'profile' && <Profile user={currentUser!} onLogout={handleLogout} onUpdateProfile={handleUpdateProfile} />}
        </div>
      </div>
    </div>
  );
}

export default App;
