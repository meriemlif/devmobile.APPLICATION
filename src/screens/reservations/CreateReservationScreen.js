import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../context/AuthContext';
import { createReservation, checkRoomAvailability } from '../../services/reservationService';
import { formatDate, formatTime, addHours, getDurationInMinutes } from '../../utils/dateHelpers';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../constants/colors';
import LoadingSpinner from '../../components/LoadingSpinner';

const CreateReservationScreen = ({ route, navigation }) => {
    const { room } = route.params;
    const { user } = useAuth();

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(addHours(new Date(), 2));
    const [purpose, setPurpose] = useState('');
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleStartDateChange = (event, selectedDate) => {
        setShowStartPicker(Platform.OS === 'ios');
        if (selectedDate) {
            setStartDate(selectedDate);
            // Ajuster automatiquement la date de fin si elle est avant la nouvelle date de début
            if (selectedDate >= endDate) {
                setEndDate(addHours(selectedDate, 2));
            }
        }
    };

    const handleEndDateChange = (event, selectedDate) => {
        setShowEndPicker(Platform.OS === 'ios');
        if (selectedDate) {
            setEndDate(selectedDate);
        }
    };

    const validateReservation = () => {
        // Vérifier que la date de début est dans le futur
        if (startDate <= new Date()) {
            Alert.alert('Erreur', 'La date de début doit être dans le futur');
            return false;
        }

        // Vérifier que la date de fin est après la date de début
        if (endDate <= startDate) {
            Alert.alert('Erreur', 'La date de fin doit être après la date de début');
            return false;
        }

        // Vérifier une durée minimale (15 minutes)
        const duration = getDurationInMinutes(startDate, endDate);
        if (duration < 15) {
            Alert.alert('Erreur', 'La durée minimale de réservation est de 15 minutes');
            return false;
        }

        // Vérifier une durée maximale (8 heures)
        if (duration > 480) {
            Alert.alert('Erreur', 'La durée maximale de réservation est de 8 heures');
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateReservation()) {
            return;
        }

        setLoading(true);

        try {
            // Vérifier la disponibilité
            const { isAvailable, error: availError } = await checkRoomAvailability(
                room.id,
                startDate.toISOString(),
                endDate.toISOString()
            );

            if (availError) {
                Alert.alert('Erreur', availError);
                setLoading(false);
                return;
            }

            if (!isAvailable) {
                Alert.alert(
                    'Conflit de réservation',
                    'Cette salle est déjà réservée pour cette période. Veuillez choisir une autre plage horaire.'
                );
                setLoading(false);
                return;
            }

            // Créer la réservation
            const reservationData = {
                room_id: room.id,
                user_id: user.id,
                start_time: startDate.toISOString(),
                end_time: endDate.toISOString(),
                purpose: purpose.trim() || null,
                status: 'confirmed',
            };

            const { reservation, error } = await createReservation(reservationData);

            if (error) {
                Alert.alert('Erreur', error);
            } else if (reservation) {
                Alert.alert(
                    'Réservation confirmée',
                    'Votre réservation a été créée avec succès !',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.navigate('MyReservations'),
                        },
                    ]
                );
            }
        } catch (error) {
            console.error('Error creating reservation:', error);
            Alert.alert('Erreur', 'Une erreur est survenue lors de la création de la réservation');
        } finally {
            setLoading(false);
        }
    };

    const duration = getDurationInMinutes(startDate, endDate);

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* En-tête */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                    <View style={styles.headerContent}>
                        <Text style={styles.title}>Nouvelle réservation</Text>
                        <Text style={styles.subtitle}>{room.name}</Text>
                    </View>
                </View>

                <View style={styles.content}>
                    {/* Date et heure de début */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Date et heure de début</Text>
                        <TouchableOpacity
                            style={styles.dateButton}
                            onPress={() => setShowStartPicker(true)}
                        >
                            <Ionicons name="calendar" size={20} color={COLORS.primary} />
                            <View style={styles.dateTextContainer}>
                                <Text style={styles.dateText}>{formatDate(startDate)}</Text>
                                <Text style={styles.timeText}>{formatTime(startDate)}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                        </TouchableOpacity>

                        {showStartPicker && (
                            <DateTimePicker
                                value={startDate}
                                mode="datetime"
                                is24Hour={true}
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={handleStartDateChange}
                                minimumDate={new Date()}
                            />
                        )}
                    </View>

                    {/* Date et heure de fin */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Date et heure de fin</Text>
                        <TouchableOpacity
                            style={styles.dateButton}
                            onPress={() => setShowEndPicker(true)}
                        >
                            <Ionicons name="calendar" size={20} color={COLORS.primary} />
                            <View style={styles.dateTextContainer}>
                                <Text style={styles.dateText}>{formatDate(endDate)}</Text>
                                <Text style={styles.timeText}>{formatTime(endDate)}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                        </TouchableOpacity>

                        {showEndPicker && (
                            <DateTimePicker
                                value={endDate}
                                mode="datetime"
                                is24Hour={true}
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={handleEndDateChange}
                                minimumDate={startDate}
                            />
                        )}
                    </View>

                    {/* Durée */}
                    <View style={styles.durationCard}>
                        <Ionicons name="time" size={24} color={COLORS.accent} />
                        <View style={styles.durationText}>
                            <Text style={styles.durationLabel}>Durée totale</Text>
                            <Text style={styles.durationValue}>
                                {Math.floor(duration / 60)}h {duration % 60}min
                            </Text>
                        </View>
                    </View>

                    {/* Objectif de la réservation */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Objectif (optionnel)</Text>
                        <TextInput
                            style={styles.purposeInput}
                            placeholder="Décrivez l'objectif de cette réservation..."
                            placeholderTextColor={COLORS.textSecondary}
                            value={purpose}
                            onChangeText={setPurpose}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Résumé */}
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryTitle}>Résumé de la réservation</Text>

                        <View style={styles.summaryRow}>
                            <Ionicons name="business" size={18} color={COLORS.textSecondary} />
                            <Text style={styles.summaryText}>{room.name}</Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Ionicons name="people" size={18} color={COLORS.textSecondary} />
                            <Text style={styles.summaryText}>Capacité: {room.capacity} personnes</Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Ionicons name="calendar" size={18} color={COLORS.textSecondary} />
                            <Text style={styles.summaryText}>
                                {formatDate(startDate)} • {formatTime(startDate)} - {formatTime(endDate)}
                            </Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Ionicons name="time" size={18} color={COLORS.textSecondary} />
                            <Text style={styles.summaryText}>
                                Durée: {Math.floor(duration / 60)}h {duration % 60}min
                            </Text>
                        </View>
                    </View>

                    {/* Bouton de confirmation */}
                    <TouchableOpacity
                        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <LoadingSpinner size="small" color={COLORS.textInverse} />
                        ) : (
                            <>
                                <Ionicons name="checkmark-circle" size={20} color={COLORS.textInverse} />
                                <Text style={styles.submitButtonText}>Confirmer la réservation</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        paddingTop: Platform.OS === 'ios' ? SPACING.xxl : SPACING.md,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    headerContent: {
        flex: 1,
    },
    title: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    subtitle: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    content: {
        padding: SPACING.lg,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    label: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 2,
        borderColor: COLORS.border,
        ...SHADOWS.sm,
    },
    dateTextContainer: {
        flex: 1,
        marginLeft: SPACING.md,
    },
    dateText: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    timeText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    durationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.accent + '15',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: SPACING.xl,
        borderWidth: 2,
        borderColor: COLORS.accent + '30',
    },
    durationText: {
        marginLeft: SPACING.md,
    },
    durationLabel: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
    },
    durationValue: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.accent,
        marginTop: 2,
    },
    purposeInput: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        fontSize: FONT_SIZES.md,
        color: COLORS.textPrimary,
        borderWidth: 2,
        borderColor: COLORS.border,
        minHeight: 100,
        ...SHADOWS.sm,
    },
    summaryCard: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.xl,
        borderWidth: 2,
        borderColor: COLORS.primary + '30',
        ...SHADOWS.md,
    },
    summaryTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
    },
    summaryText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textPrimary,
        marginLeft: SPACING.sm,
        flex: 1,
    },
    submitButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.lg,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: COLORS.textInverse,
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
        marginLeft: SPACING.sm,
    },
});

export default CreateReservationScreen;
