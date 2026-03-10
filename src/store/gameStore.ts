import { create } from "zustand";
import { Player, WordEntry, Game } from "../domain/entities";

interface GameState {
  // Configuración
  numPlayers: number;
  numImpostors: number;
  players: Player[];
  collectedWords: WordEntry[];
  currentGame: Game | null;

  // Acciones
  setNumPlayers: (n: number) => void;
  setNumImpostors: (n: number) => void;
  setPlayers: (players: Player[]) => void;
  addWord: (entry: WordEntry) => void;
  setGame: (game: Game) => void;
  reset: () => void;
  resetWords: () => void;
}

const initialState = {
  numPlayers: 4,
  numImpostors: 1,
  players: [],
  collectedWords: [],
  currentGame: null,
};

export const useGameStore = create<GameState>((set) => ({
  ...initialState,

  setNumPlayers: (numPlayers) => set({ numPlayers }),
  setNumImpostors: (numImpostors) => set({ numImpostors }),
  setPlayers: (players) => set({ players }),
  addWord: (entry) =>
    set((state) => ({
      collectedWords: [...state.collectedWords, entry],
    })),
  setGame: (currentGame) => set({ currentGame }),
  reset: () => set(initialState),
  resetWords: () => set({ collectedWords: [] }),
}));
