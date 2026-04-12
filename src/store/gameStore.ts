import { create } from 'zustand';
import { Player, WordEntry, Game } from '../domain/entities';

interface GameState {
  numPlayers: number;
  numImpostors: number;
  players: Player[];
  collectedWords: WordEntry[];
  currentGame: Game | null;
  usedWords: string[];
  characterIndices: number[];
  selectedCategory: string | null;
  setCharacterIndices: (indices: number[]) => void;


  setNumPlayers: (n: number) => void;
  setNumImpostors: (n: number) => void;
  setPlayers: (players: Player[]) => void;
  addWord: (entry: WordEntry) => void;
  setGame: (game: Game) => void;
  addUsedWord: (word: string) => void;
  reset: () => void;
  resetWords: () => void;
  setSelectedCategory: (category: string | null) => void;
}

const initialState = {
  numPlayers: 4,
  numImpostors: 1,
  players: [],
  collectedWords: [],
  currentGame: null,
  usedWords: [],
  characterIndices: [],
  selectedCategory: null,
};

export const useGameStore = create<GameState>((set) => ({
  ...initialState,
  setNumPlayers:  (numPlayers) => set({ numPlayers }),
  setNumImpostors:(numImpostors) => set({ numImpostors }),
  setPlayers:     (players) => set({ players }),
  addWord:        (entry) => set((s) => ({ collectedWords: [...s.collectedWords, entry] })),
  setGame:        (currentGame) => set({ currentGame }),
  addUsedWord:    (word) => set((s) => ({ usedWords: [...s.usedWords, word] })),
  reset:          () => set(initialState),
  resetWords:     () => set({ collectedWords: [], usedWords: [] }),
  setCharacterIndices: (characterIndices) => set({ characterIndices }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
}));