import React, { useCallback, useRef, useState } from "react";
import CPContext from "./CPContextBase";

export function CPProvider({ children }) {
  const [lcusername, setLCusername] = useState("");
  const [lcdata, setLcdata] = useState(null);
  const [lcStatus, setLcStatus] = useState({ state: "idle", message: "" });
  const [cfusername, setCFusername] = useState("");
  const [cfdata, setCfdata] = useState(null);
  const [cfStatus, setCfStatus] = useState({ state: "idle", message: "" });
  const [search, setSearch] = useState(0);
  const [contest, setContest] = useState(null);
  const [contestStatus, setContestStatus] = useState("idle");
  const requestId = useRef(0);

  const searchProfiles = useCallback(async (lcInput, cfInput) => {
    const lc = lcInput.trim();
    const cf = cfInput.trim();
    if (!lc && !cf) return false;

    setLCusername(lc);
    setCFusername(cf);
    setSearch((count) => count + 1);
    const currentRequest = ++requestId.current;

    if (lc) {
      setLcdata(null);
      setLcStatus({ state: "loading", message: "Loading LeetCode profile…" });
    } else if (lcStatus.state === "loading") {
      setLcStatus({ state: "idle", message: "" });
    }
    if (cf) {
      setCfdata(null);
      setCfStatus({ state: "loading", message: "Loading Codeforces profile…" });
    } else if (cfStatus.state === "loading") {
      setCfStatus({ state: "idle", message: "" });
    }
    if (lc) {
      setContest(null);
      setContestStatus("loading");
    } else {
      setContestStatus("idle");
    }

    const jobs = [];
    if (lc) jobs.push((async () => {
      try {
        const response = await fetch(`https://alfa-leetcode-api.onrender.com/${encodeURIComponent(lc)}`);
        if (!response.ok) throw new Error("We couldn’t load that LeetCode profile. Check the username and try again.");
        const data = await response.json();
        if (!data || typeof data !== "object" || data.errors || data.status === "error") throw new Error(data?.message || "No LeetCode profile was found for that username.");
        if (requestId.current === currentRequest) {
          setLcdata(data);
          setLcStatus({ state: "success", message: "LeetCode profile loaded." });
        }
      } catch (error) {
        if (requestId.current === currentRequest) setLcStatus({ state: "error", message: error.message || "LeetCode is temporarily unavailable. Try again." });
      }
    })());
    if (cf) jobs.push((async () => {
      try {
        const response = await fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(cf)}`);
        if (!response.ok) throw new Error("We couldn’t load that Codeforces profile. Check the username and try again.");
        const data = await response.json();
        if (data?.status !== "OK" || !Array.isArray(data.result) || !data.result[0]) throw new Error(data?.comment || "No Codeforces profile was found for that username.");
        if (requestId.current === currentRequest) {
          setCfdata(data);
          setCfStatus({ state: "success", message: "Codeforces profile loaded." });
        }
      } catch (error) {
        if (requestId.current === currentRequest) setCfStatus({ state: "error", message: error.message || "Codeforces is temporarily unavailable. Try again." });
      }
    })());
    if (lc) jobs.push((async () => {
      try {
        const response = await fetch(`https://alfa-leetcode-api.onrender.com/${encodeURIComponent(lc)}/contest/history`);
        if (!response.ok) throw new Error("Contest history is unavailable.");
        const data = await response.json();
        if (requestId.current === currentRequest) {
          setContest(data);
          setContestStatus("success");
        }
      } catch {
        if (requestId.current === currentRequest) setContestStatus("error");
      }
    })());
    await Promise.all(jobs);
    return true;
  }, [cfStatus.state, lcStatus.state]);

  const value = {
    lcusername, setLCusername, lcdata, lcStatus,
    cfusername, setCFusername, cfdata, cfStatus,
    search, setSearch, contest, setContest, contestStatus, setContestStatus,
    searchProfiles,
  };

  return <CPContext.Provider value={value}>{children}</CPContext.Provider>;
}
