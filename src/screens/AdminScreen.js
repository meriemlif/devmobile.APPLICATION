import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { createRoom, getAllRooms, deleteRoom } from '../services/roomService';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants/colors';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminScreen = ({ navigation }) => {
    const [roomName, setRoomName] = useState('');
    const [description, setDescription] = useState('');
    const [capacity, setCapacity] = useState('');
    const [equipment, setEquipment] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = async () => {
        setRefreshing(true);
        const { rooms: fetchedRooms, error } = await getAllRooms();
        if (!error && fetchedRooms) {
            setRooms(fetchedRooms);
        }
        setRefreshing(false);
    };

    const pickImage = async () => {
        // Demander la permission d'accès à la galerie
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert('Permission refusée', 'Vous devez autoriser l\'accès à la galerie pour choisir une image');
            return;
        }

        // Lancer le sélecteur d'images
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setSelectedImage(result.assets[0].uri);
            setImageUrl(''); // Vider l'URL si une image est sélectionnée
        }
    };

    const handleDeleteRoom = (room) => {
        Alert.alert(
            'Supprimer la salle',
            `Êtes-vous sûr de vouloir supprimer "${room.name}" ?`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        const { error } = await deleteRoom(room.id);
                        if (error) {
                            Alert.alert('Erreur', error);
                        } else {
                            Alert.alert('Succès', 'La salle a été supprimée');
                            loadRooms(); // Recharger la liste
                        }
                    },
                },
            ]
        );
    };

    const handleCreateRoom = async () => {
        // Validation
        if (!roomName.trim()) {
            Alert.alert('Erreur', 'Le nom de la salle est requis');
            return;
        }

        if (!capacity || isNaN(capacity) || parseInt(capacity) < 1) {
            Alert.alert('Erreur', 'La capacité doit être un nombre supérieur à 0');
            return;
        }

        setLoading(true);

        try {
            // Parser les équipements (séparés par des virgules)
            const equipmentArray = equipment
                .split(',')
                .map(item => item.trim())
                .filter(item => item.length > 0);

            const roomData = {
                name: roomName.trim(),
                description: description.trim() || null,
                capacity: parseInt(capacity),
                equipment: equipmentArray.length > 0 ? equipmentArray : [],
                image_url: selectedImage || imageUrl.trim() || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
                available: true,
            };

            const { room, error } = await createRoom(roomData);

            if (error) {
                Alert.alert('Erreur', error);
            } else if (room) {
                Alert.alert(
                    'Succès',
                    'La salle a été créée avec succès !',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                // Réinitialiser le formulaire
                                setRoomName('');
                                setDescription('');
                                setCapacity('');
                                setEquipment('');
                                setImageUrl('');
                                setSelectedImage(null);
                                loadRooms(); // Recharger la liste des salles
                            },
                        },
                    ]
                );
            }
        } catch (error) {
            console.error('Error creating room:', error);
            Alert.alert('Erreur', 'Une erreur est survenue lors de la création de la salle');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Ionicons name="shield-checkmark" size={48} color={COLORS.accent} />
                <Text style={styles.title}>Panneau d'Administration</Text>
                <Text style={styles.subtitle}>Créer une nouvelle salle</Text>
            </View>

            <View style={styles.form}>
                {/* Nom de la salle */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nom de la salle *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Salle Epsilon"
                        value={roomName}
                        onChangeText={setRoomName}
                        placeholderTextColor={COLORS.textSecondary}
                    />
                </View>

                {/* Description */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Décrivez la salle..."
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        placeholderTextColor={COLORS.textSecondary}
                    />
                </View>

                {/* Capacité */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Capacité (personnes) *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: 25"
                        value={capacity}
                        onChangeText={setCapacity}
                        keyboardType="numeric"
                        placeholderTextColor={COLORS.textSecondary}
                    />
                </View>

                {/* Équipements */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Équipements (séparés par des virgules)</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Ex: Projecteur, WiFi, Tableau blanc"
                        value={equipment}
                        onChangeText={setEquipment}
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                        placeholderTextColor={COLORS.textSecondary}
                    />
                </View>

                {/* Image de la salle */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Image de la salle</Text>

                    {/* Bouton pour choisir une image */}
                    <TouchableOpacity
                        style={styles.imagePickerButton}
                        onPress={pickImage}
                    >
                        <Ionicons name="images" size={24} color={COLORS.primary} />
                        <Text style={styles.imagePickerText}>
                            {selectedImage ? 'Changer l\'image' : 'Choisir une image depuis le téléphone'}
                        </Text>
                    </TouchableOpacity>

                    {/* Aperçu de l'image sélectionnée */}
                    {selectedImage && (
                        <View style={styles.imagePreviewContainer}>
                            <Image
                                source={{ uri: selectedImage }}
                                style={styles.imagePreview}
                                resizeMode="cover"
                            />
                            <TouchableOpacity
                                style={styles.removeImageButton}
                                onPress={() => setSelectedImage(null)}
                            >
                                <Ionicons name="close-circle" size={24} color={COLORS.error} />
                            </TouchableOpacity>
                        </View>
                    )}

                    <Text style={styles.hint}>
                        {selectedImage
                            ? 'Image sélectionnée. Appuyez sur X pour utiliser l\'image par défaut'
                            : 'Aucune image sélectionnée, l\'image par défaut sera utilisée'}
                    </Text>
                </View>

                {/* Bouton de création */}
                <TouchableOpacity
                    style={[styles.createButton, loading && styles.createButtonDisabled]}
                    onPress={handleCreateRoom}
                    disabled={loading}
                >
                    {loading ? (
                        <LoadingSpinner size="small" color={COLORS.textInverse} />
                    ) : (
                        <>
                            <Ionicons name="add-circle" size={20} color={COLORS.textInverse} />
                            <Text style={styles.createButtonText}>Créer la salle</Text>
                        </>
                    )}
                </TouchableOpacity>

                {/* Section de gestion des salles */}
                <View style={styles.managementSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Salles existantes</Text>
                        <TouchableOpacity onPress={loadRooms} disabled={refreshing}>
                            <Ionicons
                                name="refresh"
                                size={24}
                                color={refreshing ? COLORS.textSecondary : COLORS.primary}
                            />
                        </TouchableOpacity>
                    </View>

                    {refreshing ? (
                        <LoadingSpinner size="small" />
                    ) : rooms.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="home-outline" size={48} color={COLORS.textSecondary} />
                            <Text style={styles.emptyStateText}>Aucune salle créée</Text>
                        </View>
                    ) : (
                        <View style={styles.roomsList}>
                            {rooms.map((room) => (
                                <View key={room.id} style={styles.roomItem}>
                                    <View style={styles.roomInfo}>
                                        <Text style={styles.roomName}>{room.name}</Text>
                                        <Text style={styles.roomCapacity}>
                                            <Ionicons name="people" size={14} color={COLORS.textSecondary} /> {room.capacity} personnes
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => handleDeleteRoom(room)}
                                    >
                                        <Ionicons name="trash" size={20} color={COLORS.error} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </View>
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
        paddingTop: SPACING.xxl + SPACING.lg, // Extra space at top
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    title: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '800',
        color: COLORS.textPrimary,
        marginTop: SPACING.md,
    },
    subtitle: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs / 2,
    },
    form: {
        padding: SPACING.lg,
        paddingBottom: SPACING.xxl * 2, // Extra space at bottom
    },
    inputGroup: {
        marginBottom: SPACING.lg,
    },
    label: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    input: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        fontSize: FONT_SIZES.md,
        color: COLORS.textPrimary,
        borderWidth: 2,
        borderColor: COLORS.border,
        ...SHADOWS.sm,
    },
    textArea: {
        minHeight: 100,
    },
    hint: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
        fontStyle: 'italic',
    },
    createButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.accent,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SPACING.md,
        ...SHADOWS.lg,
    },
    createButtonDisabled: {
        opacity: 0.6,
    },
    createButtonText: {
        color: COLORS.textInverse,
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
        marginLeft: SPACING.sm,
    },
    imagePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
        ...SHADOWS.sm,
    },
    imagePickerText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.primary,
        fontWeight: '600',
        marginLeft: SPACING.sm,
    },
    imagePreviewContainer: {
        marginTop: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        overflow: 'hidden',
        position: 'relative',
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: BORDER_RADIUS.md,
    },
    removeImageButton: {
        position: 'absolute',
        top: SPACING.sm,
        right: SPACING.sm,
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        ...SHADOWS.md,
    },
    managementSection: {
        marginTop: SPACING.xxl,
        paddingTop: SPACING.lg,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    roomsList: {
        gap: SPACING.sm,
    },
    roomItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...SHADOWS.sm,
    },
    roomInfo: {
        flex: 1,
    },
    roomName: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs / 2,
    },
    roomCapacity: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
    },
    deleteButton: {
        padding: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.error + '10',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: SPACING.xl,
    },
    emptyStateText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
        marginTop: SPACING.md,
    },
});

export default AdminScreen;
