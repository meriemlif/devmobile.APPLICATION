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
import { validateEmail, validatePassword, validatePasswordMatch, validateName } from '../../utils/validators';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../constants/colors';
import LoadingSpinner from '../../components/LoadingSpinner';

const RegisterScreen = ({ navigation }) => {
    const { signUp } = useAuth(); // Utiliser le hook AuthContext
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleRegister = async () => {
        // Validation
        const nameError = validateName(fullName, 'Le nom complet');
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        const matchError = validatePasswordMatch(password, confirmPassword);

        if (nameError || emailError || passwordError || matchError) {
            setErrors({
                fullName: nameError,
                email: emailError,
                password: passwordError,
                confirmPassword: matchError,
            });
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            const { user, error } = await signUp(email, password, fullName);

            if (error) {
                Alert.alert('Erreur d\'inscription', error);
            } else if (user) {
                // Rediriger vers l'écran de connexion avec un message de succès
                Alert.alert(
                    'Inscription réussie !',
                    'Votre compte a été créé avec succès. Veuillez vous connecter.',
                    [
                        {
                            text: 'Se connecter',
                            onPress: () => navigation.navigate('Login'),
                        },
                    ]
                );
            }
        } catch (error) {
            Alert.alert('Erreur', 'Une erreur est survenue lors de l\'inscription');
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
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Créer un compte</Text>
                    <Text style={styles.subtitle}>Commencez à réserver vos salles</Text>
                </View>

                {/* Formulaire */}
                <View style={styles.form}>
                    {/* Nom complet */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nom complet</Text>
                        <View style={[styles.inputContainer, errors.fullName && styles.inputError]}>
                            <Ionicons name="person" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Jean Dupont"
                                value={fullName}
                                onChangeText={(text) => {
                                    setFullName(text);
                                    if (errors.fullName) setErrors({ ...errors, fullName: null });
                                }}
                                autoCapitalize="words"
                            />
                        </View>
                        {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
                    </View>

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
                                placeholder="Minimum 6 caractères"
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

                    {/* Confirmer mot de passe */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirmer le mot de passe</Text>
                        <View style={[styles.inputContainer, errors.confirmPassword && styles.inputError]}>
                            <Ionicons name="lock-closed" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Répétez votre mot de passe"
                                value={confirmPassword}
                                onChangeText={(text) => {
                                    setConfirmPassword(text);
                                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                                }}
                                secureTextEntry={!showConfirmPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={styles.eyeIcon}
                            >
                                <Ionicons
                                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                                    size={20}
                                    color={COLORS.textSecondary}
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                    </View>

                    {/* Bouton d'inscription */}
                    <TouchableOpacity
                        style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading ? (
                            <LoadingSpinner size="small" color={COLORS.textInverse} />
                        ) : (
                            <Text style={styles.registerButtonText}>S'inscrire</Text>
                        )}
                    </TouchableOpacity>

                    {/* Lien de connexion */}
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Déjà un compte ? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginLink}>Se connecter</Text>
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
        padding: SPACING.xl,
        paddingTop: SPACING.xxl * 2, // Extra space at top
        paddingBottom: SPACING.xxl * 2, // Extra space at bottom
    },
    header: {
        marginBottom: SPACING.xl,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.lg,
        ...SHADOWS.sm,
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
    registerButton: {
        backgroundColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        alignItems: 'center',
        marginTop: SPACING.md,
        ...SHADOWS.md,
    },
    registerButtonDisabled: {
        opacity: 0.6,
    },
    registerButtonText: {
        color: COLORS.textInverse,
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: SPACING.lg,
    },
    loginText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
    },
    loginLink: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.primary,
        fontWeight: '700',
    },
});

export default RegisterScreen;
