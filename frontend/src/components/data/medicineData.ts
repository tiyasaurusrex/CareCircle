export interface Medicine {
    id: string;
    name: string;
    dosage: string;
    schedule: string;
    status: 'taken' | 'missed' | 'pending';
}

const initialMedicines: Medicine[] = [
    { id: '1', name: 'Aspirin', dosage: '100mg', schedule: '08:00 AM', status: 'taken' },
    { id: '2', name: 'Metformin', dosage: '500mg', schedule: '09:00 AM', status: 'taken' },
    { id: '3', name: 'Lisinopril', dosage: '10mg', schedule: '02:00 PM', status: 'pending' },
    { id: '4', name: 'Vitamin D3', dosage: '1000 IU', schedule: '08:00 PM', status: 'pending' },
];

export const getMedicines = (): Medicine[] => {
    return [...initialMedicines];
};
