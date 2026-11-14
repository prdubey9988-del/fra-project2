# Financial Risk Analytics (FRA) — Credit Risk Deep Dive
### *Systematic Macro Stress vs. Idiosyncratic Governance Breakdown: A 10-Year Forensic Comparative Study of ICICI Bank & Yes Bank (FY2015 – FY2024)*

---

## 📌 Executive Overview
This interactive web dashboard presents a 10-year forensic credit risk evaluation comparing two distinct private-sector banking trajectories in India:
1. **ICICI Bank Limited (Systemic Survivor):** A Domestic Systemically Important Bank (D-SIB) that navigated an aggressive corporate capex default cycle (GNPA peaking at **8.84%** in FY2018), front-loaded bad loan write-offs under new leadership ("kitchen sinking" in FY2019), and engineered a retail turnaround driving GNPA down to **2.16%** by FY2024 (+435% 10-year equity return).
2. **Yes Bank Limited (Idiosyncratic Failure & Reconstruction):** A mid-sized aggressive corporate lender that concealed credit impairment through regulatory divergences (FY2016–FY2018) until promoter exit and liquidity runs forced an unprecedented slippage shock (**19.05%** of advances in FY2020), prompting an RBI moratorium, public-private consortium bailout, and subsequent bad-loan carve-out to JC Flowers ARC.

---

## 🎯 Key Forensic Findings
| Dimension | ICICI Bank | Yes Bank | Systemic Context |
| :--- | :--- | :--- | :--- |
| **Peak GNPA Ratio** | **8.84% (₹54,063 Cr)** in FY18 | **16.80% (₹32,878 Cr)** in FY20 | RBI AQR & Feb 12 Circular ended CDR/SDR forbearance |
| **Peak Credit Cost** | **2.85%** in FY19 | **16.74%** in FY20 | Provisioning annihilated Yes Bank's FY20 net worth |
| **Max 1-Yr Slippages** | ₹33,544 Cr (FY17) | ₹37,272 Cr (FY20) | Yes Bank FY20 slippages were ~4.7× FY19 (₹7,970 Cr) |
| **Clean-up Mechanism** | Organic write-offs & NPA sales (₹14,094 Cr in FY19) | JC Flowers ARC sale (₹48,000 Cr portfolio, FY23) | Internal retail pivot vs. external bad-bank carve-out |
| **Nifty Bank Correlation**| **0.861** (β = 1.04) | **0.492** (β = 1.13) | Yes Bank decoupled from index due to idiosyncratic crisis |
| **10-Year Total Return** | **+435.0%** (18.3% CAGR) | **-71.9%** (-11.9% CAGR) | Nifty Bank benchmark return: +266.6% |

---

## 💻 Dashboard Architecture & Features
Built strictly with **vanilla HTML5, CSS3, and ES6+ JavaScript** (zero framework dependencies), designed to Bloomberg-terminal aesthetic standards:
- **Design System:** Deep obsidian dark mode (`#060811`), cyan/rose/emerald neon accents, multi-layer glassmorphism (`backdrop-filter: blur(16px)`), micro-animations, and responsive layouts.
- **Visualizations:** Powered by **Chart.js v4.4.2** with `chartjs-plugin-annotation`:
  - **Credit Risk Ratio Benchmarking:** Dynamic line charts featuring entity trajectories, peer dispersion bands (shaded max-min spread), dashed peer averages, and individual peer toggles.
  - **NPA Movement & Waterfall:** Dual-mode accounting reconciliation (`Opening + Slippages - Recoveries - Write-offs = Closing`) with 10-year stacked trend analysis and single-year forensic waterfall floating bars.
  - **Interactive Event Timeline:** 14 detailed historical events (Systematic vs. Idiosyncratic). Clicking any event immediately projects historical event windows across the charts.
  - **Equity Risk & Event Window Matrix:** Normalized Base-100 return charts with contextual tooltips, beta/correlation risk cards, and stress-window return breakdowns.
  - **Direct Comparative View:** Side-by-side metric overlay and comprehensive 10-dimension forensic scorecard matrix.
  - **Methodology & Data Disclosures:** Academic documentation covering RBI 90-day delinquency norms, AQR rules, data break handling (Yes Bank moratorium, HDFC merger, IDFC merger), and peer selection criteria.

---

## 📂 Project Structure
```
fra-project/
├── index.html                 # Main dashboard markup, semantic panels, and layouts
├── style.css                  # Custom styling, dark mode, glassmorphism, responsive grid
├── app.js                     # Core application logic, Chart.js managers, interactive controllers
├── data/
│   ├── credit_risk_data.js    # 10-year audited balance sheet and P&L metrics + computeRatios()
│   ├── stock_data.js          # Monthly closing prices and returns (2014-2024) for 9 banks + Nifty Bank
│   └── events_timeline.js     # Taxonomy of 14 systematic & idiosyncratic risk milestones
├── scripts/
│   └── fetch_stock_prices.py  # Python script utilized to fetch adjusted historical market prices
└── README.md                  # Project documentation & analytical synthesis
```

---

## 🚀 How to Run Locally
Because this project uses vanilla web standards, it requires no build tools or package installations:

### Option 1: Direct Browser Launch
Simply double-click `index.html` or open it with any modern web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local HTTP Server (Python)
```bash
# Navigate to the project directory
cd fra-project

# Launch a local Python server
python -m http.server 8080
```
Open `http://localhost:8080` in your browser.

---

## 📊 Peer Group Definitions
- **ICICI Bank Benchmark (Tier-1 Large Private Banks):**
  - HDFC Bank Limited
  - Axis Bank Limited
  - Kotak Mahindra Bank Limited
- **Yes Bank Benchmark (Mid-sized Private Banks):**
  - The Federal Bank Limited
  - RBL Bank Limited
  - IDFC First Bank Limited
  - Bandhan Bank Limited

---

## 🎓 Academic Citations & Regulatory References
1. Reserve Bank of India (RBI) — *Prudential Framework for Resolution of Stressed Assets* (June 7, 2019 Circular).
2. Reserve Bank of India (RBI) — *Asset Quality Review (AQR)* Inspection Guidelines (2015–2016).
3. Reserve Bank of India (RBI) — *Yes Bank Limited Reconstruction Scheme* (March 2020).
4. Basel Committee on Banking Supervision (BCBS) — *Pillar 3 Disclosure Requirements*.
5. Annual Reports & Audited Financial Statements (FY2015 to FY2024) for all 9 evaluated institutions.
