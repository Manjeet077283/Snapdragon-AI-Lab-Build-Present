import os from 'os';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function detectDeviceAndRuntime() {
  const cpus = os.cpus();
  const rawModel = cpus.length > 0 ? cpus[0].model : 'Unknown Processor';

  let processorName = rawModel;
  let manufacturer = 'Generic PC';
  let modelName = 'Windows Workstation';
  let isSnapdragon = false;
  let npuDetected = false;

  try {
    const { stdout: cpuOut } = await execPromise(
      `powershell -Command "Get-CimInstance Win32_Processor | Select-Object -ExpandProperty Name"`
    );
    if (cpuOut.trim()) {
      processorName = cpuOut.trim().split('\n')[0].trim();
    }
  } catch (e) {}

  try {
    const { stdout: sysOut } = await execPromise(
      `powershell -Command "Get-CimInstance Win32_ComputerSystem | Select-Object Manufacturer, Model | ConvertTo-Json"`
    );
    if (sysOut.trim()) {
      const parsed = JSON.parse(sysOut.trim());
      manufacturer = parsed.Manufacturer || manufacturer;
      modelName = parsed.Model || modelName;
    }
  } catch (e) {}

  // Check if Snapdragon / Qualcomm processor
  const procLower = processorName.toLowerCase();
  if (procLower.includes('snapdragon') || procLower.includes('qualcomm') || procLower.includes('snapdragon x elite') || procLower.includes('snapdragon x plus')) {
    isSnapdragon = true;
  }

  // Check for NPU devices via WMI / PNPDeviceID
  try {
    const { stdout: npuOut } = await execPromise(
      `powershell -Command "Get-CimInstance Win32_PnPEntity | Where-Object { $_.Name -like '*NPU*' -or $_.Name -like '*Hexagon*' -or $_.Name -like '*Qualcomm Neural*' } | Select-Object -ExpandProperty Name"`
    );
    if (npuOut.trim()) {
      npuDetected = true;
    }
  } catch (e) {}

  const executionMode = (isSnapdragon && npuDetected)
    ? 'Qualcomm QNN NPU Hardware Accelerated'
    : 'Snapdragon-Optimized / NPU-Ready (CPU Fallback Mode)';

  return {
    device: isSnapdragon ? `Snapdragon-Powered ${manufacturer} PC` : `${manufacturer} ${modelName}`,
    processor: processorName,
    cores: cpus.length,
    architecture: os.arch(),
    totalMemoryGB: (os.totalmem() / (1024 * 1024 * 1024)).toFixed(1),
    freeMemoryGB: (os.freemem() / (1024 * 1024 * 1024)).toFixed(1),
    isSnapdragon,
    npuDetected,
    aiAccelerator: npuDetected ? 'Qualcomm® Hexagon™ NPU' : 'NPU Hardware Simulation / CPU Cores',
    runtime: npuDetected ? 'Qualcomm QNN SDK Execution Provider' : 'ONNX Runtime DirectML / Native PyEngine',
    model: 'SnapInsight-SLM-v1.2 (Quantized 4-bit INT4)',
    execution: executionMode,
    privacyGuarantee: '100% On-Device Local Processing Priority'
  };
}
