/* =========================================================
 * QuantSim · 量化交易模拟后台
 * 纯前端模拟：所有数据均为演示，不构成投资建议。
 * ========================================================= */

/* ---------- 基础数据（尽量贴近真实场景） ---------- */

const PLATFORMS = [
  { id: "binance", name: "Binance", region: "全球", feeRate: 0.0010, categories: ["crypto"], desc: "全球最大加密货币交易所，流动性极佳" },
  { id: "okx",     name: "OKX",     region: "全球", feeRate: 0.0008, categories: ["crypto"], desc: "加密货币现货 + 衍生品综合平台" },
  { id: "bybit",   name: "Bybit",   region: "全球", feeRate: 0.0006, categories: ["crypto"], desc: "以衍生品见长的加密交易所" },
  { id: "kucoin",  name: "KuCoin",  region: "全球", feeRate: 0.0010, categories: ["crypto"], desc: "币种覆盖广泛，小币种较多" },
  { id: "ashare",  name: "沪深A股(模拟)", region: "中国", feeRate: 0.0003, categories: ["stock", "etf"], desc: "A股主板 / 创业板 / 科创板模拟" },
  { id: "cme",     name: "CME期货(模拟)", region: "美国", feeRate: 0.0004, categories: ["futures", "options"], desc: "芝商所全球期货与期权" },
  { id: "ibkr",    name: "Interactive Brokers", region: "全球", feeRate: 0.0008, categories: ["stock", "forex", "futures", "options", "etf", "bond"], desc: "多市场全品类券商" },
  { id: "fxcm",    name: "FXCM(模拟)", region: "全球", feeRate: 0.0002, categories: ["forex"], desc: "老牌外汇经纪商" },
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
  { id: "trend",     name: "趋势跟踪",   winRate: 0.42, baseReturn: 0.090, drawdown: 0.10, note: "顺势而为，吃大波段" },
  { id: "meanrev",   name: "均值回归",   winRate: 0.60, baseReturn: 0.050, drawdown: 0.05, note: "低买高卖，震荡市占优" },
  { id: "grid",      name: "网格交易",   winRate: 0.72, baseReturn: 0.035, drawdown: 0.04, note: "高胜率小止盈，震荡有利" },
  { id: "statarb",   name: "统计套利",   winRate: 0.55, baseReturn: 0.060, drawdown: 0.03, note: "价差收敛，收益相对稳定" },
  { id: "hft",       name: "高频做市",   winRate: 0.68, baseReturn: 0.045, drawdown: 0.05, note: "薄利多销，依赖速度与费率" },
  { id: "dca",       name: "DCA定投",    winRate: 0.65, baseReturn: 0.050, drawdown: 0.06, note: "分散时点，平滑成本" },
  { id: "event",     name: "事件驱动",   winRate: 0.35, baseReturn: 0.120, drawdown: 0.15, note: "高弹性高风险，博事件爆发" },
  { id: "multifactor", name: "多因子选股", winRate: 0.58, baseReturn: 0.070, drawdown: 0.07, note: "多因子打分，均衡配置" },
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
  // 近似的标准正态分布（Box-Muller）
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/* =========================================================
 * 模拟引擎：每个选项组合 -> 一个结果
 * ========================================================= */

function simulate(platform, category, strategy, risk, horizon, capital) {
  const noise = gaussian() * 0.055;          // 市场随机扰动
  let rate = strategy.baseReturn * risk.mult + noise;
  rate = clamp(rate, -0.35, 0.45);

  const leverage = risk.leverage;
  const grossProfit = capital * rate * leverage;
  const fee = capital * platform.feeRate * horizon.turnover;
  const profit = grossProfit - fee;

  const drawdown = clamp(strategy.drawdown * risk.mult + Math.random() * 0.04, 0.01, 0.6);
  const winRate = clamp(strategy.winRate - (leverage > 2 ? 0.06 : 0) + (Math.random() * 0.1 - 0.05), 0.05, 0.95);
  const trades = Math.max(1, Math.round(horizon.turnover * (2 + Math.random() * 6)));

  return {
    rate: rate,                // 净收益率（含费用前口径，用于评价）
    returnRate: profit / capital, // 扣除费用后的实际收益率
    profit,
    fee,
    drawdown,
    winRate,
    trades,
    leverage,
  };
}

function evaluate(rate, strategy) {
  let band, tag, comments;
  if (rate >= 0.15) {
    band = "bigwin"; tag = "大幅盈利";
    comments = [
      "收益强劲、方向判断精准，建议及时部分止盈锁定利润。",
      "行情走出大行情，浮盈可观，警惕过热后可分批离场。",
    ];
  } else if (rate >= 0.05) {
    band = "win"; tag = "稳健盈利";
    comments = [
      "方向正确、盈利稳健，可继续持有并上移止损位。",
      "策略表现良好，趋势仍在，注意控制追高仓位。",
    ];
  } else if (rate >= 0) {
    band = "mildwin"; tag = "小幅盈利";
    comments = [
      "小有盈利、波动可控，等待更明确的加仓信号。",
      "收益温和，属于正常的区间波动，可持续观察。",
    ];
  } else if (rate >= -0.05) {
    band = "flat"; tag = "基本持平";
    comments = [
      "盈亏基本打平、行情震荡，建议降低仓位观望。",
      "市场方向不明，摩擦成本抵消收益，宜耐心等待突破。",
    ];
  } else if (rate >= -0.15) {
    band = "loss"; tag = "小幅回撤";
    comments = [
      "出现回撤、注意风险敞口，严格执行止损纪律。",
      "短线承压，未破关键位前可持有，破位则减仓。",
    ];
  } else {
    band = "bigloss"; tag = "大幅亏损";
    comments = [
      "亏损较大、已触发风控线，需立即减仓并复盘策略。",
      "方向判断失误且杠杆放大亏损，建议停止加仓、清点敞口。",
    ];
  }
  return { band, tag, comment: pick(comments) };
}

/* =========================================================
 * 状态
 * ========================================================= */

let accounts = [];
let equitySeries = [];
const logs = [];

/* =========================================================
 * 渲染：下拉框
 * ========================================================= */

function fillSelect(sel, items, textFn, valueFn) {
  sel.innerHTML = "";
  items.forEach((it) => {
    const opt = document.createElement("option");
    opt.value = valueFn(it);
    opt.textContent = textFn(it);
    sel.appendChild(opt);
  });
}

function fillPlatforms() {
  fillSelect($("#platform"), PLATFORMS, (p) => `${p.name} · ${p.region}`, (p) => p.id);
  fillSelect($("#strategy"), STRATEGIES, (s) => `${s.name}（${s.note}）`, (s) => s.id);
  fillSelect($("#risk"), RISKS, (r) => `${r.name}（${r.leverage}x）`, (r) => r.id);
  fillSelect($("#horizon"), HORIZONS, (h) => h.name, (h) => h.id);
  syncCategories();
}

function currentPlatform() {
  return PLATFORMS.find((p) => p.id === $("#platform").value);
}

function syncCategories() {
  const p = currentPlatform();
  const cats = p.categories.map((c) => CATEGORIES[c]);
  fillSelect($("#category"), cats, (c) => c.label, (c) => c.label);
  updateUnit();
}

function updateUnit() {
  const catId = $("#category").value;
  const unit = Object.values(CATEGORIES).find((c) => c.label === catId)?.unit || "USDT";
  $("#capitalUnit").textContent = `(${unit})`;
}

/* =========================================================
 * 监控总览 / 账户卡片
 * ========================================================= */

function randomAccount() {
  const p = pick(PLATFORMS);
  const catId = pick(p.categories);
  const cat = CATEGORIES[catId];
  const strat = pick(STRATEGIES);
  const equity = Math.round((5000 + Math.random() * 95000) / 100) * 100;
  const pnlRate = (Math.random() - 0.42) * 0.3; // 大致偏正，但允许亏损
  const status = pnlRate > 0.08 ? "ok" : pnlRate < -0.05 ? "alert" : "warn";
  return { platform: p, cat, strat, equity, pnlRate, status };
}

function renderAccounts() {
  accounts = Array.from({ length: 6 }, randomAccount);
  const list = $("#accountList");
  list.innerHTML = "";
  accounts.forEach((a) => {
    const el = document.createElement("div");
    el.className = "account";
    const badge =
      a.status === "ok" ? "运行良好" : a.status === "warn" ? "关注" : "警告";
    el.innerHTML = `
      <div class="info">
        <div class="name">${a.platform.name} <span class="badge ${a.status}">${badge}</span></div>
        <div class="meta">${a.cat.label} · ${a.strat.name} · 净值 ${fmt(a.equity, 0)}</div>
      </div>
      <div class="pnl">
        <div class="p ${a.pnlRate >= 0 ? "up" : "down"}">${sign(a.pnlRate)}</div>
        <div class="meta">浮动盈亏</div>
      </div>`;
    list.appendChild(el);
  });
  $("#accountCount").textContent = `${accounts.length} 个账户`;

  // 总览卡片
  renderOverview();
}

function renderOverview() {
  const totalEquity = accounts.reduce((s, a) => s + a.equity, 0);
  const avgPnl = accounts.reduce((s, a) => s + a.pnlRate, 0) / accounts.length;
  const sharpe = clamp(avgPnl / 0.08, -3, 5);
  const maxDd = 0.04 + Math.random() * 0.08;
  const winCount = accounts.filter((a) => a.pnlRate >= 0).length;

  $("#overviewCards").innerHTML = `
    <div class="stat-card">
      <div class="label">组合总资产</div>
      <div class="value">¥${fmt(totalEquity, 0)}</div>
      <div class="change flat">${accounts.length} 个账户</div>
    </div>
    <div class="stat-card">
      <div class="label">当前浮动盈亏</div>
      <div class="value ${avgPnl >= 0 ? "up" : "down"}">${sign(avgPnl)}</div>
      <div class="change ${avgPnl >= 0 ? "up" : "down"}">${avgPnl >= 0 ? "整体偏多" : "整体承压"}</div>
    </div>
    <div class="stat-card">
      <div class="label">夏普比率(年化)</div>
      <div class="value">${fmt(sharpe, 2)}</div>
      <div class="change flat">风险调整后收益</div>
    </div>
    <div class="stat-card">
      <div class="label">最大回撤</div>
      <div class="value down">-${fmt(maxDd * 100, 1)}%</div>
      <div class="change flat">持仓区间</div>
    </div>
    <div class="stat-card">
      <div class="label">盈利账户 / 亏损</div>
      <div class="value">${winCount} / ${accounts.length - winCount}</div>
      <div class="change ${winCount >= accounts.length / 2 ? "up" : "down"}">胜率 ${fmt((winCount / accounts.length) * 100, 0)}%</div>
    </div>
  `.trim();
}

/* =========================================================
 * 净值曲线（SVG）
 * ========================================================= */

function generateEquity(points = 60) {
  const series = [1.0];
  for (let i = 1; i < points; i++) {
    const step = 0.004 * gaussian() + 0.001; // 轻微正漂移
    series.push(clamp(series[i - 1] + step, 0.5, 2.0));
  }
  return series;
}

function drawChart(series) {
  const svg = $("#equityChart");
  const w = 600, h = 260, pad = 12;
  const min = Math.min(...series) * 0.98;
  const max = Math.max(...series) * 1.02;
  const range = max - min || 1;
  const x = (i) => pad + (i / (series.length - 1)) * (w - pad * 2);
  const y = (v) => h - pad - ((v - min) / range) * (h - pad * 2);

  const line = series.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = series
    .map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`)
    .join(" ") + ` L${x(series.length - 1).toFixed(1)},${h - pad} L${x(0).toFixed(1)},${h - pad} Z`;

  // 基准线（净资产 = 1.0）
  const baseY = y(1.0);

  svg.innerHTML = `
    <defs>
      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#2f81f7" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#2f81f7" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <line x1="${pad}" y1="${baseY}" x2="${w - pad}" y2="${baseY}" stroke="#4b5563" stroke-dasharray="4 4" stroke-width="1"/>
    <path d="${area}" fill="url(#areaGrad)"/>
    <path d="${line}" fill="none" stroke="#2f81f7" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
  `;
}

/* =========================================================
 * 结果展示（醒目评价）
 * ========================================================= */

function renderResult(res, evalRes, capital) {
  const box = $("#resultBox");
  box.classList.remove("hidden");
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });

  $("#evalBanner").className = "eval-banner eval-" + evalRes.band;
  $("#evalBanner").innerHTML = `
    <span class="tag">${evalRes.tag}</span>
    <span class="comment">${evalRes.comment}</span>`;

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

  $("#metrics").innerHTML = metrics
    .map((m) => `<div class="metric"><div class="k">${m[0]}</div><div class="v ${m[2]}">${m[1]}</div></div>`)
    .join("");
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
      <td>${l.op.platform.name}</td>
      <td>${l.op.category}</td>
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
 * 事件绑定
 * ========================================================= */

function handleSubmit(e) {
  e.preventDefault();
  const platform = currentPlatform();
  const category = $("#category").value;
  const strategy = STRATEGIES.find((s) => s.id === $("#strategy").value);
  const risk = RISKS.find((r) => r.id === $("#risk").value);
  const horizon = HORIZONS.find((h) => h.id === $("#horizon").value);
  const capital = Math.max(0, Number($("#capital").value) || 0);

  const res = simulate(platform, category, strategy, risk, horizon, capital);
  const evalRes = evaluate(res.rate, strategy);
  const op = { platform, category, strategy, risk, horizon, capital };

  renderResult(res, evalRes, capital);
  addLog(op, res, evalRes);

  // 净值曲线向前推进一次
  if (equitySeries.length) {
    equitySeries.push(clamp(equitySeries[equitySeries.length - 1] * (1 + res.returnRate), 0.5, 2.0));
    drawChart(equitySeries);
  }
}

function init() {
  fillPlatforms();
  renderAccounts();
  equitySeries = generateEquity();
  drawChart(equitySeries);
  renderLogs();

  $("#opForm").addEventListener("submit", handleSubmit);
  $("#platform").addEventListener("change", syncCategories);
  $("#category").addEventListener("change", updateUnit);
  $("#refreshBtn").addEventListener("click", () => {
    renderAccounts();
    equitySeries = generateEquity();
    drawChart(equitySeries);
  });
  $("#clearLog").addEventListener("click", () => {
    logs.length = 0;
    renderLogs();
  });
}

document.addEventListener("DOMContentLoaded", init);