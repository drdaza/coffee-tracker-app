import React from "react";
import { View, Pressable, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ui/ThemedText";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { useFormatDate } from "@/hooks/utils/useFormatDate";
import type { Tasting } from "@/api/tasting/types";

interface TastingCardProps {
  tasting: Tasting;
  onPress?: () => void;
  onDelete?: () => void;
  isOwner: boolean;
}

const SCORE_KEYS = [
  { key: "aroma" as const, abbr: "AR" },
  { key: "flavor" as const, abbr: "FL" },
  { key: "body" as const, abbr: "BD" },
  { key: "acidity" as const, abbr: "AC" },
  { key: "balance" as const, abbr: "BL" },
  { key: "aftertaste" as const, abbr: "AF" },
];

export const TastingCard = ({
  tasting,
  onPress,
  onDelete,
  isOwner,
}: TastingCardProps) => {
  const cardBg = useThemeColor({}, "cardBackground");
  const tint = useThemeColor({}, "tint");
  const icon = useThemeColor({}, "icon");
  const borderColor = useThemeColor({}, "border");
  const errorColor = useThemeColor({}, "error");

  const { t } = useTranslation();
  const { formatDate } = useFormatDate();

  const handleDelete = () => {
    Alert.alert(t("tasting.deleteTitle"), t("tasting.deleteConfirmation"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: onDelete,
      },
    ]);
  };

  return (
    <Pressable
      style={[styles.card, { backgroundColor: cardBg }]}
      onPress={onPress}
    >
      {/* Header: Overall Score + Date */}
      <View style={[styles.headerRow, { borderBottomColor: borderColor }]}>
        <View style={styles.scoreContainer}>
          <Ionicons name="star" size={18} color={tint} />
          <ThemedText type="defaultSemiBold" style={[styles.overallScore, { color: tint }]}>
            {tasting.overallScore.toFixed(1)}/10
          </ThemedText>
        </View>
        <View style={styles.headerRight}>
          <ThemedText style={[styles.date, { color: icon }]}>
            {formatDate(tasting.createdAt)}
          </ThemedText>
          {isOwner && onDelete && (
            <Pressable onPress={handleDelete} hitSlop={8}>
              <Ionicons name="trash-outline" size={18} color={errorColor} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Score Row */}
      <View style={styles.scoresRow}>
        {SCORE_KEYS.map(({ key, abbr }) => (
          <View key={key} style={styles.scoreItem}>
            <ThemedText style={[styles.scoreAbbr, { color: icon }]}>
              {abbr}
            </ThemedText>
            <ThemedText
              type="defaultSemiBold"
              style={[
                styles.scoreValue,
                { color: tasting[key] > 0 ? tint : icon },
              ]}
            >
              {tasting[key]}
            </ThemedText>
          </View>
        ))}
      </View>

      {/* Notes */}
      {tasting.notes.length > 0 && (
        <ThemedText style={[styles.notes, { color: icon }]} numberOfLines={2}>
          {tasting.notes.join(", ")}
        </ThemedText>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  overallScore: {
    fontSize: 18,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  date: {
    fontSize: 13,
  },
  scoresRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  scoreItem: {
    alignItems: "center",
    gap: 2,
  },
  scoreAbbr: {
    fontSize: 11,
    fontWeight: "600",
  },
  scoreValue: {
    fontSize: 16,
  },
  notes: {
    fontSize: 13,
    marginTop: 4,
  },
});
