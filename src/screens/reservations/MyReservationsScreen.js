import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    RefreshControl,
    Alert,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { getUserReservations, cancelReservation } from '../../services/reservationService';
import ReservationCard from '../../components/ReservationCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants/colors';
import { isFuture } from '../../utils/dateHelpers';

const MyReservationsScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState('upcoming'); // 'upcoming', 'past', 'all'

    useEffect(() => {
        if (user) {
            loadReservations();
        }
    }, [user]);

    useEffect(() => {
        applyFilter();
    }, [filter, reservations]);

    const loadReservations = async () => {
        if (!user) return;

        setLoading(true);
        const { reservations: fetchedReservations, error } = await getUserReservations(user.id);

        if (!error && fetchedReservations) {
            setReservations(fetchedReservations);
        }

        setLoading(false);
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadReservations();
        setRefreshing(false);
    }, [user]);

    const applyFilter = () => {
        const now = new Date();
        let filtered = [...reservations];

        switch (filter) {
            case 'upcoming':
                filtered = reservations.filter(r =>
                    isFuture(r.start_time) && r.status !== 'cancelled'
                );
                break;
            case 'past':
                filtered = reservations.filter(r =>
                    new Date(r.end_time) < now || r.status === 'cancelled'
                );
                break;
            case 'all':
            default:
                break;
        }

        setFilteredReservations(filtered);
    };

    const handleCancelReservation = (reservation) => {
        Alert.alert(
            'Annuler la réservation',
            'Êtes-vous sûr de vouloir annuler cette réservation ?',
            [
                { text: 'Non', style: 'cancel' },
                {
                    text: 'Oui, annuler',
                    style: 'destructive',
                    onPress: async () => {
                        const { error } = await cancelReservation(reservation.id);

                        if (error) {
                            Alert.alert('Erreur', error);
                        } else {
                            Alert.alert('Succès', 'Réservation annulée avec succès');
                            loadReservations();
                        }
                    },
                },
            ]
        );
    };

    const handleReservationPress = (reservation) => {
        // Naviguer vers les détails de la salle dans le navigateur imbriqué
        navigation.navigate('Rooms', {
            screen: 'RoomDetail',
            params: { room: reservation.rooms }
        });
    };

    const renderFilterButton = (filterType, label) => (
        <TouchableOpacity
            style={[
                styles.filterButton,
                filter === filterType && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(filterType)}
        >
            <Text
                style={[
                    styles.filterButtonText,
                    filter === filterType && styles.filterButtonTextActive,
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );

    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>
                {filter === 'upcoming'
                    ? 'Aucune réservation à venir'
                    : filter === 'past'
                        ? 'Aucune réservation passée'
                        : 'Aucune réservation'}
            </Text>
            <TouchableOpacity
                style={styles.browseButton}
                onPress={() => navigation.navigate('Rooms')}
            >
                <Text style={styles.browseButtonText}>Parcourir les salles</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <View style={styles.container}>
            {/* En-tête */}
            <View style={styles.header}>
                <Text style={styles.title}>Mes réservations</Text>
                <Text style={styles.subtitle}>
                    {filteredReservations.length} {filteredReservations.length > 1 ? 'réservations' : 'réservation'}
                </Text>
            </View>

            {/* Filtres */}
            <View style={styles.filterContainer}>
                {renderFilterButton('upcoming', 'À venir')}
                {renderFilterButton('past', 'Passées')}
                {renderFilterButton('all', 'Toutes')}
            </View>

            {/* Liste des réservations */}
            <FlatList
                data={filteredReservations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ReservationCard
                        reservation={item}
                        onPress={() => handleReservationPress(item)}
                        onCancel={
                            isFuture(item.start_time) && item.status !== 'cancelled'
                                ? handleCancelReservation
                                : null
                        }
                        showActions={filter === 'upcoming'}
                    />
                )}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={COLORS.primary}
                        colors={[COLORS.primary]}
                    />
                }
                ListEmptyComponent={renderEmptyList}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        padding: SPACING.md,
        paddingTop: SPACING.lg,
        paddingBottom: SPACING.sm,
    },
    title: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    subtitle: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs / 2,
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.md,
        paddingBottom: SPACING.md,
        gap: SPACING.sm,
    },
    filterButton: {
        flex: 1,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.surface,
        borderWidth: 2,
        borderColor: COLORS.border,
        alignItems: 'center',
    },
    filterButtonActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterButtonText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    filterButtonTextActive: {
        color: COLORS.textInverse,
    },
    listContent: {
        paddingBottom: SPACING.lg,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: SPACING.xxl * 2,
    },
    emptyText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
        marginTop: SPACING.md,
        marginBottom: SPACING.lg,
    },
    browseButton: {
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.md,
    },
    browseButtonText: {
        color: COLORS.textInverse,
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
    },
});

export default MyReservationsScreen;
