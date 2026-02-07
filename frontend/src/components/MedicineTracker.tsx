import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { medicineApi, type MedicineData } from '../services/api';
import type { Medicine } from './data/medicineData';
import './MedicineTracker.css';

//Web Speech API
function useSpeechToText() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    const isSupported = typeof window !== 'undefined' &&
        ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

    const startListening = useCallback(() => {
        if (!isSupported) return;

        const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognitionCtor) return;
        const recognition = new SpeechRecognitionCtor();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.continuous = false;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const text = event.results[0][0].transcript;
            setTranscript(text);
        };

        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);
        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
    }, [isSupported]);

    const stopListening = useCallback(() => {
        recognitionRef.current?.stop();
        setIsListening(false);
    }, []);

    return { isListening, transcript, setTranscript, startListening, stopListening, isSupported };
}

interface MedicineTrackerProps {
    patientId: string | null;
    medicines: Medicine[];
    setMedicines: React.Dispatch<React.SetStateAction<Medicine[]>>;
}

export const MedicineTracker: React.FC<MedicineTrackerProps> = ({ patientId, medicines, setMedicines }) => {
    const [medicineName, setMedicineName] = useState('');
    const [dosage, setDosage] = useState('');
    const [timesPerDay, setTimesPerDay] = useState('1');
    const [loading, setLoading] = useState(false);
    const [voiceText, setVoiceText] = useState('');
    const { isListening, transcript, setTranscript, startListening, stopListening, isSupported } = useSpeechToText();

    useEffect(() => {
        if (transcript) {
            setVoiceText(transcript);
            parseAndFillFields(transcript);
            setTranscript('');
        }
    }, [transcript, setTranscript]);
    const parseAndFillFields = (text: string) => {
        const raw = text.trim().toLowerCase();
        const dosageRegex = /(\d+\.?\d*)\s*(mg|ml|mcg|g|iu|units?|tablets?|capsules?|drops?)/i;
        const dosageMatch = raw.match(dosageRegex);
        let extractedDosage = '';
        if (dosageMatch) {
            extractedDosage = `${dosageMatch[1]}${dosageMatch[2].replace(/s$/, '')}`;
        }
        let extractedFreq = '1';
        const freqPatterns: [RegExp, string][] = [
            [/\b(4\s*x|four times|4 times)\b/i, '4'],
            [/\b(thrice|3\s*x|three times|3 times)\b/i, '3'],
            [/\b(twice|2\s*x|two times|2 times)\b/i, '2'],
            [/\bmorning\s+(and|&)\s+(night|evening)\b/i, '2'],
            [/\b(once|1\s*x|one time|1 time)\b/i, '1'],
        ];
        for (const [pattern, val] of freqPatterns) {
            if (pattern.test(raw)) {
                extractedFreq = val;
                break;
            }
        }
        let nameText = raw;
        if (dosageMatch) {
            nameText = nameText.replace(dosageRegex, '');
        }
        nameText = nameText
            .replace(/\b(once|twice|thrice|one time|two times|three times|four times)\b/gi, '')
            .replace(/\b\d\s*x\s*(a|per)?\s*(day|daily)?\b/gi, '')
            .replace(/\b\d\s*times?\s*(a|per)?\s*(day|daily)?\b/gi, '')
            .replace(/\b(a|per|every)\s*(day|daily|morning|night|evening|afternoon)\b/gi, '')
            .replace(/\b(daily|morning|night|evening|afternoon)\b/gi, '')
            .replace(/\b(and|for|in|the|take|times?)\b/gi, '')
            .replace(/\s{2,}/g, ' ')
            .trim();
        const extractedName = nameText
            .split(' ')
            .filter(Boolean)
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');

        if (extractedName) setMedicineName(extractedName);
        if (extractedDosage) setDosage(extractedDosage);
        setTimesPerDay(extractedFreq);
    };

    const handleVoiceFill = () => {
        if (!voiceText.trim()) return;
        parseAndFillFields(voiceText);
        setVoiceText('');
    };

    const mapApiToLocal = (m: MedicineData): Medicine => ({
        id: m._id,
        name: m.name,
        dosage: m.dosage,
        schedule: m.schedule.join(', '),
        status: 'pending',
    });

    const fetchMedicines = useCallback(async () => {
        if (!patientId || patientId.startsWith('local-') || medicines.length > 0) return;
        
        try {
            const data = await medicineApi.getByPatient(patientId);
            if (data.length > 0) {
                setMedicines(data.map(mapApiToLocal));
            }
        } catch {
            
        }
    }, [patientId, medicines.length, setMedicines]);

    useEffect(() => {
        fetchMedicines();
    }, [fetchMedicines]);

    const handleAddMedicine = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!medicineName || !dosage) return;

        const scheduleArr = Array.from({ length: parseInt(timesPerDay) }, (_, i) => {
            const hour = 8 + Math.floor((i * 12) / parseInt(timesPerDay));
            return `${hour.toString().padStart(2, '0')}:00`;
        });

        if (patientId && !patientId.startsWith('local-')) {
            setLoading(true);
            try {
                const today = new Date().toISOString().split('T')[0];
                const endDate = new Date();
                endDate.setMonth(endDate.getMonth() + 1);

                const med = await medicineApi.add({
                    patientId,
                    name: medicineName,
                    dosage,
                    schedule: scheduleArr,
                    startDate: today,
                    endDate: endDate.toISOString().split('T')[0],
                });
                setMedicines(prev => [...prev, mapApiToLocal(med)]);
            } catch {
                const newMedicine: Medicine = {
                    id: Date.now().toString(),
                    name: medicineName,
                    dosage: dosage,
                    schedule: `${timesPerDay}x/day`,
                    status: 'pending',
                };
                setMedicines(prev => [...prev, newMedicine]);
            } finally {
                setLoading(false);
            }
        } else {
            const newMedicine: Medicine = {
                id: Date.now().toString(),
                name: medicineName,
                dosage: dosage,
                schedule: `${timesPerDay}x/day`,
                status: 'pending',
            };
            setMedicines(prev => [...prev, newMedicine]);
        }

        setMedicineName('');
        setDosage('');
        setTimesPerDay('1');
    };

    const handleMarkStatus = (id: string, status: 'taken' | 'missed') => {
        setMedicines(prev => prev.map(med =>
            med.id === id ? { ...med, status } : med
        ));
    };

    const handleRemoveMedicine = (id: string) => {
        setMedicines(prev => prev.filter(med => med.id !== id));
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
                    {isSupported && (
                        <div className="medicine-tracker__voice-section">
                            <label className="medicine-tracker__label"> Speak Medicine Details</label>
                            <div className="medicine-tracker__voice-row">
                                <input
                                    type="text"
                                    value={voiceText}
                                    onChange={(e) => setVoiceText(e.target.value)}
                                    className="medicine-tracker__input medicine-tracker__voice-input"
                                    placeholder='Try: "Paracetamol 500mg 2x a day"'
                                />
                                <button
                                    type="button"
                                    onClick={isListening ? stopListening : startListening}
                                    className={`medicine-tracker__mic-btn ${isListening ? 'medicine-tracker__mic-btn--active' : ''}`}
                                    title={isListening ? 'Stop listening' : 'Start voice input'}
                                >
                                    {isListening ? (
                                        <span className="medicine-tracker__mic-pulse">●</span>
                                    ) : '🎤'}
                                </button>
                                {voiceText && (
                                    <button
                                        type="button"
                                        onClick={handleVoiceFill}
                                        className="medicine-tracker__voice-fill-btn"
                                    >
                                        Re-parse
                                    </button>
                                )}
                            </div>
                            {isListening && (
                                <p className="medicine-tracker__voice-status">Listening… speak now</p>
                            )}
                            <p className="medicine-tracker__voice-hint">
                                Say something like: "Aspirin 100mg twice a day" 
                            </p>
                        </div>
                    )}

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
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Medicine'}
                        </Button>
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
