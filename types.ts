
export enum ChristmasConcept {
  TRADITIONAL = 'TRADITIONAL',
  WHITE_WINTER = 'WHITE_WINTER',
  CUTE_FUN = 'CUTE_FUN',
  LUXURY = 'LUXURY',
  COZY = 'COZY',
  MINIMALIST = 'MINIMALIST'
}

export interface ConceptDetail {
  id: ChristmasConcept;
  title: string;
  description: string;
  icon: string;
  prompt: string;
  colorClass: string;
}

export interface AppState {
  sourceImage: string | null;
  resultImage: string | null;
  isLoading: boolean;
  selectedConcept: ChristmasConcept;
  error: string | null;
}
