"use client"

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";

interface Device {
  name: string;
  path: string;
  type: string;
  size: string;
}

export default function DeviceSelectionPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevicePath, setSelectedDevicePath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0); // New state to trigger re-fetch

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result: Device[] = await invoke("scan_devices_backend");
        setDevices(result);
      } catch (err: any) {
        console.error("Error fetching devices:", err);
        setError(err.message || "Failed to load devices.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevices();
  }, [refreshTrigger]); // Depend on refreshTrigger

  const handleNext = () => {
    if (selectedDevicePath) {
      // In a real application, you would pass the selected device path to the next page/context
      console.log("Selected device:", selectedDevicePath);
      router.push(`/wipe-method?devicePath=${encodeURIComponent(selectedDevicePath)}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.16))] p-4 bg-muted/40">
      <Card className="w-full max-w-2xl bg-background p-6 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Select Device to Wipe</CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            Choose the device you wish to securely erase. This action is irreversible.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-md" />
              ))}
            </div>
          ) : error ? (
            <p className="text-red-500 text-center">Error: {error}</p>
          ) : devices.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <p className="text-center text-muted-foreground">No devices found.</p>
              <Button onClick={() => setRefreshTrigger(prev => prev + 1)} disabled={isLoading}>
                Refresh Devices
              </Button>
            </div>
          ) : (
            <RadioGroup onValueChange={setSelectedDevicePath} value={selectedDevicePath || ""} className="space-y-4">
              {devices.map((device) => (
                <div key={device.path} className="flex items-center space-x-3 p-4 border rounded-md">
                  <RadioGroupItem value={device.path} id={`device-${device.path}`} />
                  <Label htmlFor={`device-${device.path}`} className="flex-1 grid gap-1">
                    <span className="font-medium">{device.name}</span>
                    <span className="text-sm text-muted-foreground">{device.size} - {device.type}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          <p className="text-sm font-semibold text-red-500 mt-4">
            ⚠️ Warning: This will permanently erase all data on the selected device.
          </p>

          <div className="flex justify-between space-x-4">
            <Button onClick={() => setRefreshTrigger(prev => prev + 1)} disabled={isLoading} variant="outline" className="flex-1 py-3 text-lg">
              Refresh Devices
            </Button>
            <Button onClick={handleNext} disabled={!selectedDevicePath || isLoading} className="flex-1 py-3 text-lg">
              {isLoading ? "Scanning..." : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
