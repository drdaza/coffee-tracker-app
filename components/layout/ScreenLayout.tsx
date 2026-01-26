import { useThemeColor } from "@/hooks/theme/useThemeColor";
import React, { ReactNode } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Loader } from "@/components/common/Loader";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { Ionicons } from "@expo/vector-icons";

interface ScreenLayoutProps {
  children?: ReactNode;
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

  const Container = ({ children }: { children: ReactNode }) => (
    <View style={[styles.container, { backgroundColor: background }, containerStyle]}>
      {children}
    </View>
  );

  // Loading state
  if (loading) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container>
        <ErrorState message={error} onRetry={onRetry} />
      </Container>
    );
  }

  // Empty state
  if (isEmpty) {
    return (
      <Container>
        <EmptyState icon={emptyIcon} title={emptyTitle} message={emptyMessage} />
      </Container>
    );
  }

  // Content
  return <Container>{children ?? null}</Container>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
