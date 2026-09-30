# SnapInsight — System & Deployment Architecture

## 1. Overall Hybrid Architecture Diagram

```text
INTERNET
   │
   ▼
┌─────────────────────────┐
│     React Frontend      │  (Hosted on Netlify / Vercel)
│   (Vite + TS + Tailwind)│
└────────────┬────────────┘
             │ HTTPS
             ▼
┌─────────────────────────┐
│   Node / Express API    │  (Hosted on Render / Cloud)
│        Backend          │
└────────────┬────────────┘
             │
      ┌──────┴──────────────────────┐
      ▼                             ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│     Python / FastAPI    │   │  Optional Cloud AI      │
│      Pandas Service     │   │  (User Approved Only)   │
└─────────────────────────┘   └─────────────────────────┘

============================================================
              SNAPDRAGON LOCAL ON-DEVICE MODE
============================================================
   │
   ▼
┌─────────────────────────┐
│    Snapdragon HP PC     │  (e.g., HP OmniBook X 14)
└────────────┬────────────┘
             ▼
┌─────────────────────────┐
│   Local AI Runtime      │  (snapdragon-runtime/ port 5050)
│   (REST & WebSockets)   │
└────────────┬────────────┘
             ▼
┌─────────────────────────┐
│ Qualcomm AI Hub Model   │  (SnapInsight-SLM-v1.2 Quantized 4-bit)
└────────────┬────────────┘
             ▼
     CPU / GPU / NPU
             │
             ▼
   Hardware-Accelerated
       AI Inference
```

---

## 2. Two-Layer AI + Deterministic Math Pipeline

```text
User Question: "Which product generated the highest revenue?"
                      │
                      ▼
┌────────────────────────────────────────────────────────┐
│ Layer 1: AI Intent Planner                             │
│ Converts natural language into formal calculation spec │
│ {                                                      │
│   "intent": "top_ranking",                             │
│   "group_by": "Product",                               │
│   "metric": "Revenue",                                 │
│   "aggregation": "sum",                                │
│   "sort": "descending",                                │
│   "limit": 5                                           │
│ }                                                      │
└─────────────────────┬──────────────────────────────────┘
                      │
                      ▼
┌────────────────────────────────────────────────────────┐
│ Layer 2: Deterministic Analytics (Pandas & NumPy)      │
│ Performs exact mathematical aggregations               │
│ - AI Implementation Consulting: ₹8,28,591.29           │
│ - SnapInsight Pro Enterprise:   ₹4,51,907.20           │
│ - Data Pipeline Setup:          ₹4,50,334.36           │
│ Zero Numerical Hallucinations                          │
└─────────────────────┬──────────────────────────────────┘
                      │
                      ▼
┌────────────────────────────────────────────────────────┐
│ Layer 3: Grounded AI Interpretation                    │
│ Plain-language executive findings & recommendations    │
└─────────────────────┬──────────────────────────────────┘
                      │
                      ▼
┌────────────────────────────────────────────────────────┐
│ Layer 4: Explainability Trace Modal                    │
│ Full transparent breakdown of formula & source rows    │
└────────────────────────────────────────────────────────┘
```

---

## 3. Privacy & Data Lifecycle
- **Local-First Design**: Raw user files remain on the host machine.
- **Session Cleanup**: Working copies are stored temporarily in `data/uploads/` and automatically deleted after the analysis session.
- **Explicit Cloud Consent**: Data is never sent to external cloud LLM APIs unless the user explicitly toggles Cloud Fallback in Settings.
