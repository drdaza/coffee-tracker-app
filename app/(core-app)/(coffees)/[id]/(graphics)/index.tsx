import { View, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useCoffeeStore } from "@/stores/coffeeStore";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { ThemedText } from "@/components/ui/ThemedText";
import { StarRating } from "@/components/common/StarRating";

export default function CoffeeGraphicsScreen() {
  useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();

  // Theme colors
  const background = useThemeColor({}, "background");
  const tint = useThemeColor({}, "tint");
  const icon = useThemeColor({}, "icon");
  const cardBg = useThemeColor({}, "cardBackground");
  const borderColor = useThemeColor({}, "border");

  // Store state
  const { coffeeDetail, isLoading } = useCoffeeStore();

  return (
    <ScreenLayout
      loading={isLoading && !coffeeDetail}
      isEmpty={!coffeeDetail && !isLoading}
      emptyIcon="analytics-outline"
      emptyTitle={t("coffeeDetail.noStats")}
      emptyMessage={t("coffeeDetail.noStatsMessage")}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: background }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {coffeeDetail && (
          <>
            {/* Stats Overview Card */}
            <View style={[styles.card, { backgroundColor: cardBg }]}>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                {t("coffeeDetail.statsOverview")}
              </ThemedText>

              {/* Rating Stat */}
              <View style={[styles.statRow, { borderBottomColor: borderColor }]}>
                <View style={styles.statLabelContainer}>
                  <Ionicons name="star" size={24} color={tint} />
                  <ThemedText style={styles.statLabel}>
                    {t("coffeeDetail.rating")}
                  </ThemedText>
                </View>
                <View style={styles.statValueContainer}>
                  {coffeeDetail.rate !== null && coffeeDetail.rate > 0 ? (
                    <>
                      <StarRating
                        rating={coffeeDetail.rate}
                        size={18}
                        color={tint}
                      />
                      <ThemedText style={styles.statValue}>
                        {coffeeDetail.rate.toFixed(1)}/5
                      </ThemedText>
                    </>
                  ) : (
                    <ThemedText style={[styles.statValue, { color: icon }]}>
                      {t("coffeeDetail.noRating")}
                    </ThemedText>
                  )}
                </View>
              </View>

              {/* Collections Count */}
              <View style={[styles.statRow, { borderBottomColor: borderColor }]}>
                <View style={styles.statLabelContainer}>
                  <Ionicons name="heart" size={24} color={tint} />
                  <ThemedText style={styles.statLabel}>
                    {t("coffeeDetail.inCollections")}
                  </ThemedText>
                </View>
                <ThemedText style={[styles.statValue, styles.statNumber]}>
                  {coffeeDetail.stats.totalInCollections}
                </ThemedText>
              </View>

              {/* Tastings Count */}
              <View style={[styles.statRow, styles.lastStatRow]}>
                <View style={styles.statLabelContainer}>
                  <Ionicons name="cafe" size={24} color={tint} />
                  <ThemedText style={styles.statLabel}>
                    {t("coffeeDetail.totalTastings")}
                  </ThemedText>
                </View>
                <ThemedText style={[styles.statValue, styles.statNumber]}>
                  {coffeeDetail.stats.totalTastings}
                </ThemedText>
              </View>
            </View>

            {/* Flavor Wheel Placeholder */}
            <View style={[styles.card, { backgroundColor: cardBg }]}>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                {t("coffeeDetail.flavorProfile")}
              </ThemedText>
              <View style={styles.placeholderContainer}>
                <Ionicons
                  name="pie-chart-outline"
                  size={64}
                  color={icon}
                  style={styles.placeholderIcon}
                />
                <ThemedText style={[styles.placeholderText, { color: icon }]}>
                  {t("coffeeDetail.flavorChartPlaceholder")}
                </ThemedText>
              </View>
            </View>

            {/* Characteristics Radar Chart Placeholder */}
            <View style={[styles.card, { backgroundColor: cardBg }]}>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                {t("coffeeDetail.characteristics")}
              </ThemedText>
              <View style={styles.placeholderContainer}>
                <Ionicons
                  name="analytics-outline"
                  size={64}
                  color={icon}
                  style={styles.placeholderIcon}
                />
                <ThemedText style={[styles.placeholderText, { color: icon }]}>
                  {t("coffeeDetail.characteristicsChartPlaceholder")}
                </ThemedText>
              </View>
            </View>

            {/* Tasting History Placeholder */}
            <View style={[styles.card, { backgroundColor: cardBg }]}>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                {t("coffeeDetail.tastingHistory")}
              </ThemedText>
              <View style={styles.placeholderContainer}>
                <Ionicons
                  name="time-outline"
                  size={64}
                  color={icon}
                  style={styles.placeholderIcon}
                />
                <ThemedText style={[styles.placeholderText, { color: icon }]}>
                  {t("coffeeDetail.tastingHistoryPlaceholder")}
                </ThemedText>
              </View>
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
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  lastStatRow: {
    borderBottomWidth: 0,
  },
  statLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statLabel: {
    fontSize: 15,
  },
  statValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statValue: {
    fontSize: 15,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
  },
  placeholderContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
  },
  placeholderIcon: {
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 14,
    textAlign: "center",
  },
});
