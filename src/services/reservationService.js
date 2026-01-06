import localStorageService from './localStorageService';

/**
 * Service de gestion des réservations (version locale)
 */

// Créer une nouvelle réservation
export const createReservation = async (reservationData) => {
    try {
        const reservation = {
            id: localStorageService.generateId(),
            ...reservationData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        // Récupérer les informations de la salle
        const room = await localStorageService.getRoomById(reservationData.room_id);

        await localStorageService.addReservation(reservation);

        // Retourner la réservation avec les données de la salle
        return {
            reservation: {
                ...reservation,
                rooms: room,
            },
            error: null,
        };
    } catch (error) {
        console.error('Create reservation error:', error);
        return { reservation: null, error: 'Une erreur est survenue' };
    }
};

// Récupérer les réservations de l'utilisateur connecté
export const getUserReservations = async (userId) => {
    try {
        const reservations = await localStorageService.getUserReservations(userId);
        const rooms = await localStorageService.getRooms();

        // Enrichir avec les données des salles
        const enrichedReservations = reservations.map(reservation => ({
            ...reservation,
            rooms: rooms.find(r => r.id === reservation.room_id) || null,
        }));

        // Trier par date (plus récent en premier)
        enrichedReservations.sort((a, b) =>
            new Date(b.start_time) - new Date(a.start_time)
        );

        return { reservations: enrichedReservations, error: null };
    } catch (error) {
        console.error('Get user reservations error:', error);
        return { reservations: [], error: 'Une erreur est survenue' };
    }
};

// Récupérer toutes les réservations d'une salle
export const getRoomReservations = async (roomId) => {
    try {
        const reservations = await localStorageService.getRoomReservations(roomId);

        // Trier par date de début
        reservations.sort((a, b) =>
            new Date(a.start_time) - new Date(b.start_time)
        );

        return { reservations, error: null };
    } catch (error) {
        console.error('Get room reservations error:', error);
        return { reservations: [], error: 'Une erreur est survenue' };
    }
};

// Récupérer une réservation par ID
export const getReservationById = async (reservationId) => {
    try {
        const reservations = await localStorageService.getReservations();
        const reservation = reservations.find(r => r.id === reservationId);

        if (!reservation) {
            return { reservation: null, error: 'Réservation non trouvée' };
        }

        const room = await localStorageService.getRoomById(reservation.room_id);

        return {
            reservation: {
                ...reservation,
                rooms: room,
            },
            error: null,
        };
    } catch (error) {
        console.error('Get reservation by id error:', error);
        return { reservation: null, error: 'Une erreur est survenue' };
    }
};

// Mettre à jour une réservation
export const updateReservation = async (reservationId, updates) => {
    try {
        await localStorageService.updateReservation(reservationId, {
            ...updates,
            updated_at: new Date().toISOString(),
        });

        return await getReservationById(reservationId);
    } catch (error) {
        console.error('Update reservation error:', error);
        return { reservation: null, error: 'Une erreur est survenue' };
    }
};

// Annuler une réservation
export const cancelReservation = async (reservationId) => {
    try {
        await localStorageService.updateReservation(reservationId, {
            status: 'cancelled',
            updated_at: new Date().toISOString(),
        });

        const reservations = await localStorageService.getReservations();
        const reservation = reservations.find(r => r.id === reservationId);

        return { reservation, error: null };
    } catch (error) {
        console.error('Cancel reservation error:', error);
        return { reservation: null, error: 'Une erreur est survenue' };
    }
};

// Supprimer une réservation
export const deleteReservation = async (reservationId) => {
    try {
        await localStorageService.deleteReservation(reservationId);
        return { error: null };
    } catch (error) {
        console.error('Delete reservation error:', error);
        return { error: 'Une erreur est survenue' };
    }
};

// Vérifier si une salle est disponible pour une période donnée
export const checkRoomAvailability = async (roomId, startTime, endTime, excludeReservationId = null) => {
    try {
        const reservations = await localStorageService.getRoomReservations(roomId);

        const start = new Date(startTime);
        const end = new Date(endTime);

        // Vérifier les conflits
        const conflicts = reservations.filter(reservation => {
            // Exclure la réservation en cours de modification
            if (excludeReservationId && reservation.id === excludeReservationId) {
                return false;
            }

            const resStart = new Date(reservation.start_time);
            const resEnd = new Date(reservation.end_time);

            // Vérifier le chevauchement
            return (
                (start >= resStart && start < resEnd) || // Début dans une réservation
                (end > resStart && end <= resEnd) || // Fin dans une réservation
                (start <= resStart && end >= resEnd) // Englobe une réservation
            );
        });

        return {
            isAvailable: conflicts.length === 0,
            conflicts,
            error: null,
        };
    } catch (error) {
        console.error('Check room availability error:', error);
        return {
            isAvailable: false,
            conflicts: [],
            error: 'Une erreur est survenue',
        };
    }
};

// Récupérer les réservations actives (non annulées)
export const getActiveReservations = async () => {
    try {
        const reservations = await localStorageService.getReservations();
        const rooms = await localStorageService.getRooms();
        const now = new Date();

        const activeReservations = reservations
            .filter(r => r.status !== 'cancelled' && new Date(r.end_time) >= now)
            .map(reservation => ({
                ...reservation,
                rooms: rooms.find(room => room.id === reservation.room_id),
            }))
            .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

        return { reservations: activeReservations, error: null };
    } catch (error) {
        console.error('Get active reservations error:', error);
        return { reservations: [], error: 'Une erreur est survenue' };
    }
};

// Récupérer les réservations pour une date spécifique
export const getReservationsByDate = async (date) => {
    try {
        const reservations = await localStorageService.getReservations();
        const rooms = await localStorageService.getRooms();

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const dayReservations = reservations
            .filter(r => {
                const startTime = new Date(r.start_time);
                return (
                    r.status !== 'cancelled' &&
                    startTime >= startOfDay &&
                    startTime <= endOfDay
                );
            })
            .map(reservation => ({
                ...reservation,
                rooms: rooms.find(room => room.id === reservation.room_id),
            }))
            .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

        return { reservations: dayReservations, error: null };
    } catch (error) {
        console.error('Get reservations by date error:', error);
        return { reservations: [], error: 'Une erreur est survenue' };
    }
};
