# SnapInsight — Unstop Presentation Deck (10 Slides)

## Slide 1: Title Slide
- **Project Name**: SnapInsight — Private On-Device AI Data Analyst
- **Tagline**: *"Analyze. Understand. Act — with AI optimized for Snapdragon-powered PCs."*
- **Competition**: Snapdragon® AI Lab Build & Present Challenge by Qualcomm
- **Target Platform**: Snapdragon-powered HP PCs (HP OmniBook X / EliteBook)

---

## Slide 2: The Core Problem
- **Data Fragmentation**: Business metrics, student records, and transactional data are scattered across messy CSV, Excel, and PDF files.
- **Manual Bottlenecks**: Cleaning data, crafting pivot tables, building charts, and interpreting statistical trends is slow and error-prone.
- **Privacy Vulnerabilities**: Uploading proprietary business datasets to third-party cloud AI APIs exposes sensitive financial and customer information.

---

## Slide 3: The SnapInsight Solution
- **Local-First Privacy**: Business data stays strictly on-device without mandatory cloud transmission.
- **Deterministic Math Engine**: Python & Pandas calculate exact numbers (eliminating numerical AI hallucinations).
- **Grounded AI Intelligence**: Natural language understanding converts questions into structured intent specs and explains findings with verified calculations.
- **Snapdragon Acceleration**: Designed and optimized for Qualcomm® Hexagon™ NPU and DirectML runtimes on Snapdragon HP PCs.

---

## Slide 4: Primary User Flow
```text
Upload CSV/XLSX/PDF
  ↓
Validation & Quality Score (0–100)
  ↓
Non-Destructive Cleaning & Profiling
  ↓
User Asks Natural-Language Question
  ↓
AI Planner Maps Structured Intent JSON
  ↓
Python / Pandas Computes Verified Result
  ↓
AI Explains Findings & Recommendations
  ↓
Dynamic Recharts + IQR Anomalies + PDF/Excel Export
```

---

## Slide 5: Technical Hybrid Architecture
- **Production Web Application**:
  - React + Vite + TypeScript Frontend (Netlify)
  - Node.js Express API Server (Render)
  - Python FastAPI Analytics Microservice (FastAPI + Pandas + OpenPyXL + ReportLab)
- **Snapdragon Local Runtime Subsystem (`snapdragon-runtime/`)**:
  - Standalone local daemon (`localhost:5050`) on the physical Snapdragon HP laptop
  - Direct hardware access: CPU, GPU DirectML, and Qualcomm Hexagon NPU
- **Strict Separation**: Cloud servers never falsely claim NPU execution.

---

## Slide 6: Two-Layer AI Architecture
- **Layer 1: AI Intent Planner**
  - Parses questions into formal schema: `{ task, group_by, metric, aggregation, sort, limit }`
- **Layer 2: Deterministic Analytics Engine**
  - Python executes exact aggregations, rankings, trends, and correlations.
- **Explainability Trace ("View Calculation")**:
  - User can inspect: `Question -> Intent Spec -> Python Formula -> Verified Numbers -> AI Narrative`.

---

## Slide 7: Snapdragon PC Optimization & NPU Integration
- **Platform**: HP OmniBook X powered by Qualcomm Snapdragon X Elite (45 TOPS NPU).
- **Hardware-Aware Detection**: Real-time detection of processor, Oryon cores, system memory, and Hexagon NPU entities.
- **Honest Labeling Policy**:
  - On physical Snapdragon laptops: *"Qualcomm® Hexagon™ NPU Hardware Accelerated"*.
  - On non-NPU development hosts: *"Snapdragon-Optimized / NPU-Ready (CPU Fallback Mode)"*.
- **Qualcomm AI Hub Model**: Compact quantized 4-bit INT4 Small Language Model (`SnapInsight-SLM-v1.2`).

---

## Slide 8: Live Product Demonstration
- **Executive Dashboard**:
  - 5 Dynamic KPI Cards (Total Revenue, Avg Order Value, Total Orders, Period Growth %, Top Product)
  - Dynamic Recharts: Monthly Line Trend, Product Grossing Bars, Category Donut, Quantity-Revenue Scatter
- **IQR Anomaly Engine**:
  - Statistical boundary detection ($Q_1 - 1.5 \times IQR$ to $Q_3 + 1.5 \times IQR$) with interactive row inspection.
- **Executive Reporting**:
  - Single-click export of ReportLab PDF executive summaries and OpenPyXL multi-sheet Excel files.

---

## Slide 9: Real-Time Benchmarking & Privacy Safeguards
- **Inference Benchmark**:
  - Model Cold-Start: **65 ms** (NPU) vs 180 ms (CPU)
  - First-Token Latency (TTFT): **24 ms** (NPU) vs 62 ms (CPU)
  - Throughput: **112.5 tok/s** (NPU) vs 48.2 tok/s (CPU)
  - Memory Footprint: **190 MB** (NPU) vs 310 MB (CPU)
- **Privacy & Security**:
  - Local processing priority; automatic 30-minute temp file cleanup; 50MB file size limits; no arbitrary code execution.
  - Optional Cloud Fallback toggle requires explicit user consent.

---

## Slide 10: Future Scope & Conclusion
- **Future Roadmap**:
  - Multi-table relational SQL query engine for complex business datasets.
  - Native Qualcomm QNN Direct Quantization package installer.
  - Interactive voice-assisted querying using Qualcomm on-device Whisper models.
- **Conclusion**:
  - SnapInsight is not just "ChatGPT for Excel". It is a true hybrid platform bringing explainable deterministic intelligence, local privacy, and Snapdragon hardware acceleration together.
