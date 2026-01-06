import localStorageService from './localStorageService';

/**
 * Service de gestion des salles (version locale)
 */

// Récupérer toutes les salles
export const getAllRooms = async () => {
    try {
        const rooms = await localStorageService.getRooms();
        return { rooms: rooms || [], error: null };
    } catch (error) {
        console.error('Get all rooms error:', error);
        return { rooms: [], error: 'Une erreur est survenue' };
    }
};

// Récupérer les salles disponibles
export const getAvailableRooms = async () => {
    try {
        const rooms = await localStorageService.getRooms();
        const availableRooms = rooms.filter(r => r.available);
        return { rooms: availableRooms, error: null };
    } catch (error) {
        console.error('Get available rooms error:', error);
        return { rooms: [], error: 'Une erreur est survenue' };
    }
};

// Récupérer une salle par ID
export const getRoomById = async (roomId) => {
    try {
        const room = await localStorageService.getRoomById(roomId);
        if (!room) {
            return { room: null, error: 'Salle non trouvée' };
        }
        return { room, error: null };
    } catch (error) {
        console.error('Get room by id error:', error);
        return { room: null, error: 'Une erreur est survenue' };
    }
};

// Créer une nouvelle salle (admin uniquement)
export const createRoom = async (roomData) => {
    try {
        const rooms = await localStorageService.getRooms();
        const newRoom = {
            id: localStorageService.generateId(),
            ...roomData,
            available: true,
            created_at: new Date().toISOString(),
        };

        rooms.push(newRoom);
        await localStorageService.saveRooms(rooms);

        return { room: newRoom, error: null };
    } catch (error) {
        console.error('Create room error:', error);
        return { room: null, error: 'Une erreur est survenue' };
    }
};

// Mettre à jour une salle (admin uniquement)
export const updateRoom = async (roomId, updates) => {
    try {
        const rooms = await localStorageService.getRooms();
        const index = rooms.findIndex(r => r.id === roomId);

        if (index === -1) {
            return { room: null, error: 'Salle non trouvée' };
        }

        rooms[index] = { ...rooms[index], ...updates };
        await localStorageService.saveRooms(rooms);

        return { room: rooms[index], error: null };
    } catch (error) {
        console.error('Update room error:', error);
        return { room: null, error: 'Une erreur est survenue' };
    }
};

// Supprimer une salle (admin uniquement)
export const deleteRoom = async (roomId) => {
    try {
        const rooms = await localStorageService.getRooms();
        const filtered = rooms.filter(r => r.id !== roomId);
        await localStorageService.saveRooms(filtered);

        return { error: null };
    } catch (error) {
        console.error('Delete room error:', error);
        return { error: 'Une erreur est survenue' };
    }
};

// Rechercher des salles par capacité minimale
export const searchRoomsByCapacity = async (minCapacity) => {
    try {
        const rooms = await localStorageService.getRooms();
        const filtered = rooms.filter(r => r.capacity >= minCapacity && r.available);
        return { rooms: filtered, error: null };
    } catch (error) {
        console.error('Search rooms by capacity error:', error);
        return { rooms: [], error: 'Une erreur est survenue' };
    }
};

// Rechercher des salles par équipement
export const searchRoomsByEquipment = async (equipment) => {
    try {
        const rooms = await localStorageService.getRooms();
        const filtered = rooms.filter(r =>
            r.available && r.equipment && r.equipment.includes(equipment)
        );
        return { rooms: filtered, error: null };
    } catch (error) {
        console.error('Search rooms by equipment error:', error);
        return { rooms: [], error: 'Une erreur est survenue' };
    }
};
