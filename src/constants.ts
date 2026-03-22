export const MARS = { SOL_MINUTES: 1477, NIGHT_START: 0.78, NIGHT_END: 0.22, MAX_RISK: 100 };

export const DIFFICULTY_PRESETS: Record<string, { energyMult: number, riskMult: number, xpMult: number }> = {
  cadet: { energyMult: 0.9, riskMult: 0.9, xpMult: 1.0 },
  analyst: { energyMult: 1.0, riskMult: 1.0, xpMult: 1.05 },
  commander: { energyMult: 1.15, riskMult: 1.2, xpMult: 1.15 }
};

export const MISSION_MODIFIERS_POOL = [
  { id: 'dust_front', name: 'Dust Front', apply: { riskAdd: 2, cooldownAdd: 1 } },
  { id: 'solar_window', name: 'Solar Window', apply: { energyGainBonus: 2 } },
  { id: 'latency_spike', name: 'Latency Spike', apply: { riskAdd: 1, xpBonus: 2 } },
  { id: 'thermal_drift', name: 'Thermal Drift', apply: { energyDrainAdd: 1 } }
];

export const TERRAINS = [
  { id: 1, name: 'Basaltic Flats', complex: 4.2, success: 72, quadrant: 'A3-07' },
  { id: 2, name: 'Regolith Field', complex: 5.8, success: 61, quadrant: 'A3-12' },
  { id: 3, name: 'Basaltic Ridge', complex: 7.4, success: 42, quadrant: 'A3-19' },
  { id: 4, name: 'Scoria Outcrop', complex: 6.1, success: 55, quadrant: 'B1-03' },
  { id: 5, name: 'Sulfate Layer', complex: 8.9, success: 38, quadrant: 'B1-08' },
  { id: 6, name: 'Hematite Sphere', complex: 9.2, success: 32, quadrant: 'C2-11' },
];

export const CHALLENGES = [
  {
    id: 'fe2o3', category: 'Iron Mineralogy',
    q: "Spectral analysis shows Fe₂O₃ concentrations of 18.2%. What does this primarily indicate about the surface mineralogy?",
    options: [
      { t: 'A. Active volcanic degassing', correct: false },
      { t: 'B. Oxidized iron — ancient aqueous or atmospheric oxidation', correct: true },
      { t: 'C. Presence of subsurface ice deposits', correct: false },
      { t: 'D. Recent meteorite impact event', correct: false },
    ],
    exp: "Fe₂O₃ (haematite) forms when iron is oxidised by water or an oxygen-bearing atmosphere over geological time. Mars's red colour is largely due to this iron oxide. It's strong evidence of ancient aqueous processes."
  },
  {
    id: 'pressure', category: 'Atmospheric Dynamics',
    q: "REMS sensor shows an unexpected pressure spike of +0.8 kPa over 4 minutes. Most probable cause?",
    options: [
      { t: 'A. Sensor calibration error', correct: false },
      { t: 'B. Localised dust devil passing rover', correct: true },
      { t: 'C. Methane release from subsurface', correct: false },
      { t: 'D. Solar wind interaction', correct: false },
    ],
    exp: 'Dust devils on Mars create localised low-pressure vortices. As one passes a sensor, it causes a transient pressure drop followed by a spike as the vortex exits. The 4-minute duration is characteristic of a small dust devil (~50m diameter) at 4 m/s.'
  },
  {
    id: 'lamination', category: 'Sedimentary Analysis',
    q: "Rock samples show alternating light/dark layering at 2mm intervals. This lamination pattern most strongly suggests:",
    options: [
      { t: 'A. Impact shock metamorphism', correct: false },
      { t: 'B. Cyclic seasonal sediment deposition', correct: true },
      { t: 'C. Lava flow cooling fractures', correct: false },
      { t: 'D. Eolian cross-bedding', correct: false },
    ],
    exp: 'Regular lamination at millimetre scale is a hallmark of rhythmite — sediment deposited in regular cycles. On Mars this likely reflects seasonal variations in wind strength, frost deposition, or dust storm frequency.'
  },
  {
    id: 'felsic', category: 'Igneous Petrology',
    q: "ChemCam detects elevated SiO₂ (62%) with low FeO. In Mars geological context, this suggests:",
    options: [
      { t: 'A. Ultramafic mantle extrusion', correct: false },
      { t: 'B. Felsic igneous intrusion — rare on Mars', correct: true },
      { t: 'C. Evaporitic salt deposit', correct: false },
      { t: 'D. Carbonaceous chondrite inclusion', correct: false },
    ],
    exp: 'Mars is predominantly basaltic. Finding 62% SiO₂ suggests a felsic or intermediate intrusive body — a product of magmatic differentiation.'
  },
  {
    id: 'apxs_lockup', category: 'Instrument Protocols',
    q: "During APXS integration, the instrument generates artificial counts at the lowest energy channel (lockup anomaly). Required mitigation?",
    options: [
      { t: 'A. Increase integration time to 5 hours to override the buffer', correct: false },
      { t: 'B. Power cycle and split long integrations into two shorter sessions', correct: true },
      { t: 'C. Deploy arm to calibration slab to reset Curium-244 flux', correct: false },
    ],
    exp: 'The APXS lockup anomaly is a known firmware issue. The fix is to power cycle the instrument and avoid very long single integrations — split sessions.'
  },
  {
    id: 'energy_storm', category: 'Resource Strategy',
    q: "Energy is critically low and a storm approaches. Optimal strategy?",
    options: [
      { t: 'A. Sprint to nearest node before storm hits', correct: false },
      { t: 'B. Deploy science instruments immediately', correct: false },
      { t: 'C. Park facing optimal solar angle, power down non-essentials', correct: true },
      { t: 'D. Increase signal frequency to Earth', correct: false },
    ],
    exp: 'With low energy and an incoming storm, prioritise survival: park for best solar angle and power down non-essentials.'
  },
  {
    id: 'sulfate', category: 'Iron Mineralogy',
    q: "APXS detects high SO₃ (>15%) and CaO. This geochemical signature most likely indicates:",
    options: [
      { t: 'A. Hydrothermal vent deposit with sulfide minerals', correct: false },
      { t: 'B. Calcium sulfate (gypsum/anhydrite) evaporite layer', correct: true },
      { t: 'C. Volcanic tuff with calcium-rich plagioclase', correct: false },
      { t: 'D. Impact melt glass with sulfur contamination', correct: false },
    ],
    exp: 'High SO₃ combined with CaO is diagnostic of calcium sulfate minerals (gypsum/anhydrite) — often evaporites formed from brines.'
  },
  {
    id: 'hematite_spheres', category: 'Sedimentary Analysis',
    q: "Small spherical concretions (~5mm diameter) are observed throughout the rock matrix. Their most likely formation process?",
    options: [
      { t: 'A. Aerosol droplet solidification during volcanic eruption', correct: false },
      { t: 'B. Authigenic precipitation from iron-rich groundwater', correct: true },
      { t: 'C. Micro-meteorite impacts in soft sediment', correct: false },
      { t: 'D. Frost heave cycling over millions of years', correct: false },
    ],
    exp: 'These are haematite concretions ("blueberries") that form from iron-rich groundwater precipitating minerals around nucleation points.'
  }
];

export const MISSIONS = [
  { id: 1, name: 'First Contact', unlockTier: 1, constraint: 'Energy management basics', objective: 'Complete 3 APXS scans without energy depletion', maxRisk: 80 },
  { id: 2, name: 'Dust Season', unlockTier: 1, constraint: 'Dust accumulation + storm decisions', objective: 'Navigate a storm event — HALT scores bonus points', maxRisk: 75 },
  { id: 3, name: 'Night Operations', unlockTier: 1, constraint: 'Night cycle energy drain', objective: 'Complete 2 scans surviving the night cycle', maxRisk: 70 },
  { id: 4, name: 'Mineral Survey', unlockTier: 2, constraint: 'Multi-terrain APXS analysis', objective: 'Achieve 80%+ challenge accuracy across 4+ scans', maxRisk: 65 },
  { id: 5, name: 'Cascade Failure', unlockTier: 2, constraint: 'Risk budget + instrument reliability', objective: 'Complete mission with risk budget below 40/100', maxRisk: 100 },
  { id: 6, name: 'Extended Survey', unlockTier: 3, constraint: 'All constraints active simultaneously', objective: 'Achieve Survival Index above 70% across full run', maxRisk: 100 },
];

export const SKILL_BRANCHES = [
  {
    id: 'energy', icon: '⚡', name: 'Energy Systems', nodes: [
      { id: 'e1', name: 'Solar Basics', req: 'Complete M01' },
      { id: 'e2', name: 'Night Planning', req: 'Score >60% in night cycle' },
      { id: 'e3', name: 'Storm Response', req: 'HALT 3 storms' },
      { id: 'e4', name: 'Compound Degradation', req: 'Reach T3' },
    ]
  },
  {
    id: 'geology', icon: '🪨', name: 'Geological Analysis', nodes: [
      { id: 'g1', name: 'Rock Identification', req: 'Complete 5 scans' },
      { id: 'g2', name: 'Mineral Chemistry', req: '3 correct mineral analyses' },
      { id: 'g3', name: 'Stratigraphy', req: 'Answer lamination Q correctly' },
      { id: 'g4', name: 'Comparative Planetology', req: 'Complete M04' },
    ]
  },
  {
    id: 'risk', icon: '⚖️', name: 'Risk Architecture', nodes: [
      { id: 'r1', name: 'Hazard ID', req: 'First traction slip avoided' },
      { id: 'r2', name: 'Budget Management', req: 'Complete M05 <40 risk' },
      { id: 'r3', name: 'Cascade Prevention', req: 'Complete M05' },
      { id: 'r4', name: 'FMEA Fundamentals', req: 'Reach T4' },
    ]
  },
  {
    id: 'systems', icon: '🔧', name: 'Systems Engineering', nodes: [
      { id: 's1', name: 'Constraint Mapping', req: 'Complete 3 missions' },
      { id: 's2', name: 'Trade-off Analysis', req: '5 storm decisions made' },
      { id: 's3', name: 'Multi-var Optimisation', req: 'Complete M06' },
      { id: 's4', name: 'Failure Mode Response', req: 'Survive instrument anomaly' },
    ]
  },
];

export const TEACHER_STUDENTS = [
  { name: 'Arjun S.', tier: 2, si: 78, acc: 82, riskEvts: 2, status: 'ACTIVE' },
  { name: 'Meera R.', tier: 1, si: 54, acc: 61, riskEvts: 5, status: 'STORM_WAIT' },
  { name: 'Rohan P.', tier: 2, si: 71, acc: 74, riskEvts: 3, status: 'SCANNING' },
  { name: 'Priya K.', tier: 1, si: 48, acc: 55, riskEvts: 6, status: 'LOW_ENERGY' },
  { name: 'Dev T.', tier: 3, si: 89, acc: 91, riskEvts: 1, status: 'ACTIVE' },
  { name: 'Ananya M.', tier: 2, si: 66, acc: 70, riskEvts: 4, status: 'ACTIVE' },
  { name: 'Karan J.', tier: 1, si: 41, acc: 48, riskEvts: 7, status: 'DEPLETED' },
  { name: 'Sneha B.', tier: 2, si: 73, acc: 76, riskEvts: 2, status: 'ACTIVE' },
];

export const HEATMAP_CONCEPTS = ['Iron Mineralogy', 'Atmospheric Dynamics', 'Sedimentary Analysis', 'Igneous Petrology', 'Instrument Protocols', 'Resource Strategy'];
export const HEATMAP_DATA = [
  [10, 55, 25, 80, 60, 15], [45, 70, 35, 90, 50, 20], [20, 40, 15, 65, 45, 10], [75, 85, 60, 95, 70, 40],
  [5, 15, 10, 20, 10, 5], [30, 60, 40, 70, 55, 25], [80, 90, 75, 100, 80, 55], [15, 35, 20, 55, 30, 10],
];
export const BENCHMARK_DATA = [
  { name: 'Survival Index', class: 68, national: 61, district: 64 },
  { name: 'Decision Accuracy', class: 72, national: 58, district: 65 },
  { name: 'Risk Management', class: 64, national: 52, district: 57 },
  { name: 'Resource Efficiency', class: 70, national: 63, district: 67 },
  { name: 'Latency Adaptation', class: 55, national: 49, district: 51 },
];
