import React from "react";

function SummaryCard({ lcdata, cfdata }) {
    if (!lcdata && !cfdata) return null;

    const cards = [];

    if (lcdata) {
        cards.push(
            {
                title: "Problems Solved",
                value: lcdata.totalSolved,
                subtitle: "LeetCode",
                icon: "✓",
                gradient: "from-emerald-500/20 to-emerald-500/5",
                iconBg: "bg-emerald-500/15",
                iconColor: "text-emerald-400",
            },
            {
                title: "Global Ranking",
                value: lcdata.ranking?.toLocaleString(),
                subtitle: "LeetCode",
                icon: "↗",
                gradient: "from-cyan-500/20 to-cyan-500/5",
                iconBg: "bg-cyan-500/15",
                iconColor: "text-cyan-400",
            }
        );
    }

    if (cfdata && cfdata.status === "OK") {
        const cf = cfdata.result[0];

        cards.push(
            {
                title: "Current Rating",
                value: cf.rating,
                subtitle: "Codeforces",
                icon: "★",
                gradient: "from-blue-500/20 to-blue-500/5",
                iconBg: "bg-blue-500/15",
                iconColor: "text-blue-400",
            },
            {
                title: "Max Rating",
                value: cf.maxRating,
                subtitle: "Codeforces",
                icon: "↑",
                gradient: "from-purple-500/20 to-purple-500/5",
                iconBg: "bg-purple-500/15",
                iconColor: "text-purple-400",
            }
        );
    }

    return (
        <section className="w-full max-w-6xl mx-auto mt-10">

            <div className="mb-5">
                <h2 className="text-2xl font-bold text-white">
                    Performance Overview
                </h2>

                <p className="text-sm text-zinc-500 mt-1">
                    Your competitive programming statistics
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                {cards.map((card, index) => (
                    <div
                        key={index}
                        className={`
                            relative overflow-hidden
                            rounded-2xl
                            border border-white/10
                            bg-gradient-to-br ${card.gradient}
                            bg-zinc-900/80
                            backdrop-blur-xl
                            p-5
                            transition-all duration-300
                            hover:-translate-y-1
                            hover:border-white/20
                            hover:shadow-xl
                        `}
                    >

                        {/* Glow */}
                        <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-white/5 blur-2xl" />

                        <div className="relative">

                            {/* Header */}
                            <div className="flex items-center justify-between">

                                <div
                                    className={`
                                        w-10 h-10
                                        rounded-xl
                                        flex items-center justify-center
                                        ${card.iconBg}
                                        ${card.iconColor}
                                        text-lg font-bold
                                    `}
                                >
                                    {card.icon}
                                </div>

                                <span className="text-xs text-zinc-500">
                                    {card.subtitle}
                                </span>

                            </div>

                            {/* Content */}
                            <div className="mt-6">

                                <p className="text-sm text-zinc-400">
                                    {card.title}
                                </p>

                                <h3 className="text-3xl font-bold text-white mt-1 tracking-tight">
                                    {card.value ?? "—"}
                                </h3>

                            </div>

                            {/* Bottom line */}
                            <div className="mt-5 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className={`
                                        h-full w-1/2
                                        ${card.iconBg}
                                        rounded-full
                                    `}
                                />
                            </div>

                        </div>
                    </div>
                ))}

            </div>
        </section>
    );
}

export default SummaryCard;