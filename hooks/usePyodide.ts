
import { useState, useEffect, useRef } from 'react';

// Pyodide is loaded from a script tag in index.html, so we declare it globally here.
declare global {
  interface Window {
    loadPyodide: (options: { indexURL: string }) => Promise<any>;
  }
}

interface RunPythonResult {
    stdout: string;
    stderr: string;
    success: boolean;
    durationMs: number;
}

export const usePyodide = () => {
  const [pyodideLoaded, setPyodideLoaded] = useState(false);
  const pyodide = useRef<any>(null);
  
  useEffect(() => {
    const load = async () => {
      try {
        console.log("Loading Pyodide...");
        const pyodideInstance = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/",
        });
        pyodide.current = pyodideInstance;
        setPyodideLoaded(true);
        console.log("Pyodide loaded successfully.");
      } catch (error) {
        console.error("Failed to load Pyodide:", error);
      }
    };
    load();
  }, []);

  const runPython = async (code: string): Promise<RunPythonResult> => {
    if (!pyodide.current) {
        return { stdout: "", stderr: "Pyodide not loaded yet.", success: false, durationMs: 0 };
    }

    const startTime = performance.now();
    let stdout = "";
    let stderr = "";
    let success = false;
    
    // Custom print function to capture output
    const capturedOutput: string[] = [];
    pyodide.current.globals.set("print", (...args: any[]) => {
      const line = args.map(arg => String(arg)).join(' ');
      capturedOutput.push(line);
    });

    try {
      // Execute the code
      const result = await pyodide.current.runPythonAsync(code);
      
      // Join printed lines
      stdout = capturedOutput.join('\n');
      
      // If the result of the last expression is not None/undefined, append it to the output.
      if (result !== undefined && result !== null) {
          // Add a newline if there was already output from print()
          if (stdout.length > 0) {
              stdout += '\n';
          }
          stdout += String(result);
      }
      
      // Clean up proxy if it exists
      if (result && typeof result.destroy === 'function') {
        result.destroy();
      }
      
      success = true;
    } catch (error: any) {
      stderr = error.message;
      // Even on error, we might have some output from print statements before the crash
      stdout = capturedOutput.join('\n');
    }
    const endTime = performance.now();

    return {
        stdout: stdout.trim(),
        stderr,
        success,
        durationMs: endTime - startTime
    };
  };

  return { pyodideLoaded, runPython };
};
