import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { ThemedText } from "@/components/ui/ThemedText";
import { CustomButton } from "@/components/ui/CustomButton";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { useFormatDate } from "@/hooks/utils/useFormatDate";
import { useAuthStore } from "@/stores/authStore";
import { userService } from "@/api/user/service";
import { AppError } from "@/api/errors";
import type { User } from "@/api/types";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { logout } = useAuthStore();
  const { formatDate } = useFormatDate();

  const background = useThemeColor({}, "background");
  const tint = useThemeColor({}, "tint");
  const icon = useThemeColor({}, "icon");
  const cardBg = useThemeColor({}, "cardBackground");
  const borderColor = useThemeColor({}, "border");

  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getMyProfile();
        setProfile(data);
      } catch (err) {
        const message =
          err instanceof AppError
            ? err.getUserMessage()
            : t("profile.noProfileMessage");
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [t]);

  const handleLogout = () => {
    Alert.alert(t("profile.logoutTitle"), t("profile.logoutConfirmation"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("auth.logoutButton"),
        style: "destructive",
        onPress: async () => {
          setLoggingOut(true);
          try {
            await logout();
          } catch {
            setLoggingOut(false);
          }
        },
      },
    ]);
  };

  return (
    <ScreenLayout
      loading={isLoading}
      error={error}
      onRetry={() => {
        setIsLoading(true);
        setError(null);
        userService.getMyProfile().then(setProfile).catch(() => {
          setError(t("profile.noProfileMessage"));
        }).finally(() => setIsLoading(false));
      }}
      isEmpty={!profile && !isLoading && !error}
      emptyIcon="person-outline"
      emptyTitle={t("profile.noProfile")}
      emptyMessage={t("profile.noProfileMessage")}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: background }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {profile && (
          <>
            {/* Avatar + Name */}
            <View style={styles.headerSection}>
              <View style={[styles.avatar, { backgroundColor: tint }]}>
                <ThemedText style={styles.avatarText}>
                  {profile.name.charAt(0).toUpperCase()}
                </ThemedText>
              </View>
              <ThemedText type="defaultSemiBold" style={styles.userName}>
                {profile.name}
              </ThemedText>
              <ThemedText style={[styles.userRole, { color: icon }]}>
                {profile.role}
              </ThemedText>
            </View>

            {/* Info Card */}
            <View style={[styles.card, { backgroundColor: cardBg }]}>
              <View style={[styles.infoRow, { borderBottomColor: borderColor }]}>
                <View style={styles.infoLabel}>
                  <Ionicons name="mail-outline" size={20} color={tint} />
                  <ThemedText style={styles.infoLabelText}>
                    {t("profile.email")}
                  </ThemedText>
                </View>
                <ThemedText style={styles.infoValue}>
                  {profile.email}
                </ThemedText>
              </View>

              <View style={[styles.infoRow, { borderBottomColor: borderColor }]}>
                <View style={styles.infoLabel}>
                  <Ionicons name="person-outline" size={20} color={tint} />
                  <ThemedText style={styles.infoLabelText}>
                    {t("profile.name")}
                  </ThemedText>
                </View>
                <ThemedText style={styles.infoValue}>
                  {profile.name}
                </ThemedText>
              </View>

              <View style={[styles.infoRow, { borderBottomColor: borderColor }]}>
                <View style={styles.infoLabel}>
                  <Ionicons name="shield-outline" size={20} color={tint} />
                  <ThemedText style={styles.infoLabelText}>
                    {t("profile.role")}
                  </ThemedText>
                </View>
                <ThemedText style={styles.infoValue}>
                  {profile.role}
                </ThemedText>
              </View>

              <View style={[styles.infoRow, styles.lastRow]}>
                <View style={styles.infoLabel}>
                  <Ionicons name="calendar-outline" size={20} color={tint} />
                  <ThemedText style={styles.infoLabelText}>
                    {t("profile.memberSince")}
                  </ThemedText>
                </View>
                <ThemedText style={styles.infoValue}>
                  {formatDate(profile.createdAt)}
                </ThemedText>
              </View>
            </View>

            {/* Logout Button */}
            <View style={styles.logoutContainer}>
              <CustomButton
                type="delete"
                size="full"
                label={
                  loggingOut
                    ? t("profile.loggingOut")
                    : t("auth.logoutButton")
                }
                onPress={handleLogout}
                disabled={loggingOut}
              />
            </View>
          </>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  headerSection: {
    alignItems: "center",
    paddingVertical: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
  },
  userName: {
    fontSize: 22,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoLabelText: {
    fontSize: 15,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "500",
  },
  logoutContainer: {
    marginTop: 8,
  },
});
