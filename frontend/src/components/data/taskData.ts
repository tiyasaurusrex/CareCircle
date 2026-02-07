export interface Task {
    id: string;
    title: string;
    category: 'vitals' | 'exercise' | 'diet' | 'hygiene' | 'medication';
    dueDate: string;
    dueTime: string;
    repeat: 'none' | 'daily' | 'weekly';
    notes: string;
    status: 'pending' | 'completed' | 'overdue';
    completedAt?: string;
}

export const categoryIcons: Record<string, string> = {
    vitals: '🩺',
    exercise: '🏃',
    diet: '🥗',
    hygiene: '🧼',
    medication: '💊'
};

export const initialTasks: Task[] = [
    { id: '1', title: 'Morning BP Check', category: 'vitals', dueDate: '2026-02-03', dueTime: '08:00', repeat: 'daily', notes: 'Check before breakfast', status: 'completed', completedAt: '07:45 AM' },
    { id: '2', title: 'Physiotherapy Session', category: 'exercise', dueDate: '2026-02-03', dueTime: '10:00', repeat: 'daily', notes: 'Leg stretches and walking', status: 'pending' },
    { id: '3', title: 'Wound Dressing Change', category: 'hygiene', dueDate: '2026-02-03', dueTime: '09:00', repeat: 'daily', notes: 'Use sterile gauze', status: 'overdue' },
    { id: '4', title: 'Blood Sugar Check', category: 'vitals', dueDate: '2026-02-03', dueTime: '14:00', repeat: 'daily', notes: 'After lunch', status: 'pending' },
    { id: '5', title: 'Evening Walk', category: 'exercise', dueDate: '2026-02-03', dueTime: '17:00', repeat: 'daily', notes: '15 minutes in garden', status: 'pending' },
    { id: '6', title: 'Diet Compliance Check', category: 'diet', dueDate: '2026-02-03', dueTime: '20:00', repeat: 'daily', notes: 'Log food intake', status: 'pending' },
];

export const getTasks = (): Task[] => {
    return [...initialTasks];
};
