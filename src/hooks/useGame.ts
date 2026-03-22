import { useGameStore } from '../store/gameStore';
import { BuildGameUseCase } from '../domain/useCases/BuildGameUseCase';
import { GameRepository } from '../data/repositories/GameRepository';

const buildGameUseCase = new BuildGameUseCase();
const gameRepository = new GameRepository();

export function useGame() {
  const { setGame, addUsedWord, reset, resetWords } = useGameStore();

  const startGame = async () => {
    const { players, collectedWords, numImpostors, usedWords } =
      useGameStore.getState();

    if (collectedWords.length === 0) {
      console.warn('useGame: no hay palabras');
      return null;
    }
    if (players.length === 0) {
      console.warn('useGame: no hay jugadores');
      return null;
    }

    try {
      const game = buildGameUseCase.execute(
        players,
        collectedWords,
        numImpostors,
        usedWords,
      );
      setGame(game);
      addUsedWord(game.chosenWord.word);
      await gameRepository.saveGame(game);
      return game;
    } catch (error) {
      console.error('useGame error:', error);
      return null;
    }
  };

  return { startGame, reset, resetWords };
}