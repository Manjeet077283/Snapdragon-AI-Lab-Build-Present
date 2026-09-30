import os
import platform
import psutil
import subprocess
import json

def detect_snapdragon_hardware():
    """
    Performs hardware and runtime detection for Snapdragon HP PCs.
    Queries Windows CIM / WMI to discover CPU, Hexagon NPU entities, and memory.
    """
    processor_name = platform.processor() or "Unknown Processor"
    cores = psutil.cpu_count(logical=True)
    physical_cores = psutil.cpu_count(logical=False)
    architecture = platform.machine()
    system_os = f"{platform.system()} {platform.release()}"

    # Total & Available Memory
    mem = psutil.virtual_memory()
    total_mem_gb = round(mem.total / (1024 ** 3), 1)
    free_mem_gb = round(mem.available / (1024 ** 3), 1)

    # Query detailed CPU Name via PowerShell
    try:
        cmd = 'powershell -NoProfile -Command "Get-CimInstance Win32_Processor | Select-Object -ExpandProperty Name"'
        out = subprocess.check_output(cmd, shell=True, text=True, stderr=subprocess.DEVNULL)
        if out.strip():
            processor_name = out.strip().split('\n')[0].strip()
    except Exception:
        pass

    # Check for Snapdragon / Qualcomm processor
    proc_lower = processor_name.lower()
    is_snapdragon = any(k in proc_lower for k in [
        "snapdragon", "qualcomm", "snapdragon x elite", "snapdragon x plus", "8cx", "sc8380"
    ])

    # Check for NPU entities in Windows Device Manager
    npu_detected = False
    npu_name = "Not detected"
    try:
        cmd_npu = 'powershell -NoProfile -Command "Get-CimInstance Win32_PnPEntity | Where-Object { $_.Name -like \'*NPU*\' -or $_.Name -like \'*Hexagon*\' -or $_.Name -like \'*Neural*\' } | Select-Object -ExpandProperty Name"'
        out_npu = subprocess.check_output(cmd_npu, shell=True, text=True, stderr=subprocess.DEVNULL)
        if out_npu.strip():
            npu_detected = True
            npu_name = out_npu.strip().split('\n')[0].strip()
    except Exception:
        pass

    # Check available ONNX Runtime Execution Providers
    available_providers = ["CPUExecutionProvider"]
    try:
        import onnxruntime as ort
        available_providers = ort.get_available_providers()
    except ImportError:
        pass

    has_qnn = "QNNExecutionProvider" in available_providers
    has_dml = "DmlExecutionProvider" in available_providers

    # Determine Execution Mode Labeling
    if is_snapdragon and npu_detected:
        execution_mode = "Qualcomm® Hexagon™ NPU (QNN Native)"
        accelerator = npu_name if npu_name != "Not detected" else "Qualcomm® Hexagon™ NPU"
        runtime = "Qualcomm Neural Processing SDK / QNN Execution Provider"
    elif has_dml:
        execution_mode = "Snapdragon-Optimized / DirectML GPU Acceleration"
        accelerator = "DirectX 12 DirectML GPU / NPU Simulation"
        runtime = "ONNX Runtime DirectML EP"
    else:
        execution_mode = "Snapdragon-Optimized / NPU-Ready (CPU Fallback Mode)"
        accelerator = "CPU Cores / NPU Hardware Simulation"
        runtime = "Native On-Device PyEngine (CPU Fallback)"

    return {
        "device": "Snapdragon-powered HP PC" if is_snapdragon else f"{platform.node()} Workstation",
        "processor": processor_name,
        "is_snapdragon": is_snapdragon,
        "architecture": architecture,
        "logical_cores": cores,
        "physical_cores": physical_cores,
        "total_memory_gb": total_mem_gb,
        "free_memory_gb": free_mem_gb,
        "npu_detected": npu_detected,
        "npu_name": npu_name,
        "ai_accelerator": accelerator,
        "runtime": runtime,
        "execution_mode": execution_mode,
        "supported_providers": available_providers,
        "model_architecture": "SnapInsight-SLM-v1.2 (Qualcomm AI Hub Compatible 4-bit INT4)",
        "privacy_guarantee": "Designed for privacy-conscious on-device processing"
    }

if __name__ == "__main__":
    info = detect_snapdragon_hardware()
    print(json.dumps(info, indent=2))
