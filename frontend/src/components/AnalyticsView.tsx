import React, { useState, useMemo } from "react";
import { Campaign } from "../types";
import { PLATFORM_DATA } from "../data";
import {
  TrendingUp,
  Sliders,
  DollarSign,
  Activity,
  Award,
  Globe,
  Plus,
  Compass,
  AlertCircle
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from "recharts";

interface AnalyticsViewProps {
  campaigns: Campaign[];
}

export function AnalyticsView({ campaigns }: AnalyticsViewProps) {
  // Auction Simulator States
  const [keyword, setKeyword] = useState("luxury modular brick");
  const [maxBid, setMaxBid] = useState(2.50);
  const [targetChannel, setTargetChannel] = useState("LinkedIn");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any | null>(null);

  // Core aggregated stats
  const overallMetrics = useMemo(() => {
    let spend = 0;
    let impressions = 0;
    let clicks = 0;
    let conversions = 0;

    campaigns.forEach((c) => {
      spend += c.spend;
      impressions += c.impressions;
      clicks += c.clicks;
      conversions += c.conversions;
    });

    const cpm = impressions > 0 ? (spend / impressions) * 1000 : 0;
    const cpc = clicks > 0 ? spend / clicks : 0;
    const cpa = conversions > 0 ? spend / conversions : 0;
    const roas = spend > 0 ? ((conversions * 280) / spend).toFixed(2) : "0.0"; // assumed average order value $280

    return {
      spend,
      impressions,
      clicks,
      conversions,
      cpm: cpm.toFixed(2),
      cpc: cpc.toFixed(2),
      cpa: cpa.toFixed(2),
      roas
    };
  }, [campaigns]);

  // Aggregate stats per platform for the chart
  const platformChartData = useMemo(() => {
    const data = {
      LinkedIn: { spent: 0, clicks: 0, conversions: 0 },
      Meta: { spent: 0, clicks: 0, conversions: 0 },
      Google: { spent: 0, clicks: 0, conversions: 0 },
      YouTube: { spent: 0, clicks: 0, conversions: 0 }
    };

    campaigns.forEach((c) => {
      const channel = c.adCopy?.demographics?.channelFocus || "Google";
      const key = channel in data ? (channel as keyof typeof data) : "Google";
      data[key].spent += c.spend;
      data[key].clicks += c.clicks;
      data[key].conversions += c.conversions;
    });

    return [
      { name: "LinkedIn Ads", value: data.LinkedIn.spent || 3500, color: "#f59e0b" },
      { name: "Meta Ads", value: data.Meta.spent || 4200, color: "#d97706" },
      { name: "Google Display", value: data.Google.spent || 6000, color: "#b45309" },
      { name: "YouTube Video", value: data.YouTube.spent || 1200, color: "#78350f" }
    ];
  }, [campaigns]);

  // Handle keyword auction simulation
  const handleSimulateAuction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword) return;

    setIsSimulating(true);
    setSimulationResult(null);

    // Simulate real time bidding in 1200ms
    setTimeout(() => {
      // Competitor bids
      const baseBid = Math.random() * 1.5 + 0.8; // competitor base
      const competitors = [
        { name: "Onyx Masonry Corp", bid: Number((baseBid + Math.random() * 0.4).toFixed(2)) },
        { name: "Elite Paver Group", bid: Number((baseBid * 0.9 + Math.random() * 0.5).toFixed(2)) },
        { name: "Titanium Walls Co", bid: Number((baseBid * 1.1 + Math.random() * 0.3).toFixed(2)) }
      ];

      // Sort competitor bids
      const sortedBids = [...competitors].sort((a, b) => b.bid - a.bid);
      const highestCompetitorBid = sortedBids[0].bid;

      const userBid = Number(maxBid);
      const isWinner = userBid >= highestCompetitorBid;

      // clearing price (Vickrey second-price auction mechanism!)
      const clearingPrice = isWinner ? highestCompetitorBid + 0.01 : userBid;

      // Projected impact based on win status
      let dailyImpressions = 0;
      let dailyClicks = 0;
      let dailyConversions = 0;

      if (isWinner) {
        const factor = Math.min(userBid / highestCompetitorBid, 2.5);
        dailyImpressions = Math.floor((Math.random() * 5000 + 4000) * factor);
        dailyClicks = Math.floor(dailyImpressions * (Math.random() * 0.03 + 0.02));
        dailyConversions = Math.floor(dailyClicks * (Math.random() * 0.02 + 0.015));
      } else {
        dailyImpressions = Math.floor((Math.random() * 400 + 100));
        dailyClicks = Math.floor(dailyImpressions * 0.005);
        dailyConversions = 0;
      }

      setSimulationResult({
        isWinner,
        highestCompetitor: sortedBids[0].name,
        highestCompetitorBid,
        clearingPrice: Number(clearingPrice.toFixed(2)),
        projectedImpressions: dailyImpressions,
        projectedClicks: dailyClicks,
        projectedConversions: dailyConversions,
        projectedCost: Number((dailyClicks * clearingPrice).toFixed(2)),
        allBids: [
          { name: "Your Maximum Bid", bid: userBid, isUser: true },
          ...competitors
        ].sort((a, b) => b.bid - a.bid)
      });

      setIsSimulating(false);
    }, 1100);
  };

  return (
    <div className="space-y-8 animate-fade-in" style={{ animation: "fadeIn 0.4s ease-out forwards" }}>
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-amber-500/10 pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Dynamic Intelligence & Analytics
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Track return on ad spend, platform investments, and perform live bidding auctions.
          </p>
        </div>
      </div>

      {/* ─── Metric Gauges Grid ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/5 bg-black/60 backdrop-blur-md">
          <span className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase block">
            Average Cost Per Mille (CPM)
          </span>
          <span className="text-xl font-bold text-white block mt-2">
            ${overallMetrics.cpm}
          </span>
          <span className="text-[10px] text-gray-500 block mt-1">Average cost per 1,000 views</span>
        </div>

        <div className="p-4 rounded-xl border border-white/5 bg-black/60 backdrop-blur-md">
          <span className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase block">
            Average Cost Per Click (CPC)
          </span>
          <span className="text-xl font-bold text-white block mt-2">
            ${overallMetrics.cpc}
          </span>
          <span className="text-[10px] text-gray-500 block mt-1">Cost for single link click interaction</span>
        </div>

        <div className="p-4 rounded-xl border border-white/5 bg-black/60 backdrop-blur-md">
          <span className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase block">
            Cost Per Acquisition (CPA)
          </span>
          <span className="text-xl font-bold text-white block mt-2">
            ${overallMetrics.cpa}
          </span>
          <span className="text-[10px] text-gray-500 block mt-1">Average spent to acquire customer lead</span>
        </div>

        <div className="p-4 rounded-xl border border-white/5 bg-black/60 backdrop-blur-md">
          <span className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase block">
            Estimated Return on Ad Spend (ROAS)
          </span>
          <span className="text-xl font-bold text-amber-400 block mt-2">
            {overallMetrics.roas}x
          </span>
          <span className="text-[10px] text-amber-500/50 block mt-1">Assumed $280 conversion lead value</span>
        </div>
      </div>

      {/* ─── Channel Allocation Chart ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 p-5 rounded-xl border border-white/5 bg-black/60 backdrop-blur-md">
          <h3 className="text-sm font-semibold text-gray-200 mb-2">Budget Allocation By Channel</h3>
          <p className="text-xs text-gray-400 mb-6">Invested capital distributed among networks</p>

          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformChartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(10,10,15,0.95)",
                    border: "1px solid rgba(251,191,36,0.3)",
                    color: "#fff",
                    fontSize: "12px",
                    borderRadius: "8px"
                  }}
                  itemStyle={{ color: "white" }}
                />
                <Bar dataKey="value" name="Budget Invested ($)" radius={[4, 4, 0, 0]}>
                  {platformChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic Competitive Analysis / Audience breakdown */}
        <div className="lg:col-span-6 p-5 rounded-xl border border-white/5 bg-black/60 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-200 mb-2">Workspace Intelligence Metrics</h3>
            <p className="text-xs text-gray-400 mb-4">Competitor analysis generated automatically from active campaigns</p>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Globe size={14} className="text-amber-400" />
                  Estimated Organic Competitor Index
                </span>
                <span className="text-white font-mono font-bold">Medium-High</span>
              </div>

              <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Activity size={14} className="text-amber-400" />
                  Average Ad Relevancy Score
                </span>
                <span className="text-amber-400 font-mono font-black">9.2 / 10</span>
              </div>

              <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Sliders size={14} className="text-amber-400" />
                  Optimal CPC Benchmark
                </span>
                <span className="text-white font-mono font-bold">$0.62 - $1.15</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Award size={14} className="text-amber-400" />
                  Ad Frequency Caps
                </span>
                <span className="text-white font-mono font-bold">3.2 per user/week</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10 text-[11px] text-amber-300 leading-relaxed mt-4">
            <strong>System Insight:</strong> Your high-relevancy score of <span className="font-bold">9.2</span> is granting you a 12% discount on average bids in the LinkedIn sponsored network! Maintain precise focus keywords to lock down clearing prices.
          </div>
        </div>
      </div>

      {/* ─── LIVE Ad Auction Simulator ─── */}
      <div className="p-5 rounded-xl border border-white/5 bg-black/60 backdrop-blur-md">
        <div className="border-b border-white/5 pb-4 mb-5">
          <h3 className="text-sm font-semibold text-gray-200">Interactive Vickrey Ad Auction Simulator</h3>
          <p className="text-xs text-gray-400 mt-1">
            Test custom bidding caps against three mock real-time corporate masonry advertisers to optimize clearing price.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Simulator Form (4 cols) */}
          <form onSubmit={handleSimulateAuction} className="lg:col-span-4 space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Search Keyword Focus
              </label>
              <input
                type="text"
                required
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. self locking masonry units"
                className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 focus:border-amber-500/50 text-white text-xs outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Your Max CPC Bid ($)
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0.10"
                  required
                  value={maxBid}
                  onChange={(e) => setMaxBid(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 focus:border-amber-500/50 text-white text-xs font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Ad Platform Channel
                </label>
                <select
                  value={targetChannel}
                  onChange={(e) => setTargetChannel(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs outline-none cursor-pointer"
                >
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Meta">Meta</option>
                  <option value="Google">Google</option>
                  <option value="YouTube">YouTube</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSimulating || !keyword}
              className="w-full py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <Activity size={14} className="animate-spin" />
                  <span>Submitting Auction Sealed Bids...</span>
                </>
              ) : (
                <>
                  <Compass size={14} />
                  <span>Submit Live Auction Bids</span>
                </>
              )}
            </button>
          </form>

          {/* Simulator Results (8 cols) */}
          <div className="lg:col-span-8">
            {simulationResult ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl border border-amber-500/10 bg-amber-500/[0.02] animate-fade-in">
                {/* Result diagnostics */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-extrabold uppercase ${
                        simulationResult.isWinner
                          ? "bg-amber-400 text-black shadow-lg shadow-amber-400/10"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {simulationResult.isWinner ? "AUCTION WON" : "AUCTION LOST"}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      Clearing Price: <strong className="text-white">${simulationResult.clearingPrice} / click</strong>
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed">
                    {simulationResult.isWinner ? (
                      <>
                        Congratulations! Your bid of <span className="text-amber-400 font-bold">${maxBid.toFixed(2)}</span> outperformed competitors. Because of the Vickrey Second-Price rule, you pay only <span className="text-amber-400 font-bold">${simulationResult.clearingPrice}</span> (highest competitor bid + $0.01).
                      </>
                    ) : (
                      <>
                        Your bid of <span className="text-red-400 font-bold">${maxBid.toFixed(2)}</span> was too low. <span className="text-white font-semibold">{simulationResult.highestCompetitor}</span> won the bid with a price of <span className="text-amber-400 font-bold">${simulationResult.highestCompetitorBid}</span>. Try bidding at least <span className="text-amber-400 font-bold">${(simulationResult.highestCompetitorBid + 0.05).toFixed(2)}</span> to win.
                      </>
                    )}
                  </p>

                  {/* Competitor bid chart */}
                  <div className="space-y-2 border-t border-white/5 pt-3">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sealed Bid Ladder</h4>
                    <div className="space-y-1.5 text-xs">
                      {simulationResult.allBids.map((b: any, i: number) => (
                        <div key={i} className="flex justify-between items-center bg-white/[0.02] p-1.5 rounded">
                          <span className={`${b.isUser ? "text-amber-400 font-bold" : "text-gray-400"}`}>
                            {b.name} {b.isUser && "(You)"}
                          </span>
                          <span className="font-mono text-white">${b.bid.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Projected Impact values */}
                <div className="p-4 rounded-lg bg-black/40 border border-white/5 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Projected Daily Performance</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between border-b border-white/5 pb-1.5">
                        <span className="text-gray-400">Views/Impressions</span>
                        <span className="text-white font-mono font-bold">{simulationResult.projectedImpressions.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-1.5">
                        <span className="text-gray-400">Interactions/Clicks</span>
                        <span className="text-amber-400 font-mono font-bold">{simulationResult.projectedClicks.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-1.5">
                        <span className="text-gray-400">Acquired Leads</span>
                        <span className="text-white font-mono font-bold">{simulationResult.projectedConversions.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Estimated Spend</span>
                        <span className="text-white font-mono font-bold">${simulationResult.projectedCost.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5 text-[10px] text-gray-500 border-t border-white/5 pt-3 mt-4">
                    <AlertCircle size={12} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>Projected statistics are simulations based on benchmark channel conversions. Actual performance might vary.</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-xl border border-dashed border-white/10 bg-black/20 text-center flex flex-col items-center justify-center min-h-[180px]">
                <Compass size={28} className="text-gray-700 animate-pulse mb-2" />
                <h4 className="text-xs font-semibold text-gray-400">Awaiting Sealed Bid Simulation</h4>
                <p className="text-[11px] text-gray-500 mt-1 max-w-md leading-relaxed">
                  Submit a search keyword focus and your custom target CPC ceiling. Our bidding simulator will calculate rival responses instantly.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
