"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from 'next/navigation';
import { invoke } from "@tauri-apps/api/core";

export default function WipeProgressPage() {
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState("Calculating...");
  const [logs, setLogs] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(true);
  const [isWiping, setIsWiping] = useState(false);
  const [wipeStatus, setWipeStatus] = useState("Initializing...");
  const router = useRouter();

  useEffect(() => {
    // Simulate wipe process and progress updates
    let currentProgress = 0;
    let interval: NodeJS.Timeout;
    let logInterval: NodeJS.Timeout;

    const startSimulation = async () => {
      setIsWiping(true);
      setWipeStatus("Starting wipe simulation...");
      setLogs(prev => [...prev, `[INFO] ${new Date().toLocaleTimeString()}: Starting secure wipe process...`]);

      try {
        // In a real app, this would be the actual Tauri command to start the wipe
        // const result = await invoke("start_wipe_backend_command", { device: "/dev/sda", method: "DoD" });
        // console.log("Backend wipe started:", result);

        interval = setInterval(() => {
          currentProgress += Math.floor(Math.random() * 5) + 1; // Random increment
          if (currentProgress > 100) currentProgress = 100;
          setProgress(currentProgress);
          setEstimatedTime(`${100 - currentProgress} seconds remaining`); // Mock calculation

          if (currentProgress >= 100) {
            clearInterval(interval);
            clearInterval(logInterval);
            setIsWiping(false);
            setWipeStatus("Wipe Complete!");
            setLogs(prev => [...prev, `[INFO] ${new Date().toLocaleTimeString()}: Wipe process completed successfully.`]);
            setTimeout(() => router.push('/wipe-complete'), 2000); // Redirect after a delay
          }
        }, 1000);

        logInterval = setInterval(() => {
          setLogs(prev => [...prev, `[LOG] ${new Date().toLocaleTimeString()}: Progress at ${currentProgress}%. Sector scan...`]);
        }, 3000);

      } catch (error: any) {
        setWipeStatus(`Wipe Failed: ${error.message}`);
        setLogs(prev => [...prev, `[ERROR] ${new Date().toLocaleTimeString()}: Wipe failed: ${error.message}`]);
        setIsWiping(false);
        clearInterval(interval);
        clearInterval(logInterval);
      }
    };

    startSimulation();

    return () => {
      clearInterval(interval);
      clearInterval(logInterval);
    };
  }, []);

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
          <div className="flex flex-col items-center space-y-4">
            <Progress value={progress} className="w-full h-4" />
            <p className="text-lg font-medium">{progress}% Complete</p>
            <p className="text-sm text-muted-foreground">Estimated time remaining: {estimatedTime}</p>
            <Button onClick={() => setShowLogs(!showLogs)} variant="outline" className="w-full sm:w-auto">
              {showLogs ? "Hide Logs" : "Show Logs"}
            </Button>
          </div>

          {showLogs && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Real-time Logs</h3>
              <Textarea
                value={logs.join('\n')}
                readOnly
                className="w-full h-64 font-mono text-xs bg-muted p-4 rounded-md overflow-auto resize-none"
              />
            </div>
          )}

          {!isWiping && wipeStatus !== "Initializing..." && ( // Show only when wipe is not active and not initializing
            <Button onClick={() => router.push('/wipe-complete')} className="w-full py-3 text-lg mt-6">
              Go to Summary
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
