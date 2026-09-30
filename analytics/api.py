import os
import sys
import json
from typing import Optional, Dict, Any
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from profiling import profile_dataset
from cleaning import clean_dataset
from analysis import compute_kpis_and_charts, execute_analysis_intent
from anomaly import detect_anomalies_iqr
from report import generate_pdf_report, generate_excel_report
from sample_generator import generate_sample_data

app = FastAPI(
    title="SnapInsight Analytics Microservice",
    description="Deterministic Data Profiling, Cleaning, Analytics, and IQR Anomaly Engine",
    version="1.0.0"
)

# Enable CORS for microservice
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FilePathRequest(BaseModel):
    file_path: Optional[str] = None
    target_column: Optional[str] = None
    intent_spec: Optional[Dict[str, Any]] = None
    fill_strategy: Optional[str] = "mean"

def resolve_dataframe(file_path: Optional[str]) -> pd.DataFrame:
    # Resolve relative or absolute file path
    resolved_path = file_path
    if not resolved_path or not os.path.exists(resolved_path):
        # Fallback to sample data
        root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        sample_path = os.path.join(root_dir, 'data', 'sample', 'sales_data.csv')
        if os.path.exists(sample_path):
            resolved_path = sample_path
        else:
            resolved_path = generate_sample_data(sample_path)

    ext = os.path.splitext(resolved_path)[1].lower()
    if ext == '.csv':
        return pd.read_csv(resolved_path)
    elif ext in ['.xlsx', '.xls']:
        return pd.read_excel(resolved_path)
    elif ext == '.pdf':
        try:
            import pypdf
            reader = pypdf.PdfReader(resolved_path)
            lines = []
            for p in reader.pages:
                lines.extend(p.extract_text().splitlines())
            return pd.DataFrame([{"Line_No": i+1, "Text": l.strip()} for i, l in enumerate(lines) if l.strip()])
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"PDF parsing error: {str(e)}")
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported format: {ext}")

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "snapinsight-analytics",
        "version": "1.0.0",
        "engine": "FastAPI + Pandas"
    }

@app.post("/profile")
def profile_endpoint(req: FilePathRequest):
    try:
        df = resolve_dataframe(req.file_path)
        profile = profile_dataset(df)
        return {"status": "success", "data": profile}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/clean")
def clean_endpoint(req: FilePathRequest):
    try:
        df = resolve_dataframe(req.file_path)
        cleaned_df, cleaning_log = clean_dataset(df, fill_numeric_strategy=req.fill_strategy or "mean")
        
        # Save working copy
        output_file = req.file_path.replace(".csv", "_cleaned.csv") if req.file_path else "data/sample/sales_data_cleaned.csv"
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        cleaned_df.to_csv(output_file, index=False)
        
        prof = profile_dataset(cleaned_df)
        return {
            "status": "success",
            "cleaned_file": output_file,
            "cleaning_log": cleaning_log,
            "profile": prof
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze")
def analyze_endpoint(req: FilePathRequest):
    try:
        df = resolve_dataframe(req.file_path)
        cleaned_df, _ = clean_dataset(df)
        summary = compute_kpis_and_charts(cleaned_df)
        
        intent_res = None
        if req.intent_spec:
            intent_res = execute_analysis_intent(cleaned_df, req.intent_spec)

        return {
            "status": "success",
            "summary": summary,
            "intent_result": intent_res
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/anomaly")
def anomaly_endpoint(req: FilePathRequest):
    try:
        df = resolve_dataframe(req.file_path)
        cleaned_df, _ = clean_dataset(df)
        anomalies = detect_anomalies_iqr(cleaned_df, target_column=req.target_column)
        return {"status": "success", "data": anomalies}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/report")
def report_endpoint(req: FilePathRequest):
    try:
        df = resolve_dataframe(req.file_path)
        cleaned_df, _ = clean_dataset(df)
        prof = profile_dataset(cleaned_df)
        summary = compute_kpis_and_charts(cleaned_df)
        anom = detect_anomalies_iqr(cleaned_df)

        dev_info = {
            "device": "Snapdragon-powered HP PC",
            "processor": "Qualcomm Snapdragon X Elite / Host CPU",
            "execution": "Snapdragon-Optimized / NPU-Ready"
        }

        root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        pdf_path = os.path.join(root_dir, 'data', 'reports', 'SnapInsight_Report.pdf')
        excel_path = os.path.join(root_dir, 'data', 'reports', 'SnapInsight_Report.xlsx')

        generate_pdf_report(cleaned_df, prof, summary, anom, dev_info, pdf_path)
        generate_excel_report(cleaned_df, prof, summary, anom, dev_info, excel_path)

        return {
            "status": "success",
            "pdf_path": pdf_path,
            "excel_path": excel_path
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/sample")
def sample_endpoint():
    try:
        root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        sample_path = os.path.join(root_dir, 'data', 'sample', 'sales_data.csv')
        path = generate_sample_data(sample_path)
        return {"status": "success", "file": path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("api:app", host="0.0.0.0", port=port, reload=True)
