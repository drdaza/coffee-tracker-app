import { CoffeeListScreen } from "@/components/coffee/CoffeeListScreen";
import { useCoffeeStore } from "@/stores/coffeeStore";

export default function MyCollectionScreen() {
  const {
    myCollection,
    collectionMeta,
    isLoading,
    isLoadingMore,
    fetchMyCollection,
    loadMoreCollection,
  } = useCoffeeStore();

  return (
    <CoffeeListScreen
      data={myCollection}
      meta={collectionMeta}
      isLoading={isLoading}
      isLoadingMore={isLoadingMore}
      fetch={fetchMyCollection}
      loadMore={loadMoreCollection}
      emptyIcon="cafe-outline"
      emptyTitleKey="collection.empty"
      emptyMessageKey="collection.emptyMessage"
    />
  );
}
