export interface Medicine {
    id: string;
    name: string;
    dosage: string;
    schedule: string;
    status: 'taken' | 'missed' | 'pending';
}

const initialMedicines: Medicine[] = [];

export const getMedicines = (): Medicine[] => {
    return [...initialMedicines];
};
