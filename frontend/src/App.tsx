import { useState, useEffect } from 'react';
import './App.css';
import Referral from "./Referral";

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
import { setToken, getToken } from './services/api';
import { getMedicines, type Medicine } from './components/data/medicineData';
import { getSymptomLogs, type SymptomEntry } from './components/data/symptomData';
import { getTasks, type Task } from './components/data/taskData';

// Session persistence helpers
const SESSION_KEY = 'carecircle_session';
const DATA_KEY = 'carecircle_data';

interface SessionData {
  token: string;
  email: string;
  user: PatientUser;
  patientId: string;
}

interface AppData {
  medicines: Medicine[];
  symptoms: SymptomEntry[];
  tasks: Task[];
}

const saveSession = (data: SessionData) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
};

const loadSession = (): SessionData | null => {
  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
  // Note: We keep user-specific data in localStorage so they can return to it
  // Each user's data is stored with their patientId as the key
};

const saveData = (data: AppData, userId: string) => {
  localStorage.setItem(`${DATA_KEY}_${userId}`, JSON.stringify(data));
};

const loadData = (userId: string | null): AppData | null => {
  if (!userId) return null;
  const stored = localStorage.getItem(`${DATA_KEY}_${userId}`);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

type Page = 'dashboard' | 'medicines' | 'symptoms' | 'tasks' | 'profile'  | 'referral';
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
  const [patientId, setPatientId] = useState<string | null>(null);
  
  // Shared state for all data - will be loaded after session restoration
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Restore session on app load
  useEffect(() => {
    const session = loadSession();
    if (session) {
      setToken(session.token);
      setUserEmail(session.email);
      setCurrentUser(session.user);
      setPatientId(session.patientId);
      setProfileComplete(true);
      setIsLoggedIn(true);
      
      // Load user-specific data
      const userData = loadData(session.patientId);
      if (userData) {
        setMedicines(userData.medicines);
        setSymptoms(userData.symptoms);
        setTasks(userData.tasks);
      } else {
        // New user - load placeholder data
        setMedicines(getMedicines());
        setSymptoms(getSymptomLogs());
        setTasks(getTasks());
      }
    }
  }, []);

  // Persist data whenever it changes
  useEffect(() => {
    if (isLoggedIn && profileComplete && patientId) {
      saveData({ medicines, symptoms, tasks }, patientId);
    }
  }, [medicines, symptoms, tasks, isLoggedIn, profileComplete, patientId]);

  const handleLogin = (email: string, token: string) => {
    setUserEmail(email);
    setToken(token);
    setIsLoggedIn(true);
  };

  const handleProfileComplete = (profileData: ProfileData, id: string) => {
    const user: PatientUser = {
      email: userEmail,
      ...profileData
    };
    setCurrentUser(user);
    setPatientId(id);
    setProfileComplete(true);
    
    // Load placeholder data for new user
    const existingData = loadData(id);
    if (!existingData) {
      setMedicines(getMedicines());
      setSymptoms(getSymptomLogs());
      setTasks(getTasks());
    }
    
    // Save session to localStorage
    const token = getToken();
    if (token) {
      saveSession({ token, email: userEmail, user, patientId: id });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    // Reset data on logout to empty arrays
    setMedicines([]);
    setSymptoms([]);
    setTasks([]);
    setProfileComplete(false);
    setUserEmail('');
    setPatientId(null);
    setToken(null);
    clearSession(); // Clear persisted session (but not user data)
    setCurrentPage('dashboard');
  };

  const handleUpdateProfile = (updatedUser: PatientUser) => {
    setCurrentUser(updatedUser);
    
    // Update session storage with new profile data
    const token = getToken();
    if (token && patientId) {
      saveSession({ token, email: userEmail, user: updatedUser, patientId });
    }
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
        {
          id: 'referral',
          label: 'Referral',
          icon: <DashboardIcon />, // you can change icon later
          active: currentPage === 'referral',
          onClick: () => setCurrentPage('referral')
        },
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
            <p className="app-subtitle">Your health companion</p>
          </header>
          {currentPage === 'dashboard' && (
            <Dashboard 
              key={`dashboard-${medicines.length}-${symptoms.length}-${tasks.length}`}
              patient={currentUser} 
              patientId={patientId}
              medicines={medicines}
              symptoms={symptoms}
              tasks={tasks}
            />
          )}
          {currentPage === 'medicines' && (
            <MedicineTracker 
              patientId={patientId}
              medicines={medicines}
              setMedicines={setMedicines}
            />
          )}
          {currentPage === 'symptoms' && (
            <SymptomLog 
              patientId={patientId}
              symptoms={symptoms}
              setSymptoms={setSymptoms}
              patientProfile={currentUser}
            />
          )}
          {currentPage === 'tasks' && (
            <CareTasks 
              tasks={tasks}
              setTasks={setTasks}
              patientId={patientId}
            />
          )}
          {currentPage === 'profile' && <Profile user={currentUser!} onLogout={handleLogout} onUpdateProfile={handleUpdateProfile} />}
          {currentPage === 'referral' && <Referral />}
        </div>
      </div>
    </div>
  );
}

export default App;




