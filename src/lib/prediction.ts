export interface MovieInput {
  budget: number; // in millions
  genre: string;
  runtime: number; // minutes
  releaseMonth: number;
  castPopularity: number; // 1-10
  directorExperience: number; // number of previous films
  sequelOrOriginal: "sequel" | "original";
  marketingBudget: number; // in millions
}

export interface PredictionResult {
  model: string;
  successProbability: number;
  prediction: "Hit" | "Flop";
  confidence: number;
  color: string;
}

const genreWeights: Record<string, number> = {
  action: 0.15, adventure: 0.14, animation: 0.18, comedy: 0.08,
  drama: 0.05, horror: 0.12, scifi: 0.13, thriller: 0.10,
  romance: 0.04, fantasy: 0.11, documentary: 0.02,
};

const monthWeights: Record<number, number> = {
  1: 0.04, 2: 0.06, 3: 0.05, 4: 0.07, 5: 0.12, 6: 0.15,
  7: 0.14, 8: 0.08, 9: 0.04, 10: 0.06, 11: 0.10, 12: 0.13,
};

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

function baseScore(input: MovieInput): number {
  const budgetScore = Math.min(input.budget / 250, 1) * 0.2;
  const genreScore = genreWeights[input.genre] ?? 0.06;
  const runtimeScore = input.runtime >= 90 && input.runtime <= 150 ? 0.1 : 0.03;
  const monthScore = monthWeights[input.releaseMonth] ?? 0.05;
  const castScore = (input.castPopularity / 10) * 0.15;
  const directorScore = Math.min(input.directorExperience / 15, 1) * 0.12;
  const sequelBonus = input.sequelOrOriginal === "sequel" ? 0.08 : 0;
  const marketingScore = Math.min(input.marketingBudget / 100, 1) * 0.15;

  return budgetScore + genreScore + runtimeScore + monthScore + castScore + directorScore + sequelBonus + marketingScore;
}

function addNoise(val: number, seed: number): number {
  const noise = (Math.sin(seed * 9301 + 49297) % 233280) / 233280;
  return val + (noise - 0.5) * 0.08;
}

export function predictRandomForest(input: MovieInput): PredictionResult {
  const base = baseScore(input);
  const ensembleAvg = (addNoise(base, 1) + addNoise(base, 2) + addNoise(base, 3) + addNoise(base, 4) + addNoise(base, 5)) / 5;
  const prob = Math.max(0.05, Math.min(0.98, ensembleAvg + 0.12));
  return {
    model: "Random Forest",
    successProbability: Math.round(prob * 100),
    prediction: prob >= 0.5 ? "Hit" : "Flop",
    confidence: Math.round((0.5 + Math.abs(prob - 0.5)) * 100),
    color: "rf",
  };
}

export function predictLogisticRegression(input: MovieInput): PredictionResult {
  const raw = baseScore(input);
  const logit = (raw - 0.45) * 8;
  const prob = sigmoid(logit);
  return {
    model: "Logistic Regression",
    successProbability: Math.round(prob * 100),
    prediction: prob >= 0.5 ? "Hit" : "Flop",
    confidence: Math.round((0.5 + Math.abs(prob - 0.5)) * 100),
    color: "lr",
  };
}

export function predictDecisionTree(input: MovieInput): PredictionResult {
  let score = 0;
  if (input.budget > 100) score += 0.2; else if (input.budget > 50) score += 0.12; else score += 0.05;
  if (input.castPopularity >= 7) score += 0.2; else if (input.castPopularity >= 4) score += 0.1;
  if (["action", "adventure", "animation", "scifi"].includes(input.genre)) score += 0.15; else score += 0.05;
  if ([5, 6, 7, 11, 12].includes(input.releaseMonth)) score += 0.12; else score += 0.04;
  if (input.directorExperience >= 5) score += 0.1;
  if (input.sequelOrOriginal === "sequel") score += 0.08;
  if (input.marketingBudget > 50) score += 0.12; else if (input.marketingBudget > 20) score += 0.06;

  const prob = Math.max(0.05, Math.min(0.98, score + 0.05));
  return {
    model: "Decision Tree",
    successProbability: Math.round(prob * 100),
    prediction: prob >= 0.5 ? "Hit" : "Flop",
    confidence: Math.round((0.5 + Math.abs(prob - 0.5)) * 100),
    color: "dt",
  };
}
