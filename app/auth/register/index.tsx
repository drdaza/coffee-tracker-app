import LogoCoffeeChartCenter from "@/assets/svgs/logo_coffee_chart_centered_v2.svg";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTranslation } from "@/hooks/useTranslation";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

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
    // For now, just navigate to home after registration
    router.replace("/(core-app)/(home)");
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
          placeholder={t("home.enterUsername")}
          style={{ marginBottom: 16 }}
          size="large"
          label={t("common.username")}
          showLabel
          keyboardType="email-address"
          value={username}
          onChangeText={setUsername}
        />
        <CustomInput
          placeholder={t("auth.enterEmail")}
          style={{ marginBottom: 16 }}
          size="large"
          label={t("common.email")}
          showLabel
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <CustomInput
          placeholder={t("home.enterPassword")}
          style={{ marginBottom: 16 }}
          size="large"
          label={t("common.password")}
          showLabel
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <CustomInput
          placeholder={t("auth.confirmPassword")}
          style={{ marginBottom: 24 }}
          size="large"
          label={t("auth.confirmPassword")}
          showLabel
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <CustomButton
          label={t("auth.register")}
          size="large"
          onPress={handleRegister}
          style={{ marginBottom: 16 }}
        />

        <Pressable onPress={handleNavigateToLogin}>
          <Text
            style={{
              color: tint,
              textAlign: "center",
              fontSize: 16,
            }}
          >
            {t("auth.alreadyHaveAccount")}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;
