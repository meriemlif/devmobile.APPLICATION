import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants/colors';

const ProfileScreen = () => {
    const { user, profile, signOut } = useAuth();

    const handleSignOut = () => {
        Alert.alert(
            'Déconnexion',
            'Êtes-vous sûr de vouloir vous déconnecter ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Se déconnecter',
                    style: 'destructive',
                    onPress: async () => {
                        const { error } = await signOut();
                        if (error) {
                            Alert.alert('Erreur', error);
                        }
                    },
                },
            ]
        );
    };

    const ProfileItem = ({ icon, label, value }) => (
        <View style={styles.profileItem}>
            <View style={styles.profileItemLeft}>
                <Ionicons name={icon} size={20} color={COLORS.primary} />
                <Text style={styles.profileItemLabel}>{label}</Text>
            </View>
            <Text style={styles.profileItemValue}>{value || '---'}</Text>
        </View>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* En-tête du profil */}
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Ionicons name="person" size={48} color={COLORS.textInverse} />
                </View>
                <Text style={styles.name}>{profile?.full_name || 'Utilisateur'}</Text>
                <Text style={styles.email}>{user?.email}</Text>
                {profile?.role === 'admin' && (
                    <View style={styles.adminBadge}>
                        <Ionicons name="shield-checkmark" size={14} color={COLORS.textInverse} />
                        <Text style={styles.adminText}>Administrateur</Text>
                    </View>
                )}
            </View>

            {/* Informations du profil */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Informations</Text>
                <View style={styles.card}>
                    <ProfileItem icon="person-outline" label="Nom" value={profile?.full_name} />
                    <ProfileItem icon="mail-outline" label="Email" value={user?.email} />
                    <ProfileItem
                        icon="shield-outline"
                        label="Rôle"
                        value={profile?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                    />
                </View>
            </View>

            {/* Actions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Actions</Text>

                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="settings-outline" size={20} color={COLORS.textPrimary} />
                    <Text style={styles.actionButtonText}>Paramètres</Text>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="help-circle-outline" size={20} color={COLORS.textPrimary} />
                    <Text style={styles.actionButtonText}>Aide et support</Text>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="information-circle-outline" size={20} color={COLORS.textPrimary} />
                    <Text style={styles.actionButtonText}>À propos</Text>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* Bouton de déconnexion */}
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
                <Text style={styles.signOutButtonText}>Se déconnecter</Text>
            </TouchableOpacity>

            {/* Version */}
            <Text style={styles.version}>Version 1.0.0</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        alignItems: 'center',
        padding: SPACING.xl,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.md,
        ...SHADOWS.lg,
    },
    name: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs / 2,
    },
    email: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
    },
    adminBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.accent,
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs / 2,
        borderRadius: BORDER_RADIUS.sm,
        marginTop: SPACING.md,
    },
    adminText: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
        color: COLORS.textInverse,
        marginLeft: SPACING.xs / 2,
    },
    section: {
        padding: SPACING.md,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        overflow: 'hidden',
        ...SHADOWS.sm,
    },
    profileItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    profileItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    profileItemLabel: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginLeft: SPACING.sm,
    },
    profileItemValue: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: SPACING.sm,
        ...SHADOWS.sm,
    },
    actionButtonText: {
        flex: 1,
        fontSize: FONT_SIZES.md,
        color: COLORS.textPrimary,
        marginLeft: SPACING.md,
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        margin: SPACING.md,
        borderWidth: 2,
        borderColor: COLORS.error + '30',
    },
    signOutButtonText: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.error,
        marginLeft: SPACING.sm,
    },
    version: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
        textAlign: 'center',
        paddingVertical: SPACING.xl,
    },
});

export default ProfileScreen;
