/**
 * Utilitaires pour la manipulation des dates et heures
 */

// Formater une date au format français DD/MM/YYYY
export const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

// Formater une heure au format HH:mm
export const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

// Formater une date et heure complète
export const formatDateTime = (date) => {
    if (!date) return '';
    return `${formatDate(date)} ${formatTime(date)}`;
};

// Vérifier si une date est aujourd'hui
export const isToday = (date) => {
    const today = new Date();
    const d = new Date(date);
    return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
    );
};

// Vérifier si une date est dans le futur
export const isFuture = (date) => {
    return new Date(date) > new Date();
};

// Vérifier si une date est dans le passé
export const isPast = (date) => {
    return new Date(date) < new Date();
};

// Obtenir le début de la journée
export const getStartOfDay = (date = new Date()) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

// Obtenir la fin de la journée
export const getEndOfDay = (date = new Date()) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
};

// Ajouter des minutes à une date
export const addMinutes = (date, minutes) => {
    return new Date(date.getTime() + minutes * 60000);
};

// Ajouter des heures à une date
export const addHours = (date, hours) => {
    return new Date(date.getTime() + hours * 3600000);
};

// Ajouter des jours à une date
export const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

// Calculer la durée entre deux dates en minutes
export const getDurationInMinutes = (startDate, endDate) => {
    const diff = new Date(endDate) - new Date(startDate);
    return Math.floor(diff / 60000);
};

// Calculer la durée entre deux dates en heures
export const getDurationInHours = (startDate, endDate) => {
    return getDurationInMinutes(startDate, endDate) / 60;
};

// Formater une durée en heures et minutes
export const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) {
        return `${mins} min`;
    } else if (mins === 0) {
        return `${hours}h`;
    } else {
        return `${hours}h ${mins}min`;
    }
};

// Obtenir le nom du jour de la semaine
export const getDayName = (date, short = false) => {
    const days = short
        ? ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
        : ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return days[new Date(date).getDay()];
};

// Obtenir le nom du mois
export const getMonthName = (date, short = false) => {
    const months = short
        ? ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
        : ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return months[new Date(date).getMonth()];
};

// Formater une date de manière relative (aujourd'hui, demain, etc.)
export const getRelativeDate = (date) => {
    const d = new Date(date);
    const today = new Date();
    const tomorrow = addDays(today, 1);
    const yesterday = addDays(today, -1);

    if (isToday(d)) return 'Aujourd\'hui';
    if (
        d.getDate() === tomorrow.getDate() &&
        d.getMonth() === tomorrow.getMonth() &&
        d.getFullYear() === tomorrow.getFullYear()
    ) {
        return 'Demain';
    }
    if (
        d.getDate() === yesterday.getDate() &&
        d.getMonth() === yesterday.getMonth() &&
        d.getFullYear() === yesterday.getFullYear()
    ) {
        return 'Hier';
    }

    return formatDate(d);
};

// Convertir une chaîne de temps (HH:mm) en objet Date pour aujourd'hui
export const timeStringToDate = (timeString, baseDate = new Date()) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date(baseDate);
    date.setHours(hours, minutes, 0, 0);
    return date;
};

// Vérifier si deux périodes se chevauchent
export const doPeriodsOverlap = (start1, end1, start2, end2) => {
    const s1 = new Date(start1);
    const e1 = new Date(end1);
    const s2 = new Date(start2);
    const e2 = new Date(end2);

    return (s1 < e2 && e1 > s2);
};
