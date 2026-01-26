import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { useCoffeeStore } from "@/stores/coffeeStore";
import { AppError } from "@/api/errors";

interface UseCoffeeActionsOptions {
  coffeeId: string;
  isInCollection: boolean;
  onCollectionChange?: (inCollection: boolean) => void;
}

export function useCoffeeActions({
  coffeeId,
  isInCollection,
  onCollectionChange,
}: UseCoffeeActionsOptions) {
  const { t } = useTranslation();
  const { addToCollection, removeFromCollection, deleteCoffee } =
    useCoffeeStore();

  const [isCollectionLoading, setIsCollectionLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCollectionToggle = useCallback(async () => {
    setIsCollectionLoading(true);
    try {
      if (isInCollection) {
        await removeFromCollection(coffeeId);
        onCollectionChange?.(false);
      } else {
        await addToCollection(coffeeId);
        onCollectionChange?.(true);
      }
    } catch (err) {
      const message =
        err instanceof AppError
          ? err.getUserMessage()
          : t("coffeeDetail.collectionError");
      Alert.alert(t("common.error"), message);
    } finally {
      setIsCollectionLoading(false);
    }
  }, [
    coffeeId,
    isInCollection,
    addToCollection,
    removeFromCollection,
    onCollectionChange,
    t,
  ]);

  const handleEdit = useCallback(() => {
    router.push(`/(coffees)/edit/${coffeeId}`);
  }, [coffeeId]);

  const handleDelete = useCallback(async () => {
    Alert.alert(
      t("coffeeDetail.deleteTitle"),
      t("coffeeDetail.deleteConfirmation"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteCoffee(coffeeId);
              router.back();
            } catch (err) {
              const message =
                err instanceof AppError
                  ? err.getUserMessage()
                  : t("coffeeDetail.deleteError");
              Alert.alert(t("common.error"), message);
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  }, [coffeeId, deleteCoffee, t]);

  return {
    isCollectionLoading,
    isDeleting,
    handleCollectionToggle,
    handleEdit,
    handleDelete,
  };
}
