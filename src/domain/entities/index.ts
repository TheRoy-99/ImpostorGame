export interface Player {
  id: string;
  name: string;
}

export interface WordEntry {
  player: Player;
  word: string;
}

export type Role = 'word' | 'impostor';

export interface Assignment {
  player: Player;
  role: Role;
}

export interface Game {
  id: string;
  chosenWord: WordEntry;
  assignments: Assignment[];
  numImpostors: number;
  createdAt: Date;
  allWordsUsed?: boolean;
}