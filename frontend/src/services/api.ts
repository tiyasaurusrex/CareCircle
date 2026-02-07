const API_BASE = '/api';

let authToken: string | null = null;

export const setToken = (token: string | null) => {
    authToken = token;
};

export const getToken = (): string | null => authToken;

async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    const json = await res.json();

    if (!res.ok || json.success === false) {
        throw new Error(json.message || 'Request failed');
    }

    return json.data as T;
}
export interface AuthResponse {
    token: string;
}

export interface RegisterResponse {
    email: string;
    password: string;
}

export const authApi = {
    register: (email: string, password: string) =>
        request<RegisterResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    login: (email: string, password: string) =>
        request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),
};
export interface PatientData {
    _id: string;
    name: string;
    age: number;
    gender: string;
    condition: string;
    createdAt: string;
}

export const patientApi = {
    create: (data: { name: string; age: number; gender: string; condition: string }) =>
        request<PatientData>('/patients', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    getById: (patientId: string) =>
        request<PatientData>(`/patients/${patientId}`),

    getAll: () =>
        request<PatientData[]>('/patients'),
};
export interface MedicineData {
    _id: string;
    patient: string;
    name: string;
    dosage: string;
    schedule: string[];
    startDate: string;
    endDate: string;
}

export const medicineApi = {
    add: (data: {
        patientId: string;
        name: string;
        dosage: string;
        schedule: string[];
        startDate: string;
        endDate: string;
    }) =>
        request<MedicineData>('/medicines', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    getByPatient: (patientId: string) =>
        request<MedicineData[]>(`/medicines/${patientId}`),
};

export interface SymptomData {
    _id: string;
    patient: string;
    painLevel: number;
    temperature: number;
    notes: string;
    createdAt: string;
}

export const symptomApi = {
    log: (data: {
        patientId: string;
        painLevel: number;
        temperature: number;
        notes: string;
    }) =>
        request<SymptomData>('/symptoms', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    getByPatient: (patientId: string) =>
        request<SymptomData[]>(`/symptoms/${patientId}`),
};

export interface TriageData {
    severity: string;
    advice: string;
    referralRequired: boolean;
}

export const triageApi = {
    run: (data: { painLevel: number; temperature: number }) =>
        request<TriageData>('/triage', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
};

export interface ReferralData {
    level: string;
    advice: string;
}

export const referralApi = {
    getAdvice: (severity: string) =>
        request<ReferralData>('/referral', {
            method: 'POST',
            body: JSON.stringify({ severity }),
        }),
};

export interface ReminderData {
    _id: string;
    patient: string;
    medicine: string;
    reminderTimes: string[];
    frequency: string;
    active: boolean;
}

export const reminderApi = {
    create: (data: { patientId: string; medicineId: string }) =>
        request<ReminderData>('/reminders', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    getByPatient: (patientId: string) =>
        request<ReminderData[]>(`/reminders/${patientId}`),
};
