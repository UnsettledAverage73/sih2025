"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';

interface Device {
  id: string;
  name: string;
  size: string;
  type: string;
  health: string;
}

const mockDevices: Device[] = [
  {
    id: "1",
    name: "Samsung SSD 860 EVO",
    size: "500 GB",
    type: "SSD",
    health: "Good",
  },
  {
    id: "2",
    name: "Western Digital HDD",
    size: "1 TB",
    type: "HDD",
    health: "Good",
  },
  {
    id: "3",
    name: "SanDisk USB Drive",
    size: "64 GB",
    type: "USB",
    health: "Good",
  },
  {
    id: "4",
    name: "Unallocated Partition",
    size: "200 GB",
    type: "Partition",
    health: "Fair",
  },
];

export default function DeviceSelectionPage() {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const router = useRouter();

  const handleNext = () => {
    if (selectedDevice) {
      router.push('/wipe-method');
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
          <RadioGroup onValueChange={setSelectedDevice} value={selectedDevice || ""} className="space-y-4">
            {mockDevices.map((device) => (
              <div key={device.id} className="flex items-center space-x-3 p-4 border rounded-md">
                <RadioGroupItem value={device.id} id={`device-${device.id}`} />
                <Label htmlFor={`device-${device.id}`} className="flex-1 grid gap-1">
                  <span className="font-medium">{device.name}</span>
                  <span className="text-sm text-muted-foreground">{device.size} - {device.type} ({device.health})</span>
                </Label>
              </div>
            ))}
          </RadioGroup>

          <p className="text-sm font-semibold text-red-500 mt-4">
            ⚠️ Warning: This will permanently erase all data on the selected device.
          </p>

          <Button onClick={handleNext} disabled={!selectedDevice} className="w-full py-3 text-lg">
            Next
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
