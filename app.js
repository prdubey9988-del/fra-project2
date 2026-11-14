/**
 * Financial Risk Analytics (FRA) — Credit Risk Deep Dive Dashboard
 * Core Application Logic, Chart.js Visualizations & Analytics
 */

// =============================================================================
// GLOBAL STATE & CONSTANTS
// =============================================================================

const FRA_STATE = {
  currentMainTab: 'icici',       // 'icici' | 'yesbank' | 'comparative' | 'npamovement' | 'timeline' | 'stock' | 'methodology'
  selectedEntity: 'ICICI Bank',  // 'ICICI Bank' | 'Yes Bank'
  selectedMetric: 'gnpa_pct',    // 'gnpa_pct' | 'nnpa_pct' | 'pcr_pct' | 'slippage_ratio' | 'credit_cost' | 'writeoff_ratio'
  showPeerBand: false,
  showAnnotations: true,
  peerVisibility: {},            // Bank name -> boolean
  npaBank: 'ICICI Bank',         // 'ICICI Bank' | 'Yes Bank'
  npaViewMode: 'annual',         // 'annual' | 'waterfall'
  npaSelectedYear: 'FY2019',
  activeHighlightedEvent: null,  // event id string or null
  stockMode: 'normalized',       // 'normalized' | 'absolute'
  stockIncludeNifty: true,
  stockIncludePeers: false,
  comparativeMetric: 'gnpa_pct',
  timelineFilter: 'all'          // 'all' | 'systematic' | 'icici' | 'yesbank'
};

// Peer groupings
const PEER_GROUPS = {
  "ICICI Bank": ["HDFC Bank", "Axis Bank", "Kotak Mahindra Bank"],
  "Yes Bank": ["Federal Bank", "RBL Bank", "IDFC First Bank", "Bandhan Bank"]
};

// Distinct colors for entities and peers
const COLOR_PALETTE = {
  "ICICI Bank": "#00d4ff",
  "Yes Bank": "#ff4757",
  "Nifty Bank": "#a855f7",
  "Peer Average": "#c084fc",
  "Peer Band": "rgba(168, 85, 247, 0.12)",
  "HDFC Bank": "#38bdf8",
  "Axis Bank": "#f43f5e",
  "Kotak Mahindra Bank": "#fbbf24",
  "Federal Bank": "#2dd4bf",
  "RBL Bank": "#818cf8",
  "IDFC First Bank": "#fb923c",
  "Bandhan Bank": "#4ade80"
};

// Metric metadata & descriptions
const METRIC_DEFS = {
  gnpa_pct: {
    name: "Gross NPA Ratio (%)",
    shortName: "GNPA %",
    unit: "%",
    decimals: 2,
    formula: "(Gross NPA / Gross Advances) × 100",
    desc: "Measures gross unrecognized loan impairment under RBI's 90-day delinquency classification norm.",
    iciciCommentary: "Surged from 3.78% (FY15) to 8.84% (FY18) post-RBI AQR and Feb 12 circular. Cleaned down to 2.16% by FY24 under Bakhshi's retail pivot and write-offs.",
    yesCommentary: "Concealed via under-reporting (FY16-FY18 divergence). Rose to 16.80% in FY20 after Rana Kapoor's exit; reset to 2.17% in FY23 via JC Flowers ARC carve-out."
  },
  nnpa_pct: {
    name: "Net NPA Ratio (%)",
    shortName: "NNPA %",
    unit: "%",
    decimals: 2,
    formula: "(Net NPA / (Gross Advances − Provisions)) × 100",
    desc: "Unprovisioned bad loans as % of net advances. Reflects direct solvency risk threatening the bank's core capital.",
    iciciCommentary: "Peaked at 4.89% in FY17 (4.77% in FY18) before aggressive provisioning reduced it to 0.42% in FY24, giving ICICI one of the cleanest balance sheets in Asia.",
    yesCommentary: "Maintained artificially low (0.12% to 0.81%) through evergreen restructuring until FY19 (1.86%) and FY20 (5.03%), necessitating an SBI-led public rescue."
  },
  pcr_pct: {
    name: "Provision Coverage Ratio (%)",
    shortName: "PCR %",
    unit: "%",
    decimals: 2,
    formula: "(Specific Provisions Held / Gross NPA) × 100",
    desc: "Loss-absorption cushion against bad debt. High PCR protects future earnings and equity from recovery shortfalls.",
    iciciCommentary: "Dropped to 40.2% during the FY17 corporate storm, then built up steadily to ~81% in FY24 (reported: 80.3%), creating a strong loss-absorption buffer.",
    yesCommentary: "Fell to inadequate levels (43% in FY19) until FY20 when rescue-era provisioning lifted PCR to 73.8% amidst the moratorium and reconstruction scheme."
  },
  slippage_ratio: {
    name: "Slippage Ratio (%)",
    shortName: "Slippage %",
    unit: "%",
    decimals: 2,
    formula: "(Fresh Additions to NPA / Gross Advances) × 100",
    desc: "Annual velocity of new loan deterioration. Core forward-looking measure of incremental credit risk.",
    iciciCommentary: "Peaked at 6.22% in FY17 (₹33,544 Cr additions) and stayed high in FY18 (₹28,730 Cr). Fell to ~1.5% by FY24 as corporate legacy assets were replaced by secured retail advances.",
    yesCommentary: "Jumped to 19.05% of advances in FY20 (₹37,272 Cr fresh slippages in 12 months), wiping out a large part of the bank's net worth."
  },
  credit_cost: {
    name: "Credit Cost (%)",
    shortName: "Credit Cost %",
    unit: "%",
    decimals: 2,
    formula: "(Provision Expense in P&L / Gross Advances) × 100",
    desc: "Annual P&L tax of provisioning. Directly eats into Net Interest Margin (NIM) and Return on Assets (RoA).",
    iciciCommentary: "Held near 2.8% through FY17–FY19 (peak 2.85% in FY19) as management front-loaded provisions to absorb NCLT haircuts, before declining to a record-low 0.28% in FY24.",
    yesCommentary: "Reached 16.74% in FY20 (₹32,758 Cr net provisions on ~₹1.96 Lakh Cr gross advances), resulting in an FY20 net loss of ₹16,418 Cr."
  },
  writeoff_ratio: {
    name: "Write-Off Ratio (%)",
    shortName: "Write-Off %",
    unit: "%",
    decimals: 2,
    formula: "(Bad Loan Write-offs / Gross Advances) × 100",
    desc: "Prudential and technical derecognition of non-performing assets to clean the balance sheet.",
    iciciCommentary: "Peaked at 2.55% in FY18 and stayed elevated in FY19 (₹14,094 Cr written off or sold) — the 'kitchen-sinking' phase that laid the foundation for ICICI's multi-year rally.",
    yesCommentary: "Hit 9.15% in FY23 (₹18,523 Cr GNPA reduction via write-off/sale) driven by the ₹48,000 Cr stressed-portfolio transfer to JC Flowers Asset Reconstruction Company (ARC)."
  }
};

// Global Data Store
let FRA_DATA = {
  raw: null,
  computed: null,
  years: [],
  peerStats: {},      // entity -> metric -> fy -> { avg, min, max }
  npaMovements: {},   // bank -> fy -> { opening, slippages, recoveries, writeoffs, closing }
  stockStats: {},     // bank -> { beta, corr, totalReturn, cagr, maxDD, startPrice, endPrice }
  eventWindowPerf: [] // array of window stats
};

// Chart.js Instances
let creditRiskChartInstance = null;
let npaMovementChartInstance = null;
let comparativeChartInstance = null;
let stockPriceChartInstance = null;

// =============================================================================
// INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  try {
    initChartAnnotationPlugin();
    initAnalyticsData();
    initPeerCheckboxes();
    renderTimelineCards();
    renderEventPerformanceTable();
    initUIEventListeners();
    
    // Initial Render
    updateCreditRiskUI();
    renderCreditRiskChart();
    renderNpaMovementChart();
    renderComparativeChart();
    renderStockPriceChart();

    // Trigger initial animated stats
    triggerHeroCounters();
  } catch (error) {
    console.error("Dashboard initialization error:", error);
  }
});

/**
 * Register Chart.js Annotation plugin safely if loaded via CDN
 */

// Draws data values next to points/bars for datasets flagged showValues
const ValueLabelPlugin = {
  id: 'valueLabels',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    chart.data.datasets.forEach((ds, i) => {
      if (!ds.showValues || !chart.isDatasetVisible(i)) return;
      const meta = chart.getDatasetMeta(i);
      ctx.save();
      ctx.font = '600 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = ds.valueColor || ds.borderColor || '#e2e8f0';
      meta.data.forEach((el, j) => {
        const raw = ds.data[j];
        const isArr = Array.isArray(raw);
        const v = isArr ? Math.abs(raw[1] - raw[0]) : ((raw && typeof raw === 'object') ? raw.label : raw);
        if (v === null || v === undefined || (typeof v === 'number' && isNaN(v))) return;
        const txt = ds.valueFormat ? ds.valueFormat(v, j) : (typeof v === 'number' ? v.toFixed(1) : v);
        const p = el.tooltipPosition();
        const top = (el.base !== undefined && el.y !== undefined) ? Math.min(el.y, el.base) : p.y;
        const y = ds.valueBelow ? p.y + 20 : top - 12;
        ctx.fillText(txt, p.x, y);
      });
      ctx.restore();
    });
  }
};
if (typeof Chart !== 'undefined') { Chart.register(ValueLabelPlugin); Chart.defaults.scales.linear.beginAtZero = true; }

function initChartAnnotationPlugin() {
  if (typeof ChartAnnotation !== 'undefined') {
    try { Chart.register(ChartAnnotation); } catch (e) {}
  } else if (window['chartjs-plugin-annotation']) {
    try { Chart.register(window['chartjs-plugin-annotation']); } catch (e) {}
  }
}

/**
 * Pre-compute all ratios, peer distributions, NPA movements, and market stats
 */
function initAnalyticsData() {
  if (typeof CREDIT_RISK_DATA === 'undefined') {
    console.error("CREDIT_RISK_DATA not found. Make sure credit_risk_data.js is loaded.");
    return;
  }

  FRA_DATA.raw = CREDIT_RISK_DATA;
  FRA_DATA.computed = computeRatios(CREDIT_RISK_DATA);
  FRA_DATA.years = Object.keys(FRA_DATA.raw["ICICI Bank"].data);

  // Initialize peer visibility defaults
  for (const entity of ["ICICI Bank", "Yes Bank"]) {
    FRA_DATA.peerStats[entity] = {};
    const peers = PEER_GROUPS[entity];
    peers.forEach(p => {
      if (FRA_STATE.peerVisibility[p] === undefined) {
        FRA_STATE.peerVisibility[p] = false;
      }
    });

    // Compute peer distribution (Avg, Min, Max) for each metric and year
    for (const metric of Object.keys(METRIC_DEFS)) {
      FRA_DATA.peerStats[entity][metric] = {};
      FRA_DATA.years.forEach(fy => {
        const vals = peers
          .map(p => FRA_DATA.computed[p]?.ratios[fy]?.[metric])
          .filter(v => v !== undefined && !isNaN(v));
        
        if (vals.length > 0) {
          const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
          const min = Math.min(...vals);
          const max = Math.max(...vals);
          FRA_DATA.peerStats[entity][metric][fy] = {
            avg: Math.round(avg * 100) / 100,
            min: Math.round(min * 100) / 100,
            max: Math.round(max * 100) / 100
          };
        }
      });
    }
  }

  // Pre-calculate NPA Movements (Opening, Slippages, Recoveries, Write-offs, Closing)
  const allBanks = Object.keys(FRA_DATA.computed);
  allBanks.forEach(bank => {
    FRA_DATA.npaMovements[bank] = {};
    const d = FRA_DATA.raw[bank].data;
    let prevClose = bank === 'ICICI Bank' ? 11750 : (bank === 'Yes Bank' ? 175 : (d[Object.keys(d)[0]]?.gross_npa || 0) * 0.85);

    FRA_DATA.years.forEach(yr => {
      const item = d[yr];
      if (!item) return;
      const opening = Math.round(prevClose);
      const slippages = item.slippages;
      const writeoffs = item.write_offs;
      const closing = item.gross_npa;
      let recoveries = (opening + slippages) - writeoffs - closing;
      if (recoveries < 0) recoveries = 0;

      FRA_DATA.npaMovements[bank][yr] = {
        opening,
        slippages,
        recoveries,
        writeoffs,
        closing
      };
      prevClose = closing;
    });
  });

  // Pre-calculate Stock Return Statistics & Correlations
  if (typeof STOCK_DATA !== 'undefined') {
    computeStockRiskAnalytics();
    computeEventWindowReturns();
  }
}

/**
 * Compute Market Beta, Correlation with Nifty Bank, CAGR, and Max Drawdown
 */
function computeStockRiskAnalytics() {
  const returns = STOCK_DATA.returns;
  const prices = STOCK_DATA.prices;
  const niftyReturns = returns["Nifty Bank"]?.monthly_returns || [];
  const niftyMap = new Map(niftyReturns.map(x => [x.date, x.return_pct]));

  const banks = ["ICICI Bank", "Yes Bank", "Nifty Bank", "HDFC Bank", "Axis Bank", "Kotak Mahindra Bank", "Federal Bank", "RBL Bank", "IDFC First Bank", "Bandhan Bank"];

  banks.forEach(bank => {
    if (!returns[bank] || !prices[bank]) return;
    const bReturns = returns[bank].monthly_returns || [];
    const bPriceList = prices[bank];

    // Correlation & Beta with Nifty Bank
    const pairs = [];
    bReturns.forEach(br => {
      if (niftyMap.has(br.date)) {
        pairs.push([br.return_pct, niftyMap.get(br.date)]);
      }
    });

    const regress = (pp) => {
      if (pp.length < 3) return { corr: null, beta: null };
      const n = pp.length;
      const mx = pp.reduce((s, p) => s + p[0], 0) / n, my = pp.reduce((s, p) => s + p[1], 0) / n;
      let nu = 0, dx = 0, dy = 0;
      pp.forEach(([x, y]) => { nu += (x - mx) * (y - my); dx += (x - mx) ** 2; dy += (y - my) ** 2; });
      return { corr: dx > 0 && dy > 0 ? nu / Math.sqrt(dx * dy) : null, beta: dy > 0 ? nu / dy : null };
    };
    const datedPairs = bReturns.filter(br => niftyMap.has(br.date)).map(br => [br.return_pct, niftyMap.get(br.date), br.date]);
    const pre = regress(datedPairs.filter(p => p[2] < '2019-04-01'));
    const post = regress(datedPairs.filter(p => p[2] >= '2019-04-01'));

    let corr = 0, beta = 0;
    if (pairs.length > 2) {
      const n = pairs.length;
      const meanX = pairs.reduce((s, p) => s + p[0], 0) / n;
      const meanY = pairs.reduce((s, p) => s + p[1], 0) / n;
      let num = 0, denX = 0, denY = 0;
      pairs.forEach(([x, y]) => {
        num += (x - meanX) * (y - meanY);
        denX += Math.pow(x - meanX, 2);
        denY += Math.pow(y - meanY, 2);
      });
      corr = denX > 0 && denY > 0 ? num / Math.sqrt(denX * denY) : 0;
      beta = denY > 0 ? num / denY : 0;
    }

    // 10-Year Return & CAGR
    const firstP = bPriceList[0]?.close || 1;
    const lastP = bPriceList[bPriceList.length - 1]?.close || 1;
    const totalReturn = ((lastP - firstP) / firstP) * 100;
    const yearsSpan = bPriceList.length / 12;
    const cagr = (Math.pow(lastP / firstP, 1 / (yearsSpan || 10)) - 1) * 100;

    // Peak-to-Trough Max Drawdown
    let peak = -Infinity;
    let maxDD = 0;
    bPriceList.forEach(item => {
      if (item.close > peak) peak = item.close;
      const dd = (item.close - peak) / peak;
      if (dd < maxDD) maxDD = dd;
    });

    FRA_DATA.stockStats[bank] = {
      corr: Math.round(corr * 1000) / 1000,
      beta: Math.round(beta * 100) / 100,
      totalReturn: Math.round(totalReturn * 10) / 10,
      cagr: Math.round(cagr * 10) / 10,
      maxDD: Math.round(maxDD * 1000) / 10,
      corrPre: pre.corr, betaPre: pre.beta, corrPost: post.corr, betaPost: post.beta,
      r2: Math.round(corr * corr * 1000) / 1000,
      startPrice: firstP,
      endPrice: lastP
    };
  });
}

/**
 * Compute performance across critical historical event windows
 */
function computeEventWindowReturns() {
  if (typeof EVENT_WINDOWS === 'undefined') return;

  const prices = STOCK_DATA.prices;

  function getWindowReturn(bank, start, end) {
    const pList = prices[bank];
    if (!pList) return null;
    const startP = pList.find(p => p.date >= start);
    const endP = [...pList].reverse().find(p => p.date <= end);
    if (!startP || !endP) return null;
    return Math.round(((endP.close - startP.close) / startP.close * 100) * 10) / 10;
  }

  FRA_DATA.eventWindowPerf = [];

  for (const [id, win] of Object.entries(EVENT_WINDOWS)) {
    const icici = getWindowReturn("ICICI Bank", win.start, win.end);
    const yes = getWindowReturn("Yes Bank", win.start, win.end);
    const nifty = getWindowReturn("Nifty Bank", win.start, win.end);

    let takeaway = "";
    if (id === 'aqr') {
      takeaway = "ICICI recognized hidden stress early; Yes Bank concealed NPAs, outperforming unsustainably.";
    } else if (id === 'demonetization') {
      takeaway = "Short-term MSME cash flow freeze; systemic deposits surged across both lenders.";
    } else if (id === 'ilfs') {
      takeaway = "NBFC liquidity freeze; Yes Bank's high shadow-bank exposure started showing severe stress.";
    } else if (id === 'icici_chanda') {
      takeaway = "Despite governance allegations, ICICI held up (slightly ahead of Nifty Bank); the market looked through to the Bakhshi transition.";
    } else if (id === 'yes_rbi_divergence') {
      takeaway = "First regulatory red flag proving Yes Bank had under-reported ₹4,176 Cr in bad loans.";
    } else if (id === 'yes_rana_exit') {
      takeaway = "RBI forced founder-CEO exit; ICICI rallied +43% under turnaround while Yes Bank plunged -40%.";
    } else if (id === 'yes_collapse') {
      takeaway = "Deposit run; RBI moratorium & SBI rescue averted systemic contagion.";
    } else if (id === 'covid') {
      takeaway = "ICICI's stronger balance sheet held up; Yes Bank lagged under legacy stress.";
    } else {
      takeaway = "Systematic vs idiosyncratic divergence in asset valuation.";
    }

    FRA_DATA.eventWindowPerf.push({
      id,
      label: win.label,
      start: win.start,
      end: win.end,
      icici,
      yes,
      nifty,
      takeaway
    });
  }
}

// =============================================================================
// NAVIGATION & TAB SWITCHING
// =============================================================================

function switchMainTab(tabId) {
  FRA_STATE.currentMainTab = tabId;

  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active', 'tab-icici', 'tab-yes');
  });

  const activeBtn = document.getElementById(`tab-btn-${tabId}`);
  if (activeBtn) {
    activeBtn.classList.add('active');
    if (tabId === 'icici') activeBtn.classList.add('tab-icici');
    if (tabId === 'yesbank') activeBtn.classList.add('tab-yes');
  }

  // Hide all panels
  document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));

  // Show relevant panel
  if (tabId === 'icici' || tabId === 'yesbank') {
    document.getElementById('view-credit-risk').classList.add('active');
    selectEntity(tabId === 'icici' ? 'ICICI Bank' : 'Yes Bank');
    if (creditRiskChartInstance) setTimeout(() => creditRiskChartInstance.resize(), 50);
  } else if (tabId === 'comparative') {
    document.getElementById('view-comparative').classList.add('active');
    if (comparativeChartInstance) setTimeout(() => comparativeChartInstance.resize(), 50);
  } else if (tabId === 'npamovement') {
    document.getElementById('view-npamovement').classList.add('active');
    if (npaMovementChartInstance) setTimeout(() => npaMovementChartInstance.resize(), 50);
  } else if (tabId === 'timeline') {
    document.getElementById('view-timeline').classList.add('active');
  } else if (tabId === 'stock') {
    document.getElementById('view-stock').classList.add('active');
    if (stockPriceChartInstance) setTimeout(() => stockPriceChartInstance.resize(), 50);
  } else if (tabId === 'methodology') {
    document.getElementById('view-methodology').classList.add('active');
  }

  window.scrollTo({ top: document.querySelector('.nav-tab-wrapper').offsetTop - 20, behavior: 'smooth' });
}

function selectEntity(bankName) {
  FRA_STATE.selectedEntity = bankName;

  // Toggle segmented buttons in Credit Risk panel
  const iciciBtn = document.getElementById('btn-select-icici');
  const yesBtn = document.getElementById('btn-select-yes');
  if (bankName === 'ICICI Bank') {
    iciciBtn.classList.add('active', 'icici-active');
    yesBtn.classList.remove('active', 'yes-active');
  } else {
    yesBtn.classList.add('active', 'yes-active');
    iciciBtn.classList.remove('active', 'icici-active');
  }

  // Sync with main navigation tab bar
  const isICICI = bankName === 'ICICI Bank';
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active', 'tab-icici', 'tab-yes'));
  const targetTab = isICICI ? 'tab-btn-icici' : 'tab-btn-yesbank';
  const tabEl = document.getElementById(targetTab);
  if (tabEl) {
    tabEl.classList.add('active');
    tabEl.classList.add(isICICI ? 'tab-icici' : 'tab-yes');
  }

  // Update titles & subtitles
  document.getElementById('panel-bank-title').textContent = isICICI
    ? "ICICI Bank: Credit Risk & Asset Quality Arc"
    : "Yes Bank: Credit Risk, Divergence & Moratorium Shock";
  document.getElementById('panel-bank-subtitle').textContent = isICICI
    ? "Comparing 10-year credit risk indicators against Large Private Sector peers (HDFC Bank, Axis Bank, Kotak Mahindra)."
    : "Comparing 10-year credit risk indicators against Mid-sized Private peers (Federal Bank, RBL Bank, IDFC First, Bandhan).";

  // Rebuild peer checkboxes for new bank
  initPeerCheckboxes();
  updateCreditRiskUI();
  renderCreditRiskChart();
}

function selectMetric(metricKey) {
  FRA_STATE.selectedMetric = metricKey;

  // Update metric tab buttons
  document.querySelectorAll('.metric-btn').forEach(btn => {
    btn.classList.remove('active', 'icici-theme', 'yes-theme');
  });

  const activeBtn = document.getElementById(`mbtn-${metricKey}`);
  if (activeBtn) {
    activeBtn.classList.add('active');
    activeBtn.classList.add(FRA_STATE.selectedEntity === 'ICICI Bank' ? 'icici-theme' : 'yes-theme');
  }

  updateCreditRiskUI();
  renderCreditRiskChart();
}

function togglePeerBand() {
  FRA_STATE.showPeerBand = !FRA_STATE.showPeerBand;
  const btn = document.getElementById('btn-toggle-peerband');
  btn.classList.toggle('active', FRA_STATE.showPeerBand);
  btn.innerHTML = `<i class="fa-solid fa-chart-line"></i> Peer Band: ${FRA_STATE.showPeerBand ? 'ON' : 'OFF'}`;
  renderCreditRiskChart();
}

function toggleEventAnnotations() {
  FRA_STATE.showAnnotations = !FRA_STATE.showAnnotations;
  const btn = document.getElementById('btn-toggle-annotations');
  btn.classList.toggle('active', FRA_STATE.showAnnotations);
  btn.innerHTML = `<i class="fa-solid fa-flag"></i> Event Flags: ${FRA_STATE.showAnnotations ? 'ON' : 'OFF'}`;
  renderCreditRiskChart();
  renderStockPriceChart();
}

// =============================================================================
// PEER CHECKBOXES
// =============================================================================

function initPeerCheckboxes() {
  const container = document.getElementById('peer-checkboxes-container');
  if (!container) return;

  const peers = PEER_GROUPS[FRA_STATE.selectedEntity] || [];
  container.innerHTML = `
    <span style="font-weight: 600; color: var(--text-muted); text-transform: uppercase; font-size: 0.72rem;">Peer Lines:</span>
    <label class="peer-checkbox-label">
      <input type="checkbox" id="chk-toggle-all-peers" onchange="toggleAllPeers(this.checked)">
      <span style="font-weight: 600;">Select All</span>
    </label>
  `;

  peers.forEach(peer => {
    const isChecked = FRA_STATE.peerVisibility[peer] !== false;
    const color = COLOR_PALETTE[peer] || '#94a3b8';
    const label = document.createElement('label');
    label.className = 'peer-checkbox-label';
    label.innerHTML = `
      <input type="checkbox" id="chk-peer-${peer.replace(/\s+/g, '')}" ${isChecked ? 'checked' : ''} onchange="toggleSinglePeer('${peer}', this.checked)">
      <span class="peer-dot" style="background-color: ${color}"></span>
      <span>${peer}</span>
    `;
    container.appendChild(label);
  });
}

function toggleAllPeers(checked) {
  const peers = PEER_GROUPS[FRA_STATE.selectedEntity] || [];
  peers.forEach(p => {
    FRA_STATE.peerVisibility[p] = checked;
    const el = document.getElementById(`chk-peer-${p.replace(/\s+/g, '')}`);
    if (el) el.checked = checked;
  });
  renderCreditRiskChart();
}

function toggleSinglePeer(peer, checked) {
  FRA_STATE.peerVisibility[peer] = checked;
  renderCreditRiskChart();
}

// =============================================================================
// UI UPDATES: CREDIT RISK PANEL
// =============================================================================

function updateCreditRiskUI() {
  const metric = METRIC_DEFS[FRA_STATE.selectedMetric];
  const entity = FRA_STATE.selectedEntity;
  const isICICI = entity === 'ICICI Bank';

  // Update Formula Banner
  document.getElementById('metric-desc-text').textContent = metric.desc;
  document.getElementById('metric-formula-code').textContent = `Formula: ${metric.formula}`;

  // Update Ribbon Statistics
  const entityRatios = FRA_DATA.computed[entity].ratios;
  const peerStats = FRA_DATA.peerStats[entity][FRA_STATE.selectedMetric];

  const currVal = entityRatios['FY2024'][FRA_STATE.selectedMetric];
  const vals = FRA_DATA.years.map(y => entityRatios[y][FRA_STATE.selectedMetric]);
  const peakVal = Math.max(...vals);
  const peakYear = FRA_DATA.years[vals.indexOf(peakVal)];
  const avgVal = vals.reduce((a, b) => a + b, 0) / vals.length;
  const peerCurrAvg = peerStats['FY2024']?.avg || 0;
  const startVal = entityRatios['FY2015'][FRA_STATE.selectedMetric];
  const netChange = currVal - startVal;

  document.getElementById('stat-curr-val').textContent = `${currVal}${metric.unit}`;
  document.getElementById('stat-curr-sub').textContent = currVal <= 2.5 ? "Industry-leading clean book" : "Post-restructuring stabilized";

  document.getElementById('stat-peak-val').textContent = `${peakVal}${metric.unit}`;
  document.getElementById('stat-peak-sub').textContent = `${peakYear} (Cycle Peak)`;

  document.getElementById('stat-avg-val').textContent = `${avgVal.toFixed(2)}${metric.unit}`;
  document.getElementById('stat-peer-val').textContent = `${peerCurrAvg.toFixed(2)}${metric.unit}`;
  document.getElementById('stat-peer-sub').textContent = isICICI ? "HDFC, Axis, Kotak avg" : "Federal, RBL, IDFC, Bandhan avg";

  const changeSign = netChange >= 0 ? "+" : "";
  document.getElementById('stat-change-val').textContent = `${changeSign}${netChange.toFixed(2)}${metric.unit}`;
  document.getElementById('stat-change-sub').textContent = "FY2024 vs FY2015 delta";

  // Update Chart Title
  document.getElementById('chart-main-title').textContent = `${entity} vs. Peers: ${metric.name}`;
  document.getElementById('chart-main-subtitle').textContent = `Solid ${isICICI ? 'cyan' : 'red'} line = ${isICICI ? 'ICICI Bank' : 'Yes Bank'}; dashed purple = peer-group average. Tick peers below to compare individual banks.`;

  // Update Insight Commentary Callout
  document.getElementById('insight-title').textContent = `${entity} — ${metric.shortName} Forensic Analysis`;
  document.getElementById('insight-content').textContent = isICICI ? metric.iciciCommentary : metric.yesCommentary;
}

// =============================================================================
// CHART 1: CREDIT RISK METRICS CHART (CHART.JS)
// =============================================================================

function renderCreditRiskChart() {
  const canvas = document.getElementById('creditRiskChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (creditRiskChartInstance) {
    creditRiskChartInstance.destroy();
  }

  const entity = FRA_STATE.selectedEntity;
  const metricKey = FRA_STATE.selectedMetric;
  const isICICI = entity === 'ICICI Bank';
  const entityColor = COLOR_PALETTE[entity];
  const years = FRA_DATA.years;

  // Entity Data Series
  const entityData = years.map(y => FRA_DATA.computed[entity].ratios[y][metricKey]);
  const peerStat = FRA_DATA.peerStats[entity][metricKey];

  const peerAvgData = years.map(y => peerStat[y]?.avg || null);
  const peerMinData = years.map(y => peerStat[y]?.min || null);
  const peerMaxData = years.map(y => peerStat[y]?.max || null);

  // Gradient under entity line
  const gradient = ctx.createLinearGradient(0, 0, 0, 380);
  if (isICICI) {
    gradient.addColorStop(0, 'rgba(0, 212, 255, 0.35)');
    gradient.addColorStop(1, 'rgba(0, 212, 255, 0.0)');
  } else {
    gradient.addColorStop(0, 'rgba(255, 71, 87, 0.35)');
    gradient.addColorStop(1, 'rgba(255, 71, 87, 0.0)');
  }

  const datasets = [];

  // Peer Dispersion Band (Max line and Min line filling to Max)
  datasets.push({
      label: 'Peer Group Average',
      data: peerAvgData,
      borderColor: '#c084fc',
      borderWidth: 2.5,
      borderDash: [6, 4],
      pointRadius: 3,
      pointBackgroundColor: '#c084fc',
      fill: false,
      showValues: true,
      valueBelow: true,
      tension: 0
    });
  if (FRA_STATE.showPeerBand) {
    datasets.push({
      label: 'Peer Dispersion Range (Max)',
      data: peerMaxData,
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      pointRadius: 0,
      fill: false,
      tension: 0
    });

    datasets.push({
      label: 'Peer Dispersion Range (Band)',
      data: peerMinData,
      borderColor: 'transparent',
      backgroundColor: 'rgba(168, 85, 247, 0.12)',
      pointRadius: 0,
      fill: '-1', // Fill to previous dataset (Peer Max)
      tension: 0
    });

  }

  // Individual Peer Lines (Toggled via checkboxes)
  const peers = PEER_GROUPS[entity] || [];
  peers.forEach(peer => {
    if (FRA_STATE.peerVisibility[peer]) {
      const pData = years.map(y => FRA_DATA.computed[peer]?.ratios[y]?.[metricKey] || null);
      datasets.push({
        label: peer,
        data: pData,
        borderColor: COLOR_PALETTE[peer] || '#94a3b8',
        borderWidth: 1.5,
        borderDash: [2, 2],
        pointRadius: 2,
        pointBackgroundColor: COLOR_PALETTE[peer] || '#94a3b8',
        fill: false,
        tension: 0
      });
    }
  });

  // Main Entity Line (Bold, glowing, gradient fill)
  datasets.push({
    label: entity,
    data: entityData,
    borderColor: entityColor,
    borderWidth: 3.5,
    backgroundColor: gradient,
    pointRadius: 5,
    pointHoverRadius: 8,
    pointBackgroundColor: entityColor,
    pointBorderColor: '#fff',
    pointBorderWidth: 1.5,
    fill: false,
    showValues: true,
    tension: 0
  });

  // Annotations Setup
  const annotations = {};
  if (FRA_STATE.showAnnotations) {
    // Key Historical Regulatory Inflections
    annotations.aqr = {
      type: 'line',
      scaleID: 'x',
      value: 'FY2016',
      borderColor: 'rgba(16, 185, 129, 0.65)',
      borderWidth: 1.5,
      borderDash: [4, 4],
      label: {
        display: true,
        content: 'RBI AQR',
        position: 'start',
        backgroundColor: 'rgba(16, 185, 129, 0.85)',
        color: '#fff',
        font: { size: 10, weight: 'bold', family: 'Inter' },
        padding: 4,
        borderRadius: 4
      }
    };

    annotations.feb12 = {
      type: 'line',
      scaleID: 'x',
      value: 'FY2018',
      borderColor: isICICI ? 'rgba(0, 212, 255, 0.65)' : 'rgba(245, 158, 11, 0.65)',
      borderWidth: 1.5,
      borderDash: [4, 4],
      label: {
        display: true,
        content: isICICI ? 'ICICI Peak Stress' : 'Feb 12 Circular',
        position: 'center',
        backgroundColor: isICICI ? 'rgba(0, 212, 255, 0.85)' : 'rgba(245, 158, 11, 0.85)',
        color: '#060811',
        font: { size: 10, weight: 'bold', family: 'Inter' },
        padding: 4,
        borderRadius: 4
      }
    };

    annotations.moratorium = {
      type: 'line',
      scaleID: 'x',
      value: 'FY2020',
      borderColor: 'rgba(255, 71, 87, 0.75)',
      borderWidth: 1.5,
      borderDash: [4, 4],
      label: {
        display: true,
        content: isICICI ? 'COVID-19' : 'Yes Moratorium',
        position: 'start',
        backgroundColor: 'rgba(255, 71, 87, 0.85)',
        color: '#fff',
        font: { size: 10, weight: 'bold', family: 'Inter' },
        padding: 4,
        borderRadius: 4
      }
    };

    // Highlight user-selected event if active
    if (FRA_STATE.activeHighlightedEvent) {
      const activeEv = EVENTS_TIMELINE.find(e => e.id === FRA_STATE.activeHighlightedEvent);
      if (activeEv && activeEv.fy) {
        annotations.activeHighlight = {
          type: 'line',
          scaleID: 'x',
          value: activeEv.fy,
          borderColor: '#ffffff',
          borderWidth: 3,
          label: {
            display: true,
            content: `Active: ${activeEv.title}`,
            position: 'end',
            backgroundColor: '#ffffff',
            color: '#000000',
            font: { size: 11, weight: 'bold', family: 'Outfit' },
            padding: 6,
            borderRadius: 6
          }
        };
      }
    }
  }

  creditRiskChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: years,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#94a3b8',
            font: { family: 'Inter', size: 11, weight: 500 },
            boxWidth: 14,
            usePointStyle: true,
            filter: (item) => !/Dispersion/.test(item.text)
          }
        },
        tooltip: {
          backgroundColor: 'rgba(10, 15, 30, 0.95)',
          titleFont: { family: 'Outfit', size: 13, weight: 'bold' },
          bodyFont: { family: 'Inter', size: 12 },
          borderColor: 'rgba(255, 255, 255, 0.15)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              const val = context.parsed.y;
              if (val === null || val === undefined) return null;
              let extra = '';
              if (context.dataset.label === 'Peer Group Average') {
                const yr = years[context.dataIndex];
                const n = (PEER_GROUPS[entity] || []).filter(p => FRA_DATA.computed[p]?.ratios[yr]?.[metricKey] != null).length;
                extra = ` (n = ${n} bank${n === 1 ? '' : 's'})`;
              }
              return `${context.dataset.label}: ${val.toFixed(2)}${METRIC_DEFS[metricKey].unit}${extra}`;
            }
          }
        },
        annotation: {
          annotations: annotations
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          ticks: {
            color: '#94a3b8',
            font: { family: 'Inter', size: 11 }
          }
        },
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.06)'
          },
          ticks: {
            color: '#94a3b8',
            font: { family: 'Inter', size: 11 },
            callback: function(val) {
              return val + METRIC_DEFS[metricKey].unit;
            }
          }
        }
      }
    }
  });
}

// =============================================================================
// CHART 2: NPA MOVEMENT (STACKED & WATERFALL MODES)
// =============================================================================

function selectNpaBank(bankName) {
  FRA_STATE.npaBank = bankName;

  document.getElementById('npa-btn-icici').classList.toggle('active', bankName === 'ICICI Bank');
  document.getElementById('npa-btn-icici').classList.toggle('icici-active', bankName === 'ICICI Bank');
  document.getElementById('npa-btn-yes').classList.toggle('active', bankName === 'Yes Bank');
  document.getElementById('npa-btn-yes').classList.toggle('yes-active', bankName === 'Yes Bank');

  if (FRA_STATE.npaViewMode === 'waterfall') {
    initWaterfallYearPills();
    updateWaterfallStatsRibbon();
  }
  renderNpaMovementChart();
}

function setNpaViewMode(mode) {
  FRA_STATE.npaViewMode = mode;
  document.getElementById('btn-npa-view-annual').classList.toggle('active', mode === 'annual');
  document.getElementById('btn-npa-view-waterfall').classList.toggle('active', mode === 'waterfall');

  const yearContainer = document.getElementById('waterfall-year-container');
  const statsGrid = document.getElementById('waterfall-stats-grid');

  if (mode === 'waterfall') {
    yearContainer.style.display = 'block';
    statsGrid.style.display = 'grid';
    initWaterfallYearPills();
    updateWaterfallStatsRibbon();
  } else {
    yearContainer.style.display = 'none';
    statsGrid.style.display = 'none';
  }

  renderNpaMovementChart();
}

function initWaterfallYearPills() {
  const container = document.getElementById('year-pills-list');
  if (!container) return;

  container.innerHTML = '';
  FRA_DATA.years.forEach(yr => {
    const isSelected = yr === FRA_STATE.npaSelectedYear;
    const isYes = FRA_STATE.npaBank === 'Yes Bank';
    const btn = document.createElement('button');
    btn.className = `year-pill ${isSelected ? 'active' : ''} ${isSelected && isYes ? 'yes-pill' : ''}`;
    btn.textContent = yr;
    btn.onclick = () => {
      FRA_STATE.npaSelectedYear = yr;
      initWaterfallYearPills();
      updateWaterfallStatsRibbon();
      renderNpaMovementChart();
    };
    container.appendChild(btn);
  });
}

function updateWaterfallStatsRibbon() {
  const bank = FRA_STATE.npaBank;
  const fy = FRA_STATE.npaSelectedYear;
  const mov = FRA_DATA.npaMovements[bank][fy];
  if (!mov) return;

  document.getElementById('wf-val-opening').textContent = `₹${mov.opening.toLocaleString()} Cr`;
  document.getElementById('wf-val-slippages').textContent = `+₹${mov.slippages.toLocaleString()} Cr`;
  document.getElementById('wf-val-recoveries').textContent = `-₹${mov.recoveries.toLocaleString()} Cr`;
  document.getElementById('wf-val-writeoffs').textContent = `-₹${mov.writeoffs.toLocaleString()} Cr`;
  document.getElementById('wf-val-closing').textContent = `₹${mov.closing.toLocaleString()} Cr`;
}

function renderNpaMovementChart() {
  const canvas = document.getElementById('npaMovementChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (npaMovementChartInstance) {
    npaMovementChartInstance.destroy();
  }

  const bank = FRA_STATE.npaBank;
  const isICICI = bank === 'ICICI Bank';

  if (FRA_STATE.npaViewMode === 'annual') {
    // 10-Year Annual Trend: Stacked Bars (Additions vs Reductions) + Closing Line
    document.getElementById('npa-chart-title').textContent = `${bank}: 10-Year NPA Flow (Additions vs. Reductions)`;
    document.getElementById('npa-chart-subtitle').textContent = "Fresh slippages (red) add to bad loans; recoveries (green) and write-offs (amber) reduce bad loans; line represents Closing Gross NPA.";

    const years = FRA_DATA.years;
    const slippagesData = years.map(y => FRA_DATA.npaMovements[bank][y].slippages);
    const recoveriesData = years.map(y => -FRA_DATA.npaMovements[bank][y].recoveries);
    const writeoffsData = years.map(y => -FRA_DATA.npaMovements[bank][y].writeoffs);
    const closingData = years.map(y => FRA_DATA.npaMovements[bank][y].closing);

    npaMovementChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: years,
        datasets: [
          {
            type: 'line',
            label: 'Closing Gross NPA (₹ Cr)',
            data: closingData,
            showValues: true,
            valueFormat: (v) => '₹' + (v / 1000).toFixed(1) + 'k',
            borderColor: isICICI ? '#00d4ff' : '#ff4757',
            borderWidth: 3,
            pointRadius: 4,
            pointBackgroundColor: isICICI ? '#00d4ff' : '#ff4757',
            fill: false,
            tension: 0,
            yAxisID: 'y'
          },
          {
            type: 'bar',
            label: '(+) Fresh Slippages',
            data: slippagesData,
            backgroundColor: 'rgba(239, 68, 68, 0.8)',
            borderColor: '#ef4444',
            borderWidth: 1,
            borderRadius: 4,
            stack: 'flow'
          },
          {
            type: 'bar',
            label: '(-) Upgrades & Recoveries',
            data: recoveriesData,
            backgroundColor: 'rgba(16, 185, 129, 0.8)',
            borderColor: '#10b981',
            borderWidth: 1,
            borderRadius: 4,
            stack: 'flow'
          },
          {
            type: 'bar',
            label: '(-) Write-Offs / ARC Transfer',
            data: writeoffsData,
            backgroundColor: 'rgba(245, 158, 11, 0.8)',
            borderColor: '#f59e0b',
            borderWidth: 1,
            borderRadius: 4,
            stack: 'flow'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } }
          },
          tooltip: {
            backgroundColor: 'rgba(10, 15, 30, 0.95)',
            titleFont: { family: 'Outfit', size: 13, weight: 'bold' },
            bodyFont: { family: 'Inter', size: 12 },
            borderColor: 'rgba(255, 255, 255, 0.15)',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: function(ctx) {
                const val = ctx.parsed.y;
                return `${ctx.dataset.label}: ₹${Math.abs(val).toLocaleString()} Cr`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.06)' },
            ticks: {
              color: '#94a3b8',
              font: { family: 'Inter', size: 11 },
              callback: val => `₹${Math.abs(val).toLocaleString()} Cr`
            }
          }
        }
      }
    });

  } else {
    // Single-Year Waterfall View: Floating Bar Chart
    const fy = FRA_STATE.npaSelectedYear;
    document.getElementById('npa-chart-title').textContent = `${bank}: Single-Year Forensic Waterfall (${fy})`;
    document.getElementById('npa-chart-subtitle').textContent = `Step-by-step balance sheet reconciliation for ${fy} in ₹ Crores.`;

    const mov = FRA_DATA.npaMovements[bank][fy];
    const top1 = mov.opening;
    const top2 = top1 + mov.slippages;
    const bot3 = top2 - mov.recoveries;
    const bot4 = mov.closing;

    const waterfallData = [
      [0, top1],
      [top1, top2],
      [bot3, top2],
      [bot4, bot3],
      [0, mov.closing]
    ];

    const waterfallColors = [
      'rgba(148, 163, 184, 0.85)', // Opening (Slate)
      'rgba(239, 68, 68, 0.85)',    // Slippages (Red)
      'rgba(16, 185, 129, 0.85)',   // Recoveries (Green)
      'rgba(245, 158, 11, 0.85)',   // Write-Offs (Amber)
      isICICI ? 'rgba(0, 212, 255, 0.85)' : 'rgba(255, 71, 87, 0.85)' // Closing
    ];

    npaMovementChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['1. Opening GNPA', '2. Slippages (+)', '3. Recoveries (-)', '4. Write-Offs (-)', '5. Closing GNPA'],
        datasets: [{
          label: 'NPA Level (₹ Cr)',
          data: waterfallData,
          showValues: true,
          valueColor: '#e2e8f0',
          valueFormat: (v, j) => (j === 1 ? '+' : (j === 2 || j === 3) ? '−' : '') + '₹' + Math.round(v).toLocaleString('en-IN') + ' Cr',
          backgroundColor: waterfallColors,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.15)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(10, 15, 30, 0.95)',
            titleFont: { family: 'Outfit', size: 13, weight: 'bold' },
            bodyFont: { family: 'Inter', size: 12 },
            borderColor: 'rgba(255, 255, 255, 0.15)',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: function(ctx) {
                const raw = ctx.raw;
                if (Array.isArray(raw)) {
                  const diff = Math.abs(raw[1] - raw[0]);
                  return `Flow Amount: ₹${diff.toLocaleString()} Cr (Level: ₹${raw[1].toLocaleString()} Cr)`;
                }
                return `Level: ₹${ctx.parsed.y.toLocaleString()} Cr`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.06)' },
            ticks: {
              color: '#94a3b8',
              font: { family: 'Inter', size: 11 },
              callback: val => `₹${val.toLocaleString()} Cr`
            }
          }
        }
      }
    });
  }
}

// =============================================================================
// CHART 3: COMPARATIVE SIDE-BY-SIDE CHART
// =============================================================================

function setComparativeMetric(metricKey) {
  FRA_STATE.comparativeMetric = metricKey;
  renderComparativeChart();
}

function renderComparativeChart() {
  const canvas = document.getElementById('comparativeChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (comparativeChartInstance) {
    comparativeChartInstance.destroy();
  }

  const metricKey = FRA_STATE.comparativeMetric;
  const metric = METRIC_DEFS[metricKey];
  const years = FRA_DATA.years;

  document.getElementById('comp-chart-title').textContent = `Direct Comparison: ${metric.name} Over 10 Financial Years`;
  document.getElementById('comp-chart-subtitle').textContent = `ICICI Bank (cyan line) vs. Yes Bank (red line). Metric unit: ${metric.unit}`;

  const iciciData = years.map(y => FRA_DATA.computed['ICICI Bank'].ratios[y][metricKey]);
  const yesData = years.map(y => FRA_DATA.computed['Yes Bank'].ratios[y][metricKey]);

  comparativeChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [
        {
          label: 'ICICI Bank (Large Private)',
          data: iciciData,
          borderColor: '#00d4ff',
          backgroundColor: 'rgba(0, 212, 255, 0.1)',
          borderWidth: 3.5,
          pointRadius: 5,
          pointBackgroundColor: '#00d4ff',
          pointHoverRadius: 8,
          fill: false,
          showValues: true,
          tension: 0
        },
        {
          label: 'Yes Bank (Mid-sized Private)',
          data: yesData,
          borderColor: '#ff4757',
          backgroundColor: 'rgba(255, 71, 87, 0.1)',
          borderWidth: 3.5,
          pointRadius: 5,
          pointBackgroundColor: '#ff4757',
          pointHoverRadius: 8,
          fill: false,
          showValues: true,
          valueBelow: true,
          tension: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 } }
        },
        tooltip: {
          backgroundColor: 'rgba(10, 15, 30, 0.95)',
          titleFont: { family: 'Outfit', size: 13, weight: 'bold' },
          bodyFont: { family: 'Inter', size: 12 },
          borderColor: 'rgba(255, 255, 255, 0.15)',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(2)}${metric.unit}`
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.06)' },
          ticks: {
            color: '#94a3b8',
            font: { family: 'Inter', size: 11 },
            callback: val => val + metric.unit
          }
        }
      }
    }
  });
}

// =============================================================================
// CHART 4: SHARE PRICE & EVENT RETURN ANALYSIS
// =============================================================================

function setStockMode(mode) {
  FRA_STATE.stockMode = mode;
  document.getElementById('btn-stock-norm').classList.toggle('active', mode === 'normalized');
  document.getElementById('btn-stock-abs').classList.toggle('active', mode === 'absolute');

  const title = mode === 'normalized'
    ? "10-Year Cumulative Equity Return (Base 100 = April 2014)"
    : "10-Year Monthly Closing Stock Prices (₹)";
  const subtitle = mode === 'normalized'
    ? "ICICI Bank (cyan), Yes Bank (red), and Nifty Bank benchmark (purple) indexed to 100 at start."
    : "Historical monthly closes in Indian Rupees (₹) adjusted for corporate actions.";

  document.getElementById('stock-chart-title').textContent = title;
  document.getElementById('stock-chart-subtitle').textContent = subtitle;

  renderStockPriceChart();
}

function toggleStockSeries(type) {
  if (type === 'nifty') {
    FRA_STATE.stockIncludeNifty = !FRA_STATE.stockIncludeNifty;
    const btn = document.getElementById('btn-stock-nifty');
    btn.classList.toggle('active', FRA_STATE.stockIncludeNifty);
    btn.innerHTML = `<i class="fa-solid fa-chart-line"></i> Nifty Bank: ${FRA_STATE.stockIncludeNifty ? 'ON' : 'OFF'}`;
  } else if (type === 'peers') {
    FRA_STATE.stockIncludePeers = !FRA_STATE.stockIncludePeers;
    const btn = document.getElementById('btn-stock-peers');
    btn.classList.toggle('active', FRA_STATE.stockIncludePeers);
    btn.innerHTML = `<i class="fa-solid fa-users"></i> Peer Lines: ${FRA_STATE.stockIncludePeers ? 'ON' : 'OFF'}`;
  }
  renderStockPriceChart();
}

function renderStockPriceChart() {
  const canvas = document.getElementById('stockPriceChart');
  if (!canvas || typeof STOCK_DATA === 'undefined') return;
  const ctx = canvas.getContext('2d');

  if (stockPriceChartInstance) {
    stockPriceChartInstance.destroy();
  }

  const isNorm = FRA_STATE.stockMode === 'normalized';
  const dates = STOCK_DATA.prices["ICICI Bank"].map(p => p.date);

  function getSeriesData(bankName) {
    const list = STOCK_DATA.prices[bankName] || [];
    if (list.length === 0) return [];
    const base = list[0]?.close || 1;
    return list.map(item => isNorm ? Math.round((item.close / base * 100) * 10) / 10 : item.close);
  }

  const datasets = [
    {
      label: 'ICICI Bank',
      data: getSeriesData('ICICI Bank'),
      borderColor: '#00d4ff',
      borderWidth: 3,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointBackgroundColor: '#00d4ff',
      fill: false,
      tension: 0
    },
    {
      label: 'Yes Bank',
      data: getSeriesData('Yes Bank'),
      borderColor: '#ff4757',
      borderWidth: 3,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointBackgroundColor: '#ff4757',
      fill: false,
      tension: 0
    }
  ];

  if (FRA_STATE.stockIncludeNifty) {
    datasets.push({
      label: 'Nifty Bank Benchmark',
      data: getSeriesData('Nifty Bank'),
      borderColor: '#a855f7',
      borderWidth: 2.2,
      borderDash: [4, 4],
      pointRadius: 0,
      pointHoverRadius: 5,
      pointBackgroundColor: '#a855f7',
      fill: false,
      tension: 0
    });
  }

  if (FRA_STATE.stockIncludePeers) {
    const samplePeers = ['HDFC Bank', 'Axis Bank', 'Federal Bank'];
    samplePeers.forEach(peer => {
      datasets.push({
        label: peer,
        data: getSeriesData(peer),
        borderColor: COLOR_PALETTE[peer] || '#64748b',
        borderWidth: 1.2,
        pointRadius: 0,
        fill: false,
        tension: 0
      });
    });
  }

  // Stock Chart Annotations
  const annotations = {};
  if (FRA_STATE.showAnnotations) {
    annotations.moratoriumLine = {
      type: 'line',
      scaleID: 'x',
      value: '2020-03-01',
      borderColor: 'rgba(255, 71, 87, 0.75)',
      borderWidth: 1.5,
      borderDash: [3, 3],
      label: {
        display: true,
        content: 'Yes Bank Moratorium (Mar 2020)',
        position: 'start',
        backgroundColor: 'rgba(255, 71, 87, 0.85)',
        color: '#fff',
        font: { size: 10, weight: 'bold' }
      }
    };

    annotations.bakhshiLine = {
      type: 'line',
      scaleID: 'x',
      value: '2018-10-01',
      borderColor: 'rgba(0, 212, 255, 0.75)',
      borderWidth: 1.5,
      borderDash: [3, 3],
      label: {
        display: true,
        content: 'Bakhshi Takes Helm at ICICI',
        position: 'end',
        backgroundColor: 'rgba(0, 212, 255, 0.85)',
        color: '#060811',
        font: { size: 10, weight: 'bold' }
      }
    };

    // If an event is clicked, add a highlight box
    if (FRA_STATE.activeHighlightedEvent && typeof EVENT_WINDOWS !== 'undefined') {
      const win = EVENT_WINDOWS[FRA_STATE.activeHighlightedEvent];
      if (win) {
        // Snap start and end to available month dates
        const snapStart = dates.find(d => d >= win.start) || dates[0];
        const snapEnd = [...dates].reverse().find(d => d <= win.end) || dates[dates.length - 1];

        annotations.activeWindow = {
          type: 'box',
          xMin: snapStart,
          xMax: snapEnd,
          backgroundColor: 'rgba(0, 212, 255, 0.18)',
          borderColor: '#00d4ff',
          borderWidth: 1.5,
          label: {
            display: true,
            content: `Event: ${win.label}`,
            position: 'center',
            backgroundColor: '#00d4ff',
            color: '#060811',
            font: { size: 11, weight: 'bold' }
          }
        };
      }
    }
  }

  stockPriceChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } }
        },
        tooltip: {
          backgroundColor: 'rgba(10, 15, 30, 0.95)',
          titleFont: { family: 'Outfit', size: 13, weight: 'bold' },
          bodyFont: { family: 'Inter', size: 12 },
          footerFont: { family: 'Inter', size: 11, style: 'italic' },
          borderColor: 'rgba(255, 255, 255, 0.15)',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: function(ctx) {
              const val = ctx.parsed.y;
              return isNorm
                ? `${ctx.dataset.label}: ${val} (Base 100)`
                : `${ctx.dataset.label}: ₹${val.toFixed(2)}`;
            },
            footer: function(tooltipItems) {
              if (!tooltipItems.length) return '';
              const idx = tooltipItems[0].dataIndex;
              const date = dates[idx];
              if (!date || typeof EVENT_WINDOWS === 'undefined') return '';
              const activeEvents = [];
              for (const [id, win] of Object.entries(EVENT_WINDOWS)) {
                if (date >= win.start && date <= win.end) {
                  activeEvents.push(win.label);
                }
              }
              return activeEvents.length > 0 ? `Context: ${activeEvents.join(' | ')}` : '';
            }
          }
        },
        annotation: {
          annotations: annotations
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          ticks: {
            color: '#94a3b8',
            font: { family: 'Inter', size: 10 },
            maxTicksLimit: 12,
            callback: function(val, idx) {
              return dates[idx] ? dates[idx].slice(0, 7) : '';
            }
          }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.06)' },
          ticks: {
            color: '#94a3b8',
            font: { family: 'Inter', size: 11 },
            callback: val => isNorm ? val : `₹${val}`
          }
        }
      }
    }
  });
}

// =============================================================================
// EVENT TIMELINE & INTERACTION
// =============================================================================

function filterTimeline(type) {
  FRA_STATE.timelineFilter = type;

  document.querySelectorAll('.timeline-pill').forEach(p => p.classList.remove('active'));
  const pill = document.getElementById(`tpill-${type}`);
  if (pill) pill.classList.add('active');

  renderTimelineCards();
}

function renderTimelineCards() {
  const container = document.getElementById('timeline-stream-container');
  if (!container || typeof EVENTS_TIMELINE === 'undefined') return;

  container.innerHTML = '';
  const filter = FRA_STATE.timelineFilter;

  const filteredEvents = EVENTS_TIMELINE.filter(ev => {
    if (filter === 'all') return true;
    if (filter === 'systematic') return ev.type === 'systematic';
    if (filter === 'icici') return ev.affected.includes('ICICI Bank');
    if (filter === 'yesbank') return ev.affected.includes('Yes Bank');
    return true;
  });

  filteredEvents.forEach(ev => {
    const isSystematic = ev.type === 'systematic';
    const isICICI = ev.affected.includes('ICICI Bank');
    const isYes = ev.affected.includes('Yes Bank');

    let typeClass = 'type-systematic';
    if (!isSystematic && isICICI) typeClass = 'type-idiosyncratic-icici';
    if (!isSystematic && isYes) typeClass = 'type-idiosyncratic-yes';

    const isSelected = FRA_STATE.activeHighlightedEvent === ev.id;

    const card = document.createElement('div');
    card.className = `timeline-card ${typeClass} ${isSelected ? 'active-selected' : ''}`;
    card.onclick = () => highlightEvent(ev.id);

    card.innerHTML = `
      <div>
        <div class="timeline-card-header">
          <span class="timeline-date-fy">${ev.date} (${ev.fy})</span>
          <div class="timeline-badges">
            <span class="t-badge ${isSystematic ? 'systematic' : 'idiosyncratic'}">
              ${isSystematic ? 'Systematic' : 'Idiosyncratic'}
            </span>
            <span class="t-badge sev-${ev.severity}">${ev.severity.toUpperCase()}</span>
          </div>
        </div>
        <h4 class="timeline-card-title">${ev.title}</h4>
        <p class="timeline-card-desc">${ev.description}</p>
        <div class="timeline-card-driver">
          <strong>Transmission Driver:</strong> ${ev.driver}
        </div>
      </div>
      <div class="timeline-card-action">
        <button class="btn-highlight-chart" onclick="event.stopPropagation(); highlightEvent('${ev.id}')">
          <i class="fa-solid fa-highlighter"></i> ${isSelected ? 'Highlighted' : 'Highlight on Charts'}
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

function highlightEvent(eventId) {
  FRA_STATE.activeHighlightedEvent = eventId;
  const ev = EVENTS_TIMELINE.find(e => e.id === eventId);
  if (!ev) return;

  // Show active event banner
  const banner = document.getElementById('active-event-banner');
  if (banner) {
    banner.classList.add('visible');
    document.getElementById('active-event-name').textContent = `Highlighted: ${ev.title}`;
    document.getElementById('active-event-summary').textContent = `Period: ${ev.date} (${ev.fy}) | Type: ${ev.type.toUpperCase()} | Driver: ${ev.driver}`;
  }

  renderTimelineCards();
  renderCreditRiskChart();
  renderStockPriceChart();

  // Scroll to chart if triggered from timeline
  if (FRA_STATE.currentMainTab === 'timeline') {
    switchMainTab(ev.affected.includes('Yes Bank') ? 'yesbank' : 'icici');
  }
}

function clearEventHighlight() {
  FRA_STATE.activeHighlightedEvent = null;
  const banner = document.getElementById('active-event-banner');
  if (banner) banner.classList.remove('visible');

  renderTimelineCards();
  renderCreditRiskChart();
  renderStockPriceChart();
}

// =============================================================================
// TABLE: EVENT WINDOW PERFORMANCE MATRIX
// =============================================================================

function renderEventPerformanceTable() {
  const tbody = document.getElementById('event-window-tbody');
  if (!tbody || FRA_DATA.eventWindowPerf.length === 0) return;

  tbody.innerHTML = '';

  FRA_DATA.eventWindowPerf.forEach(item => {
    const isIdio = item.id.includes('icici') || item.id.includes('yes');
    const tr = document.createElement('tr');

    const iciciPill = item.icici !== null
      ? `<span class="perf-pill ${item.icici >= 0 ? 'positive' : 'negative'}">${item.icici >= 0 ? '+' : ''}${item.icici}%</span>`
      : 'N/A';

    const yesPill = item.yes !== null
      ? `<span class="perf-pill ${item.yes >= 0 ? 'positive' : 'negative'}">${item.yes >= 0 ? '+' : ''}${item.yes}%</span>`
      : 'N/A';

    const excess = (v) => (v !== null && item.nifty !== null)
      ? `<div style="font-size:0.68rem;color:var(--text-muted);margin-top:3px;">vs Nifty: ${(v - item.nifty) >= 0 ? '+' : ''}${(v - item.nifty).toFixed(1)} pp</div>` : '';

    const niftyPill = item.nifty !== null
      ? `<span class="perf-pill ${item.nifty >= 0 ? 'positive' : 'negative'}">${item.nifty >= 0 ? '+' : ''}${item.nifty}%</span>`
      : 'N/A';

    tr.innerHTML = `
      <td><strong>${item.label}</strong></td>
      <td style="font-family: var(--font-mono); font-size: 0.78rem;">${item.start} to ${item.end}</td>
      <td>
        <span class="t-badge ${isIdio ? 'idiosyncratic' : 'systematic'}">
          ${isIdio ? 'Idiosyncratic' : 'Systematic'}
        </span>
      </td>
      <td>${iciciPill}${excess(item.icici)}</td>
      <td>${yesPill}${excess(item.yes)}</td>
      <td>${niftyPill}</td>
      <td style="font-size: 0.8rem; line-height: 1.4;">${item.takeaway}</td>
    `;

    tbody.appendChild(tr);
  });
}

// =============================================================================
// ANIMATED COUNTERS & MICRO-INTERACTIONS
// =============================================================================

function triggerHeroCounters() {
  animateCounter('kpi-icici-peak', 0, 8.84, 1200, 2, '%');
  animateCounter('kpi-icici-curr', 0, 2.51, 1400, 2, '%');
  animateCounter('kpi-yes-peak', 0, 16.80, 1200, 2, '%');
  animateCounter('kpi-yes-curr', 0, 1.81, 1400, 2, '%');
  animateCounter('kpi-creditcost-peak', 0, 16.74, 1300, 2, '%');
}

function animateCounter(id, start, end, duration, decimals = 2, suffix = '') {
  const el = document.getElementById(id);
  if (!el) return;

  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const currentVal = start + (end - start) * easeOut;

    el.textContent = currentVal.toFixed(decimals) + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = end.toFixed(decimals) + suffix;
    }
  }

  requestAnimationFrame(update);
}

function initUIEventListeners() {
  // Window resize handler to maintain Chart.js canvas responsiveness
  window.addEventListener('resize', () => {
    if (creditRiskChartInstance) creditRiskChartInstance.resize();
    if (npaMovementChartInstance) npaMovementChartInstance.resize();
    if (comparativeChartInstance) comparativeChartInstance.resize();
    if (stockPriceChartInstance) stockPriceChartInstance.resize();
  });
}


// =============================================================================
// STOCK STAT BOXES (computed from price data, not hard-coded)
// =============================================================================
function renderStockStatBoxes() {
  const S = FRA_DATA.stockStats || {};
  const I = S['ICICI Bank'], Y = S['Yes Bank'], N = S['Nifty Bank'];
  if (!I || !Y || !N) return;
  const f = (v, d = 2) => (v === null || v === undefined) ? 'n/a' : v.toFixed(d);
  const pct = (v) => (v >= 0 ? '+' : '') + v.toFixed(1) + '%';
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('ss-corr-icici', f(I.corr, 3)); set('ss-corr-yes', f(Y.corr, 3));
  set('ss-corr-note', `Share of monthly return variance explained by the market (R²): ICICI ${(I.r2 * 100).toFixed(0)}%, Yes Bank ${(Y.r2 * 100).toFixed(0)}%. FY15–19 → FY20–24: ICICI ${f(I.corrPre)} → ${f(I.corrPost)}, Yes ${f(Y.corrPre)} → ${f(Y.corrPost)}.`);
  set('ss-beta-icici', f(I.beta)); set('ss-beta-yes', f(Y.beta));
  set('ss-beta-note', `FY15–19 → FY20–24: ICICI ${f(I.betaPre)} → ${f(I.betaPost)}, Yes ${f(Y.betaPre)} → ${f(Y.betaPost)}. Similar beta but low correlation = large bank-specific volatility for Yes Bank.`);
  set('ss-ret-icici', pct(I.totalReturn)); set('ss-ret-yes', pct(Y.totalReturn));
  set('ss-ret-note', `Nifty Bank benchmark: ${pct(N.totalReturn)} over the same period (CAGR: ICICI ${I.cagr}%, Yes ${Y.cagr}%, Nifty Bank ${N.cagr}%).`);
  set('ss-dd-icici', I.maxDD.toFixed(1) + '%'); set('ss-dd-yes', Y.maxDD.toFixed(1) + '%');
}
document.addEventListener('DOMContentLoaded', () => setTimeout(renderStockStatBoxes, 0));
