import { useState, useEffect, useCallback } from "react";
import { WebContainer } from "@webcontainer/api";
import { TemplateFolder } from "@/features/playground/lib/path-to-json";

// =========================================================================
// GLOBAL STATE (Outside the hook)
// These variables survive component re-renders and React Strict Mode cycles
// =========================================================================
let webContainerInstance: WebContainer | null = null;
let bootPromise: Promise<WebContainer> | null = null;

interface UseWebContainerProps {
  templateData: TemplateFolder | null;
}

interface UseWebContainerReturn {
  serverUrl: string | null;
  isLoading: boolean;
  error: string | null;
  instance: WebContainer | null;
  writeFileSync: (path: string, content: string) => Promise<void>;
  destroy: () => void;
}

export const useWebContainer = ({ templateData }: UseWebContainerProps): UseWebContainerReturn => {
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [instance, setInstance] = useState<WebContainer | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initializeWebContainer() {
      try {
        // 1. If we already have a ready instance, use it immediately
        if (webContainerInstance) {
          if (mounted) {
            setInstance(webContainerInstance);
            setIsLoading(false);
          }
          return;
        }

        // 2. If boot is already starting (but not finished), wait for that same promise
        if (!bootPromise) {
          bootPromise = WebContainer.boot();
        }

        const bootedInstance = await bootPromise;

        // 3. Assign the result to the global variable
        webContainerInstance = bootedInstance;

        if (mounted) {
          setInstance(bootedInstance);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Failed to initialize WebContainer:", err);
        
        // If it failed, clear the promise so we can try again later if needed
        bootPromise = null;
        
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to initialize WebContainer");
          setIsLoading(false);
        }
      }
    }

    initializeWebContainer();

    // Cleanup: We intentionally DO NOT teardown the instance on unmount.
    // This prevents the "Strict Mode" crash and keeps the container alive for navigation.
    return () => {
      mounted = false;
    };
  }, []);

  const writeFileSync = useCallback(async (path: string, content: string): Promise<void> => {
    if (!instance) {
      throw new Error("WebContainer instance is not initialized");
    }

    try {
      const pathParts = path.split("/");
      const folderPath = pathParts.slice(0, -1).join("/");
      if (folderPath) {
        await instance.fs.mkdir(folderPath, { recursive: true });
      }
      await instance.fs.writeFile(path, content);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to write file";
      console.error(`Error writing file at ${path}:`, errorMessage);
      throw new Error(`Error writing file at ${path}: ${errorMessage}`);
    }
  }, [instance]);

  const destroy = useCallback(() => {
    if (webContainerInstance) {
      try {
        webContainerInstance.teardown();
      } catch (e) {
        console.warn("Teardown error", e);
      }
    }
    // Reset globals
    webContainerInstance = null;
    bootPromise = null;
    
    // Reset local state
    setInstance(null);
    setServerUrl(null);
  }, []);

  return {
    serverUrl,
    isLoading,
    error,
    instance,
    writeFileSync,
    destroy,
  };
};