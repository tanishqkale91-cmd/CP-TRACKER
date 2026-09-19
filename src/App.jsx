import DifficultyChart from "./Components/DifficultyChart";
import React, { useEffect, useState } from "react";
import SkillStats from "./Components/SkillStats";
import SummaryCard from "./Components/SummaryCard";

function App() {
  const [lcusername, setLCusername] = useState("");
  const [lcdata, setLcdata] = useState(null);
  const [cfusername, setCFusername] = useState("");
  const [cfdata, setCfdata] = useState(null);
  const [search, setSearch] = useState(0);

  function incount() {
    setSearch((prev) => prev + 1);
  }

  useEffect(() => {
    if (!lcusername || search === 0) return;

    async function fetchLcData() {
      try {
        const response = await fetch(`https://alfa-leetcode-api.onrender.com/${lcusername}`);

        if (!response.ok) {
          throw new Error(`LeetCode API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("LeetCode:", data);
        setLcdata(data);
      } catch (error) {
        console.error("LC Fetch Failed:", error);
        setLcdata(null);
      }
    }

    fetchLcData();
  }, [search]);

  useEffect(() => {
    if (!cfusername || search === 0) return;

    async function fetchCfData() {
      try {
        const response = await fetch(`https://codeforces.com/api/user.info?handles=${cfusername}`);

        if (!response.ok) {
          throw new Error(`Codeforces API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Codeforces:", data);
        setCfdata(data);
      } catch (error) {
        console.error("CF Fetch Failed:", error);
        setCfdata(null);
      }
    }

    fetchCfData();
  }, [search]);

  return (
    <div className="min-h-screen bg-[#07070a] text-white overflow-x-hidden">


      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-violet-600/10 blur-[140px] rounded-full" />
        <div className="absolute top-[45%] -left-40 w-[450px] h-[450px] bg-blue-600/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 -right-40 w-[450px] h-[450px] bg-cyan-500/5 blur-[140px] rounded-full" />
      </div>

  
      <nav className="relative z-10 border-b border-white/[0.08] bg-black/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center font-black shadow-lg shadow-violet-500/20">
              CP
            </div>

            <div>
              <h1 className="font-bold text-lg tracking-tight">CP Tracker</h1>
              <p className="text-[11px] text-zinc-500">Competitive Programming Dashboard</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-500">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            Live Statistics
          </div>

        </div>
      </nav>

   
      <main className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-12">


        <section className="text-center max-w-4xl mx-auto">

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-300 text-xs font-medium mb-6">
            ⚡ Track your coding journey
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]">
            Your CP journey,
            <span className="block mt-2 bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              all in one place.
            </span>
          </h2>

          <p className="mt-6 text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Track your LeetCode and Codeforces performance, understand your strengths, and find the topics that need more practice.
          </p>

        </section>

    
        <section className="max-w-4xl mx-auto mt-10">

          <div className="relative p-5 sm:p-6 rounded-2xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-xl shadow-2xl shadow-black/30">

            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/[0.04] via-transparent to-blue-500/[0.04] pointer-events-none" />

            <div className="relative grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">

            
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">
                  LeetCode Username
                </label>

                <input
                  type="text"
                  placeholder="e.g. Tann_ishq"
                  value={lcusername}
                  onChange={(e) => setLCusername(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-black/40 border border-white/[0.08] text-sm text-white placeholder:text-zinc-700 outline-none transition-all duration-200 focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10 hover:border-white/[0.15]"
                />
              </div>

        
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">
                  Codeforces Username
                </label>

                <input
                  type="text"
                  placeholder="e.g. tourist"
                  value={cfusername}
                  onChange={(e) => setCFusername(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-black/40 border border-white/[0.08] text-sm text-white placeholder:text-zinc-700 outline-none transition-all duration-200 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 hover:border-white/[0.15]"
                />
              </div>

          
              <button
                onClick={incount}
                className="h-12 px-7 rounded-xl bg-white text-black font-semibold text-sm transition-all duration-200 hover:bg-zinc-200 hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-white/5"
              >
                Search
              </button>

            </div>
          </div>
        </section>

  
        {(lcdata || (cfdata && cfdata.status === "OK")) && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-10">

       
            {lcdata && (
              <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-orange-500/[0.08] to-white/[0.02] p-6 transition-all duration-300 hover:border-orange-500/20 hover:-translate-y-1">

                <div className="absolute -top-20 -right-20 w-48 h-48 bg-orange-500/10 blur-3xl rounded-full" />

                <div className="relative flex items-center gap-5">

                  <img
                    src={lcdata.avatar}
                    alt={lcdata.name}
                    className="w-20 h-20 rounded-2xl object-cover border border-white/10 shadow-xl"
                  />

                  <div className="min-w-0">

                    <span className="inline-flex px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-400 text-[11px] font-semibold">
                      LEETCODE
                    </span>

                    <h3 className="text-xl font-bold mt-2 truncate">
                      {lcdata.name || lcdata.username}
                    </h3>

                    <p className="text-sm text-zinc-500">
                      @{lcdata.username}
                    </p>

                  </div>

                </div>

                <div className="relative mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">

                  <span className="text-xs text-zinc-500">
                    Global Ranking
                  </span>

                  <span className="text-sm font-semibold text-orange-400">
                    #{lcdata.ranking?.toLocaleString()}
                  </span>

                </div>

              </div>
            )}

           
            {cfdata && cfdata.status === "OK" && (
              <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-blue-500/[0.08] to-white/[0.02] p-6 transition-all duration-300 hover:border-blue-500/20 hover:-translate-y-1">

                <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/10 blur-3xl rounded-full" />

                <div className="relative flex items-center gap-5">

                  <img
                    src={cfdata.result[0].titlePhoto || cfdata.result[0].avatar}
                    alt={cfdata.result[0].handle}
                    className="w-20 h-20 rounded-2xl object-cover border border-white/10 shadow-xl"
                  />

                  <div>

                    <span className="inline-flex px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-[11px] font-semibold">
                      CODEFORCES
                    </span>

                    <h3 className="text-xl font-bold mt-2">
                      {cfdata.result[0].handle}
                    </h3>

                    <p className="text-sm text-zinc-500">
                      {cfdata.result[0].rank || "Unrated"}
                    </p>

                  </div>

                </div>

                <div className="relative mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">

                  <span className="text-xs text-zinc-500">
                    Current Rating
                  </span>

                  <span className="text-sm font-semibold text-blue-400">
                    {cfdata.result[0].rating ?? "Unrated"}
                  </span>

                </div>

              </div>
            )}

          </section>
        )}

      
        {(lcdata || cfdata) && (
          <section className="mt-10">
            <SummaryCard lcdata={lcdata} cfdata={cfdata} />
          </section>
        )}

       
        {lcdata && (
          <section className="mt-12">

            <div className="mb-6">

              <div className="text-xs uppercase tracking-[0.2em] text-violet-400 font-semibold">
                Analytics
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold mt-2">
                Performance Breakdown
              </h2>

              <p className="text-sm text-zinc-500 mt-2">
                Understand your solving patterns and topic strengths.
              </p>

            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

              <div className="relative min-h-[460px] overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-xl p-5">

                <div className="flex items-center justify-between mb-2">

                  <div>
                    <h3 className="font-semibold text-zinc-200">
                      Difficulty Breakdown
                    </h3>

                    <p className="text-xs text-zinc-600 mt-1">
                      Problems solved by difficulty
                    </p>
                  </div>

                  <span className="px-2 py-1 rounded-lg bg-violet-500/10 text-violet-400 text-[10px] font-semibold">
                    LEETCODE
                  </span>

                </div>

                <DifficultyChart name={lcusername} search={search} />

              </div>

              
              <div className="relative min-h-[460px] overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-xl p-5">

                <div className="flex items-center justify-between mb-4">

                  <div>
                    <h3 className="font-semibold text-zinc-200">
                      Topic Analysis
                    </h3>

                    <p className="text-xs text-zinc-600 mt-1">
                      Your strongest and weakest areas
                    </p>
                  </div>

                  <span className="px-2 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-[10px] font-semibold">
                    SKILLS
                  </span>

                </div>

                <SkillStats name={lcusername} search={search} />

              </div>

            </div>
          </section>
        )}

      </main>

      
      <footer className="relative z-10 mt-16 border-t border-white/[0.06] bg-black/20">

        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-7 flex flex-col sm:flex-row items-center justify-between gap-3">

          <p className="text-sm text-zinc-600">
            CP Tracker
          </p>

          <p className="text-xs text-zinc-700">
            Built for competitive programmers.
          </p>

        </div>

      </footer>

    </div>
  );
}

export default App;