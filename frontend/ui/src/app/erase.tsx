import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const ErasePage = () => {
  const [devicePath, setDevicePath] = useState("");
  const [passes, setPasses] = useState(3);
  const [outputPath, setOutputPath] = useState("");
  const [wipeProgress, setWipeProgress] = useState(0);
  const [isWiping, setIsWiping] = useState(false);
  const [wipeStatus, setWipeStatus] = useState("");
  const [error, setError] = useState<string | null>(null);

  const startWipe = async () => {
    setError(null);
    setIsWiping(true);
    setWipeProgress(0);
    setWipeStatus("Starting wipe...");

    try {
      // Mocking progress updates
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 10;
        setWipeProgress(currentProgress);
        if (currentProgress >= 100) {
          clearInterval(interval);
          setWipeStatus("Wipe complete!");
          setIsWiping(false);
        }
      }, 500);

      // Example Tauri command invocation
      const result = await invoke("erase_drive", {
        device: devicePath,
        passes: passes,
        output: outputPath,
      });
      console.log("Wipe result:", result);
    } catch (err: any) {
      console.error("Error during wipe:", err);
      setError(err.message || "An unknown error occurred during wipe.");
      setWipeStatus("Wipe failed!");
      setIsWiping(false);
      setWipeProgress(0);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Secure Disk Erase</CardTitle>
          <CardDescription>Initiate a secure wipe of a selected disk.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="devicePath">Device Path</Label>
            <Input
              id="devicePath"
              type="text"
              placeholder="/dev/sda" // Example path
              value={devicePath}
              onChange={(e) => setDevicePath(e.target.value)}
              disabled={isWiping}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="passes">Number of Passes</Label>
            <Input
              id="passes"
              type="number"
              min="1"
              value={passes}
              onChange={(e) => setPasses(parseInt(e.target.value))}
              disabled={isWiping}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="outputPath">Certificate Output Path</Label>
            <Input
              id="outputPath"
              type="text"
              placeholder="/path/to/certificates"
              value={outputPath}
              onChange={(e) => setOutputPath(e.target.value)}
              disabled={isWiping}
            />
          </div>
          <Button onClick={startWipe} disabled={isWiping || !devicePath || !outputPath} className="w-full">
            {isWiping ? "Wiping..." : "Start Secure Wipe"}
          </Button>

          {isWiping && (
            <div className="space-y-2 mt-4">
              <Progress value={wipeProgress} className="w-full" />
              <p className="text-center text-sm text-muted-foreground">{wipeStatus} ({wipeProgress}%)</p>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-center text-sm mt-4">Error: {error}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ErasePage;
