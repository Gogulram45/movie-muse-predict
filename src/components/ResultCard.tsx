import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { PredictionResult } from "@/lib/prediction";

const colorMap: Record<string, string> = {
  rf: "bg-rf/10 border-rf text-rf",
  lr: "bg-lr/10 border-lr text-lr",
  dt: "bg-dt/10 border-dt text-dt",
};

const ringMap: Record<string, string> = {
  rf: "text-rf",
  lr: "text-lr",
  dt: "text-dt",
};

export default function ResultCard({ result, index }: { result: PredictionResult; index: number }) {
  const isHit = result.prediction === "Hit";
  const circleRadius = 40;
  const circumference = 2 * Math.PI * circleRadius;
  const offset = circumference - (result.successProbability / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className="rounded-2xl border border-border bg-card p-6 flex flex-col items-center gap-4"
    >
      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${colorMap[result.color]}`}>
        {result.model}
      </span>

      <div className="relative">
        <svg width="100" height="100" className="-rotate-90">
          <circle cx="50" cy="50" r={circleRadius} fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
          <motion.circle
            cx="50" cy="50" r={circleRadius} fill="none"
            strokeWidth="6" strokeLinecap="round"
            className={`stroke-current ${ringMap[result.color]}`}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, delay: index * 0.15 + 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-foreground">{result.successProbability}%</span>
        </div>
      </div>

      <div className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${
        isHit ? "bg-success/10 text-success" : "bg-accent/10 text-accent"
      }`}>
        {isHit ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
        {result.prediction}
      </div>

      <p className="text-xs text-muted-foreground">
        Confidence: <span className="font-semibold text-foreground">{result.confidence}%</span>
      </p>
    </motion.div>
  );
}
