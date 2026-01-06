// Configuration constants
export const CONFIG = {
    APP_NAME: 'Réservation Salles',
    DEFAULT_LANGUAGE: 'fr',
    DATE_FORMAT: 'DD/MM/YYYY',
    TIME_FORMAT: 'HH:mm',
    DATETIME_FORMAT: 'DD/MM/YYYY HH:mm',
};

// API Configuration (si besoin d'endpoints supplémentaires)
export const API_CONFIG = {
    TIMEOUT: 30000, // 30 seconds
    MAX_RETRIES: 3,
};

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 50,
};

// Time slots for reservations (example)
export const TIME_SLOTS = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00',
];

// Reservation durations (in minutes)
export const RESERVATION_DURATIONS = [
    { label: '30 min', value: 30 },
    { label: '1 heure', value: 60 },
    { label: '1h 30', value: 90 },
    { label: '2 heures', value: 120 },
    { label: '3 heures', value: 180 },
    { label: '4 heures', value: 240 },
    { label: 'Journée complète', value: 480 },
];

// Status configurations
export const RESERVATION_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
};

export const RESERVATION_STATUS_LABELS = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    cancelled: 'Annulée',
};

export const RESERVATION_STATUS_COLORS = {
    pending: '#F59E0B',
    confirmed: '#10B981',
    cancelled: '#EF4444',
};
