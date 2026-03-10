import AsyncStorage from "@react-native-async-storage/async-storage";
import { Game } from "../../domain/entities";
import { IGameRepository } from "../../domain/repositories/IGameRepository";
import { StorageKeys } from "../storage/StorageKeys";

export class GameRepository implements IGameRepository {
  async saveGame(game: Game): Promise<void> {
    const history = await this.getHistory();
    history.unshift(game);
    await AsyncStorage.setItem(
      StorageKeys.GAME_HISTORY,
      JSON.stringify(history),
    );
  }

  async getHistory(): Promise<Game[]> {
    const raw = await AsyncStorage.getItem(StorageKeys.GAME_HISTORY);
    return raw ? JSON.parse(raw) : [];
  }

  async clearHistory(): Promise<void> {
    await AsyncStorage.removeItem(StorageKeys.GAME_HISTORY);
  }
}
