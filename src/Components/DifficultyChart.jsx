import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useState, useEffect } from "react";

const COLORS = ["#00ff88", "#ffbb00", "#ff4444"];

function DifficultyChart({ name, search }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!name || search === 0) return;

    async function fetchSolved() {
      try {
        const response = await fetch(
          `https://alfa-leetcode-api.onrender.com/${name}/solved`
        );
        const result = await response.json();

        setData([
          { name: "Easy", value: result.easySolved },
          { name: "Medium", value: result.mediumSolved },
          { name: "Hard", value: result.hardSolved },
        ]);
      } catch (error) {
        console.error("Chart fetch failed:", error);
      }
    }

    fetchSolved();
  }, [search]);

  if (data.length === 0) return null;

  return (
    <div>
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={120}
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}

export default DifficultyChart;