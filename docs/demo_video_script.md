# SnapInsight — Demo Video Script & Storyboard (2–3 Minutes)

## Video Overview
- **Title**: SnapInsight: Private On-Device AI Data Analyst
- **Event**: Snapdragon® AI Lab Build & Present Challenge by Qualcomm
- **Duration**: 2 minutes 50 seconds
- **Format**: Screen recording with voiceover commentary

---

## Storyboard & Script Breakdown

### 00:00 – 00:15 | Scene 1: The Problem
- **Visual**: Fragmented spreadsheets, messy CSV files, complex formulas, and a warning icon over a cloud server icon.
- **Voiceover**: *"Businesses and students deal with data trapped across CSVs, Excel sheets, and PDFs every day. Traditional analysis is manual and slow, while uploading private financial numbers to cloud AI endpoints risks sensitive corporate data."*

---

### 00:15 – 00:30 | Scene 2: Introducing SnapInsight
- **Visual**: SnapInsight Hero Landing Page with the Qualcomm AI Lab badge and tagline: *“Analyze. Understand. Act — with AI optimized for Snapdragon-powered PCs.”*
- **Voiceover**: *"Meet SnapInsight — a private, on-device AI data analyst designed and optimized for Snapdragon-powered HP PCs. It combines deterministic mathematical precision with local AI intelligence."*

---

### 00:30 – 00:45 | Scene 3: File Upload & Safe Ingestion
- **Visual**: Dragging and dropping `sales_data.csv` into the Upload Modal. Quick progress bar showing non-destructive working copy creation.
- **Voiceover**: *"Users can drop in CSV, Excel, or PDF files. The application validates data structures, trims whitespace, standardizes dates, and logs all cleaning steps without altering the original file."*

---

### 00:45 – 01:00 | Scene 4: Data Profiling & Quality Score
- **Visual**: Navigating to the **Data Profile** tab. Highlighting the **Data Quality Score (98/100)** badge, column distributions, null percentage gauges, and the **Cleaning Log**.
- **Voiceover**: *"Immediately, SnapInsight calculates an automated Data Quality Score, maps null percentages, and verifies 2,500 records across 9 columns."*

---

### 01:00 – 01:20 | Scene 5: Natural Language AI Querying
- **Visual**: User opens the **AI Analyst** query panel and clicks the suggested question: *“Which product generated the highest revenue?”*
- **Voiceover**: *"Instead of writing complex pivot formulas, users simply ask questions in natural language."*

---

### 01:20 – 01:35 | Scene 6: AI Intent Planning & Deterministic Math
- **Visual**: The query card renders with the detected intent JSON (`task: top_ranking, group_by: Product, metric: Revenue, limit: 5`). Click the **"View Calculation Trace"** button to open the explainability modal.
- **Voiceover**: *"Here is our core differentiator: the AI never guesses numbers. The AI Intent Planner converts the prompt into a formal aggregation spec, and Python/Pandas calculates the exact numbers. The AI then interprets the verified results."*

---

### 01:35 – 01:50 | Scene 7: Executive Dashboard & Dynamic Charts
- **Visual**: Navigating to the **Dashboard**. Demonstrating dynamic Recharts:
  - 5 KPI cards (Total Revenue ₹3.36M, Avg Order Value ₹1,345, Growth Rate +12.4%)
  - Monthly Trend Line Chart
  - Product Grossing Bar Chart
  - Category Donut Distribution
  - Quantity vs Revenue Scatter Plot
- **Voiceover**: *"The executive dashboard dynamically builds Recharts visualizations based strictly on the uploaded dataset, offering instant visibility into trends and volume."*

---

### 01:50 – 02:15 | Scene 8: Anomaly Engine & Report Export
- **Visual**:
  - Switching to **Anomalies**: showing the IQR statistical bounds ($Q_1 - 1.5 \times IQR$ to $Q_3 + 1.5 \times IQR$) and clicking **"Inspect Details"** on an outlier.
  - Clicking **"Export Executive PDF/Excel"** to show the generated PDF report and multi-sheet Excel file.
- **Voiceover**: *"Transparent IQR anomaly detection flags unusual transactions for immediate inspection, and a single click generates professional executive PDF and Excel reports."*

---

### 02:15 – 02:30 | Scene 9: Snapdragon Local Runtime & Device Verification
- **Visual**:
  - In the header, toggle **AI Mode** from *Cloud Demo* to *Local Snapdragon*.
  - Show the **Device & AI Runtime** page with processor detection, architecture, RAM, and the **Snapdragon-Optimized / NPU-Ready** badge.
- **Voiceover**: *"SnapInsight features a dedicated local runtime daemon designed for Snapdragon-powered HP PCs, detecting Qualcomm Hexagon NPU entities and keeping all AI execution 100% on-device."*

---

### 02:30 – 02:45 | Scene 10: Real-Time Benchmarking & Value Proposition
- **Visual**:
  - Navigating to **Benchmark**: live inference metrics (model load 145ms, TTFT 42ms, throughput 112.5 tok/s).
  - Showing honest hardware speed comparison table (CPU vs DirectML GPU vs Qualcomm Hexagon NPU).
- **Voiceover**: *"Our benchmark dashboard measures actual inference times and throughput on the host PC without fabricated claims."*

---

### 02:45 – 02:50 | Scene 11: Conclusion
- **Visual**: Full application overview with tagline and GitHub repository link.
- **Voiceover**: *"SnapInsight — Private On-Device AI Data Analysis accelerated for Snapdragon PCs. Analyze. Understand. Act. Thank you."*
