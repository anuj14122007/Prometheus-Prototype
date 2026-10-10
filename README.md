# PROMETHEUS — Autonomous Scientific Discovery Engine

> **"From scientific questions to computational evidence."**

PROMETHEUS is a clean, interactive scientific research-agent web application designed for non-technical hackathon judges to understand in 90 seconds.

---

## 🚀 Deploy to Vercel & GitHub Guide

This project is pre-configured for **zero-config deployment on Vercel** and seamless version control on **GitHub**.

### Option 1: Deploy via GitHub + Vercel Dashboard (Recommended)

#### Step 1: Push to GitHub
If you haven't pushed your repository to GitHub yet:
```bash
git init
git add .
git commit -m "Initial commit: PROMETHEUS Autonomous Scientific Discovery Engine"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY_NAME>.git
git push -u origin main
```

#### Step 2: Import into Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **"Add New..."** → **"Project"**.
3. Select your GitHub repository.
4. Vercel automatically detects the framework preset (**Vite**), build command (`npm run build`), and output directory (`dist`) via the included `vercel.json`.
5. **No environment variables are needed** to run the core prototype. Click **"Deploy"**.
6. Your live site will be ready in under 30 seconds!

---

### Option 2: Deploy via Vercel CLI

You can also deploy directly from your terminal:
```bash
# Deploy to preview
npx vercel

# Deploy to production
npx vercel --prod
```

---

## 🧭 Core Principle
```
ONE SCREEN. ONE MAIN TASK. ONE PRIMARY ACTION. ONE RESULT AT A TIME.
```

Instead of overwhelming judges with dozens of competing panels and walls of text, PROMETHEUS presents an uncluttered, step-by-step scientific workspace:

1. **Step 1: Choose**: Select a molecular candidate (`EC`, `FEC`, `DFEC`, `VC`, `DMC`, `PC`) with real-time 3D ball-and-stick conformer visualization.
2. **Step 2: Test**: Formulate a concise testable hypothesis and execute the computational calculation (`RUN EXPERIMENT`).
3. **Step 3: See the Result**: View the measured property (`Topological Polar Surface Area`) in large, readable text, with a target threshold check (`≥ 38.0 Å²`) and explicit physical limitations.
4. **Step 4: Decide What Comes Next**: Inspect how the autonomous agent uses the recorded evidence to select the subsequent experiment along a structural gradient.
5. **Step 5: Summary**: Review key findings across tested scaffolds and restart the discovery loop.

---

## ⚡ The 90-Second Hackathon Judge Demo

1. Click **"Guided Demo"** in the top navigation bar.
2. Watch PROMETHEUS autonomously cycle through candidate screening:
   - Evaluates baseline cyclic carbonate **EC** ($38.77\text{ \AA}^2$, target met).
   - Formulates fluorination hypothesis on **FEC** ($38.77\text{ \AA}^2$, high polar area preserved with added oxidation stability).
   - Tests linear acyclic comparator **DMC** ($35.53\text{ \AA}^2$, below threshold), empirically proving that ring confinement is essential.
   - Concludes with a concise evidence synthesis and clear stopping boundary.

---

## 🔬 Computational Methodology & Honest Boundaries

- **Real Computation**: Deterministic in-browser cheminformatics calculations:
  - Topological Polar Surface Area (Ertl-Rohde fragment rules).
  - Exact IUPAC molecular weights (C: 12.011, H: 1.008, O: 15.999, F: 18.9984).
  - Wiener topological graph index ($W$) via Floyd-Warshall all-pairs shortest paths.
  - Multi-parameter equivalence hashing preventing redundant computation.
- **Secondary Details**: Technical parameters and complete research ledgers are accessible via discreet slide-over drawers (**"View Experiment Details"** and **"Research Memory"**), preserving scientific depth without cluttering the primary workflow.

---

## 🛠 Local Development

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Run scientific verification test suite
npm test

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```
