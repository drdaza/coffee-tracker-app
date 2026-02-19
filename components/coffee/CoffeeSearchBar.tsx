import React, { useCallback, useState } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CustomInput } from "@/components/ui/CustomInput";
import { ThemedText } from "@/components/ui/ThemedText";
import { EnumPickerModal } from "@/components/common/EnumPickerModal";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useTranslation } from "@/hooks/i18n/useTranslation";

type SortByField = "name" | "price" | "rate" | "createdAt";
type SortOrder = "asc" | "desc";

interface CoffeeSearchBarProps {
  searchText: string;
  onSearchTextChange: (text: string) => void;
  sortBy: SortByField;
  sortOrder: SortOrder;
  minRate: number | undefined;
  hasActiveFilters: boolean;
  onSortByChange: (sortBy: SortByField) => void;
  onSortOrderChange: (sortOrder: SortOrder) => void;
  onMinRateChange: (minRate: number | undefined) => void;
  onClearFilters: () => void;
}

const SORT_BY_OPTIONS: SortByField[] = ["createdAt", "name", "price", "rate"];
const SORT_ORDER_OPTIONS: SortOrder[] = ["desc", "asc"];
const RATING_OPTIONS = ["1", "2", "3", "4", "5"] as const;

export function CoffeeSearchBar({
  searchText,
  onSearchTextChange,
  sortBy,
  sortOrder,
  minRate,
  hasActiveFilters,
  onSortByChange,
  onSortOrderChange,
  onMinRateChange,
  onClearFilters,
}: CoffeeSearchBarProps) {
  const { t } = useTranslation();
  const tint = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");

  const [showSortByPicker, setShowSortByPicker] = useState(false);
  const [showSortOrderPicker, setShowSortOrderPicker] = useState(false);
  const [showRatingPicker, setShowRatingPicker] = useState(false);

  const sortByLabels: Record<SortByField, string> = {
    createdAt: t("search.sortOptions.createdAt"),
    name: t("search.sortOptions.name"),
    price: t("search.sortOptions.price"),
    rate: t("search.sortOptions.rate"),
  };

  const sortOrderLabels: Record<SortOrder, string> = {
    asc: t("search.sortAsc"),
    desc: t("search.sortDesc"),
  };

  const ratingLabels: Record<string, string> = {
    "1": "1+",
    "2": "2+",
    "3": "3+",
    "4": "4+",
    "5": "5",
  };

  const handleSortBySelect = useCallback(
    (value: SortByField | null) => {
      onSortByChange(value ?? "createdAt");
    },
    [onSortByChange],
  );

  const handleSortOrderSelect = useCallback(
    (value: SortOrder | null) => {
      onSortOrderChange(value ?? "desc");
    },
    [onSortOrderChange],
  );

  const handleRatingSelect = useCallback(
    (value: string | null) => {
      onMinRateChange(value ? Number(value) : undefined);
    },
    [onMinRateChange],
  );

  const isSortActive = sortBy !== "createdAt";
  const isOrderActive = sortOrder !== "desc";
  const isRatingActive = minRate !== undefined;
  const showClear = hasActiveFilters || searchText.length > 0;

  return (
    <View style={styles.container}>
      <CustomInput
        size="full"
        showLabel={false}
        placeholder={t("search.placeholder")}
        value={searchText}
        onChangeText={onSearchTextChange}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContainer}
      >
        {/* Sort By chip */}
        <Pressable
          style={[
            styles.chip,
            { borderColor: isSortActive ? tint : iconColor },
            isSortActive ? { backgroundColor: tint + "20" } : null,
          ]}
          onPress={() => setShowSortByPicker(true)}
        >
          <Ionicons
            name="swap-vertical"
            size={14}
            color={isSortActive ? tint : iconColor}
          />
          <ThemedText
            style={[
              styles.chipText,
              { color: isSortActive ? tint : textColor },
            ]}
          >
            {isSortActive ? sortByLabels[sortBy] : t("search.sort")}
          </ThemedText>
        </Pressable>

        {/* Sort Order chip */}
        <Pressable
          style={[
            styles.chip,
            { borderColor: isOrderActive ? tint : iconColor },
            isOrderActive ? { backgroundColor: tint + "20" } : null,
          ]}
          onPress={() => setShowSortOrderPicker(true)}
        >
          <Ionicons
            name={sortOrder === "asc" ? "arrow-up" : "arrow-down"}
            size={14}
            color={isOrderActive ? tint : iconColor}
          />
          <ThemedText
            style={[
              styles.chipText,
              { color: isOrderActive ? tint : textColor },
            ]}
          >
            {sortOrderLabels[sortOrder]}
          </ThemedText>
        </Pressable>

        {/* Rating chip */}
        <Pressable
          style={[
            styles.chip,
            { borderColor: isRatingActive ? tint : iconColor },
            isRatingActive ? { backgroundColor: tint + "20" } : null,
          ]}
          onPress={() => setShowRatingPicker(true)}
        >
          <Ionicons
            name="star"
            size={14}
            color={isRatingActive ? tint : iconColor}
          />
          <ThemedText
            style={[
              styles.chipText,
              { color: isRatingActive ? tint : textColor },
            ]}
          >
            {isRatingActive
              ? `${t("search.rating")} ${minRate}+`
              : t("search.rating")}
          </ThemedText>
        </Pressable>

        {/* Clear filters chip */}
        {showClear ? (
          <Pressable
            style={[styles.chip, styles.clearChip, { borderColor: tint }]}
            onPress={onClearFilters}
          >
            <Ionicons name="close-circle" size={14} color={tint} />
            <ThemedText style={[styles.chipText, { color: tint }]}>
              {t("search.clearFilters")}
            </ThemedText>
          </Pressable>
        ) : null}
      </ScrollView>

      {/* Sort By Picker */}
      <EnumPickerModal
        visible={showSortByPicker}
        onClose={() => setShowSortByPicker(false)}
        title={t("search.sort")}
        options={SORT_BY_OPTIONS}
        labels={sortByLabels}
        selectedValue={sortBy}
        onSelect={handleSortBySelect}
        allowNone={false}
      />

      {/* Sort Order Picker */}
      <EnumPickerModal
        visible={showSortOrderPicker}
        onClose={() => setShowSortOrderPicker(false)}
        title={t("search.sortOrder")}
        options={SORT_ORDER_OPTIONS}
        labels={sortOrderLabels}
        selectedValue={sortOrder}
        onSelect={handleSortOrderSelect}
        allowNone={false}
      />

      {/* Rating Picker */}
      <EnumPickerModal
        visible={showRatingPicker}
        onClose={() => setShowRatingPicker(false)}
        title={t("search.minRating")}
        options={[...RATING_OPTIONS]}
        labels={ratingLabels}
        selectedValue={minRate?.toString() ?? null}
        onSelect={handleRatingSelect}
        allowNone={true}
        noneLabel={t("search.anyRating")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    gap: 10,
  },
  chipsContainer: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "500",
  },
  clearChip: {
    borderStyle: "dashed",
  },
});
