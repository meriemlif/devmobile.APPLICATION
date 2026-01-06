import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRoomReservations } from '../../services/reservationService';
import { formatDate, formatTime } from '../../utils/dateHelpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../constants/colors';

const RoomDetailScreen = ({ route, navigation }) => {
    const { room } = route.params;
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReservations();
    }, []);

    const loadReservations = async () => {
        setLoading(true);
        const { reservations: fetchedReservations, error } = await getRoomReservations(room.id);

        if (!error && fetchedReservations) {
            // Garder seulement les réservations futures
            const futureReservations = fetchedReservations.filter(
                r => new Date(r.end_time) > new Date()
            );
            setReservations(futureReservations);
        }

        setLoading(false);
    };

    const handleReserve = () => {
        navigation.navigate('CreateReservation', { room });
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image de la salle */}
                <View style={styles.imageContainer}>
                    {room.image_url ? (
                        <Image source={{ uri: room.image_url }} style={styles.image} />
                    ) : (
                        <View style={[styles.image, styles.placeholderImage]}>
                            <Ionicons name="business" size={80} color={COLORS.textSecondary} />
                        </View>
                    )}

                    {/* Bouton retour */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                </View>

                {/* Informations de la salle */}
                <View style={styles.content}>
                    {/* Nom et disponibilité */}
                    <View style={styles.headerSection}>
                        <Text style={styles.name}>{room.name}</Text>
                        {room.available ? (
                            <View style={styles.availableBadge}>
                                <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                                <Text style={styles.availableText}>Disponible</Text>
                            </View>
                        ) : (
                            <View style={[styles.availableBadge, styles.unavailableBadge]}>
                                <Ionicons name="close-circle" size={16} color={COLORS.error} />
                                <Text style={[styles.availableText, styles.unavailableText]}>Indisponible</Text>
                            </View>
                        )}
                    </View>

                    {/* Description */}
                    {room.description && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Description</Text>
                            <Text style={styles.description}>{room.description}</Text>
                        </View>
                    )}

                    {/* Capacité */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Capacité</Text>
                        <View style={styles.infoCard}>
                            <Ionicons name="people" size={24} color={COLORS.primary} />
                            <Text style={styles.capacityText}>{room.capacity} personnes</Text>
                        </View>
                    </View>

                    {/* Équipements */}
                    {room.equipment && room.equipment.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Équipements</Text>
                            <View style={styles.equipmentList}>
                                {room.equipment.map((item, index) => (
                                    <View key={index} style={styles.equipmentItem}>
                                        <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                                        <Text style={styles.equipmentText}>{item}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Réservations à venir */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Réservations à venir</Text>
                        {loading ? (
                            <LoadingSpinner />
                        ) : reservations.length > 0 ? (
                            <View style={styles.reservationsList}>
                                {reservations.slice(0, 5).map((reservation, index) => (
                                    <View key={index} style={styles.reservationItem}>
                                        <View style={styles.reservationDot} />
                                        <View style={styles.reservationInfo}>
                                            <Text style={styles.reservationDate}>
                                                {formatDate(reservation.start_time)}
                                            </Text>
                                            <Text style={styles.reservationTime}>
                                                {formatTime(reservation.start_time)} - {formatTime(reservation.end_time)}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                                {reservations.length > 5 && (
                                    <Text style={styles.moreReservations}>
                                        +{reservations.length - 5} autres réservations
                                    </Text>
                                )}
                            </View>
                        ) : (
                            <Text style={styles.noReservations}>Aucune réservation à venir</Text>
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Bouton de réservation fixe */}
            {room.available && (
                <View style={styles.bottomBar}>
                    <TouchableOpacity style={styles.reserveButton} onPress={handleReserve}>
                        <Ionicons name="calendar" size={20} color={COLORS.textInverse} />
                        <Text style={styles.reserveButtonText}>Réserver cette salle</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 300,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: SPACING.xl,
        left: SPACING.md,
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.md,
    },
    content: {
        padding: SPACING.lg,
    },
    headerSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.lg,
    },
    name: {
        flex: 1,
        fontSize: FONT_SIZES.xxl,
        fontWeight: '800',
        color: COLORS.textPrimary,
        marginRight: SPACING.md,
    },
    availableBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.success + '20',
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.sm,
    },
    unavailableBadge: {
        backgroundColor: COLORS.error + '20',
    },
    availableText: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
        color: COLORS.success,
        marginLeft: SPACING.xs / 2,
    },
    unavailableText: {
        color: COLORS.error,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    description: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
        lineHeight: 24,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        ...SHADOWS.sm,
    },
    capacityText: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginLeft: SPACING.md,
    },
    equipmentList: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        ...SHADOWS.sm,
    },
    equipmentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
    },
    equipmentText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textPrimary,
        marginLeft: SPACING.sm,
    },
    reservationsList: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        ...SHADOWS.sm,
    },
    reservationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
    },
    reservationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
        marginRight: SPACING.md,
    },
    reservationInfo: {
        flex: 1,
    },
    reservationDate: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    reservationTime: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    moreReservations: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
        fontStyle: 'italic',
        marginTop: SPACING.sm,
        textAlign: 'center',
    },
    noReservations: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: SPACING.lg,
    },
    bottomBar: {
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        ...SHADOWS.lg,
    },
    reserveButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.md,
    },
    reserveButtonText: {
        color: COLORS.textInverse,
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
        marginLeft: SPACING.sm,
    },
});

export default RoomDetailScreen;
