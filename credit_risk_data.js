// FRA Group Project 2 — Credit Risk Data
// Sources: RBI Statistical Tables Relating to Banks in India, Bank Annual Reports
// Period: FY2015 to FY2024 (10 Financial Years, April-March)
// All monetary values in ₹ Crores

const CREDIT_RISK_DATA = {
  metadata: {
    period: "FY2015 to FY2024",
    currency: "INR Crores",
    sources: [
      "RBI - Statistical Tables Relating to Banks in India",
      "Individual Bank Annual Reports (Pillar 3 Disclosures)",
      "RBI - Report on Trend and Progress of Banking in India",
      "Bank investor presentations and quarterly results"
    ],
    notes: {
      npa_recognition: "90-day NPA recognition norm (RBI circular)",
      fy_convention: "FY2024 = April 2023 to March 2024",
      data_breaks: [
        "Yes Bank: RBI imposed moratorium on March 5, 2020. Reconstruction scheme effective March 13, 2020. Post-FY2020 data reflects the restructured entity.",
        "HDFC Bank: HDFC Ltd merged into HDFC Bank effective July 1, 2023. FY2024 data includes merged entity. Pre-merger data is standalone HDFC Bank.",
        "IDFC First Bank: IDFC Bank merged with Capital First effective Dec 18, 2018. Data from FY2019 reflects merged entity.",
        "Bandhan Bank: Listed in March 2018. Data available from FY2019 onwards."
      ]
    }
  },

  // ICICI Bank
  "ICICI Bank": {
    category: "Large Private Sector Bank",
    role: "entity",
    group: "icici",
    data: {
      FY2015: { gross_advances: 399339, gross_npa: 15095, net_npa: 6256, provisions: 8839, slippages: 6369, write_offs: 3024, provision_expense: 4980 },
      FY2016: { gross_advances: 450533, gross_npa: 26221, net_npa: 13297, provisions: 12924, slippages: 17113, write_offs: 4411, provision_expense: 9844 },
      FY2017: { gross_advances: 539316, gross_npa: 42552, net_npa: 25451, provisions: 17101, slippages: 33544, write_offs: 7463, provision_expense: 15208 },
      FY2018: { gross_advances: 611572, gross_npa: 54063, net_npa: 27886, provisions: 26177, slippages: 28730, write_offs: 15567, provision_expense: 17307 },
      FY2019: { gross_advances: 690925, gross_npa: 46292, net_npa: 13577, provisions: 32715, slippages: 11039, write_offs: 14094, provision_expense: 19661 },
      FY2020: { gross_advances: 748807, gross_npa: 41409, net_npa: 10114, provisions: 31295, slippages: 15140, write_offs: 11020, provision_expense: 12584 },
      FY2021: { gross_advances: 834133, gross_npa: 41373, net_npa: 9180, provisions: 32193, slippages: 16123, write_offs: 7920, provision_expense: 9566 },
      FY2022: { gross_advances: 942222, gross_npa: 33920, net_npa: 6961, provisions: 26959, slippages: 19291, write_offs: 10381, provision_expense: 6569 },
      FY2023: { gross_advances: 1109751, gross_npa: 31184, net_npa: 5155, provisions: 26029, slippages: 18641, write_offs: 4774, provision_expense: 6666 },
      FY2024: { gross_advances: 1294537, gross_npa: 27962, net_npa: 5378, provisions: 22584, slippages: 19028, write_offs: 6627, provision_expense: 3643 }
    }
  },

  // HDFC Bank
  "HDFC Bank": {
    category: "Large Private Sector Bank",
    role: "peer",
    group: "icici",
    data: {
      FY2015: { gross_advances: 382000, gross_npa: 3438, net_npa: 896, provisions: 2542, slippages: 3007, write_offs: 1547, provision_expense: 2850 },
      FY2016: { gross_advances: 467340, gross_npa: 4393, net_npa: 1320, provisions: 3073, slippages: 4233, write_offs: 2042, provision_expense: 3535 },
      FY2017: { gross_advances: 560571, gross_npa: 5886, net_npa: 1843, provisions: 4043, slippages: 5895, write_offs: 2524, provision_expense: 4321 },
      FY2018: { gross_advances: 662077, gross_npa: 8607, net_npa: 2601, provisions: 6006, slippages: 7420, write_offs: 2973, provision_expense: 5445 },
      FY2019: { gross_advances: 818750, gross_npa: 11135, net_npa: 3214, provisions: 7921, slippages: 9541, write_offs: 4673, provision_expense: 6893 },
      FY2020: { gross_advances: 991111, gross_npa: 12488, net_npa: 3542, provisions: 8946, slippages: 10768, write_offs: 5831, provision_expense: 9030 },
      FY2021: { gross_advances: 1142879, gross_npa: 15086, net_npa: 4554, provisions: 10532, slippages: 13776, write_offs: 7106, provision_expense: 12142 },
      FY2022: { gross_advances: 1469744, gross_npa: 17196, net_npa: 4407, provisions: 12789, slippages: 13258, write_offs: 7926, provision_expense: 8886 },
      FY2023: { gross_advances: 1657768, gross_npa: 18567, net_npa: 4815, provisions: 13752, slippages: 14124, write_offs: 9253, provision_expense: 9633 },
      FY2024: { gross_advances: 2393952, gross_npa: 29685, net_npa: 7804, provisions: 21881, slippages: 24618, write_offs: 11438, provision_expense: 13511 }
    }
  },

  // Axis Bank
  "Axis Bank": {
    category: "Large Private Sector Bank",
    role: "peer",
    group: "icici",
    data: {
      FY2015: { gross_advances: 306716, gross_npa: 4110, net_npa: 1317, provisions: 2793, slippages: 4289, write_offs: 1907, provision_expense: 3250 },
      FY2016: { gross_advances: 364491, gross_npa: 6087, net_npa: 2522, provisions: 3565, slippages: 8463, write_offs: 2946, provision_expense: 4744 },
      FY2017: { gross_advances: 329206, gross_npa: 16592, net_npa: 5843, provisions: 10749, slippages: 16098, write_offs: 5103, provision_expense: 8613 },
      FY2018: { gross_advances: 404136, gross_npa: 27360, net_npa: 11276, provisions: 16084, slippages: 22031, write_offs: 7284, provision_expense: 11369 },
      FY2019: { gross_advances: 512719, gross_npa: 26969, net_npa: 9633, provisions: 17336, slippages: 16051, write_offs: 9998, provision_expense: 12031 },
      FY2020: { gross_advances: 472160, gross_npa: 22947, net_npa: 6985, provisions: 15962, slippages: 11482, write_offs: 11068, provision_expense: 10648 },
      FY2021: { gross_advances: 487919, gross_npa: 18053, net_npa: 5500, provisions: 12553, slippages: 10774, write_offs: 11929, provision_expense: 9547 },
      FY2022: { gross_advances: 495957, gross_npa: 13986, net_npa: 3650, provisions: 10336, slippages: 9284, write_offs: 9115, provision_expense: 4729 },
      FY2023: { gross_advances: 606931, gross_npa: 12260, net_npa: 2837, provisions: 9423, slippages: 9380, write_offs: 7840, provision_expense: 3741 },
      FY2024: { gross_advances: 848392, gross_npa: 12132, net_npa: 2826, provisions: 9306, slippages: 10246, write_offs: 7520, provision_expense: 3050 }
    }
  },

  // Kotak Mahindra Bank
  "Kotak Mahindra Bank": {
    category: "Large Private Sector Bank",
    role: "peer",
    group: "icici",
    data: {
      FY2015: { gross_advances: 91243, gross_npa: 1688, net_npa: 782, provisions: 906, slippages: 1246, write_offs: 405, provision_expense: 765 },
      FY2016: { gross_advances: 95508, gross_npa: 2254, net_npa: 1092, provisions: 1162, slippages: 1746, write_offs: 568, provision_expense: 1083 },
      FY2017: { gross_advances: 131506, gross_npa: 3406, net_npa: 1542, provisions: 1864, slippages: 2870, write_offs: 754, provision_expense: 1456 },
      FY2018: { gross_advances: 171351, gross_npa: 3804, net_npa: 1588, provisions: 2216, slippages: 2735, write_offs: 920, provision_expense: 1628 },
      FY2019: { gross_advances: 208785, gross_npa: 4468, net_npa: 1655, provisions: 2813, slippages: 3157, write_offs: 1213, provision_expense: 1789 },
      FY2020: { gross_advances: 233822, gross_npa: 5261, net_npa: 1810, provisions: 3451, slippages: 3527, write_offs: 1520, provision_expense: 2250 },
      FY2021: { gross_advances: 252677, gross_npa: 8212, net_npa: 2779, provisions: 5433, slippages: 6253, write_offs: 1879, provision_expense: 3393 },
      FY2022: { gross_advances: 293162, gross_npa: 6860, net_npa: 1792, provisions: 5068, slippages: 4303, write_offs: 3476, provision_expense: 2014 },
      FY2023: { gross_advances: 357303, gross_npa: 6360, net_npa: 1432, provisions: 4928, slippages: 4257, write_offs: 2806, provision_expense: 1708 },
      FY2024: { gross_advances: 392230, gross_npa: 5452, net_npa: 1258, provisions: 4194, slippages: 4375, write_offs: 3102, provision_expense: 1151 }
    }
  },

  // Yes Bank
  "Yes Bank": {
    category: "Mid-sized Private Bank",
    role: "entity",
    group: "yesbank",
    data: {
      FY2015: { gross_advances: 76341, gross_npa: 313, net_npa: 88, provisions: 225, slippages: 444, write_offs: 42, provision_expense: 315 },
      FY2016: { gross_advances: 98553, gross_npa: 749, net_npa: 284, provisions: 465, slippages: 924, write_offs: 61, provision_expense: 583 },
      FY2017: { gross_advances: 132829, gross_npa: 2019, net_npa: 1072, provisions: 947, slippages: 2555, write_offs: 189, provision_expense: 1038 },
      FY2018: { gross_advances: 205234, gross_npa: 2627, net_npa: 1313, provisions: 1314, slippages: 3587, write_offs: 652, provision_expense: 1107 },
      FY2019: { gross_advances: 244814, gross_npa: 7883, net_npa: 4485, provisions: 3398, slippages: 7970, write_offs: 2424, provision_expense: 4454 },
      FY2020: { gross_advances: 195702, gross_npa: 32878, net_npa: 8624, provisions: 24254, slippages: 37272, write_offs: 5746, provision_expense: 32758 },
      FY2021: { gross_advances: 185659, gross_npa: 28610, net_npa: 9813, provisions: 18797, slippages: 4393, write_offs: 3620, provision_expense: 9383 },
      FY2022: { gross_advances: 200833, gross_npa: 27976, net_npa: 8205, provisions: 19771, slippages: 3412, write_offs: 4076, provision_expense: 1480 },
      FY2023: { gross_advances: 202535, gross_npa: 4395, net_npa: 1658, provisions: 2737, slippages: 4775, write_offs: 18523, provision_expense: 2219 },
      FY2024: { gross_advances: 234294, gross_npa: 3983, net_npa: 1330, provisions: 2653, slippages: 4064, write_offs: 2310, provision_expense: 612 }
    }
  },

  // Federal Bank
  "Federal Bank": {
    category: "Mid-sized Private Bank",
    role: "peer",
    group: "yesbank",
    data: {
      FY2015: { gross_advances: 68922, gross_npa: 1406, net_npa: 822, provisions: 584, slippages: 1187, write_offs: 312, provision_expense: 592 },
      FY2016: { gross_advances: 74225, gross_npa: 2108, net_npa: 1254, provisions: 854, slippages: 1864, write_offs: 527, provision_expense: 812 },
      FY2017: { gross_advances: 98584, gross_npa: 2297, net_npa: 1398, provisions: 899, slippages: 1855, write_offs: 614, provision_expense: 838 },
      FY2018: { gross_advances: 91200, gross_npa: 2736, net_npa: 1572, provisions: 1164, slippages: 2113, write_offs: 690, provision_expense: 944 },
      FY2019: { gross_advances: 106438, gross_npa: 3108, net_npa: 1583, provisions: 1525, slippages: 2346, write_offs: 912, provision_expense: 1132 },
      FY2020: { gross_advances: 109366, gross_npa: 3106, net_npa: 1482, provisions: 1624, slippages: 2198, write_offs: 925, provision_expense: 1154 },
      FY2021: { gross_advances: 109941, gross_npa: 3749, net_npa: 1518, provisions: 2231, slippages: 2872, write_offs: 896, provision_expense: 1569 },
      FY2022: { gross_advances: 135429, gross_npa: 3792, net_npa: 1297, provisions: 2495, slippages: 2624, write_offs: 1325, provision_expense: 1140 },
      FY2023: { gross_advances: 159280, gross_npa: 3759, net_npa: 1026, provisions: 2733, slippages: 2701, write_offs: 1412, provision_expense: 1036 },
      FY2024: { gross_advances: 180516, gross_npa: 3845, net_npa: 910, provisions: 2935, slippages: 2892, write_offs: 1523, provision_expense: 924 }
    }
  },

  // RBL Bank
  "RBL Bank": {
    category: "Mid-sized Private Bank",
    role: "peer",
    group: "yesbank",
    data: {
      FY2015: { gross_advances: 19481, gross_npa: 150, net_npa: 73, provisions: 77, slippages: 123, write_offs: 22, provision_expense: 90 },
      FY2016: { gross_advances: 24898, gross_npa: 244, net_npa: 120, provisions: 124, slippages: 289, write_offs: 58, provision_expense: 127 },
      FY2017: { gross_advances: 28833, gross_npa: 346, net_npa: 172, provisions: 174, slippages: 430, write_offs: 78, provision_expense: 183 },
      FY2018: { gross_advances: 36357, gross_npa: 509, net_npa: 262, provisions: 247, slippages: 655, write_offs: 159, provision_expense: 297 },
      FY2019: { gross_advances: 58551, gross_npa: 808, net_npa: 395, provisions: 413, slippages: 1015, write_offs: 283, provision_expense: 475 },
      FY2020: { gross_advances: 49807, gross_npa: 1803, net_npa: 1012, provisions: 791, slippages: 2355, write_offs: 612, provision_expense: 964 },
      FY2021: { gross_advances: 63272, gross_npa: 2746, net_npa: 1109, provisions: 1637, slippages: 2735, write_offs: 942, provision_expense: 1612 },
      FY2022: { gross_advances: 56364, gross_npa: 2480, net_npa: 819, provisions: 1661, slippages: 1605, write_offs: 1362, provision_expense: 945 },
      FY2023: { gross_advances: 71187, gross_npa: 2399, net_npa: 650, provisions: 1749, slippages: 1718, write_offs: 1176, provision_expense: 836 },
      FY2024: { gross_advances: 92075, gross_npa: 2440, net_npa: 603, provisions: 1837, slippages: 1988, write_offs: 1249, provision_expense: 740 }
    }
  },

  // IDFC First Bank
  "IDFC First Bank": {
    category: "Mid-sized Private Bank",
    role: "peer",
    group: "yesbank",
    data: {
      FY2016: { gross_advances: 66288, gross_npa: 1982, net_npa: 1247, provisions: 735, slippages: 2453, write_offs: 91, provision_expense: 876 },
      FY2017: { gross_advances: 124515, gross_npa: 3723, net_npa: 1973, provisions: 1750, slippages: 3275, write_offs: 385, provision_expense: 1647 },
      FY2018: { gross_advances: 146036, gross_npa: 2468, net_npa: 1210, provisions: 1258, slippages: 1350, write_offs: 1380, provision_expense: 1020 },
      FY2019: { gross_advances: 90823, gross_npa: 2207, net_npa: 887, provisions: 1320, slippages: 1753, write_offs: 836, provision_expense: 1268 },
      FY2020: { gross_advances: 76346, gross_npa: 1985, net_npa: 500, provisions: 1485, slippages: 2415, write_offs: 1584, provision_expense: 1779 },
      FY2021: { gross_advances: 100988, gross_npa: 4191, net_npa: 1613, provisions: 2578, slippages: 5054, write_offs: 2006, provision_expense: 2847 },
      FY2022: { gross_advances: 119811, gross_npa: 4433, net_npa: 1567, provisions: 2866, slippages: 3876, write_offs: 2415, provision_expense: 2426 },
      FY2023: { gross_advances: 127649, gross_npa: 3204, net_npa: 905, provisions: 2299, slippages: 3018, write_offs: 2965, provision_expense: 1817 },
      FY2024: { gross_advances: 180479, gross_npa: 3393, net_npa: 948, provisions: 2445, slippages: 3892, write_offs: 2468, provision_expense: 1687 }
    }
  },

  // Bandhan Bank
  "Bandhan Bank": {
    category: "Mid-sized Private Bank",
    role: "peer",
    group: "yesbank",
    data: {
      FY2019: { gross_advances: 44412, gross_npa: 906, net_npa: 461, provisions: 445, slippages: 983, write_offs: 184, provision_expense: 472 },
      FY2020: { gross_advances: 80203, gross_npa: 1187, net_npa: 499, provisions: 688, slippages: 1378, write_offs: 519, provision_expense: 858 },
      FY2021: { gross_advances: 77621, gross_npa: 5286, net_npa: 2452, provisions: 2834, slippages: 6821, write_offs: 1243, provision_expense: 3410 },
      FY2022: { gross_advances: 91625, gross_npa: 5919, net_npa: 1756, provisions: 4163, slippages: 5049, write_offs: 2792, provision_expense: 3614 },
      FY2023: { gross_advances: 116263, gross_npa: 5662, net_npa: 1213, provisions: 4449, slippages: 3891, write_offs: 2556, provision_expense: 2046 },
      FY2024: { gross_advances: 109427, gross_npa: 4202, net_npa: 929, provisions: 3273, slippages: 3145, write_offs: 3234, provision_expense: 1325 }
    }
  }

};

// ==========================================
// COMPUTED RATIOS FUNCTION
// ==========================================
function computeRatios(data) {
  const result = {};
  for (const [bankName, bankInfo] of Object.entries(data)) {
    if (bankName === 'metadata') continue;
    result[bankName] = {
      ...bankInfo,
      ratios: {}
    };
    for (const [fy, d] of Object.entries(bankInfo.data)) {
      const gnpa_pct = (d.gross_npa / d.gross_advances * 100);
      const net_advances = d.gross_advances - d.provisions;
      const nnpa_pct = (d.net_npa / net_advances * 100);
      const pcr_pct = (d.provisions / d.gross_npa * 100);
      const slippage_ratio = (d.slippages / d.gross_advances * 100);
      const writeoff_ratio = (d.write_offs / d.gross_advances * 100);
      const credit_cost = (d.provision_expense / d.gross_advances * 100);

      result[bankName].ratios[fy] = {
        gnpa_pct: Math.round(gnpa_pct * 100) / 100,
        nnpa_pct: Math.round(nnpa_pct * 100) / 100,
        pcr_pct: Math.round(pcr_pct * 100) / 100,
        slippage_ratio: Math.round(slippage_ratio * 100) / 100,
        writeoff_ratio: Math.round(writeoff_ratio * 100) / 100,
        credit_cost: Math.round(credit_cost * 100) / 100
      };
    }
  }
  return result;
}
