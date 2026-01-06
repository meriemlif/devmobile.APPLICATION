import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants/colors';
import { formatDate, formatTime, getDurationInMinutes, formatDuration, getRelativeDate } from '../utils/dateHelpers';
import { RESERVATION_STATUS_COLORS, RESERVATION_STATUS_LABELS } from '../constants/config';

const ReservationCard = ({ reservation, onPress, onCancel, showActions = true }) => {
    const { start_time, end_time, purpose, status, rooms } = reservation;
    const duration = getDurationInMinutes(start_time, end_time);
    const statusColor = RESERVATION_STATUS_COLORS[status] || COLORS.textSecondary;

    return (
        <TouchableOpacity
            style={[
                styles.card,
                status === 'cancelled' && styles.cancelledCard,
            ]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {/* En-tête avec badge de statut */}
            <View style={styles.header}>
                <View style={styles.roomInfo}>
                    <Ionicons name="business" size={20} color={COLORS.primary} />
                    <Text style={styles.roomName} numberOfLines={1}>
                        {rooms?.name || 'Salle inconnue'}
                    </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                    <Text style={[styles.statusText, { color: statusColor }]}>
                        {RESERVATION_STATUS_LABELS[status] || status}
                    </Text>
                </View>
            </View>

            {/* Date et heure */}
            <View style={styles.timeSection}>
                <View style={styles.timeRow}>
                    <Ionicons name="calendar" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.dateText}>{getRelativeDate(start_time)}</Text>
                </View>
                <View style={styles.timeRow}>
                    <Ionicons name="time" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.timeText}>
                        {formatTime(start_time)} - {formatTime(end_time)}
                    </Text>
                    <Text style={styles.durationText}>({formatDuration(duration)})</Text>
                </View>
            </View>

            {/* Objectif */}
            {purpose && (
                <View style={styles.purposeSection}>
                    <Text style={styles.purposeLabel}>Objectif:</Text>
                    <Text style={styles.purposeText} numberOfLines={2}>
                        {purpose}
                    </Text>
                </View>
            )}

            {/* Actions */}
            {showActions && status !== 'cancelled' && onCancel && (
                <View style={styles.actionsSection}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={(e) => {
                            e.stopPropagation();
                            onCancel(reservation);
                        }}
                    >
                        <Ionicons name="close-circle" size={18} color={COLORS.error} />
                        <Text style={styles.cancelButtonText}>Annuler</Text>
                    </TouchableOpacity>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        marginHorizontal: SPACING.md,
        ...SHADOWS.md,
    },
    cancelledCard: {
        opacity: 0.5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    roomInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: SPACING.sm,
    },
    roomName: {
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginLeft: SPACING.xs,
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs / 2,
        borderRadius: BORDER_RADIUS.sm,
    },
    statusText: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
    },
    timeSection: {
        marginBottom: SPACING.sm,
        paddingLeft: SPACING.xs,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    dateText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textPrimary,
        marginLeft: SPACING.xs,
        fontWeight: '600',
    },
    timeText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textPrimary,
        marginLeft: SPACING.xs,
        fontWeight: '500',
    },
    durationText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
        marginLeft: SPACING.xs,
    },
    purposeSection: {
        backgroundColor: COLORS.background,
        padding: SPACING.sm,
        borderRadius: BORDER_RADIUS.sm,
        marginBottom: SPACING.sm,
    },
    purposeLabel: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
        fontWeight: '600',
        marginBottom: SPACING.xs / 2,
    },
    purposeText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textPrimary,
        lineHeight: 20,
    },
    actionsSection: {
        borderTopWidth: 1,
        borderTopColor: COLORS.divider,
        paddingTop: SPACING.sm,
        marginTop: SPACING.xs,
    },
    cancelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.sm,
    },
    cancelButtonText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.error,
        fontWeight: '600',
        marginLeft: SPACING.xs,
    },
});

export default ReservationCard;
