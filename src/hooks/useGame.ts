import { useGameStore } from '../store/gameStore';
import { BuildGameUseCase } from '../domain/useCases/BuildGameUseCase';
import { GameRepository } from '../data/repositories/GameRepository';

const buildGameUseCase = new BuildGameUseCase();
const gameRepository = new GameRepository();

export function useGame() {
  const {
    players,
    collectedWords,
    numImpostors,
    setGame,
    reset,
    resetWords,
  } = useGameStore();

  const startGame = async () => {
    const game = buildGameUseCase.execute(
      players,
      collectedWords,
      numImpostors
    );
    setGame(game);
    await gameRepository.saveGame(game);
    return game;
  };

  return {
    startGame,
    reset,
    resetWords,
  };
}