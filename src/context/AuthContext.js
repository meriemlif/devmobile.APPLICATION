import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, getUserProfile } from '../services/authService';
import localStorageService from '../services/localStorageService';

// Créer le contexte d'authentification
const AuthContext = createContext({});

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
    }
    return context;
};

// Provider d'authentification
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Charger l'utilisateur et initialiser les données de démo au démarrage
    useEffect(() => {
        loadUserAndInitialize();
    }, []);

    // Charger l'utilisateur actuel et initialiser les données
    const loadUserAndInitialize = async () => {
        try {
            // Initialiser les données de démonstration
            await localStorageService.initializeWithDemoData();

            // Charger l'utilisateur actuel
            const { user: currentUser } = await getCurrentUser();

            if (currentUser) {
                setUser(currentUser);

                // Charger le profil
                const { profile: userProfile } = await getUserProfile(currentUser.id);
                setProfile(userProfile);
            }
        } catch (error) {
            console.error('Erreur lors du chargement de l\'utilisateur:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fonction d'inscription
    const signUp = async (email, password, fullName) => {
        const { signUp } = await import('../services/authService');
        const result = await signUp(email, password, fullName);

        // Ne pas mettre à jour l'état utilisateur après l'inscription
        // L'utilisateur devra se connecter manuellement pour mettre à jour l'état

        return result;
    };

    // Fonction de connexion
    const signIn = async (email, password) => {
        const { signIn } = await import('../services/authService');
        const result = await signIn(email, password);

        if (result.user) {
            setUser(result.user);
            setProfile({
                id: result.user.id,
                full_name: result.user.full_name,
                role: result.user.role,
            });
        }

        return result;
    };

    // Déconnexion
    const signOut = async () => {
        const { signOut } = await import('../services/authService');
        const { error } = await signOut();

        if (!error) {
            setUser(null);
            setProfile(null);
        }

        return { error };
    };

    // Rafraîchir le profil
    const refreshProfile = async () => {
        if (user) {
            const { profile: updatedProfile } = await getUserProfile(user.id);
            setProfile(updatedProfile);
        }
    };

    const value = {
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        refreshProfile,
        isAuthenticated: !!user,
        isAdmin: profile?.role === 'admin',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
