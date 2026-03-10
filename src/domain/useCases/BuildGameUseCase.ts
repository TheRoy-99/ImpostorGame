import { Player, WordEntry, Assignment, Game } from "../entities";

export class BuildGameUseCase {
  execute(players: Player[], words: WordEntry[], numImpostors: number): Game {
    // 1. Sortear palabra al azar — silenciosamente
    const chosen = words[Math.floor(Math.random() * words.length)];

    // 2. Elegir impostores al azar
    const impostorIndices = this.pickRandom(players.length, numImpostors);

    // 3. Asignar roles
    const assignments: Assignment[] = players.map((player, i) => ({
      player,
      role: impostorIndices.has(i) ? "impostor" : "word",
    }));

    return {
      id: Date.now().toString(),
      chosenWord: chosen,
      assignments,
      numImpostors,
      createdAt: new Date(),
    };
  }

  private pickRandom(total: number, count: number): Set<number> {
    const set = new Set<number>();
    while (set.size < count) {
      set.add(Math.floor(Math.random() * total));
    }
    return set;
  }
}
