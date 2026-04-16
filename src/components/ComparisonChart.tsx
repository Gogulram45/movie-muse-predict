import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { PredictionResult } from "@/lib/prediction";

const COLORS = ["hsl(199,89%,48%)", "hsl(280,65%,60%)", "hsl(32,95%,55%)"];

export default function ComparisonChart({ results }: { results: PredictionResult[] }) {
  const data = results.map((r, i) => ({ name: r.model, probability: r.successProbability, fill: COLORS[i] }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="rounded-2xl border border-border bg-card p-6"
    >
      <h3 className="font-display text-xl tracking-wider text-primary mb-4">Model Comparison</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} barSize={48}>
          <XAxis dataKey="name" tick={{ fill: "hsl(220,10%,55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fill: "hsl(220,10%,55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "hsl(220,18%,11%)", border: "1px solid hsl(220,15%,20%)", borderRadius: 8, color: "hsl(45,20%,90%)" }}
            formatter={(value: number) => [`${value}%`, "Success Probability"]}
          />
          <Bar dataKey="probability" radius={[8, 8, 0, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
