import localStorageService from './localStorageService';

/**
 * Service d'authentification local (sans backend)
 */

// Inscription d'un nouvel utilisateur
export const signUp = async (email, password, fullName) => {
    try {
        // Vérifier si l'email existe déjà
        const existingUser = await localStorageService.findUserByEmail(email);
        if (existingUser) {
            return { user: null, error: 'Cet email est déjà utilisé' };
        }

        // Créer le nouvel utilisateur avec mot de passe
        const user = {
            id: localStorageService.generateId(),
            email,
            password: password, // Stocker le mot de passe (en production, il faudrait le hasher)
            full_name: fullName,
            role: 'user',
            created_at: new Date().toISOString(),
        };

        // Sauvegarder l'utilisateur
        await localStorageService.saveUser(user);

        // Ne pas connecter l'utilisateur automatiquement
        // L'utilisateur devra se connecter manuellement

        return { user, error: null };
    } catch (error) {
        console.error('Sign up error:', error);
        return { user: null, error: 'Une erreur est survenue lors de l\'inscription' };
    }
};

// Connexion d'un utilisateur
export const signIn = async (email, password) => {
    try {
        const user = await localStorageService.findUserByEmail(email);

        if (!user) {
            return { user: null, error: 'Email ou mot de passe incorrect' };
        }

        // Vérifier le mot de passe
        if (user.password !== password) {
            return { user: null, error: 'Email ou mot de passe incorrect' };
        }

        await localStorageService.setCurrentUser(user);

        return { user, session: { user }, error: null };
    } catch (error) {
        console.error('Sign in error:', error);
        return { user: null, session: null, error: 'Une erreur est survenue lors de la connexion' };
    }
};

// Déconnexion
export const signOut = async () => {
    try {
        await localStorageService.clearCurrentUser();
        return { error: null };
    } catch (error) {
        console.error('Sign out error:', error);
        return { error: 'Une erreur est survenue lors de la déconnexion' };
    }
};

// Récupérer l'utilisateur actuel
export const getCurrentUser = async () => {
    try {
        const user = await localStorageService.getCurrentUser();
        return { user, error: null };
    } catch (error) {
        console.error('Get current user error:', error);
        return { user: null, error: 'Une erreur est survenue' };
    }
};

// Récupérer le profil de l'utilisateur
export const getUserProfile = async (userId) => {
    try {
        const user = await localStorageService.getCurrentUser();
        if (user && user.id === userId) {
            return {
                profile: {
                    id: user.id,
                    full_name: user.full_name,
                    role: user.role,
                },
                error: null,
            };
        }
        return { profile: null, error: 'Utilisateur non trouvé' };
    } catch (error) {
        console.error('Get user profile error:', error);
        return { profile: null, error: 'Une erreur est survenue' };
    }
};

// Mettre à jour le profil de l'utilisateur
export const updateUserProfile = async (userId, updates) => {
    try {
        const user = await localStorageService.getCurrentUser();
        if (user && user.id === userId) {
            const updatedUser = { ...user, ...updates };
            await localStorageService.setCurrentUser(updatedUser);

            return {
                profile: {
                    id: updatedUser.id,
                    full_name: updatedUser.full_name,
                    role: updatedUser.role,
                },
                error: null,
            };
        }
        return { profile: null, error: 'Utilisateur non trouvé' };
    } catch (error) {
        console.error('Update user profile error:', error);
        return { profile: null, error: 'Une erreur est survenue' };
    }
};

// Pour la compatibilité - pas besoin de listener en mode local
export const onAuthStateChange = (callback) => {
    return { data: { subscription: { unsubscribe: () => { } } } };
};
