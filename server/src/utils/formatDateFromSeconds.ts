export const formatDateFromSeconds = (seconds: number): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return new Date(seconds * 1000).toLocaleString("en-US", options);
};
