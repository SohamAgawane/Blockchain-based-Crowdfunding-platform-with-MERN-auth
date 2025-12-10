import React, { useState } from "react";

const AboutUs = () => {
  const [hoveredSlice, setHoveredSlice] = useState(null);

  const pieMeta = {
    backer: {
      label: "Backer lanes",
      percent: "24%",
      desc: "Contribution channels from global supporters.",
    },
    logic: {
      label: "Campaign logic",
      percent: "26%",
      desc: "Conditions that govern when and how value moves.",
    },
    core: {
      label: "Protocol core",
      percent: "30%",
      desc: "Smart contracts orchestrating the full rail.",
    },
    settle: {
      label: "Settlement layer",
      percent: "20%",
      desc: "Value landing as goods and services with partners.",
    },
  };

  return (
    <section id="about-us" className="w-full">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-4 pb-10 sm:pt-6 sm:pb-12 space-y-8">
        {/* TOP HEADING ROW */}
        <div className="text-center space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            About Pro Fund
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            <span className="bg-gradient-to-r from-sky-500 via-emerald-500 to-indigo-500 bg-clip-text text-transparent">
              Built like a financial rail.
            </span>{" "}
            Designed for impact.
          </h2>
        </div>

        {/* MAIN CONTENT GRID – GRAPH LEFT, TEXT RIGHT */}
        <div className="grid gap-8 md:grid-cols-2 items-stretch">
          {/* LEFT: BAR CHART CARD */}
          <div className="h-full">
            <div className="h-full rounded-3xl border border-slate-200/70 bg-white/70 backdrop-blur-sm shadow-sm px-5 py-5 sm:px-6 sm:py-6 flex flex-col">
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Protocol profile
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Illustrative composition of the Pro Fund value rail.
                  </p>
                </div>
              </div>

              {/* Donut chart with tooltip */}
              <div className="relative h-40 sm:h-44 w-full mb-4">
                {/* Tooltip */}
                {hoveredSlice && (
                  <div className="pointer-events-none absolute left-1/2 top-1 -translate-x-1/2 rounded-full bg-slate-900 px-3 py-1 text-[10px] font-medium text-white shadow-md shadow-slate-900/25">
                    {pieMeta[hoveredSlice].label} · {pieMeta[hoveredSlice].percent}
                  </div>
                )}

                <svg
                  viewBox="0 0 320 170"
                  className="h-full w-full"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    {/* just a faint circular backdrop */}
                    <radialGradient id="about-ring-bg" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#f1f5f9" />
                      <stop offset="100%" stopColor="#e5e7eb" />
                    </radialGradient>
                  </defs>

                  {/* Donut slices built with strokeDasharray */}
                  {/* Circle center */}
{/*                   
          Circle: cx=160, cy=85, r=50
          Circumference ≈ 314
          Slices:
            backer  24% → 75
            logic   26% → 82
            core    30% → 94
            settle  20% → 63
        */}

                  {/* BACKGROUND RING */}
                  <circle
                    cx="160"
                    cy="85"
                    r="50"
                    fill="none"
                    stroke="url(#about-ring-bg)"
                    strokeWidth="16"
                    opacity="0.5"
                  />

                  {/* Backer lanes – 24% */}
                  <circle
                    cx="160"
                    cy="85"
                    r="50"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="16"
                    strokeDasharray="75 314"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    transform="rotate(-90 160 85)"
                    opacity={hoveredSlice === "backer" || hoveredSlice === null ? 0.95 : 0.3}
                    onMouseEnter={() => setHoveredSlice("backer")}
                    onMouseLeave={() => setHoveredSlice(null)}
                    style={{ cursor: "pointer", transition: "opacity 0.15s ease" }}
                  />

                  {/* Campaign logic – 26% */}
                  <circle
                    cx="160"
                    cy="85"
                    r="50"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="16"
                    strokeDasharray="82 314"
                    strokeDashoffset="-75"
                    strokeLinecap="round"
                    transform="rotate(-90 160 85)"
                    opacity={hoveredSlice === "logic" || hoveredSlice === null ? 0.95 : 0.3}
                    onMouseEnter={() => setHoveredSlice("logic")}
                    onMouseLeave={() => setHoveredSlice(null)}
                    style={{ cursor: "pointer", transition: "opacity 0.15s ease" }}
                  />

                  {/* Protocol core – 30% */}
                  <circle
                    cx="160"
                    cy="85"
                    r="50"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="16"
                    strokeDasharray="94 314"
                    strokeDashoffset="-157"
                    strokeLinecap="round"
                    transform="rotate(-90 160 85)"
                    opacity={hoveredSlice === "core" || hoveredSlice === null ? 1 : 0.3}
                    onMouseEnter={() => setHoveredSlice("core")}
                    onMouseLeave={() => setHoveredSlice(null)}
                    style={{ cursor: "pointer", transition: "opacity 0.15s ease" }}
                  />

                  {/* Settlement layer – 20% */}
                  <circle
                    cx="160"
                    cy="85"
                    r="50"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="16"
                    strokeDasharray="63 314"
                    strokeDashoffset="-251"
                    strokeLinecap="round"
                    transform="rotate(-90 160 85)"
                    opacity={hoveredSlice === "settle" || hoveredSlice === null ? 0.95 : 0.3}
                    onMouseEnter={() => setHoveredSlice("settle")}
                    onMouseLeave={() => setHoveredSlice(null)}
                    style={{ cursor: "pointer", transition: "opacity 0.15s ease" }}
                  />

                  {/* INNER DONUT – center label */}
                  <circle cx="160" cy="85" r="33" fill="white" stroke="#e5e7eb" strokeWidth="1" />
                  <text
                    x="160"
                    y="80"
                    textAnchor="middle"
                    fontSize="9"
                    fill="#6b7280"
                  >
                    Rail
                  </text>
                  <text
                    x="160"
                    y="94"
                    textAnchor="middle"
                    fontSize="9"
                    className="font-medium"
                    fill="#0f172a"
                  >
                    Composition
                  </text>
                </svg>
              </div>

              {/* Legend / mapping (meaningful + project-specific) */}
              <div className="grid grid-cols-2 gap-3 text-[11px] mt-auto">
                <div className="space-y-1">
                  <p className="font-semibold text-slate-800">
                    {pieMeta.backer.label} · {pieMeta.backer.percent}
                  </p>
                  <p className="text-slate-500">{pieMeta.backer.desc}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-800">
                    {pieMeta.logic.label} · {pieMeta.logic.percent}
                  </p>
                  <p className="text-slate-500">{pieMeta.logic.desc}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-800">
                    {pieMeta.core.label} · {pieMeta.core.percent}
                  </p>
                  <p className="text-slate-500">{pieMeta.core.desc}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-800">
                    {pieMeta.settle.label} · {pieMeta.settle.percent}
                  </p>
                  <p className="text-slate-500">{pieMeta.settle.desc}</p>
                </div>
              </div>
            </div>
          </div>


          {/* RIGHT: STORY / COPY BLOCK */}
          <div className="h-full">
            <div className="h-full flex flex-col justify-between space-y-6 pt-2 pb-4">
              <div className="space-y-4">
                <p className="text-sm sm:text-[0.95rem] leading-relaxed text-slate-600">
                  Pro Fund is a blockchain-native crowdfunding layer that
                  connects global supporters with verified NGOs and charities in
                  India. Contributions are routed through audited smart
                  contracts and expressed as real products and services — not
                  just balances on a screen.
                </p>

                <p className="text-sm sm:text-[0.95rem] leading-relaxed text-slate-600">
                  By treating each campaign as a programmable flow instead of a
                  static page, Pro Fund behaves much closer to a financial rail:
                  predictable routing, observable state changes, and auditable
                  outcomes that partners can reliably build on top of.
                </p>
              </div>

              {/* Three compact finance-style bullets */}
              <div className="grid gap-3 sm:grid-cols-3 text-[11px]">
                <div className="space-y-1">
                  <p className="font-semibold text-slate-800 uppercase tracking-[0.14em]">
                    Non-custodial
                  </p>
                  <p className="text-slate-500">
                    Pro Fund never “holds” funds; smart contracts handle routing.
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-800 uppercase tracking-[0.14em]">
                    Observable
                  </p>
                  <p className="text-slate-500">
                    Backers can independently verify how campaigns progress.
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-800 uppercase tracking-[0.14em]">
                    Impact-first
                  </p>
                  <p className="text-slate-500">
                    The rail is tuned for real-world delivery to communities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
