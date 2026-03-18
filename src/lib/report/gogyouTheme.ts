export interface GogyouTheme {
  heading: string;
  tableHeader: string;
  border: string;
  rowAlt: string;
  highlight: string;
  bg: string;
}

const THEMES: Record<string, GogyouTheme> = {
  木: {
    heading:     "#2C3E2D",
    tableHeader: "#E8EFE7",
    border:      "#C8D0C2",
    rowAlt:      "#F4F7F3",
    highlight:   "#FFF9E6",
    bg:          "#FAFAF6",
  },
  水: {
    heading:     "#1C2B3A",
    tableHeader: "#DDE6EF",
    border:      "#B8C8D8",
    rowAlt:      "#EFF4F9",
    highlight:   "#E6F0FF",
    bg:          "#F6F9FC",
  },
  火: {
    heading:     "#7B1D1D",
    tableHeader: "#F5E4E4",
    border:      "#D8B4B4",
    rowAlt:      "#FDF5F5",
    highlight:   "#FFF5E6",
    bg:          "#FDF8F8",
  },
  土: {
    heading:     "#6B4C00",
    tableHeader: "#F5EDD4",
    border:      "#D4BF8A",
    rowAlt:      "#FAF5E8",
    highlight:   "#FFFBE6",
    bg:          "#FDFAF4",
  },
  金: {
    heading:     "#3A3A3A",
    tableHeader: "#EBEBEB",
    border:      "#C8C8C8",
    rowAlt:      "#F5F5F5",
    highlight:   "#FAFAE6",
    bg:          "#FAFAFA",
  },
};

/** hm.cL（木/水/火/土/金）からテーマを返す。未知の値は木性にフォールバック */
export function getGogyouTheme(element: string): GogyouTheme {
  return THEMES[element] ?? THEMES["木"];
}
