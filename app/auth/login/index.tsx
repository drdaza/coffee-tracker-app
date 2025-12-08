import LogoCoffeeChartCenter from "@/assets/svgs/logo_coffee_chart_centered_v2.svg";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomInput } from "@/components/ui/CustomInput";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { useAuthStore } from "@/stores/authStore";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View, Alert, ActivityIndicator } from "react-native";

const LoginScreen = () => {
  const background = useThemeColor({}, "background");
  const tint = useThemeColor({}, "tint");
  const { t } = useTranslation();

  const { login, isLoading, error } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    try {
      await login(email, password);
      router.replace("/(core-app)/(coffees)/(my-collection)");
    } catch {
      Alert.alert("Login Failed", error || "An error occurred");
    }
  };

  const handleNavigateToRegister = () => {
    router.push("/auth/register");
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: background,
      }}
    >
      {/* Language selector at top */}
      {/* <View style={{ position: 'absolute', top: 60, right: 20 }}>
        <LanguageSelector />
      </View> */}

      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <LogoCoffeeChartCenter width={200} height={200} color={tint} />
      </View>

      <View
        style={{
          flex: 1,
          gap: 10,
          alignItems: "center",
        }}
      >
        <CustomInput
          placeholder={t("auth.emailPlaceholder")}
          size="large"
          label={t("auth.emailLabel")}
          showLabel
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          editable={!isLoading}
        />
        <CustomInput
          placeholder={t("auth.passwordPlaceholder")}
          size="large"
          label={t("auth.passwordLabel")}
          showLabel
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
        />

        {error && (
          <Text style={{ color: "red", fontSize: 14, marginTop: 5 }}>
            {error}
          </Text>
        )}

        <CustomButton
          label={isLoading ? "Logging in..." : t("auth.loginButton")}
          size="large"
          onPress={handleLogin}
          disabled={isLoading}
        />

        {isLoading && (
          <ActivityIndicator
            size="small"
            color={tint}
            style={{ marginTop: 10 }}
          />
        )}

        <Pressable onPress={handleNavigateToRegister}>
          <Text
            style={{
              color: tint,
              textAlign: "center",
              fontSize: 16,
            }}
          >
            {t("auth.dontHaveAccount")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default LoginScreen;
