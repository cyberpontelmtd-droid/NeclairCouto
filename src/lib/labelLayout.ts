const COLUMNS_BY_PER_PAGE: Record<number, number> = {
  6: 2,
  8: 2,
  10: 2,
  12: 3,
  15: 3,
  20: 4,
  24: 4,
};

export function columnsForPerPage(perPage: number) {
  return COLUMNS_BY_PER_PAGE[perPage] ?? Math.max(1, Math.round(Math.sqrt(perPage * 0.7)));
}
