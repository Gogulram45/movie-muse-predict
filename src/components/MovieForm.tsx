import { useState } from "react";
import { motion } from "framer-motion";
import { Film, Clapperboard, DollarSign, Calendar, Star, Users, Megaphone } from "lucide-react";
import type { MovieInput } from "@/lib/prediction";

const genres = [
  { value: "action", label: "Action" },
  { value: "adventure", label: "Adventure" },
  { value: "animation", label: "Animation" },
  { value: "comedy", label: "Comedy" },
  { value: "drama", label: "Drama" },
  { value: "horror", label: "Horror" },
  { value: "scifi", label: "Sci-Fi" },
  { value: "thriller", label: "Thriller" },
  { value: "romance", label: "Romance" },
  { value: "fantasy", label: "Fantasy" },
  { value: "documentary", label: "Documentary" },
];

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface Props {
  onPredict: (input: MovieInput) => void;
}

export default function MovieForm({ onPredict }: Props) {
  const [budget, setBudget] = useState(100);
  const [genre, setGenre] = useState("action");
  const [runtime, setRuntime] = useState(120);
  const [releaseMonth, setReleaseMonth] = useState(6);
  const [castPopularity, setCastPopularity] = useState(7);
  const [directorExperience, setDirectorExperience] = useState(5);
  const [sequelOrOriginal, setSequelOrOriginal] = useState<"original" | "sequel">("original");
  const [marketingBudget, setMarketingBudget] = useState(50);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPredict({ budget, genre, runtime, releaseMonth, castPopularity, directorExperience, sequelOrOriginal, marketingBudget });
  };

  const inputClass = "w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all";
  const labelClass = "flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2";

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6"
    >
      <h2 className="font-display text-2xl tracking-wider text-primary">Movie Details</h2>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className={labelClass}><DollarSign size={16} /> Budget (M$)</label>
          <input type="number" min={1} max={500} value={budget} onChange={e => setBudget(+e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}><Megaphone size={16} /> Marketing Budget (M$)</label>
          <input type="number" min={0} max={200} value={marketingBudget} onChange={e => setMarketingBudget(+e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}><Film size={16} /> Genre</label>
          <select value={genre} onChange={e => setGenre(e.target.value)} className={inputClass}>
            {genres.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}><Clapperboard size={16} /> Runtime (min)</label>
          <input type="number" min={60} max={240} value={runtime} onChange={e => setRuntime(+e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}><Calendar size={16} /> Release Month</label>
          <select value={releaseMonth} onChange={e => setReleaseMonth(+e.target.value)} className={inputClass}>
            {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}><Star size={16} /> Cast Popularity (1-10)</label>
          <input type="range" min={1} max={10} value={castPopularity} onChange={e => setCastPopularity(+e.target.value)} className="w-full accent-primary" />
          <span className="text-sm text-primary font-semibold">{castPopularity}/10</span>
        </div>
        <div>
          <label className={labelClass}><Users size={16} /> Director's Past Films</label>
          <input type="number" min={0} max={30} value={directorExperience} onChange={e => setDirectorExperience(+e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}><Film size={16} /> Type</label>
          <div className="flex gap-3">
            {(["original", "sequel"] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setSequelOrOriginal(t)}
                className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-all ${
                  sequelOrOriginal === t
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-secondary text-muted-foreground hover:border-primary/30"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full rounded-xl bg-primary py-4 font-display text-xl tracking-wider text-primary-foreground transition-shadow hover:shadow-lg hover:shadow-primary/25"
      >
        Predict Success
      </motion.button>
    </motion.form>
  );
}
