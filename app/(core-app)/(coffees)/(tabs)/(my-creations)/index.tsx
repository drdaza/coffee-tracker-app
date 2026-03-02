import { CoffeeListScreen } from "@/components/coffee/CoffeeListScreen";
import { useCoffeeStore } from "@/stores/coffeeStore";

export default function MyCreationsScreen() {
  const {
    myCreations,
    creationsMeta,
    isLoading,
    isLoadingMore,
    fetchMyCreations,
    loadMoreCreations,
  } = useCoffeeStore();

  return (
    <CoffeeListScreen
      data={myCreations}
      meta={creationsMeta}
      isLoading={isLoading}
      isLoadingMore={isLoadingMore}
      fetch={fetchMyCreations}
      loadMore={loadMoreCreations}
      emptyIcon="cafe-outline"
      emptyTitleKey="creations.empty"
      emptyMessageKey="creations.emptyMessage"
    />
  );
}
