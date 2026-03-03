type SetState = (partial: Record<string, unknown>) => void;

export const createWithLoading = (
  set: SetState,
  loadingKey: string = "isLoading",
) => {
  return async <T>(operation: () => Promise<T>): Promise<T> => {
    set({ [loadingKey]: true });
    try {
      const result = await operation();
      set({ [loadingKey]: false });
      return result;
    } catch (error) {
      set({ [loadingKey]: false });
      throw error;
    }
  };
};
