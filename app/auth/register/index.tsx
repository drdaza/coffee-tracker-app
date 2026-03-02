import LogoCoffeeChartCenter from "@/assets/svgs/logo_coffee_chart_centered_v2.svg";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomInput } from "@/components/ui/CustomInput";
import { ThemedText } from "@/components/ui/ThemedText";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { useAuthStore } from "@/stores/authStore";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  View,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

export default function RegisterScreen() {
  const background = useThemeColor({}, "background");
  const tint = useThemeColor({}, "tint");
  const { t } = useTranslation();

  const { register, isLoading, error } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert(t("common.error"), t("auth.fillAllFields"));
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(t("common.error"), t("auth.passwordsMismatch"));
      return;
    }

    try {
      await register(name, email, password);
      router.replace("/(core-app)/(coffees)/(tabs)/(my-collection)");
    } catch {
      Alert.alert(t("auth.registerFailed"), error || t("common.unexpectedError"));
    }
  };

  const handleNavigateToLogin = () => {
    router.back();
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: background },
      ]}
    >
      <View style={styles.logoContainer}>
        <LogoCoffeeChartCenter width={180} height={180} color={tint} />
      </View>

      <View style={styles.formContainer}>
        <CustomInput
          placeholder={t("auth.usernamePlaceholder")}
          style={styles.input}
          size="large"
          label={t("auth.usernameLabel")}
          showLabel
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          editable={!isLoading}
        />
        <CustomInput
          placeholder={t("auth.emailPlaceholder")}
          style={styles.input}
          size="large"
          label={t("auth.emailLabel")}
          showLabel
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />
        <CustomInput
          placeholder={t("auth.passwordPlaceholder")}
          style={styles.input}
          size="large"
          label={t("auth.passwordLabel")}
          showLabel
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
        />
        <CustomInput
          placeholder={t("auth.confirmPasswordPlaceholder")}
          style={styles.lastInput}
          size="large"
          label={t("auth.confirmPasswordLabel")}
          showLabel
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!isLoading}
        />

        {error ? (
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        ) : null}

        <CustomButton
          label={isLoading ? t("auth.registering") : t("auth.registerButton")}
          size="large"
          onPress={handleRegister}
          disabled={isLoading}
          style={styles.submitButton}
        />

        {isLoading ? (
          <ActivityIndicator
            size="small"
            color={tint}
            style={styles.loader}
          />
        ) : null}

        <Pressable onPress={handleNavigateToLogin}>
          <ThemedText style={[styles.linkText, { color: tint }]}>
            {t("auth.alreadyHaveAccount")}
          </ThemedText>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  formContainer: {
    width: "100%",
    maxWidth: 300,
  },
  input: {
    marginBottom: 16,
  },
  lastInput: {
    marginBottom: 24,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },
  submitButton: {
    marginBottom: 16,
  },
  loader: {
    marginBottom: 10,
  },
  linkText: {
    textAlign: "center",
    fontSize: 16,
  },
});
