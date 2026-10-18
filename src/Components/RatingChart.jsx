import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useCP } from "../context/useCP";
import { ChartSkeleton } from "./Skeletons";

export default function RatingChart() {
  const { contest, contestStatus, lcusername, cfusername, searchProfiles } = useCP();
  const chartData = (Array.isArray(contest?.contestHistory) ? contest.contestHistory : [])
    .filter((item) => item?.contest?.startTime != null && item?.rating != null && Number.isFinite(Number(item.contest.startTime)) && Number.isFinite(Number(item.rating)))
    .map((item) => ({
      date: new Date(Number(item.contest.startTime) * 1000).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      rating: Number(item.rating),
      contest: item.contest.title || "Contest",
    }));

  if (contestStatus === "loading") return <ChartSkeleton label="contest rating history" />;
  if (chartData.length === 0) {
    const failed = contestStatus === "error";
    return (
      <div className="empty-state" role={failed ? "alert" : undefined}>
        <p>{failed ? "Contest rating history could not be loaded." : "No contest rating history is available."}</p>
        {failed && <button className="retry-button" type="button" onClick={() => searchProfiles(lcusername, cfusername)}>Retry contest history</button>}
      </div>
    );
  }

  return (
    <div className="chart-frame chart-frame--rating" role="img" aria-label="LeetCode contest rating history">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 12, right: 18, left: 0, bottom: 8 }}>
          <CartesianGrid stroke="var(--color-border)" />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: "var(--color-muted)", fontFamily: "var(--font-mono)" }} minTickGap={24} />
          <YAxis tick={{ fontSize: 12, fill: "var(--color-muted)", fontFamily: "var(--font-mono)" }} />
          <Tooltip contentStyle={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "2px", color: "var(--color-text)", fontFamily: "var(--font-mono)", fontSize: "12px" }} />
          <Line type="monotone" dataKey="rating" stroke="var(--color-accent)" strokeWidth={2} dot={{ r: 2, fill: "var(--color-accent)" }} activeDot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
