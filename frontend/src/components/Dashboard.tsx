import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { StatCard } from './StatCard';
import { Badge } from './Badge';
import { ListItem } from './ListItem';
import type { PatientUser } from './Login';
import { getMedicines, type Medicine } from './data/medicineData';
import { getSymptomLogs, type SymptomEntry } from './data/symptomData';
import { getTasks, categoryIcons, type Task } from './data/taskData';
import './Dashboard.css';

interface DashboardProps {
    patient: PatientUser | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ patient }) => {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [latestSymptom, setLatestSymptom] = useState<SymptomEntry | null>(null);

    useEffect(() => {
        setMedicines(getMedicines());
        setTasks(getTasks());
        const symptoms = getSymptomLogs();
        if (symptoms.length > 0) {
            setLatestSymptom(symptoms[0]);
        }
    }, []);
    useEffect(() => {
        const handleFocus = () => {
            setMedicines(getMedicines());
            setTasks(getTasks());
            const symptoms = getSymptomLogs();
            if (symptoms.length > 0) {
                setLatestSymptom(symptoms[0]);
            }
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    const missedMedicines = medicines.filter(m => m.status === 'missed').length;
    const takenCount = medicines.filter(m => m.status === 'taken').length;
    const pendingMedicineCount = medicines.filter(m => m.status === 'pending').length;
    const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'overdue');

    return (
        <div className="dashboard">
            {missedMedicines > 0 && (
                <div className="dashboard__alert">
                    <span className="dashboard__alert-icon">🚨</span>
                    <span className="dashboard__alert-text">
                        {missedMedicines} medicine{missedMedicines > 1 ? 's' : ''} missed today
                    </span>
                </div>
            )}

            <section className="dashboard__section">
                <Card color="blue" padding="large">
                    <div className="dashboard__patient">
                        <div className="dashboard__patient-avatar">
                            {patient ? patient.name.charAt(0).toUpperCase() : '👤'}
                        </div>
                        <div className="dashboard__patient-info">
                            <h2 className="dashboard__patient-name">{patient?.name || 'Welcome'}</h2>
                            <div className="dashboard__patient-details">
                                {patient && (
                                    <>
                                        <Badge variant="blue" size="small">{patient.age} years</Badge>
                                        <span className="dashboard__patient-condition">{patient.condition}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            </section>

            <div className="dashboard__grid">
                <section className="dashboard__section">
                    <Card color="pink" padding="large">
                        <h3 className="dashboard__card-title"> Today's Medicines</h3>
                        <StatCard
                            title=""
                            color="white"
                            stats={[
                                { label: 'Taken', value: takenCount },
                                { label: 'Pending', value: pendingMedicineCount },
                                { label: 'Total', value: medicines.length }
                            ]}
                        />
                        <div className="dashboard__medicine-list">
                            {medicines.slice(0, 4).map((med) => (
                                <ListItem
                                    key={med.id}
                                    avatar={<span>💊</span>}
                                    avatarColor={
                                        med.status === 'taken' ? 'green' :
                                            med.status === 'missed' ? 'pink' : 'yellow'
                                    }
                                    title={`${med.name} ${med.dosage}`}
                                    subtitle={med.schedule}
                                    action={
                                        <Badge
                                            variant={
                                                med.status === 'taken' ? 'green' :
                                                    med.status === 'missed' ? 'pink' : 'yellow'
                                            }
                                        >
                                            {med.status === 'taken' ? ' Taken' :
                                                med.status === 'missed' ? ' Missed' : ' Pending'}
                                        </Badge>
                                    }
                                />
                            ))}
                        </div>
                    </Card>
                </section>

                <section className="dashboard__section">
                    <Card color="yellow" padding="large">
                        <h3 className="dashboard__card-title"> Pending Care Tasks</h3>
                        <div className="dashboard__task-list">
                            {pendingTasks.slice(0, 4).map((task) => (
                                <ListItem
                                    key={task.id}
                                    avatar={<span>{categoryIcons[task.category]}</span>}
                                    avatarColor={task.status === 'overdue' ? 'pink' : 'yellow'}
                                    title={task.title}
                                    subtitle={task.notes || 'No notes'}
                                    action={<Badge variant={task.status === 'overdue' ? 'pink' : 'yellow'}>{task.dueTime}</Badge>}
                                />
                            ))}
                            {pendingTasks.length === 0 && (
                                <p style={{ color: '#666', textAlign: 'center', padding: '1rem' }}>No pending tasks</p>
                            )}
                        </div>
                    </Card>
                </section>
            </div>

            <section className="dashboard__section">
                <Card color="green" padding="large">
                    <h3 className="dashboard__card-title">Latest Symptom Snapshot</h3>
                    {latestSymptom ? (
                        <div className="dashboard__symptoms">
                            <div className="dashboard__symptom-item">
                                <span className="dashboard__symptom-label">Pain Level:</span>
                                <span className="dashboard__symptom-value">{latestSymptom.painLevel}/10</span>
                            </div>
                            <div className="dashboard__symptom-item">
                                <span className="dashboard__symptom-label">Blood Pressure:</span>
                                <span className="dashboard__symptom-value">{latestSymptom.bloodPressure || 'Not recorded'}</span>
                            </div>
                            <div className="dashboard__symptom-notes">
                                <span className="dashboard__symptom-label">Notes:</span>
                                <p className="dashboard__symptom-notes-text">{latestSymptom.notes}</p>
                            </div>
                        </div>
                    ) : (
                        <p style={{ color: '#666', textAlign: 'center', padding: '1rem' }}>No symptom entries yet</p>
                    )}
                </Card>
            </section>
        </div>
    );
};
