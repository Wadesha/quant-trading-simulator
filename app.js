/* =========================================================
 * QuantSim · 量化交易模拟驾驶舱
 * 纯前端模拟：所有数据均为演示，不构成投资建议。
 * ========================================================= */

/* ---------- 基础数据（尽量贴近真实场景） ---------- */

const PLATFORMS = [
  { id: "binance", name: "Binance", region: "全球", feeRate: 0.0010, categories: ["crypto"] },
  { id: "okx",     name: "OKX",     region: "全球", feeRate: 0.0008, categories: ["crypto"] },
  { id: "bybit",   name: "Bybit",   region: "全球", feeRate: 0.0006, categories: ["crypto"] },
  { id: "kucoin",  name: "KuCoin",  region: "全球", feeRate: 0.0010, categories: ["crypto"] },
  { id: "ashare",  name: "沪深A股(模拟)", region: "中国", feeRate: 0.0003, categories: ["stock", "etf"] },
  { id: "cme",     name: "CME期货(模拟)", region: "美国", feeRate: 0.0004, categories: ["futures", "options"] },
  { id: "ibkr",    name: "Interactive Brokers", region: "全球", feeRate: 0.0008, categories: ["stock", "forex", "futures", "options", "etf", "bond"] },
  { id: "fxcm",    name: "FXCM(模拟)", region: "全球", feeRate: 0.0002, categories: ["forex"] },
];

const CATEGORIES = {
  crypto:  { label: "数字货币", unit: "USDT" },
  stock:   { label: "股票",     unit: "CNY"  },
  futures: { label: "期货",     unit: "USD"  },
  forex:   { label: "外汇",     unit: "USD"  },
  options: { label: "期权",     unit: "USD"  },
  etf:     { label: "ETF/基金", unit: "CNY"  },
  bond:    { label: "债券",     unit: "CNY"  },
};

const STRATEGIES = [
  { id: "trend",     name: "趋势跟踪",   winRate: 0.42, baseReturn: 0.090, drawdown: 0.10, note: "顺势而为" },
  { id: "meanrev",   name: "均值回归",   winRate: 0.60, baseReturn: 0.050, drawdown: 0.05, note: "低买高卖" },
  { id: "grid",      name: "网格交易",   winRate: 0.72, baseReturn: 0.035, drawdown: 0.04, note: "高胜率小止盈" },
  { id: "statarb",   name: "统计套利",   winRate: 0.55, baseReturn: 0.060, drawdown: 0.03, note: "价差收敛" },
  { id: "hft",       name: "高频做市",   winRate: 0.68, baseReturn: 0.045, drawdown: 0.05, note: "薄利多销" },
  { id: "dca",       name: "DCA定投",    winRate: 0.65, baseReturn: 0.050, drawdown: 0.06, note: "平滑成本" },
  { id: "event",     name: "事件驱动",   winRate: 0.35, baseReturn: 0.120, drawdown: 0.15, note: "高弹性高风险" },
  { id: "multifactor", name: "多因子选股", winRate: 0.58, baseReturn: 0.070, drawdown: 0.07, note: "多因子打分" },
];

const RISKS = [
  { id: "low",  name: "低风险",  leverage: 1, mult: 0.5 },
  { id: "mid",  name: "中风险",  leverage: 2, mult: 1.0 },
  { id: "high", name: "高风险",  leverage: 5, mult: 1.9 },
];

const HORIZONS = [
  { id: "intraday", name: "日内",   turnover: 18  },
  { id: "swing",    name: "波段",   turnover: 6   },
  { id: "long",     name: "中长期", turnover: 1.5 },
];

/* ---------- 行情信号 + 预设操作（预案库） ---------- */

const SIGNALS = [
  { id: "trend_break", label: "趋势突破" },
  { id: "oversold",    label: "超跌反弹" },
  { id: "range",       label: "震荡市" },
  { id: "high_vol",    label: "高波动" },
  { id: "event",       label: "事件驱动" },
  { id: "risk_off",    label: "回撤预警" },
];

const PRESETS = [
  { id: "p1",  name: "BTC 趋势加仓",   signal: "trend_break", platform: "binance", category: "数字货币", strategy: "trend",    risk: "mid",  horizon: "swing",    capital: 20000 },
  { id: "p2",  name: "ETH 超跌抄底",   signal: "oversold",    platform: "okx",     category: "数字货币", strategy: "meanrev",  risk: "low",  horizon: "intraday", capital: 10000 },
  { id: "p3",  name: "BTC 震荡网格",   signal: "range",       platform: "binance", category: "数字货币", strategy: "grid",     risk: "low",  horizon: "intraday", capital: 15000 },
  { id: "p4",  name: "高波动趋势跟进", signal: "high_vol",    platform: "bybit",   category: "数字货币", strategy: "trend",    risk: "high", horizon: "intraday", capital: 12000 },
  { id: "p5",  name: "财报事件博弈",   signal: "event",       platform: "ashare",  category: "股票",   strategy: "event",    risk: "high", horizon: "intraday", capital: 8000  },
  { id: "p6",  name: "A股多因子调仓",  signal: "range",       platform: "ashare",  category: "股票",   strategy: "multifactor", risk: "mid", horizon: "long", capital: 50000 },
  { id: "p7",  name: "期货统计套利",   signal: "range",       platform: "cme",     category: "期货",   strategy: "statarb",  risk: "mid",  horizon: "swing",    capital: 30000 },
  { id: "p8",  name: "高频做市跑量",   signal: "high_vol",    platform: "kucoin",  category: "数字货币", strategy: "hft",     risk: "mid",  horizon: "intraday", capital: 25000 },
  { id: "p9",  name: "回撤防御降杠杆", signal: "risk_off",    platform: "ibkr",    category: "股票",   strategy: "meanrev",  risk: "low",  horizon: "intraday", capital: 15000 },
  { id: "p10", name: "外汇趋势套利",   signal: "trend_break", platform: "fxcm",    category: "外汇",   strategy: "trend",    risk: "mid",  horizon: "swing",    capital: 18000 },
];

const platformName = (id) => (PLATFORMS.find((p) => p.id === id) || {}).name || id;
const strategyName = (id) => (STRATEGIES.find((s) => s.id === id) || {}).name || id;
const riskName      = (id) => (RISKS.find((r) => r.id === id) || {}).name || id;
const horizonName   = (id) => (HORIZONS.find((h) => h.id === id) || {}).name || id;
const signalLabel   = (id) => (SIGNALS.find((s) => s.id === id) || {}).label || id;

/* =========================================================
 * 工具函数
 * ========================================================= */

const $ = (sel) => document.querySelector(sel);
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const fmt = (n, digits = 2) =>
  n.toLocaleString("zh-CN", { minimumFractionDigits: digits, maximumFractionDigits: digits });
const sign = (n) => (n > 0 ? "+" : "") + fmt(n * 100, 2) + "%";

function gaussian() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/* =========================================================
 * 模拟引擎
 * ========================================================= */

function simulate(platform, category, strategy, risk, horizon, capital) {
  const noise = gaussian() * 0.055;
  let rate = clamp(strategy.baseReturn * risk.mult + noise, -0.35, 0.45);

  const leverage = risk.leverage;
  const grossProfit = capital * rate * leverage;
  const fee = capital * platform.feeRate * horizon.turnover;
  const profit = grossProfit - fee;

  const drawdown = clamp(strategy.drawdown * risk.mult + Math.random() * 0.04, 0.01, 0.6);
  const winRate = clamp(strategy.winRate - (leverage > 2 ? 0.06 : 0) + (Math.random() * 0.1 - 0.05), 0.05, 0.95);
  const trades = Math.max(1, Math.round(horizon.turnover * (2 + Math.random() * 6)));

  return { rate, returnRate: profit / capital, profit, fee, drawdown, winRate, trades, leverage };
}

function evaluate(rate) {
  let band, tag, comments;
  if (rate >= 0.15) {
    band = "bigwin"; tag = "大幅盈利";
    comments = ["收益强劲、方向精准，建议及时部分止盈锁定利润。", "行情走出大行情，浮盈可观，可分批离场。"];
  } else if (rate >= 0.05) {
    band = "win"; tag = "稳健盈利";
    comments = ["方向正确、盈利稳健，可持有并上移止损位。", "策略表现良好，趋势仍在，注意控制追高仓位。"];
  } else if (rate >= 0) {
    band = "mildwin"; tag = "小幅盈利";
    comments = ["小有盈利、波动可控，等待更明确的加仓信号。", "收益温和，属正常区间波动，可持续观察。"];
  } else if (rate >= -0.05) {
    band = "flat"; tag = "基本持平";
    comments = ["盈亏基本打平、行情震荡，建议降低仓位观望。", "市场方向不明，耐心等待突破。"];
  } else if (rate >= -0.15) {
    band = "loss"; tag = "小幅回撤";
    comments = ["出现回撤、注意风险敞口，严格执行止损纪律。", "短线承压，破位则减仓。"];
  } else {
    band = "bigloss"; tag = "大幅亏损";
    comments = ["亏损较大、已触发风控线，需立即减仓并复盘。", "方向失误且杠杆放大亏损，建议停止加仓。"];
  }
  return { band, tag, comment: pick(comments) };
}

/* =========================================================
 * 驾驶舱状态
 * ========================================================= */

let activeSignals = [];
let baseCapital = 500000;   // 起始组合资产
let cumProfit = 0;          // 累计浮盈
let opCount = 0;            // 已执行笔数
let winCount = 0;           // 盈利笔数
let runningMaxDd = 0;       // 已出现最大回撤
let equityHistory = [];     // 资产净值历史
const logs = [];

const METRIC_ORDER = ["assets", "pnl", "count", "winrate", "maxdd", "sharpe"];

function seedEquity() {
  const pts = [];
  let v = baseCapital;
  for (let i = 0; i < 42; i++) {
    if (i > 0) v += gaussian() * baseCapital * 0.004;
    pts.push(v);
  }
  equityHistory = pts;
}

function metricValues() {
  const assets = baseCapital + cumProfit;
  const winRate = opCount ? winCount / opCount : null;
  const sharpe = opCount ? clamp(cumProfit / baseCapital / 0.06, -3, 5) : 0;
  const pnlDir = cumProfit > 0 ? "up" : cumProfit < 0 ? "down" : "flat";
  return {
    assets:  { label: "组合总资产", value: "¥" + fmt(assets, 0), dir: pnlDir },
    pnl:     { label: "累计浮盈",   value: (cumProfit >= 0 ? "+" : "") + fmt(cumProfit, 0), dir: pnlDir },
    count:   { label: "已执行",     value: opCount + " 笔", dir: "flat" },
    winrate: { label: "胜率",       value: winRate == null ? "—" : fmt(winRate * 100, 0) + "%", dir: winRate == null ? "flat" : (winRate >= 0.5 ? "up" : "down") },
    maxdd:   { label: "最大回撤",   value: "-" + fmt(runningMaxDd * 100, 1) + "%", dir: "down" },
    sharpe:  { label: "夏普比率",   value: fmt(sharpe, 2), dir: "flat" },
  };
}

function renderCockpit(changed = {}) {
  const vals = metricValues();
  const html = METRIC_ORDER.map((k) => {
    const v = vals[k];
    const flash = changed[k] !== undefined ? " flash" : "";
    const delta = changed[k] !== undefined
      ? `<div class="delta ${v.dir}">${changed[k]}</div>` : "";
    return `<div class="metric-cell${flash}"><div class="label">${v.label}</div><div class="value ${v.dir}">${v.value}</div>${delta}</div>`;
  }).join("");
  $("#cockpitMetrics").innerHTML = html;
}

function drawSpark(series) {
  const svg = $("#sparkChart");
  const w = 800, h = 64;
  const min = Math.min(...series) * 0.999;
  const max = Math.max(...series) * 1.001;
  const range = (max - min) || 1;
  const x = (i) => (i / (series.length - 1)) * w;
  const y = (v) => h - 3 - ((v - min) / range) * (h - 6);

  const line = series.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = line + ` L${w},${h} L0,${h} Z`;

  const change = series.length > 1 ? series[series.length - 1] - series[series.length - 2] : 0;
  const color = change >= 0 ? "#3fb950" : "#f85149";

  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  svg.setAttribute("preserveAspectRatio", "none");
  svg.innerHTML = `
    <defs>
      <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${color}" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <path d="${area}" fill="url(#sparkGrad)"/>
    <path d="${line}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
}

/* =========================================================
 * 结果展示（醒目评价）
 * ========================================================= */

function metricRows(res) {
  const rr = res.returnRate;
  const metrics = [
    ["收益率", sign(rr), rr >= 0 ? "up" : "down"],
    ["浮动盈亏", (res.profit >= 0 ? "+" : "") + fmt(res.profit, 0), res.profit >= 0 ? "up" : "down"],
    ["预估费用", fmt(res.fee, 0), "flat"],
    ["最大回撤", "-" + fmt(res.drawdown * 100, 1) + "%", "down"],
    ["胜率", fmt(res.winRate * 100, 1) + "%", res.winRate > 0.5 ? "up" : "down"],
    ["成交笔数", res.trades + " 笔", "flat"],
    ["杠杆", res.leverage + "x", "flat"],
  ];
  return metrics.map((m) => `<div class="metric"><div class="k">${m[0]}</div><div class="v ${m[2]}">${m[1]}</div></div>`).join("");
}

function renderResult(res, evalRes) {
  const box = $("#resultBox");
  box.classList.remove("hidden");
  box.innerHTML = `
    <div class="eval-banner eval-${evalRes.band}">
      <span class="tag">${evalRes.tag}</span>
      <span class="comment">${evalRes.comment}</span>
    </div>
    <div class="metrics">${metricRows(res)}</div>`;
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* =========================================================
 * 交易记录
 * ========================================================= */

function addLog(op, res, evalRes) {
  const now = new Date();
  const time = now.toLocaleTimeString("zh-CN", { hour12: false });
  logs.unshift({ time, op, res, evalRes });
  renderLogs();
}

function renderLogs() {
  const body = $("#logBody");
  body.innerHTML = "";
  logs.forEach((l) => {
    const tr = document.createElement("tr");
    const rr = l.res.returnRate;
    tr.innerHTML = `
      <td>${l.time}</td>
      <td>${l.op.name}</td>
      <td>${l.op.platform.name} / ${l.op.category}</td>
      <td>${l.op.strategy.name}</td>
      <td>${l.op.risk.name}</td>
      <td>${fmt(l.op.capital, 0)}</td>
      <td class="${rr >= 0 ? "up" : "down"}">${sign(rr)}</td>
      <td class="${l.res.profit >= 0 ? "up" : "down"}">${l.res.profit >= 0 ? "+" : ""}${fmt(l.res.profit, 0)}</td>
      <td><span class="eval-chip chip-${l.evalRes.band}">${l.evalRes.tag}</span></td>`;
    body.appendChild(tr);
  });
  $("#logEmpty").classList.toggle("hidden", logs.length > 0);
}

/* =========================================================
 * 执行一次操作（更新驾驶舱 + 高亮变化）
 * ========================================================= */

function executeOp(op) {
  const res = simulate(op.platform, op.category, op.strategy, op.risk, op.horizon, op.capital);
  const evalRes = evaluate(res.rate);

  const profit = res.profit;
  cumProfit += profit;
  opCount += 1;
  if (profit > 0) winCount += 1;
  runningMaxDd = Math.max(runningMaxDd, res.drawdown);
  equityHistory.push(baseCapital + cumProfit);
  drawSpark(equityHistory);

  addLog(op, res, evalRes);

  // 本轮发生变化的指标 + 增量，用于高亮
  const changed = {
    pnl: (profit >= 0 ? "+" : "") + fmt(profit, 0),
    assets: (profit >= 0 ? "+" : "") + fmt(profit, 0),
    count: "+1",
  };
  renderCockpit(changed);

  return { op, res, evalRes };
}

/* =========================================================
 * 行情信号 / 操作按钮
 * ========================================================= */

function renderMarketSignals() {
  const shuffled = [...SIGNALS].sort(() => Math.random() - 0.5);
  activeSignals = shuffled.slice(0, 2 + Math.floor(Math.random() * 2)).map((s) => s.id);
  const chips = SIGNALS.map((s) =>
    `<span class="signal-chip ${activeSignals.includes(s.id) ? "active" : ""}">${s.label}</span>`).join("");
  $("#marketSignals").innerHTML = `<span class="market-label">今日行情：</span>${chips}`;
  renderOps();
}

function renderOps() {
  const grid = $("#opGrid");
  grid.innerHTML = "";
  PRESETS.forEach((p) => {
    const recommended = activeSignals.includes(p.signal);
    const meta = `${platformName(p.platform)} · ${p.category} · ${strategyName(p.strategy)} · ${riskName(p.risk)} · ${horizonName(p.horizon)} · ${fmt(p.capital, 0)}`;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "op-btn" + (recommended ? " recommended" : "");
    btn.dataset.id = p.id;
    btn.innerHTML = `
      <div class="op-name">${p.name} ${recommended ? '<span class="badge recommend">推荐</span>' : ""}</div>
      <div class="op-meta">${meta}</div>
      <div class="op-trigger">触发：${signalLabel(p.signal)}</div>`;
    grid.appendChild(btn);
  });
}

function resolvePreset(p) {
  return {
    name: p.name,
    platform: PLATFORMS.find((x) => x.id === p.platform),
    category: p.category,
    strategy: STRATEGIES.find((x) => x.id === p.strategy),
    risk: RISKS.find((x) => x.id === p.risk),
    horizon: HORIZONS.find((x) => x.id === p.horizon),
    capital: p.capital,
  };
}

function execPreset(id) {
  const p = PRESETS.find((x) => x.id === id);
  const r = executeOp(resolvePreset(p));
  renderResult(r.res, r.evalRes);
}

function resetAll() {
  cumProfit = 0; opCount = 0; winCount = 0; runningMaxDd = 0;
  logs.length = 0;
  seedEquity();
  drawSpark(equityHistory);
  renderCockpit();
  renderLogs();
  $("#resultBox").classList.add("hidden");
}

/* =========================================================
 * 事件绑定
 * ========================================================= */

function init() {
  seedEquity();
  drawSpark(equityHistory);
  renderCockpit();
  renderMarketSignals();
  renderLogs();

  $("#opGrid").addEventListener("click", (e) => {
    const btn = e.target.closest(".op-btn");
    if (btn) execPreset(btn.dataset.id);
  });
  $("#refreshMarket").addEventListener("click", renderMarketSignals);
  $("#resetBtn").addEventListener("click", resetAll);
  $("#clearLog").addEventListener("click", () => {
    logs.length = 0;
    renderLogs();
  });
}

document.addEventListener("DOMContentLoaded", init);