import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import MovieForm from "@/components/MovieForm";
import ResultCard from "@/components/ResultCard";
import ComparisonChart from "@/components/ComparisonChart";
import {
  predictRandomForest,
  predictLogisticRegression,
  predictDecisionTree,
  type MovieInput,
  type PredictionResult,
} from "@/lib/prediction";

export default function Index() {
  const [results, setResults] = useState<PredictionResult[] | null>(null);

  const handlePredict = (input: MovieInput) => {
    setResults([
      predictRandomForest(input),
      predictLogisticRegression(input),
      predictDecisionTree(input),
    ]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-6">
          <Sparkles className="text-primary" size={28} />
          <h1 className="font-display text-3xl tracking-widest text-foreground">
            Movie Success <span className="text-primary">Predictor</span>
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 space-y-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-muted-foreground max-w-2xl"
        >
          Enter your movie's details and compare predictions from three ML models:
          Random Forest, Logistic Regression, and Decision Tree.
        </motion.p>

        <MovieForm onPredict={handlePredict} />

        <AnimatePresence>
          {results && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="grid gap-6 md:grid-cols-3">
                {results.map((r, i) => (
                  <ResultCard key={r.model} result={r} index={i} />
                ))}
              </div>
              <ComparisonChart results={results} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
