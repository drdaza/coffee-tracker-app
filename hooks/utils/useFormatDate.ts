import { useTranslation } from "@/hooks/i18n/useTranslation";

export const useFormatDate = () => {
  const { locale } = useTranslation();

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);

    // Use the current locale for formatting
    return date.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return { formatDate };
};
