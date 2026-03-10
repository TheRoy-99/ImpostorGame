import { Game } from '../entities';

export interface IGameRepository {
  saveGame(game: Game): Promise<void>;
  getHistory(): Promise<Game[]>;
  clearHistory(): Promise<void>;
}