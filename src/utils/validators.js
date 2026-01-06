/**
 * Fonctions de validation pour les formulaires
 */

// Valider un email
export const validateEmail = (email) => {
    if (!email) {
        return 'L\'email est requis';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Email invalide';
    }

    return null;
};

// Valider un mot de passe
export const validatePassword = (password) => {
    if (!password) {
        return 'Le mot de passe est requis';
    }

    if (password.length < 6) {
        return 'Le mot de passe doit contenir au moins 6 caractères';
    }

    return null;
};

// Valider que deux mots de passe correspondent
export const validatePasswordMatch = (password, confirmPassword) => {
    if (password !== confirmPassword) {
        return 'Les mots de passe ne correspondent pas';
    }

    return null;
};

// Valider un nom
export const validateName = (name, fieldName = 'Ce champ') => {
    if (!name || name.trim().length === 0) {
        return `${fieldName} est requis`;
    }

    if (name.trim().length < 2) {
        return `${fieldName} doit contenir au moins 2 caractères`;
    }

    return null;
};

// Valider un nombre
export const validateNumber = (value, min, max, fieldName = 'Ce champ') => {
    const num = Number(value);

    if (isNaN(num)) {
        return `${fieldName} doit être un nombre`;
    }

    if (min !== undefined && num < min) {
        return `${fieldName} doit être supérieur ou égal à ${min}`;
    }

    if (max !== undefined && num > max) {
        return `${fieldName} doit être inférieur ou égal à ${max}`;
    }

    return null;
};

// Valider une date
export const validateDate = (date, fieldName = 'La date') => {
    if (!date) {
        return `${fieldName} est requise`;
    }

    const d = new Date(date);
    if (isNaN(d.getTime())) {
        return `${fieldName} est invalide`;
    }

    return null;
};

// Valider qu'une date est dans le futur
export const validateFutureDate = (date, fieldName = 'La date') => {
    const error = validateDate(date, fieldName);
    if (error) return error;

    if (new Date(date) <= new Date()) {
        return `${fieldName} doit être dans le futur`;
    }

    return null;
};

// Valider une période (date de début < date de fin)
export const validateDateRange = (startDate, endDate) => {
    const startError = validateDate(startDate, 'La date de début');
    if (startError) return startError;

    const endError = validateDate(endDate, 'La date de fin');
    if (endError) return endError;

    if (new Date(startDate) >= new Date(endDate)) {
        return 'La date de fin doit être après la date de début';
    }

    return null;
};

// Valider la capacité d'une salle
export const validateCapacity = (capacity) => {
    return validateNumber(capacity, 1, 1000, 'La capacité');
};

// Valider un objet de salle
export const validateRoom = (room) => {
    const errors = {};

    const nameError = validateName(room.name, 'Le nom de la salle');
    if (nameError) errors.name = nameError;

    const capacityError = validateCapacity(room.capacity);
    if (capacityError) errors.capacity = capacityError;

    return Object.keys(errors).length > 0 ? errors : null;
};

// Valider un objet de réservation
export const validateReservation = (reservation) => {
    const errors = {};

    if (!reservation.room_id) {
        errors.room_id = 'La salle est requise';
    }

    const dateRangeError = validateDateRange(reservation.start_time, reservation.end_time);
    if (dateRangeError) {
        errors.dateRange = dateRangeError;
    }

    const futureError = validateFutureDate(reservation.start_time, 'La date de début');
    if (futureError) {
        errors.start_time = futureError;
    }

    return Object.keys(errors).length > 0 ? errors : null;
};
