import { useCallback } from "react";
import { router } from "expo-router";
import { useCoffeeStore } from "@/stores/coffeeStore";
import type { Coffee } from "@/api/coffee";

export const useCoffeeList = () => {
  const { setCoffeeDetail } = useCoffeeStore();

  const handleCoffeePress = useCallback(
    (coffee: Coffee) => {
      setCoffeeDetail(coffee);
      router.push(`/(core-app)/(coffees)/${coffee.id}`);
    },
    [setCoffeeDetail],
  );

  const handleAddCoffee = useCallback(() => {
    router.push("/(core-app)/(coffees)/(create)");
  }, []);

  return {
    handleCoffeePress,
    handleAddCoffee,
  };
};
