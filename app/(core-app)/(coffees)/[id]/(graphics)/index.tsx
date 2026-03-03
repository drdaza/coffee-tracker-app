import { useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useGlobalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useCoffeeStore } from "@/stores/coffeeStore";
import { useTastingStore } from "@/stores/tastingStore";
import { useAuthStore } from "@/stores/authStore";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { ThemedText } from "@/components/ui/ThemedText";
import { StarRating } from "@/components/common/StarRating";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { TastingCard } from "@/components/tasting/TastingCard";
import { AppError } from "@/api/errors";

export default function CoffeeGraphicsScreen() {
  const { id } = useGlobalSearchParams<{ id: string }>();
  const { t } = useTranslation();

  // Theme colors
  const background = useThemeColor({}, "background");
  const tint = useThemeColor({}, "tint");
  const icon = useThemeColor({}, "icon");
  const cardBg = useThemeColor({}, "cardBackground");
  const borderColor = useThemeColor({}, "border");

  // Store state
  const { coffeeDetail, isLoading } = useCoffeeStore();
  const { user } = useAuthStore();
  const {
    coffeeTastings,
    fetchCoffeeTastings,
    deleteTasting,
    isLoading: tastingLoading,
  } = useTastingStore();

  // Can create tasting only if creator/collector AND hasn't tasted yet
  const canCreateTasting =
    (coffeeDetail?.isCreator || coffeeDetail?.isInCollection) &&
    !coffeeDetail?.hasTasted;

  useEffect(() => {
    if (id) {
      fetchCoffeeTastings(id);
    }
  }, [id, fetchCoffeeTastings]);

  const handleDeleteTasting = async (tastingId: string) => {
    try {
      await deleteTasting(tastingId);
    } catch (err) {
      // Error is thrown to UI - we could show an alert here
      const message =
        err instanceof AppError
          ? err.getUserMessage()
          : t("tasting.deleteError");
      // silent fail for now, the tasting stays in the list
      console.warn(message);
    }
  };

  const handleAddTasting = () => {
    if (id) {
      router.push(`/(coffees)/tasting/create/${id}`);
    }
  };

  const handleEditTasting = (tastingId: string) => {
    router.push(`/(coffees)/tasting/edit/${tastingId}`);
  };

  return (
    <ScreenLayout
      loading={(isLoading || tastingLoading) && !coffeeDetail}
      isEmpty={!coffeeDetail && !isLoading}
      emptyIcon="analytics-outline"
      emptyTitle={t("coffeeDetail.noStats")}
      emptyMessage={t("coffeeDetail.noStatsMessage")}
    >
      <View style={styles.wrapper}>
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
                <View
                  style={[styles.statRow, { borderBottomColor: borderColor }]}
                >
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
                <View
                  style={[styles.statRow, { borderBottomColor: borderColor }]}
                >
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

              {/* Tasting History */}
              <View style={[styles.card, { backgroundColor: cardBg }]}>
                <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                  {t("coffeeDetail.tastingHistory")}
                </ThemedText>

                {coffeeTastings.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Ionicons
                      name="cafe-outline"
                      size={48}
                      color={icon}
                      style={styles.emptyIcon}
                    />
                    <ThemedText style={[styles.emptyText, { color: icon }]}>
                      {t("tasting.noTastings")}
                    </ThemedText>
                    <ThemedText style={[styles.emptySubtext, { color: icon }]}>
                      {t("tasting.noTastingsMessage")}
                    </ThemedText>
                  </View>
                ) : (
                  coffeeTastings.map((tasting) => (
                    <TastingCard
                      key={tasting.id}
                      tasting={tasting}
                      isOwner={tasting.userId === user?.id}
                      onPress={() => handleEditTasting(tasting.id)}
                      onDelete={() => handleDeleteTasting(tasting.id)}
                    />
                  ))
                )}
              </View>
            </>
          )}
        </ScrollView>

        {/* FAB for adding tasting — only if user is creator/collector and hasn't tasted yet */}
        {canCreateTasting ? (
          <FloatingActionButton
            onPress={handleAddTasting}
            icon="add"
            style={styles.fab}
          />
        ) : null}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80,
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
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },
  emptyIcon: {
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 45,
  },
});
