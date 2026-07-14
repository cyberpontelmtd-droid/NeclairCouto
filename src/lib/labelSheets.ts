const PT_PER_IN = 72;

export function pt(inches: number) {
  return inches * PT_PER_IN;
}

// Pimaco 6180 (equivalente ao padrão Avery 5160): folha Carta, 3 colunas x 10
// linhas, etiquetas de 25,4 x 66,7mm (1in x 2.625in).
export const PIMACO_6180 = {
  id: "pimaco-6180",
  name: "Pimaco 6180 (Carta, 25,4 × 66,7mm, 30/folha)",
  pageWidthIn: 8.5,
  pageHeightIn: 11,
  columns: 3,
  rows: 10,
  labelWidthIn: 2.625,
  labelHeightIn: 1,
  marginLeftIn: 0.1875,
  marginTopIn: 0.5,
  colPitchIn: 2.75,
  rowPitchIn: 1,
} as const;

export const LABELS_PER_SHEET = PIMACO_6180.columns * PIMACO_6180.rows;
