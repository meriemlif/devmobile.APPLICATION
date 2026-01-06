import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validatePassword } from '../../utils/validators';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../constants/colors';
import LoadingSpinner from '../../components/LoadingSpinner';

const LoginScreen = ({ navigation }) => {
    const { signIn } = useAuth(); // Utiliser le hook AuthContext
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleLogin = async () => {
        // Validation
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        if (emailError || passwordError) {
            setErrors({
                email: emailError,
                password: passwordError,
            });
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            const { user, error } = await signIn(email, password);

            if (error) {
                Alert.alert('Erreur de connexion', error);
            } else if (user) {
                // La navigation sera gérée par AuthContext
                console.log('Connexion réussie');
            }
        } catch (error) {
            Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* En-tête */}
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="business" size={64} color={COLORS.primary} />
                    </View>
                    <Text style={styles.title}>Réservation Salles</Text>
                    <Text style={styles.subtitle}>Connectez-vous à votre compte</Text>
                </View>

                {/* Formulaire */}
                <View style={styles.form}>
                    {/* Email */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <View style={[styles.inputContainer, errors.email && styles.inputError]}>
                            <Ionicons name="mail" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="votre.email@exemple.com"
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    if (errors.email) setErrors({ ...errors, email: null });
                                }}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                    </View>

                    {/* Mot de passe */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Mot de passe</Text>
                        <View style={[styles.inputContainer, errors.password && styles.inputError]}>
                            <Ionicons name="lock-closed" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    if (errors.password) setErrors({ ...errors, password: null });
                                }}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                            >
                                <Ionicons
                                    name={showPassword ? 'eye-off' : 'eye'}
                                    size={20}
                                    color={COLORS.textSecondary}
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                    </View>

                    {/* Bouton de connexion */}
                    <TouchableOpacity
                        style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <LoadingSpinner size="small" color={COLORS.textInverse} />
                        ) : (
                            <Text style={styles.loginButtonText}>Se connecter</Text>
                        )}
                    </TouchableOpacity>

                    {/* Lien d'inscription */}
                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>Pas encore de compte ? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.signupLink}>S'inscrire</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: SPACING.xl,
        paddingTop: SPACING.xxl * 2, // Extra space at top
        paddingBottom: SPACING.xxl * 2, // Extra space at bottom
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xxl,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: BORDER_RADIUS.xl,
        backgroundColor: COLORS.primaryLight + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.lg,
        ...SHADOWS.lg,
    },
    title: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: '800',
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
    },
    form: {
        width: '100%',
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 2,
        borderColor: COLORS.border,
        ...SHADOWS.sm,
    },
    inputError: {
        borderColor: COLORS.error,
    },
    inputIcon: {
        marginLeft: SPACING.md,
    },
    input: {
        flex: 1,
        padding: SPACING.md,
        fontSize: FONT_SIZES.md,
        color: COLORS.textPrimary,
    },
    eyeIcon: {
        padding: SPACING.md,
    },
    errorText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.error,
        marginTop: SPACING.xs,
        marginLeft: SPACING.xs,
    },
    loginButton: {
        backgroundColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        alignItems: 'center',
        marginTop: SPACING.md,
        ...SHADOWS.md,
    },
    loginButtonDisabled: {
        opacity: 0.6,
    },
    loginButtonText: {
        color: COLORS.textInverse,
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: SPACING.lg,
    },
    signupText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
    },
    signupLink: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.primary,
        fontWeight: '700',
    },
});

export default LoginScreen;
