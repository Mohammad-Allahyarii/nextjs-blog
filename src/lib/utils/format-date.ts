const dateFormatter = new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" });

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) return "—";

  return dateFormatter.format(date);
}
