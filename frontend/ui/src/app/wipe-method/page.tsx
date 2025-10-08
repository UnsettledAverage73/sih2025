"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { invoke } from "@tauri-apps/api/core";

interface WipeMethod {
  id: string;
  name: string;
  description: string;
  tooltip: string;
}

const wipeMethods: WipeMethod[] = [
  {
    id: "Quick Erase",
    name: "Quick Wipe",
    description: "Fastest, overwrites data once. Less secure, but quick for non-sensitive data.",
    tooltip: "Overwrites data with zeros a single time. Suitable for general data, but not for highly sensitive information.",
  },
  {
    id: "Secure Wipe",
    name: "Secure Wipe",
    description: "Performs a multi-pass overwrite with zeros, following custom secure guidelines.",
    tooltip: "Multiple passes ensure data is harder to recover, offering a good balance of security and performance.",
  },
  {
    id: "NIST 800-88",
    name: "NIST 800-88",
    description: "Complies with NIST 800-88 guidelines for secure data sanitization.",
    tooltip: "A standard for media sanitization ensuring data is unrecoverable even with advanced forensic techniques. (Uses nvme-cli for NVMe drives).",
  },
  {
    id: "DoD 5220.22-M",
    name: "DoD 5220.22-M",
    description: "Multiple passes with specific patterns for high-security environments.",
    tooltip: "Implements the Department of Defense 5220.22-M standard, involving three passes with different character patterns. Highly secure.",
  },
];

export default function WipeMethodPage() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isWiping, setIsWiping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedDevicePath = searchParams.get('devicePath'); // Get device path from URL query

  const handleNext = () => {
    if (selectedMethod && selectedDevicePath) {
      setShowConfirmation(true);
    } else if (!selectedDevicePath) {
        setError("No device selected. Please go back to device selection.");
    }
  };

  const handleConfirmWipe = async () => {
    setShowConfirmation(false);
    setIsWiping(true);
    setError(null);

    if (!selectedDevicePath || !selectedMethod) {
        setError("Missing device or wipe method to start wiping.");
        setIsWiping(false);
        return;
    }

    try {
        // Invoke the Tauri command to start the wipe process
        console.log(`Attempting to wipe device: ${selectedDevicePath} with method: ${selectedMethod}`);
        // Do not await the result here, as the Rust backend spawns asynchronously
        invoke("start_wipe_backend_command", {
            device: selectedDevicePath,
            method: selectedMethod,
            passes: 3, // Default passes for now, could be made configurable
            output: "./certs", // Default certificate output directory
        });
        console.log("Wipe command sent to backend. Navigating to progress page.");
        router.push('/wipe-progress'); // Navigate immediately
    } catch (err: any) {
        console.error("Error initiating wipe:", err);
        setError(err.message || "Failed to initiate wipe. Please try again.");
    } finally {
        setIsWiping(false);
    }
  };

  // Mock device summary for confirmation dialog - in a real app, this would come from device selection
  const mockDeviceSummary = selectedDevicePath ? `Device: ${selectedDevicePath}` : "No device selected";
  const selectedMethodObj = wipeMethods.find(method => method.id === selectedMethod);
  const methodSummary = selectedMethodObj ? `${selectedMethodObj.name} (${selectedMethodObj.description})` : "";

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.16))] p-4 bg-muted/40">
      <Card className="w-full max-w-2xl bg-background p-6 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Select Wipe Method</CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            Choose the method for securely erasing data from the selected device.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <p className="text-red-500 text-center text-sm mb-4">Error: {error}</p>
          )}
          <RadioGroup onValueChange={setSelectedMethod} value={selectedMethod || ""} className="space-y-4">
            {wipeMethods.map((method) => (
              <div key={method.id} className="flex items-start space-x-3 p-4 border rounded-md">
                <RadioGroupItem value={method.id} id={`method-${method.id}`} className="mt-1" />
                <div className="flex-1 grid gap-1">
                  <Label htmlFor={`method-${method.id}`} className="flex items-center gap-2">
                    <span className="font-medium">{method.name}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{method.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <span className="text-sm text-muted-foreground">{method.description}</span>
                </div>
              </div>
            ))}
          </RadioGroup>

          <p className="text-sm font-semibold text-red-500 mt-4">
            ⚠️ Warning: This will permanently erase all data on the selected device.
          </p>

          <Button onClick={handleNext} disabled={!selectedMethod || isWiping} className="w-full py-3 text-lg">
            {isWiping ? "Initiating Wipe..." : "Next"}
          </Button>
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onConfirm={handleConfirmWipe}
        deviceSummary={mockDeviceSummary}
        methodSummary={methodSummary}
      />
    </div>
  );
}
