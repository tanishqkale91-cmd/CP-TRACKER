import { useEffect, useState } from "react";
import { useCP } from "../context/useCP";
import { ChartSkeleton } from "./Skeletons";

export default function SkillStats() {
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { lcusername, lcdata, cfusername, search, searchProfiles } = useCP();
  const profileName = lcdata?.username || lcusername;

  useEffect(() => {
    if (!profileName || search === 0) {
      setSkill(null);
      setLoading(false);
      setError(false);
      return undefined;
    }
    let active = true;
    setLoading(true);
    setError(false);
    fetch(`https://alfa-leetcode-api.onrender.com/${encodeURIComponent(profileName)}/skill`)
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load topic statistics.");
        return response.json();
      })
      .then((data) => {
        if (active) setSkill(data && typeof data === "object" ? data : null);
      })
      .catch(() => {
        if (active) { setSkill(null); setError(true); }
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [profileName, search]);

  if (loading) return <ChartSkeleton label="topic statistics" />;
  if (error) return <div className="empty-state" role="alert"><p>Topic statistics could not be loaded.</p><button className="retry-button" type="button" onClick={() => searchProfiles(lcusername, cfusername)}>Retry topic statistics</button></div>;
  if (!skill) return <p className="form-help">Topic statistics are unavailable.</p>;

  const topics = [skill.fundamental, skill.intermediate, skill.advanced]
    .flatMap((group) => Array.isArray(group) ? group : [])
    .filter((topic) => topic && typeof topic.tagName === "string" && Number.isFinite(Number(topic.problemsSolved)));
  if (!topics.length) return <p className="form-help">Topic statistics are unavailable for this profile.</p>;

  const strongest = [...topics].sort((a, b) => Number(b.problemsSolved) - Number(a.problemsSolved)).slice(0, 5);
  const weakest = [...topics].sort((a, b) => Number(a.problemsSolved) - Number(b.problemsSolved)).slice(0, 5);

  return (
    <div>
      <section className="topic-group" aria-labelledby="strong-topics-title">
        <h4 className="topic-group-title" id="strong-topics-title"><span>STRONG TOPICS</span><span>TOP 5</span></h4>
        <ol className="topic-list">
          {strongest.map((topic, index) => <li className="topic-row" key={`strong-${topic.tagName}`}><span className="topic-rank">{String(index + 1).padStart(2, "0")}</span><span className="topic-name">{topic.tagName}</span><span className="topic-count">{Number(topic.problemsSolved).toLocaleString()} solved</span></li>)}
        </ol>
      </section>
      <section className="topic-group" aria-labelledby="weak-topics-title">
        <h4 className="topic-group-title" id="weak-topics-title"><span>WEAK TOPICS</span><span>BOTTOM 5</span></h4>
        <ol className="topic-list">
          {weakest.map((topic, index) => <li className="topic-row" key={`weak-${topic.tagName}`}><span className="topic-rank">{String(index + 1).padStart(2, "0")}</span><span className="topic-name">{topic.tagName}</span><span className="topic-count">{Number(topic.problemsSolved).toLocaleString()} solved</span></li>)}
        </ol>
      </section>
    </div>
  );
}
