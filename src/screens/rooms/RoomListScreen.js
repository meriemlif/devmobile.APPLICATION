import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    RefreshControl,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAvailableRooms } from '../../services/roomService';
import RoomCard from '../../components/RoomCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../constants/colors';

const RoomListScreen = ({ navigation }) => {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadRooms();
    }, []);

    useEffect(() => {
        filterRooms();
    }, [searchQuery, rooms]);

    const loadRooms = async () => {
        setLoading(true);
        const { rooms: fetchedRooms, error } = await getAvailableRooms();

        if (!error && fetchedRooms) {
            setRooms(fetchedRooms);
        }

        setLoading(false);
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadRooms();
        setRefreshing(false);
    }, []);

    const filterRooms = () => {
        if (!searchQuery.trim()) {
            setFilteredRooms(rooms);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = rooms.filter(room =>
            room.name.toLowerCase().includes(query) ||
            room.description?.toLowerCase().includes(query) ||
            room.equipment?.some(eq => eq.toLowerCase().includes(query))
        );

        setFilteredRooms(filtered);
    };

    const handleRoomPress = (room) => {
        navigation.navigate('RoomDetail', { room });
    };

    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="business-outline" size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>
                {searchQuery ? 'Aucune salle trouvée' : 'Aucune salle disponible'}
            </Text>
            {searchQuery && (
                <TouchableOpacity
                    style={styles.clearSearchButton}
                    onPress={() => setSearchQuery('')}
                >
                    <Text style={styles.clearSearchText}>Effacer la recherche</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <View style={styles.container}>
            {/* Barre de recherche */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Ionicons name="search" size={20} color={COLORS.textSecondary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Rechercher une salle..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor={COLORS.textSecondary}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* En-tête */}
            <View style={styles.header}>
                <Text style={styles.title}>Salles disponibles</Text>
                <Text style={styles.subtitle}>
                    {filteredRooms.length} {filteredRooms.length > 1 ? 'salles' : 'salle'}
                </Text>
            </View>

            {/* Liste des salles */}
            <FlatList
                data={filteredRooms}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <RoomCard room={item} onPress={() => handleRoomPress(item)} />
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
    searchContainer: {
        padding: SPACING.md,
        paddingTop: SPACING.xxl, // Extra space at top
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        borderRadius: BORDER_RADIUS.md,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        ...SHADOWS.sm,
    },
    searchInput: {
        flex: 1,
        marginLeft: SPACING.sm,
        fontSize: FONT_SIZES.md,
        color: COLORS.textPrimary,
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
    },
    clearSearchButton: {
        marginTop: SPACING.md,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        backgroundColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.md,
    },
    clearSearchText: {
        color: COLORS.textInverse,
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
    },
});

export default RoomListScreen;
