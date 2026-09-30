import { spawn } from 'child_process';
import path from 'path';
import fileUrl from 'url';

const __filename = fileUrl.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../../');
const MAIN_PY = path.join(ROOT_DIR, 'analytics', 'main.py');

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://127.0.0.1:8000';

/**
 * Executes an analytics action, trying the FastAPI microservice first,
 * with automatic fallback to local python child process execution.
 */
export async function runPythonAction(action, args = {}) {
  // Attempt to call FastAPI microservice if configured
  if (PYTHON_API_URL) {
    try {
      const endpoint = `${PYTHON_API_URL}/${action}`;
      const payload = {
        file_path: args.file,
        target_column: args.targetColumn,
        intent_spec: typeof args.intent === 'string' ? JSON.parse(args.intent) : args.intent,
        fill_strategy: args.fillStrategy || 'mean'
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000) // 10s timeout
      });

      if (response.ok) {
        const json = await response.json();
        return json;
      }
    } catch (err) {
      // FastAPI unreachable or timed out; fall back to local subprocess
      console.warn(`[PythonBridge] FastAPI endpoint unavailable (${err.message}). Falling back to local CLI...`);
    }
  }

  // Fallback: Local python child process execution
  return runLocalCli(action, args);
}

function runLocalCli(action, args) {
  return new Promise((resolve, reject) => {
    const pyArgs = [MAIN_PY, '--action', action];

    if (args.file) pyArgs.push('--file', args.file);
    if (args.output) pyArgs.push('--output', args.output);
    if (args.intent) pyArgs.push('--intent', typeof args.intent === 'object' ? JSON.stringify(args.intent) : args.intent);
    if (args.targetColumn) pyArgs.push('--target-column', args.targetColumn);

    const pyProcess = spawn('python', pyArgs, { cwd: ROOT_DIR });

    let stdout = '';
    let stderr = '';

    pyProcess.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    pyProcess.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    pyProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python script exited with code ${code}: ${stderr}`);
        return reject(new Error(`Python process failed (code ${code}): ${stderr || stdout}`));
      }

      try {
        const lines = stdout.trim().split('\n');
        const jsonLine = lines.find((l) => l.trim().startsWith('{') && l.trim().endsWith('}')) || lines[lines.length - 1];
        const data = JSON.parse(jsonLine);
        resolve(data);
      } catch (err) {
        console.error('Failed to parse Python JSON output:', stdout);
        reject(new Error(`Invalid JSON output from Python script: ${err.message}`));
      }
    });

    pyProcess.on('error', (err) => {
      reject(new Error(`Failed to launch Python child process: ${err.message}`));
    });
  });
}
