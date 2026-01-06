import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants/colors';

const RoomCard = ({ room, onPress }) => {
    const { name, description, capacity, equipment, image_url, available } = room;

    return (
        <TouchableOpacity
            style={[styles.card, !available && styles.unavailable]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {/* Image de la salle */}
            <View style={styles.imageContainer}>
                {image_url ? (
                    <Image source={{ uri: image_url }} style={styles.image} />
                ) : (
                    <View style={[styles.image, styles.placeholderImage]}>
                        <Ionicons name="business" size={48} color={COLORS.textSecondary} />
                    </View>
                )}
                {!available && (
                    <View style={styles.unavailableBadge}>
                        <Text style={styles.unavailableText}>Indisponible</Text>
                    </View>
                )}
            </View>

            {/* Contenu */}
            <View style={styles.content}>
                <Text style={styles.name} numberOfLines={1}>
                    {name}
                </Text>
                <Text style={styles.description} numberOfLines={2}>
                    {description || 'Aucune description disponible'}
                </Text>

                {/* Capacité */}
                <View style={styles.infoRow}>
                    <Ionicons name="people" size={16} color={COLORS.primary} />
                    <Text style={styles.infoText}>{capacity} personnes</Text>
                </View>

                {/* Équipements */}
                {equipment && equipment.length > 0 && (
                    <View style={styles.equipmentContainer}>
                        {equipment.slice(0, 3).map((item, index) => (
                            <View key={index} style={styles.equipmentChip}>
                                <Text style={styles.equipmentText}>{item}</Text>
                            </View>
                        ))}
                        {equipment.length > 3 && (
                            <View style={styles.equipmentChip}>
                                <Text style={styles.equipmentText}>+{equipment.length - 3}</Text>
                            </View>
                        )}
                    </View>
                )}
            </View>

            {/* Icône de navigation */}
            <View style={styles.arrow}>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: SPACING.md,
        marginHorizontal: SPACING.md,
        overflow: 'hidden',
        ...SHADOWS.md,
    },
    unavailable: {
        opacity: 0.6,
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 180,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unavailableBadge: {
        position: 'absolute',
        top: SPACING.sm,
        right: SPACING.sm,
        backgroundColor: COLORS.error,
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.sm,
    },
    unavailableText: {
        color: COLORS.textInverse,
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
    },
    content: {
        padding: SPACING.md,
    },
    name: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    description: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        lineHeight: 20,
        marginBottom: SPACING.md,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    infoText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textPrimary,
        marginLeft: SPACING.xs,
        fontWeight: '500',
    },
    equipmentContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.xs,
    },
    equipmentChip: {
        backgroundColor: COLORS.primaryLight + '20',
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs / 2,
        borderRadius: BORDER_RADIUS.sm,
    },
    equipmentText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.primary,
        fontWeight: '500',
    },
    arrow: {
        position: 'absolute',
        top: '50%',
        right: SPACING.md,
        transform: [{ translateY: -10 }],
    },
});

export default RoomCard;
