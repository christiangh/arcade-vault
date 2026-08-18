// ===== storage.ts — localStorage helper tipado =====

const SCORES_KEY = "av_scores";

export interface SavedScore {
  game: string;
  score: number;
  name: string;
  at: number;
}

export function saveScore(entry: { game: string; score: number; name: string }): void {
  try {
    const raw = localStorage.getItem(SCORES_KEY);
    const all: SavedScore[] = raw ? JSON.parse(raw) : [];
    all.push({ ...entry, at: Date.now() });
    localStorage.setItem(SCORES_KEY, JSON.stringify(all));
  } catch (e) {
    console.error("saveScore failed", e);
  }
}
