import AsyncStorage from '@react-native-async-storage/async-storage';

// Clés de stockage
const STORAGE_KEYS = {
    USERS: '@reservation_users',
    CURRENT_USER: '@reservation_current_user',
    ROOMS: '@reservation_rooms',
    RESERVATIONS: '@reservation_reservations',
};

// Service de stockage local
class LocalStorageService {
    // ==================== UTILITAIRES ====================

    async getData(key) {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (error) {
            console.error('Error getting data:', error);
            return null;
        }
    }

    async setData(key, value) {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
            return true;
        } catch (error) {
            console.error('Error setting data:', error);
            return false;
        }
    }

    async removeData(key) {
        try {
            await AsyncStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing data:', error);
            return false;
        }
    }

    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // ==================== UTILISATEURS ====================

    async getUsers() {
        return (await this.getData(STORAGE_KEYS.USERS)) || [];
    }

    async saveUser(user) {
        const users = await this.getUsers();
        users.push(user);
        return await this.setData(STORAGE_KEYS.USERS, users);
    }

    async findUserByEmail(email) {
        const users = await this.getUsers();
        return users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    async getCurrentUser() {
        return await this.getData(STORAGE_KEYS.CURRENT_USER);
    }

    async setCurrentUser(user) {
        return await this.setData(STORAGE_KEYS.CURRENT_USER, user);
    }

    async clearCurrentUser() {
        return await this.removeData(STORAGE_KEYS.CURRENT_USER);
    }

    // ==================== SALLES ====================

    async getRooms() {
        return (await this.getData(STORAGE_KEYS.ROOMS)) || [];
    }

    async saveRooms(rooms) {
        return await this.setData(STORAGE_KEYS.ROOMS, rooms);
    }

    async getRoomById(id) {
        const rooms = await this.getRooms();
        return rooms.find(r => r.id === id);
    }

    // ==================== RÉSERVATIONS ====================

    async getReservations() {
        return (await this.getData(STORAGE_KEYS.RESERVATIONS)) || [];
    }

    async saveReservations(reservations) {
        return await this.setData(STORAGE_KEYS.RESERVATIONS, reservations);
    }

    async addReservation(reservation) {
        const reservations = await this.getReservations();
        reservations.push(reservation);
        return await this.saveReservations(reservations);
    }

    async updateReservation(id, updates) {
        const reservations = await this.getReservations();
        const index = reservations.findIndex(r => r.id === id);
        if (index !== -1) {
            reservations[index] = { ...reservations[index], ...updates };
            return await this.saveReservations(reservations);
        }
        return false;
    }

    async deleteReservation(id) {
        const reservations = await this.getReservations();
        const filtered = reservations.filter(r => r.id !== id);
        return await this.saveReservations(filtered);
    }

    async getUserReservations(userId) {
        const reservations = await this.getReservations();
        return reservations.filter(r => r.user_id === userId);
    }

    async getRoomReservations(roomId) {
        const reservations = await this.getReservations();
        return reservations.filter(r => r.room_id === roomId && r.status !== 'cancelled');
    }

    // ==================== INITIALISATION ====================

    async initializeWithDemoData() {
        // Créer un compte admin par défaut (toujours vérifier)
        const adminUser = {
            id: 'admin-001',
            email: 'admin@admin.com',
            password: 'admin123', // Mot de passe par défaut pour l'admin
            full_name: 'Administrateur',
            role: 'admin',
            created_at: new Date().toISOString(),
        };

        const users = await this.getUsers();
        const adminIndex = users.findIndex(u => u.email === 'admin@admin.com');

        if (adminIndex === -1) {
            // Admin n'existe pas, le créer
            await this.saveUser(adminUser);
            console.log('Admin account created: admin@admin.com (password: admin123)');
        } else if (!users[adminIndex].password) {
            // Admin existe mais sans mot de passe, le mettre à jour
            users[adminIndex] = { ...users[adminIndex], password: 'admin123' };
            await this.setData(STORAGE_KEYS.USERS, users);
            console.log('Admin account updated with password: admin@admin.com (password: admin123)');
        }

        // Vérifier si les données de salles existent déjà
        const existingRooms = await this.getRooms();
        if (existingRooms && existingRooms.length > 0) {
            console.log('Demo data already exists');
            return;
        }

        // Données de démonstration pour les salles
        const demoRooms = [
            {
                id: 'room-1',
                name: 'Salle Alpha',
                description: 'Grande salle de formation équipée pour 30 personnes. Idéale pour les séminaires et formations',
                capacity: 30,
                equipment: ['Projecteur', 'Tableau blanc', 'WiFi', 'Climatisation', 'Système audio'],
                image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
                available: true,
                created_at: new Date().toISOString(),
            },
            {
                id: 'room-2',
                name: 'Salle Beta',
                description: 'Salle de taille moyenne, parfaite pour les réunions et ateliers en petit groupe',
                capacity: 15,
                equipment: ['Écran TV', 'Tableau blanc', 'WiFi', 'Vidéoprojecteur'],
                image_url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
                available: true,
                created_at: new Date().toISOString(),
            },
            {
                id: 'room-3',
                name: 'Salle Gamma',
                description: 'Petite salle de réunion confortable pour des sessions intimes',
                capacity: 8,
                equipment: ['Table de conférence', 'WiFi', 'Écran tactile', 'Climatisation'],
                image_url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800',
                available: true,
                created_at: new Date().toISOString(),
            },
            {
                id: 'room-4',
                name: 'Salle Delta',
                description: 'Salle informatique avec postes de travail pour formations techniques',
                capacity: 20,
                equipment: ['20 ordinateurs', 'Projecteur', 'WiFi haut débit', 'Logiciels professionnels'],
                image_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
                available: true,
                created_at: new Date().toISOString(),
            },
            {
                id: 'room-5',
                name: 'Salle Omega',
                description: 'Auditorium pour grandes conférences et événements',
                capacity: 100,
                equipment: ['Scène', 'Système audio professionnel', 'Éclairage', 'Projecteur HD', 'Micros'],
                image_url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
                available: true,
                created_at: new Date().toISOString(),
            },
        ];

        await this.saveRooms(demoRooms);
        console.log('Demo data initialized successfully');
    }

    // Réinitialiser toutes les données
    async clearAllData() {
        await this.removeData(STORAGE_KEYS.USERS);
        await this.removeData(STORAGE_KEYS.CURRENT_USER);
        await this.removeData(STORAGE_KEYS.ROOMS);
        await this.removeData(STORAGE_KEYS.RESERVATIONS);
    }
}

export default new LocalStorageService();
