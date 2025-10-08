"use client"

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from 'next/navigation';
import { listen, UnlistenFn } from "@tauri-apps/api/event"; // Import listen and UnlistenFn
import { invoke } from "@tauri-apps/api/core";

// ProgressUpdate interface (must match Go backend struct)
interface ProgressUpdate {
  percentage: number;
  current_pass: number;
  total_passes: number;
  status: string;
  error?: string;
}

export default function WipeProgressPage() {
  const [wipeProgress, setWipeProgress] = useState(0);
  const [wipeStatus, setWipeStatus] = useState("Initializing wipe...");
  const [wipeLogs, setWipeLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isWipeComplete, setIsWipeComplete] = useState(false);
  const [showLogs, setShowLogs] = useState(true);
  const router = useRouter();
  const logsEndRef = useRef<HTMLTextAreaElement>(null); // Ref for auto-scrolling logs

  useEffect(() => {
    let unlistenProgress: UnlistenFn | undefined;
    let unlistenComplete: UnlistenFn | undefined;
    let unlistenError: UnlistenFn | undefined;
    let unlistenLogMessage: UnlistenFn | undefined;
    let unlistenLogError: UnlistenFn | undefined;

    const setupListeners = async () => {
      unlistenProgress = await listen<ProgressUpdate>("wipe-progress-update", (event) => {
        const { percentage, status, current_pass, total_passes, error: updateError } = event.payload;
        setWipeProgress(Math.round(percentage));
        setWipeStatus(status);
        setWipeLogs(prev => [...prev, `[PASS ${current_pass}/${total_passes}] ${status}`]);
        if (updateError) {
          setError(updateError);
        }
      });

      unlistenLogMessage = await listen<string>("wipe-log-message", (event) => {
        setWipeLogs(prev => [...prev, `[LOG] ${event.payload}`]);
      });

      unlistenLogError = await listen<string>("wipe-log-error", (event) => {
        setWipeLogs(prev => [...prev, `[ERROR] ${event.payload}`]);
        setError(event.payload); // Set main error if a log error comes through
      });

      unlistenComplete = await listen<string>("wipe-complete", (event) => {
        setWipeProgress(100);
        setWipeStatus(event.payload);
        setWipeLogs(prev => [...prev, `[INFO] ${event.payload}`]);
        setIsWipeComplete(true);
        // Redirect to wipe-complete page after a short delay
        setTimeout(() => router.push('/wipe-complete'), 2000);
      });

      unlistenError = await listen<string>("wipe-error", (event) => {
        setWipeStatus(`Wipe Failed: ${event.payload}`);
        setWipeLogs(prev => [...prev, `[ERROR] ${event.payload}`]);
        setError(event.payload);
        setIsWipeComplete(true); // Consider wipe as complete but failed
        setWipeProgress(0); // Reset progress on error
      });
    };

    setupListeners();

    return () => {
      unlistenProgress?.();
      unlistenComplete?.();
      unlistenError?.();
      unlistenLogMessage?.();
      unlistenLogError?.();
    };
  }, [router]);

  // Auto-scroll logs to the bottom
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollTop = logsEndRef.current.scrollHeight;
    }
  }, [wipeLogs]);

  const handleGoToSummary = () => {
    router.push('/wipe-complete');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.16))] p-4 bg-muted/40">
      <Card className="w-full max-w-3xl bg-background p-6 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Wipe in Progress</CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            Securely erasing data from your device. Please do not close the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && <p className="text-red-500 text-center text-sm mb-4">Error: {error}</p>}
          <div className="flex flex-col items-center space-y-4">
            <Progress value={wipeProgress} className="w-full h-4" />
            <p className="text-lg font-medium">{wipeProgress}% Complete</p>
            <p className="text-sm text-muted-foreground">Status: {wipeStatus}</p>
            <Button onClick={() => setShowLogs(!showLogs)} variant="outline" className="w-full sm:w-auto">
              {showLogs ? "Hide Logs" : "Show Logs"}
            </Button>
          </div>

          {showLogs && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Real-time Logs</h3>
              <Textarea
                ref={logsEndRef}
                value={wipeLogs.join('\n')}
                readOnly
                className="w-full h-64 font-mono text-xs bg-muted p-4 rounded-md overflow-auto resize-none"
              />
            </div>
          )}

          {isWipeComplete && (
            <Button onClick={handleGoToSummary} className="w-full py-3 text-lg mt-6">
              Go to Summary
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
