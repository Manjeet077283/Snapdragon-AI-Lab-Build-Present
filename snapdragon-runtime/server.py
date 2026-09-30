import os
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from detector import detect_snapdragon_hardware
from model_runner import LocalModelRunner
from benchmark import run_hardware_benchmark

app = FastAPI(
    title="SnapInsight Snapdragon On-Device AI Runtime Daemon",
    description="Local hardware-accelerated AI execution daemon for Snapdragon HP PCs",
    version="1.0.0"
)

# Enable CORS for local web interface
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

runner = LocalModelRunner()

class InferRequest(BaseModel):
    prompt: str
    schema_columns: Optional[List[str]] = None

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "snapdragon-local-runtime",
        "port": 5050,
        "npu_ready": True
    }

@app.get("/status")
def status():
    return {
        "status": "success",
        "hardware": detect_snapdragon_hardware()
    }

@app.post("/infer")
def infer(req: InferRequest):
    try:
        result = runner.infer(req.prompt, req.schema_columns)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/benchmark")
def benchmark():
    try:
        res = run_hardware_benchmark()
        return {"status": "success", "benchmark": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("SNAPDRAGON_PORT", 5050))
    print(f"Starting Snapdragon Local AI Daemon on http://127.0.0.1:{port}")
    uvicorn.run(app, host="127.0.0.1", port=port)
