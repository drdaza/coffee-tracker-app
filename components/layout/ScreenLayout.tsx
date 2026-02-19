import { useThemeColor } from "@/hooks/theme/useThemeColor";
import React, { ReactNode } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Loader } from "@/components/common/Loader";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { Ionicons } from "@expo/vector-icons";

interface ScreenLayoutProps {
  children?: ReactNode;
  headerComponent?: ReactNode;
  loading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
  emptyIcon?: keyof typeof Ionicons.glyphMap;
  emptyTitle?: string;
  emptyMessage?: string;
  onRetry?: () => void;
  containerStyle?: ViewStyle;
}

export const ScreenLayout = ({
  children,
  headerComponent,
  loading = false,
  error = null,
  isEmpty = false,
  emptyIcon = "information-circle-outline",
  emptyTitle = "No data",
  emptyMessage = "There's nothing to display yet.",
  onRetry,
  containerStyle,
}: ScreenLayoutProps) => {
  const background = useThemeColor({}, "background");

  const renderContent = () => {
    if (loading) return <Loader />;
    if (error) return <ErrorState message={error} onRetry={onRetry} />;
    if (isEmpty)
      return (
        <EmptyState icon={emptyIcon} title={emptyTitle} message={emptyMessage} />
      );
    return children ?? null;
  };

  return (
    <View
      style={[styles.container, { backgroundColor: background }, containerStyle]}
    >
      {headerComponent ?? null}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
