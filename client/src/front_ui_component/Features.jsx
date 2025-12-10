import React from "react";

const kpis = [
  {
    label: "Trust surface",
    value: "Non-custodial routing",
    note: "Funds flow through immutable contracts only.",
  },
  {
    label: "Traceability",
    value: "Full on-chain visibility",
    note: "All movements verifiable without intermediaries.",
  },
  {
    label: "Flow quality",
    value: "Optimized protocol rails",
    note: "Low-friction routing across campaigns.",
  },
  {
    label: "Risk controls",
    value: "Smart guard layers",
    note: "Rule enforcement baked directly into contracts.",
  },
];

const Features = () => {
  return (
    <section className="relative w-full">
  <div className="relative mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">

    {/* CENTERED HEADING */}
    <div className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
        <span className="bg-gradient-to-r from-sky-500 via-emerald-500 to-indigo-500 bg-clip-text text-transparent">
          Built like finance.
        </span>
        <br />
        Powered by blockchain.
      </h2>

      <p className="text-sm sm:text-[0.92rem] leading-relaxed text-slate-600">
        No custodians. No manual processes. No blind trust.
        Just clean on-chain execution, professional routing and full
        protocol transparency.
      </p>
    </div>

    {/* KPI GRID */}
    <div className="mt-10 grid gap-7 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="
            group
            flex flex-col justify-between
            rounded-2xl
            border border-slate-200/30
            backdrop-blur-md
            bg-transparent

            px-5 py-6 sm:px-6 sm:py-7
            min-h-[170px] sm:min-h-[190px]

            transition-all duration-300
            hover:-translate-y-1
            hover:border-sky-300/50
            hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)]
          "
        >
          <div className="space-y-3">
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              {kpi.label}
            </div>

            <div className="text-sm font-semibold">
              <span className="bg-gradient-to-r from-sky-500 via-emerald-500 to-indigo-500 bg-clip-text text-transparent">
                {kpi.value}
              </span>
            </div>

            {/* THIN KPI STRIPE */}
            <div className="mt-1 h-[3px] w-full overflow-hidden rounded-full">
              <div className="h-full w-full bg-gradient-to-r from-sky-500 via-emerald-500 to-indigo-500 opacity-70" />
            </div>

            <p className="text-[11px] leading-snug text-slate-600">
              {kpi.note}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

  );
};

export default Features;
