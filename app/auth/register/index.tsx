import LogoCoffeeChartCenter from "@/assets/svgs/logo_coffee_chart_centered_v2.svg";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomInput } from "@/components/ui/CustomInput";
import { ThemedText } from "@/components/ui/ThemedText";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

const RegisterScreen = () => {
  const background = useThemeColor({}, "background");
  const tint = useThemeColor({}, "tint");
  // const text = useThemeColor({}, "text");
  const { t } = useTranslation();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    // TODO: Implement actual registration logic
    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }
    console.log("Register with:", username, email, password);
    // For now, just navigate to coffees after registration
    router.replace("/(core-app)/(coffees)/(tabs)/(my-collection)");
  };

  const handleNavigateToLogin = () => {
    router.back();
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: background,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 40,
        }}
      >
        <LogoCoffeeChartCenter width={180} height={180} color={tint} />
      </View>

      <View style={{ width: "100%", maxWidth: 300 }}>
        <CustomInput
          placeholder={t("auth.usernamePlaceholder")}
          style={{ marginBottom: 16 }}
          size="large"
          label={t("auth.usernameLabel")}
          showLabel
          value={username}
          onChangeText={setUsername}
        />
        <CustomInput
          placeholder={t("auth.emailPlaceholder")}
          style={{ marginBottom: 16 }}
          size="large"
          label={t("auth.emailLabel")}
          showLabel
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <CustomInput
          placeholder={t("auth.passwordPlaceholder")}
          style={{ marginBottom: 16 }}
          size="large"
          label={t("auth.passwordLabel")}
          showLabel
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <CustomInput
          placeholder={t("auth.confirmPasswordPlaceholder")}
          style={{ marginBottom: 24 }}
          size="large"
          label={t("auth.confirmPasswordLabel")}
          showLabel
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <CustomButton
          label={t("auth.registerButton")}
          size="large"
          onPress={handleRegister}
          style={{ marginBottom: 16 }}
        />

        <Pressable onPress={handleNavigateToLogin}>
          <ThemedText
            style={{
              color: tint,
              textAlign: "center",
              fontSize: 16,
            }}
          >
            {t("auth.alreadyHaveAccount")}
          </ThemedText>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;
