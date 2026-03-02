import { CoffeeListScreen } from "@/components/coffee/CoffeeListScreen";
import { useCoffeeStore } from "@/stores/coffeeStore";

export default function BrowseScreen() {
  const {
    coffees,
    coffeesMeta,
    isLoading,
    isLoadingMore,
    fetchCoffees,
    loadMoreCoffees,
  } = useCoffeeStore();

  return (
    <CoffeeListScreen
      data={coffees}
      meta={coffeesMeta}
      isLoading={isLoading}
      isLoadingMore={isLoadingMore}
      fetch={fetchCoffees}
      loadMore={loadMoreCoffees}
      emptyIcon="cafe-outline"
      emptyTitleKey="browse.noCoffeesYet"
      emptyMessageKey="browse.noCoffeesMessage"
    />
  );
}
