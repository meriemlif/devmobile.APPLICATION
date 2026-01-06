import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

const LoadingSpinner = ({ size = 'large', color = COLORS.primary, fullScreen = false }) => {
    if (fullScreen) {
        return (
            <View style={styles.fullScreenContainer}>
                <ActivityIndicator size={size} color={color} />
            </View>
        );
    }

    return <ActivityIndicator size={size} color={color} />;
};

const styles = StyleSheet.create({
    fullScreenContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
});

export default LoadingSpinner;
