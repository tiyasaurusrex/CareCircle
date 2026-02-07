import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { getMedicines, type Medicine } from './data/medicineData';
import './MedicineTracker.css';

export const MedicineTracker: React.FC = () => {
    const [medicines, setMedicines] = useState<Medicine[]>(() => getMedicines());
    const [medicineName, setMedicineName] = useState('');
    const [dosage, setDosage] = useState('');
    const [timesPerDay, setTimesPerDay] = useState('1');

    const handleAddMedicine = (e: React.FormEvent) => {
        e.preventDefault();
        if (!medicineName || !dosage) return;

        const newMedicine: Medicine = {
            id: Date.now().toString(),
            name: medicineName,
            dosage: dosage,
            schedule: `${timesPerDay}x/day`,
            status: 'pending',
        };

        setMedicines([...medicines, newMedicine]);
        setMedicineName('');
        setDosage('');
        setTimesPerDay('1');
    };

    const handleMarkStatus = (id: string, status: 'taken' | 'missed') => {
        setMedicines(medicines.map(med =>
            med.id === id ? { ...med, status } : med
        ));
    };

    const handleRemoveMedicine = (id: string) => {
        setMedicines(medicines.filter(med => med.id !== id));
    };

    const totalMedicines = medicines.length;
    const takenMedicines = medicines.filter(m => m.status === 'taken').length;
    const adherencePercentage = totalMedicines > 0
        ? Math.round((takenMedicines / totalMedicines) * 100)
        : 0;

    return (
        <div className="medicine-tracker">
            <section className="medicine-tracker__section">
                <Card color="blue" padding="large">
                    <h2 className="medicine-tracker__title"> Add Medicine</h2>
                    <form onSubmit={handleAddMedicine} className="medicine-tracker__form">
                        <div className="medicine-tracker__form-group">
                            <label className="medicine-tracker__label">Medicine Name</label>
                            <input
                                type="text"
                                value={medicineName}
                                onChange={(e) => setMedicineName(e.target.value)}
                                className="medicine-tracker__input"
                                placeholder="e.g., Aspirin"
                                required
                            />
                        </div>

                        <div className="medicine-tracker__form-group">
                            <label className="medicine-tracker__label">Dosage</label>
                            <input
                                type="text"
                                value={dosage}
                                onChange={(e) => setDosage(e.target.value)}
                                className="medicine-tracker__input"
                                placeholder="e.g., 100mg"
                                required
                            />
                        </div>

                        <div className="medicine-tracker__form-group">
                            <label className="medicine-tracker__label">Times per Day</label>
                            <select
                                value={timesPerDay}
                                onChange={(e) => setTimesPerDay(e.target.value)}
                                className="medicine-tracker__input"
                            >
                                <option value="1">1x per day</option>
                                <option value="2">2x per day</option>
                                <option value="3">3x per day</option>
                                <option value="4">4x per day</option>
                            </select>
                        </div>
                        <Button variant="primary" type="submit">Add Medicine</Button>
                    </form>
                </Card>
            </section>
            <section className="medicine-tracker__section">
                <Card color="pink" padding="large">
                    <h2 className="medicine-tracker__title"> Medicine List</h2>
                    <div className="medicine-tracker__table-container">
                        <table className="medicine-tracker__table">
                            <thead>
                                <tr>
                                    <th>Medicine</th>
                                    <th>Dosage</th>
                                    <th>Schedule</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {medicines.map((medicine) => (
                                    <tr key={medicine.id}>
                                        <td className="medicine-tracker__table-cell--name">{medicine.name}</td>
                                        <td>{medicine.dosage}</td>
                                        <td>{medicine.schedule}</td>
                                        <td>
                                            <Badge
                                                variant={
                                                    medicine.status === 'taken' ? 'green' :
                                                        medicine.status === 'missed' ? 'pink' : 'yellow'
                                                }
                                            >
                                                {medicine.status === 'taken' ? ' Taken' :
                                                    medicine.status === 'missed' ? ' Missed' : '⏳ Pending'}
                                            </Badge>
                                        </td>
                                        <td>
                                            <div className="medicine-tracker__actions">
                                                <button
                                                    onClick={() => handleMarkStatus(medicine.id, 'taken')}
                                                    className="medicine-tracker__action-btn medicine-tracker__action-btn--taken"
                                                    disabled={medicine.status === 'taken'}
                                                >
                                                    ✓ Taken
                                                </button>
                                                <button
                                                    onClick={() => handleMarkStatus(medicine.id, 'missed')}
                                                    className="medicine-tracker__action-btn medicine-tracker__action-btn--missed"
                                                    disabled={medicine.status === 'missed'}
                                                >
                                                    ✗ Missed
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveMedicine(medicine.id)}
                                                    className="medicine-tracker__action-btn medicine-tracker__action-btn--delete"
                                                >
                                                     Remove
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </section>
            <section className="medicine-tracker__section">
                <Card color="green" padding="large">
                    <h2 className="medicine-tracker__title"> Adherence Tracking</h2>
                    <div className="medicine-tracker__adherence">
                        <div className="medicine-tracker__adherence-stats">
                            <div className="medicine-tracker__adherence-percentage">
                                {adherencePercentage}%
                            </div>
                            <p className="medicine-tracker__adherence-label">Adherence Rate</p>
                            <p className="medicine-tracker__adherence-detail">
                                {takenMedicines} of {totalMedicines} medicines taken
                            </p>
                        </div>

                        <div className="medicine-tracker__chart">
                            <div className="medicine-tracker__chart-bar">
                                <div
                                    className="medicine-tracker__chart-fill"
                                    style={{ width: `${adherencePercentage}%` }}
                                >
                                    <span className="medicine-tracker__chart-text">
                                        {adherencePercentage}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </section>
        </div>
    );
};
