import { Player, WordEntry, Assignment, Game } from '../entities';

export class BuildGameUseCase {
  execute(
    players: Player[],
    words: WordEntry[],
    numImpostors: number,
    usedWordIds: string[] = [],
  ): Game {
    if (!players || players.length === 0) {
      throw new Error('No hay jugadores disponibles');
    }
    if (!words || words.length === 0) {
      throw new Error('No hay palabras disponibles');
    }

    // Filtra palabras ya usadas
    const available = words.filter(w => !usedWordIds.includes(w.word));
    const pool = available.length > 0 ? available : words; // si se agotaron, recicla todas
    const allUsed = available.length === 0;

    // Shuffle el pool y elige la primera
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const chosen = shuffled[0];

    // Shuffle jugadores para asignar impostores aleatoriamente
    const shuffledIndices = Array.from({ length: players.length }, (_, i) => i)
      .sort(() => Math.random() - 0.5);
    const impostorSet = new Set(shuffledIndices.slice(0, numImpostors));

    const assignments: Assignment[] = players.map((player, i) => ({
      player,
      role: impostorSet.has(i) ? 'impostor' : 'word',
    }));

    return {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      chosenWord: chosen,
      assignments,
      numImpostors,
      createdAt: new Date(),
      allWordsUsed: allUsed,
    };
  }
}