import { useEffect, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useCP } from "../context/useCP";
import { ChartSkeleton } from "./Skeletons";

const COLORS = ["var(--color-accent)", "var(--color-muted)", "var(--color-subtle)"];

export default function DifficultyChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { lcusername, lcdata, cfusername, search, searchProfiles } = useCP();
  const profileName = lcdata?.username || lcusername;

  useEffect(() => {
    if (!profileName || search === 0) {
      setData([]);
      setLoading(false);
      setError(false);
      return undefined;
    }
    let active = true;
    setLoading(true);
    setError(false);
    fetch(`https://alfa-leetcode-api.onrender.com/${encodeURIComponent(profileName)}/solved`)
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load solved problem counts.");
        return response.json();
      })
      .then((result) => {
        if (!active) return;
        setData([
          { name: "Easy", value: Number(result?.easySolved) || 0 },
          { name: "Medium", value: Number(result?.mediumSolved) || 0 },
          { name: "Hard", value: Number(result?.hardSolved) || 0 },
        ]);
      })
      .catch(() => { if (active) { setData([]); setError(true); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [profileName, search]);

  if (loading) return <ChartSkeleton label="difficulty totals" />;
  if (error) return <div className="empty-state" role="alert"><p>Difficulty totals could not be loaded.</p><button className="retry-button" type="button" onClick={() => searchProfiles(lcusername, cfusername)}>Retry difficulty totals</button></div>;
  if (!data.some((item) => item.value > 0)) return <p className="form-help">Difficulty totals are unavailable.</p>;

  return (
    <div className="chart-frame" role="img" aria-label="LeetCode problems solved by difficulty">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius="72%" dataKey="value" label={({ name, value, x, y }) => <text x={x} y={y} fill="var(--color-text)" fontSize="12" fontFamily="var(--font-mono)" textAnchor="middle" dominantBaseline="central">{`${name} ${value}`}</text>} labelLine={{ stroke: "var(--color-muted)" }}>
            {data.map((entry, index) => <Cell key={entry.name} fill={COLORS[index]} stroke="var(--color-bg)" strokeWidth={2} />)}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "2px", color: "var(--color-text)", fontFamily: "var(--font-mono)", fontSize: "12px" }} />
          <Legend wrapperStyle={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)", fontSize: "12px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
