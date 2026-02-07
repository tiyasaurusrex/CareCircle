export interface SymptomEntry {
    id: string;
    date: string;
    time: string;
    painLevel: number;
    temperature: string;
    bloodPressure?: string;
    notes: string;
}

const initialSymptomLogs: SymptomEntry[] = [
    { id: '1', date: '2026-02-02', time: '08:00 AM', painLevel: 4, temperature: '98.6°F', bloodPressure: '118/76', notes: 'Mild discomfort after morning routine' },
    { id: '2', date: '2026-02-02', time: '02:00 PM', painLevel: 3, temperature: '98.4°F', bloodPressure: '120/78', notes: 'Feeling better, appetite improved' },
    { id: '3', date: '2026-02-01', time: '08:00 PM', painLevel: 5, temperature: '99.1°F', bloodPressure: '125/82', notes: 'Slight fever, took medication' },
    { id: '4', date: '2026-02-01', time: '12:00 PM', painLevel: 6, temperature: '99.3°F', notes: 'Increased pain around surgical site' },
];

export const getSymptomLogs = (): SymptomEntry[] => {
    return [...initialSymptomLogs];
};
