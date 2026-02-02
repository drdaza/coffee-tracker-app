import { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useGlobalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useCoffeeStore } from "@/stores/coffeeStore";
import { useAuthStore } from "@/stores/authStore";
import { useFormatDate } from "@/hooks/utils/useFormatDate";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { useCoffeeActions } from "@/hooks/coffee/useCoffeeActions";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { ThemedText } from "@/components/ui/ThemedText";
import { CustomButton } from "@/components/ui/CustomButton";
import { StarRating } from "@/components/common/StarRating";
import { AppError } from "@/api/errors";
import { formatEnumValue } from "@/utils/formatters";
import { formatPrice } from "@/utils/price";
import { brewingMethodIcons } from "@/constants/coffeeIcons";

export default function CoffeeInformationScreen() {
  const { id } = useGlobalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { formatDate } = useFormatDate();

  // Theme colors
  const background = useThemeColor({}, "background");
  const tint = useThemeColor({}, "tint");
  const icon = useThemeColor({}, "icon");
  const cardBg = useThemeColor({}, "cardBackground");
  const borderColor = useThemeColor({}, "border");

  // Store state
  const { coffeeDetail, myCollection, isLoading, fetchCoffee } =
    useCoffeeStore();
  const { user } = useAuthStore();

  // Local state
  const [error, setError] = useState<string | null>(null);

  // Check if coffee is in user's collection
  const isInCollection = myCollection.some((c) => c.id === id);

  // Coffee actions hook
  const {
    isCollectionLoading,
    isDeleting,
    handleCollectionToggle,
    handleEdit,
    handleDelete,
  } = useCoffeeActions({
    coffeeId: id || "",
    isInCollection,
  });

  // Check if user can edit/delete (creator or admin)
  const canModify =
    coffeeDetail?.isCreator === true || user?.role === "ADMIN";

  // Fetch coffee data on mount
  useEffect(() => {
    const loadCoffee = async () => {
      if (!id) return;
      try {
        setError(null);
        await fetchCoffee(id);
      } catch (err) {
        const errorMessage =
          err instanceof AppError
            ? err.getUserMessage()
            : t("coffeeDetail.fetchError");
        setError(errorMessage);
      }
    };

    loadCoffee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Retry fetching coffee
  const handleRetry = () => {
    if (id) {
      setError(null);
      fetchCoffee(id).catch((err) => {
        const errorMessage =
          err instanceof AppError
            ? err.getUserMessage()
            : t("coffeeDetail.fetchError");
        setError(errorMessage);
      });
    }
  };

  return (
    <ScreenLayout
      loading={isLoading && !coffeeDetail}
      error={error}
      onRetry={handleRetry}
      isEmpty={!coffeeDetail && !isLoading && !error}
      emptyIcon="cafe-outline"
      emptyTitle={t("coffeeDetail.notFound")}
      emptyMessage={t("coffeeDetail.notFoundMessage")}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: background }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {coffeeDetail && (
          <>
            {/* Header Section */}
            <View style={styles.headerSection}>
              <ThemedText type="title" style={styles.name}>
                {coffeeDetail.name}
              </ThemedText>
              {coffeeDetail.roaster && (
                <ThemedText type="subtitle" style={styles.roaster}>
                  {coffeeDetail.roaster}
                </ThemedText>
              )}
              {coffeeDetail.rate !== null && coffeeDetail.rate > 0 && (
                <View style={styles.ratingContainer}>
                  <StarRating rating={coffeeDetail.rate} size={24} color={tint} />
                  <ThemedText style={styles.ratingText}>
                    {coffeeDetail.rate.toFixed(1)}
                  </ThemedText>
                </View>
              )}
            </View>

            {/* Details Card */}
            <View style={[styles.card, { backgroundColor: cardBg }]}>
              {/* Origin */}
              {coffeeDetail.origin && (
                <View style={[styles.detailRow, { borderBottomColor: borderColor }]}>
                  <View style={styles.detailLabelContainer}>
                    <Ionicons name="location-outline" size={20} color={icon} />
                    <ThemedText style={[styles.detailLabel, { color: icon }]}>
                      {t("coffeeDetail.origin")}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.detailValue}>
                    {coffeeDetail.origin}
                  </ThemedText>
                </View>
              )}

              {/* Roast Level */}
              <View style={[styles.detailRow, { borderBottomColor: borderColor }]}>
                <View style={styles.detailLabelContainer}>
                  <Ionicons name="flame-outline" size={20} color={icon} />
                  <ThemedText style={[styles.detailLabel, { color: icon }]}>
                    {t("coffeeDetail.roastLevel")}
                  </ThemedText>
                </View>
                <ThemedText style={styles.detailValue}>
                  {formatEnumValue(coffeeDetail.roastLevel)}
                </ThemedText>
              </View>

              {/* Brewing Method */}
              <View style={[styles.detailRow, { borderBottomColor: borderColor }]}>
                <View style={styles.detailLabelContainer}>
                  <Ionicons
                    name={brewingMethodIcons[coffeeDetail.brewingMethod]}
                    size={20}
                    color={icon}
                  />
                  <ThemedText style={[styles.detailLabel, { color: icon }]}>
                    {t("coffeeDetail.brewingMethod")}
                  </ThemedText>
                </View>
                <ThemedText style={styles.detailValue}>
                  {formatEnumValue(coffeeDetail.brewingMethod)}
                </ThemedText>
              </View>

              {/* Process */}
              {coffeeDetail.process && (
                <View style={[styles.detailRow, { borderBottomColor: borderColor }]}>
                  <View style={styles.detailLabelContainer}>
                    <Ionicons name="leaf-outline" size={20} color={icon} />
                    <ThemedText style={[styles.detailLabel, { color: icon }]}>
                      {t("coffeeDetail.process")}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.detailValue}>
                    {coffeeDetail.process}
                  </ThemedText>
                </View>
              )}

              {/* Price */}
              {coffeeDetail.price > 0 && (
                <View style={[styles.detailRow, { borderBottomColor: borderColor }]}>
                  <View style={styles.detailLabelContainer}>
                    <Ionicons name="pricetag-outline" size={20} color={icon} />
                    <ThemedText style={[styles.detailLabel, { color: icon }]}>
                      {t("coffeeDetail.price")}
                    </ThemedText>
                  </View>
                  <ThemedText style={[styles.detailValue, styles.priceValue]}>
                    {formatPrice(coffeeDetail.price)}
                  </ThemedText>
                </View>
              )}
            </View>

            {/* Description */}
            {coffeeDetail.description && (
              <View style={[styles.card, { backgroundColor: cardBg }]}>
                <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                  {t("coffeeDetail.description")}
                </ThemedText>
                <ThemedText style={styles.descriptionText}>
                  {coffeeDetail.description}
                </ThemedText>
              </View>
            )}

            {/* Creator Info */}
            <View style={[styles.card, { backgroundColor: cardBg }]}>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                {t("coffeeDetail.createdBy")}
              </ThemedText>
              <View style={styles.creatorRow}>
                <Ionicons name="person-outline" size={20} color={icon} />
                <ThemedText style={styles.creatorName}>
                  {coffeeDetail.creator.name}
                </ThemedText>
              </View>
              <View style={styles.datesContainer}>
                <ThemedText style={[styles.dateText, { color: icon }]}>
                  {t("coffeeDetail.createdAt")}: {formatDate(coffeeDetail.createdAt)}
                </ThemedText>
                <ThemedText style={[styles.dateText, { color: icon }]}>
                  {t("coffeeDetail.updatedAt")}: {formatDate(coffeeDetail.updatedAt)}
                </ThemedText>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              {/* Collection Toggle Button */}
              <CustomButton
                type="action"
                size="full"
                label={
                  isCollectionLoading
                    ? t("common.loading")
                    : isInCollection
                    ? t("coffeeDetail.removeFromCollection")
                    : t("coffeeDetail.addToCollection")
                }
                onPress={handleCollectionToggle}
                disabled={isCollectionLoading}
              />

              {/* Edit Button (conditional) */}
              {canModify && (
                <CustomButton
                  type="base"
                  size="full"
                  label={t("common.edit")}
                  onPress={handleEdit}
                />
              )}

              {/* Delete Button (conditional) */}
              {canModify && (
                <CustomButton
                  type="delete"
                  size="full"
                  label={isDeleting ? t("common.deleting") : t("common.delete")}
                  onPress={handleDelete}
                  disabled={isDeleting}
                />
              )}
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
    marginBottom: 20,
  },
  name: {
    fontSize: 28,
    marginBottom: 4,
  },
  roaster: {
    fontSize: 18,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "600",
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  detailLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  priceValue: {
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
  },
  creatorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  creatorName: {
    fontSize: 16,
  },
  datesContainer: {
    gap: 4,
  },
  dateText: {
    fontSize: 13,
  },
  actionsContainer: {
    gap: 12,
    marginTop: 8,
  },
});
