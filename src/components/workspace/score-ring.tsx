export function ScoreRing({ score, label }: { score: number; label: string }) {
  const color = score >= 88 ? "#0f766e" : score >= 78 ? "#2454ff" : "#b7791f";

  return (
    <div className="flex items-center gap-3">
      <div
        className="grid h-12 w-12 place-items-center rounded-full text-sm font-bold"
        style={{
          color,
          background: `conic-gradient(${color} ${score * 3.6}deg, #e8edf4 0deg)`
        }}
      >
        <div className="grid h-9 w-9 place-items-center rounded-full bg-white">{score}</div>
      </div>
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </div>
  );
}
