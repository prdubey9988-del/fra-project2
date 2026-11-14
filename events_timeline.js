// FRA Group Project 2 — Events Timeline
// Systematic vs Idiosyncratic events affecting ICICI Bank and Yes Bank

const EVENTS_TIMELINE = [
  // ==========================================
  // SYSTEMATIC EVENTS (Sector-wide)
  // ==========================================
  {
    id: "aqr",
    date: "2015-12-01",
    fy: "FY2016",
    title: "RBI Asset Quality Review (AQR)",
    type: "systematic",
    severity: "high",
    affected: ["all"],
    description: "RBI ordered banks to reclassify stressed assets as NPAs. Forced recognition of hidden bad loans across the banking system. PSU banks were hardest hit, but private banks like ICICI and Axis also saw sharp NPA increases.",
    driver: "Regulatory — RBI forced transparent recognition of asset quality deterioration that banks had been masking through restructuring."
  },
  {
    id: "demonetization",
    date: "2016-11-08",
    fy: "FY2017",
    title: "Demonetization",
    type: "systematic",
    severity: "medium",
    affected: ["all"],
    description: "Government invalidated ₹500 and ₹1000 notes (86% of currency in circulation). Short-term cash crunch affected borrowers' repayment ability, particularly MSME and informal sector loans.",
    driver: "Macro policy — Government decision caused temporary disruption to economic activity and cash-flow-dependent borrowers."
  },
  {
    id: "ibc",
    date: "2016-12-01",
    fy: "FY2017",
    title: "Insolvency & Bankruptcy Code (IBC) Enacted",
    type: "systematic",
    severity: "medium",
    affected: ["all"],
    description: "IBC created a time-bound resolution framework for stressed assets. Initially increased reported NPAs as banks referred cases to NCLT, but over time improved recovery rates.",
    driver: "Regulatory — New legal framework changed how banks resolve NPAs, front-loading recognition."
  },
  {
    id: "feb2018_circular",
    date: "2018-02-12",
    fy: "FY2018",
    title: "RBI Feb 12 Circular (Revised Framework)",
    type: "systematic",
    severity: "high",
    affected: ["all"],
    description: "RBI withdrew all existing restructuring schemes (CDR, SDR, S4A, etc.). Required banks to recognize stress within 1 day of default. This was later struck down by Supreme Court in April 2019, but had already forced NPA recognition.",
    driver: "Regulatory — Eliminated 'extend and pretend' restructuring, forcing immediate NPA recognition."
  },
  {
    id: "ilfs",
    date: "2018-09-01",
    fy: "FY2019",
    title: "IL&FS Crisis",
    type: "systematic",
    severity: "high",
    affected: ["all"],
    description: "IL&FS defaulted on debt obligations, triggering a liquidity crisis across the NBFC sector. Contagion spread to housing finance companies and shadow banks. Banks with exposure to NBFCs saw secondary stress.",
    driver: "Credit contagion — Large infrastructure lender default created systemic liquidity squeeze affecting all financial intermediaries."
  },
  {
    id: "covid",
    date: "2020-03-25",
    fy: "FY2020",
    title: "COVID-19 Lockdown & Moratorium",
    type: "systematic",
    severity: "high",
    affected: ["all"],
    description: "Nationwide lockdown halted economic activity. RBI announced loan moratorium (March-August 2020). True asset quality impact was deferred — NPAs spiked in FY2021 when moratorium ended.",
    driver: "Pandemic — Economic shutdown caused widespread borrower distress. RBI moratorium delayed but did not prevent NPA recognition."
  },
  {
    id: "covid_wave2",
    date: "2021-04-01",
    fy: "FY2022",
    title: "COVID Second Wave",
    type: "systematic",
    severity: "medium",
    affected: ["all"],
    description: "Second wave caused localized lockdowns. Impact was less severe than first wave as banks had already provisioned conservatively. Recovery began in H2 FY2022.",
    driver: "Pandemic — Second wave impact mitigated by existing provisions and economic adaptation."
  },

  // ==========================================
  // IDIOSYNCRATIC — ICICI BANK
  // ==========================================
  {
    id: "icici_corporate_npa",
    date: "2016-06-01",
    fy: "FY2017",
    title: "ICICI Bank: Corporate Loan NPA Crisis",
    type: "idiosyncratic",
    severity: "high",
    affected: ["ICICI Bank"],
    description: "ICICI Bank's aggressive corporate lending strategy (power, steel, infrastructure) led to a large NPA pile-up. Fresh slippages surged to ₹33,544 Cr in FY2017 (from ₹17,113 Cr in FY2016). GNPA ratio rose from 3.78% (FY2015) to 8.84% (FY2018).",
    driver: "Business strategy — Heavy concentration in infrastructure and corporate loans during the capex cycle downturn. Sectoral exposure to steel (Essar, Bhushan), power (Jaypee), and infrastructure proved toxic."
  },
  {
    id: "icici_chanda",
    date: "2018-03-01",
    fy: "FY2018",
    title: "ICICI Bank: Chanda Kochhar Governance Crisis",
    type: "idiosyncratic",
    severity: "medium",
    affected: ["ICICI Bank"],
    description: "Allegations of conflict of interest against CEO Chanda Kochhar regarding Videocon loan. Board initially defended her, later she resigned. Investigation confirmed quid-pro-quo. Added governance risk premium to stock.",
    driver: "Governance failure — CEO conflict of interest eroded investor confidence at a time when NPA problems were already severe."
  },
  {
    id: "icici_turnaround",
    date: "2019-01-01",
    fy: "FY2019",
    title: "ICICI Bank: Turnaround Under Sandeep Bakhshi",
    type: "idiosyncratic",
    severity: "positive",
    affected: ["ICICI Bank"],
    description: "New CEO Sandeep Bakhshi pivoted to retail lending, aggressively wrote off legacy corporate NPAs (₹14,094 Cr written off or sold in FY2019), and improved provision coverage. GNPA fell from 8.84% (FY2018) to 5.53% (FY2020). Stock began recovering.",
    driver: "Management change — Strategic shift from corporate to retail lending, aggressive provisioning and write-offs to clean the balance sheet."
  },

  // ==========================================
  // IDIOSYNCRATIC — YES BANK
  // ==========================================
  {
    id: "yes_rbi_divergence",
    date: "2017-04-01",
    fy: "FY2017",
    title: "Yes Bank: RBI Divergence Report",
    type: "idiosyncratic",
    severity: "high",
    affected: ["Yes Bank"],
    description: "RBI's risk-based supervision found large divergences between Yes Bank's reported NPAs and RBI's assessment: ₹4,176 Cr for FY2016 and ₹6,355 Cr for FY2017. This was the first red flag that the bank was hiding asset quality problems.",
    driver: "Governance — Management deliberately under-classified stressed loans to show artificially low NPA ratios, misleading investors and regulators."
  },
  {
    id: "yes_rana_exit",
    date: "2019-01-31",
    fy: "FY2019",
    title: "Yes Bank: RBI Forces Rana Kapoor Out",
    type: "idiosyncratic",
    severity: "high",
    affected: ["Yes Bank"],
    description: "RBI refused to extend Rana Kapoor's term as CEO beyond January 2019. This was a rare regulatory action against a founder-CEO of a private bank. Incoming CEO Ravneet Gill inherited a balance sheet far worse than disclosed. FY2019 slippages rose sharply.",
    driver: "Governance + Regulatory — RBI lost confidence in the founder-CEO. True asset quality was hidden under his leadership."
  },
  {
    id: "yes_collapse",
    date: "2020-03-05",
    fy: "FY2020",
    title: "Yes Bank: Moratorium & Reconstruction",
    type: "idiosyncratic",
    severity: "critical",
    affected: ["Yes Bank"],
    description: "RBI imposed moratorium on Yes Bank on March 5, 2020, capping withdrawals at ₹50,000. SBI-led consortium invested ₹10,000 Cr to rescue. GNPA rose to 16.8% (₹32,878 Cr). Stock crashed from ~₹30 to ~₹5. The bank's FY2020 slippages were ₹37,272 Cr — more than total advances of many mid-sized banks.",
    driver: "Terminal governance failure — Years of connected lending, NPA under-reporting, and capital erosion made the bank unviable. Required government-orchestrated rescue to prevent systemic contagion."
  },
  {
    id: "yes_recovery",
    date: "2022-04-01",
    fy: "FY2023",
    title: "Yes Bank: ARC Sale & Cleanup",
    type: "idiosyncratic",
    severity: "medium",
    affected: ["Yes Bank"],
    description: "Yes Bank sold a ₹48,000 Cr stressed-loan portfolio to JC Flowers ARC in FY2023 (completed Dec 2022), cutting GNPA from 13.93% to 2.17%. This was a one-time cleanup of the legacy book. The bank started showing signs of normalization, but from a fundamentally lower base.",
    driver: "Balance sheet cleanup — New management wrote off irrecoverable legacy NPAs to reset the bank's credit metrics."
  }
];

// Event window definitions for stock price analysis
const EVENT_WINDOWS = {
  "aqr": { start: "2015-09-01", end: "2016-06-30", label: "AQR Impact" },
  "demonetization": { start: "2016-11-01", end: "2017-03-31", label: "Demonetization" },
  "ilfs": { start: "2018-08-01", end: "2019-03-31", label: "IL&FS Crisis" },
  "icici_corporate_npa": { start: "2016-04-01", end: "2018-09-30", label: "ICICI NPA Crisis" },
  "icici_chanda": { start: "2018-01-01", end: "2018-12-31", label: "Chanda Kochhar" },
  "yes_rbi_divergence": { start: "2017-04-01", end: "2017-12-31", label: "Yes Bank Divergence" },
  "yes_rana_exit": { start: "2018-09-01", end: "2019-06-30", label: "Rana Kapoor Exit" },
  "yes_collapse": { start: "2020-01-01", end: "2020-06-30", label: "Yes Bank Collapse" },
  "covid": { start: "2020-03-01", end: "2020-09-30", label: "COVID-19" }
};
