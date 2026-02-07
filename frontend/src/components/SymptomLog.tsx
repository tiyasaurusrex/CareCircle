import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { getSymptomLogs, type SymptomEntry } from './data/symptomData';
import './SymptomLog.css';

interface TriageResult {
    status: 'normal' | 'monitor' | 'consult';
    message: string;
    reason: string;
    timestamp: string;
}

export const SymptomLog: React.FC = () => {
    const [logs, setLogs] = useState<SymptomEntry[]>(() => getSymptomLogs());
    const [painLevel, setPainLevel] = useState(5);
    const [temperature, setTemperature] = useState('');
    const [bloodPressure, setBloodPressure] = useState('');
    const [notes, setNotes] = useState('');
    const [triageResult, setTriageResult] = useState<TriageResult | null>(null);

    const assessTriage = (entry: SymptomEntry, recentLogs: SymptomEntry[]): TriageResult => {
        const temp = parseFloat(entry.temperature.replace('°F', '')) || 0;
        const pain = entry.painLevel;
        let systolic = 0;
        let diastolic = 0;

        if (entry.bloodPressure) {
            const bpParts = entry.bloodPressure.split('/');
            systolic = parseInt(bpParts[0]) || 0;
            diastolic = parseInt(bpParts[1]) || 0;
        }
        const reasons: string[] = [];
        let status: 'normal' | 'monitor' | 'consult' = 'normal';
        if (temp >= 101) {
            const recentTwoDays = recentLogs.slice(0, 2);
            const consecutiveFever = recentTwoDays.every(log => {
                const t = parseFloat(log.temperature.replace('°F', '')) || 0;
                return t >= 100;
            });

            if (consecutiveFever && recentTwoDays.length >= 2) {
                status = 'consult';
                reasons.push('High fever (≥101°F) continuing for multiple days');
            } else {
                status = 'consult';
                reasons.push('High fever detected (≥101°F)');
            }
        }
        if (pain >= 8) {
            status = 'consult';
            reasons.push('Severe pain level reported (≥8/10)');
        }
        if (systolic >= 140 || diastolic >= 90) {
            status = 'consult';
            reasons.push(`High blood pressure detected (${entry.bloodPressure})`);
        }

        if (temp >= 100 && pain >= 7) {
            status = 'consult';
            reasons.push('Combination of fever and high pain requires medical attention');
        }
        if (status !== 'consult') {
            if (temp >= 99 && temp < 101) {
                status = 'monitor';
                reasons.push('Elevated temperature detected');
            }

            if (pain >= 6 && pain < 8) {
                status = 'monitor';
                reasons.push('Moderate to high pain level');
            }

            if ((systolic >= 130 && systolic < 140) || (diastolic >= 85 && diastolic < 90)) {
                status = 'monitor';
                reasons.push('Elevated blood pressure');
            }
            const recentThree = [entry, ...recentLogs.slice(0, 2)];
            if (recentThree.length >= 3) {
                const isIncreasing = recentThree[0].painLevel > recentThree[1].painLevel &&
                    recentThree[1].painLevel > recentThree[2].painLevel;
                if (isIncreasing) {
                    status = 'monitor';
                    reasons.push('Pain levels showing increasing trend');
                }
            }
        }
        if (reasons.length === 0) {
            reasons.push('All vital signs within normal range');
        }

        const messages = {
            normal: '✅ All Clear - Vitals Normal',
            monitor: '⚠️ Monitor Closely',
            consult: '🚨 Consult Doctor Recommended'
        };
        return {
            status,
            message: messages[status],
            reason: reasons.join('. '),
            timestamp: new Date().toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const now = new Date();
        const newEntry: SymptomEntry = {
            id: Date.now().toString(),
            date: now.toISOString().split('T')[0],
            time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            painLevel,
            temperature: temperature || 'Not recorded',
            bloodPressure: bloodPressure || undefined,
            notes: notes || 'No notes',
        };
        const triage = assessTriage(newEntry, logs);
        setTriageResult(triage);
        setLogs([newEntry, ...logs]);
        setPainLevel(5);
        setTemperature('');
        setBloodPressure('');
        setNotes('');
        setTimeout(() => {
            document.querySelector('.symptom-log__triage')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    };

    const handleContinueMonitoring = () => {
        setTriageResult(null);
    };

    const handleGenerateReport = () => {
        const report = generateDoctorReport(logs, triageResult);
        downloadReport(report);
    };
    const handleContactCaregiver = () => {
        alert('Caregiver contact feature would be implemented here.\n\nPossible integrations:\n- SMS/Email notification\n- In-app messaging\n- Emergency contact list');
    };
    const generateDoctorReport = (logs: SymptomEntry[], triage: TriageResult | null): string => {
        const reportDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        let report = `PATIENT SYMPTOM REPORT\n`;
        report += `Generated: ${reportDate}\n`;
        report += `${'='.repeat(50)}\n\n`;
        if (triage) {
            report += `CURRENT TRIAGE STATUS\n`;
            report += `Status: ${triage.status.toUpperCase()}\n`;
            report += `Assessment: ${triage.message}\n`;
            report += `Reason: ${triage.reason}\n`;
            report += `Time: ${triage.timestamp}\n\n`;
        }
        report += `SYMPTOM HISTORY (Last 7 Days)\n`;
        report += `${'='.repeat(50)}\n\n`;
        const recentLogs = logs.slice(0, 7);
        recentLogs.forEach((log, index) => {
            report += `Entry ${index + 1}: ${log.date} at ${log.time}\n`;
            report += `  Pain Level: ${log.painLevel}/10\n`;
            report += `  Temperature: ${log.temperature}\n`;
            if (log.bloodPressure) {
                report += `  Blood Pressure: ${log.bloodPressure}\n`;
            }
            report += `  Notes: ${log.notes}\n\n`;
        });
        report += `TREND OBSERVATIONS\n`;
        report += `${'='.repeat(50)}\n`;
        const avgPain = recentLogs.reduce((sum, log) => sum + log.painLevel, 0) / recentLogs.length;
        report += `Average Pain Level: ${avgPain.toFixed(1)}/10\n`;
        const tempsWithValues = recentLogs.filter(log => {
            const temp = parseFloat(log.temperature.replace('°F', ''));
            return !isNaN(temp);
        });

        if (tempsWithValues.length > 0) {
            const avgTemp = tempsWithValues.reduce((sum, log) => {
                return sum + parseFloat(log.temperature.replace('°F', ''));
            }, 0) / tempsWithValues.length;
            report += `Average Temperature: ${avgTemp.toFixed(1)}°F\n`;
        }
        report += `\n${'='.repeat(50)}\n`;
        report += `End of Report\n`;
        return report;
    };
    const downloadReport = (content: string) => {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `symptom-report-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    const getPainColor = (level: number) => {
        if (level <= 3) return 'green';
        if (level <= 6) return 'yellow';
        return 'pink';
    };

    const getTriageColor = (status: string) => {
        if (status === 'normal') return 'green';
        if (status === 'monitor') return 'yellow';
        return 'pink';
    };

    return (
        <div className="symptom-log">
            <section className="symptom-log__section">
                <Card color="blue" padding="large">
                    <h2 className="symptom-log__title">➕ Log Symptom</h2>
                    <form onSubmit={handleSubmit} className="symptom-log__form">
                
                        <div className="symptom-log__form-group symptom-log__form-group--full">
                            <label className="symptom-log__label">
                                Pain Level: <span className="symptom-log__pain-value">{painLevel}/10</span>
                            </label>
                            <div className="symptom-log__slider-container">
                                <span className="symptom-log__slider-label">1</span>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={painLevel}
                                    onChange={(e) => setPainLevel(parseInt(e.target.value))}
                                    className="symptom-log__slider"
                                    style={{
                                        background: `linear-gradient(to right, 
                      var(--color-green) 0%, 
                      var(--color-yellow) 50%, 
                      var(--color-pink) 100%)`
                                    }}
                                />
                                <span className="symptom-log__slider-label">10</span>
                            </div>
                        </div>
                        <div className="symptom-log__form-group">
                            <label className="symptom-log__label">Temperature (°F)</label>
                            <input
                                type="text"
                                value={temperature}
                                onChange={(e) => setTemperature(e.target.value)}
                                className="symptom-log__input"
                                placeholder="e.g., 98.6"
                            />
                        </div>
                        <div className="symptom-log__form-group">
                            <label className="symptom-log__label">Blood Pressure (Optional)</label>
                            <input
                                type="text"
                                value={bloodPressure}
                                onChange={(e) => setBloodPressure(e.target.value)}
                                className="symptom-log__input"
                                placeholder="e.g., 120/80"
                            />
                        </div>
                        <div className="symptom-log__form-group symptom-log__form-group--full">
                            <label className="symptom-log__label">Notes</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="symptom-log__textarea"
                                placeholder="Describe your symptoms, how you're feeling..."
                                rows={4}
                            />
                        </div>

                        <Button variant="primary" type="submit">Save Entry</Button>
                    </form>
                </Card>
            </section>
            {triageResult && (
                <section className="symptom-log__section symptom-log__triage">
                    <Card color={getTriageColor(triageResult.status)} padding="large">
                        <div className="symptom-log__triage-content">
                            <div className="symptom-log__triage-header">
                                <h2 className="symptom-log__triage-title">{triageResult.message}</h2>
                                <Badge variant={getTriageColor(triageResult.status)} size="small">
                                    {triageResult.timestamp}
                                </Badge>
                            </div>
                            <p className="symptom-log__triage-reason">
                                <strong>Assessment:</strong> {triageResult.reason}
                            </p>

                            <div className="symptom-log__actions">
                                <h3 className="symptom-log__actions-title">Recommended Actions</h3>
                                <div className="symptom-log__actions-buttons">
                                    <Button
                                        variant="outlined"
                                        size="medium"
                                        onClick={handleContinueMonitoring}
                                    >
                                        Continue Monitoring
                                    </Button>
                                    <Button
                                        variant="primary"
                                        size="medium"
                                        onClick={handleGenerateReport}
                                    >
                                        Generate Doctor Report
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="medium"
                                        onClick={handleContactCaregiver}
                                    >
                                        📞 Contact Caregiver
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </section>
            )}

            <section className="symptom-log__section">
                <Card color="pink" padding="large">
                    <h2 className="symptom-log__title"> Symptom Trends</h2>
                    <div className="symptom-log__charts">
                        <div className="symptom-log__chart-container">
                            <h3 className="symptom-log__chart-title">Pain Trend</h3>
                            <div className="symptom-log__chart">
                                {logs.slice(0, 7).reverse().map((log) => (
                                    <div key={log.id} className="symptom-log__chart-bar-wrapper">
                                        <div
                                            className="symptom-log__chart-bar symptom-log__chart-bar--pain"
                                            style={{
                                                height: `${log.painLevel * 10}%`,
                                                backgroundColor: `var(--color-${getPainColor(log.painLevel)})`
                                            }}
                                        >
                                            <span className="symptom-log__chart-value">{log.painLevel}</span>
                                        </div>
                                        <span className="symptom-log__chart-label">
                                            {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="symptom-log__chart-container">
                            <h3 className="symptom-log__chart-title">Temperature Trend</h3>
                            <div className="symptom-log__chart">
                                {logs.slice(0, 7).reverse().map((log) => {
                                    const temp = parseFloat(log.temperature.replace('°F', '')) || 98.6;
                                    const normalizedHeight = ((temp - 97) / 4) * 100; 
                                    return (
                                        <div key={log.id} className="symptom-log__chart-bar-wrapper">
                                            <div
                                                className="symptom-log__chart-bar symptom-log__chart-bar--temp"
                                                style={{
                                                    height: `${Math.max(20, Math.min(normalizedHeight, 100))}%`,
                                                    backgroundColor: temp > 99 ? 'var(--color-pink)' : 'var(--color-blue)'
                                                }}
                                            >
                                                <span className="symptom-log__chart-value">{temp.toFixed(1)}</span>
                                            </div>
                                            <span className="symptom-log__chart-label">
                                                {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </Card>
            </section>
            <section className="symptom-log__section">
                <Card color="green" padding="large">
                    <h2 className="symptom-log__title">📝 Symptom History</h2>
                    <div className="symptom-log__logs-list">
                        {logs.slice(0, 6).map((log) => (
                            <div key={log.id} className="symptom-log__log-item">
                                <div className="symptom-log__log-header">
                                    <span className="symptom-log__log-date">{log.date} • {log.time}</span>
                                    <Badge variant={getPainColor(log.painLevel)}>
                                        Pain: {log.painLevel}/10
                                    </Badge>
                                </div>
                                <div className="symptom-log__log-details">
                                    <div className="symptom-log__log-stat">
                                        <span className="symptom-log__log-stat-label">Temperature:</span>
                                        <span className="symptom-log__log-stat-value">{log.temperature}</span>
                                    </div>
                                    {log.bloodPressure && (
                                        <div className="symptom-log__log-stat">
                                            <span className="symptom-log__log-stat-label">Blood Pressure:</span>
                                            <span className="symptom-log__log-stat-value">{log.bloodPressure}</span>
                                        </div>
                                    )}
                                    <div className="symptom-log__log-notes">
                                        <span className="symptom-log__log-stat-label">Notes:</span>
                                        <p className="symptom-log__log-notes-text">{log.notes}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </section>
        </div>
    );
};
