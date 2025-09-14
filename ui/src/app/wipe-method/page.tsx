"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { ConfirmationDialog } from "@/components/confirmation-dialog";

interface WipeMethod {
  id: string;
  name: string;
  description: string;
  tooltip: string;
}

const mockWipeMethods: WipeMethod[] = [
  {
    id: "quick",
    name: "Quick Wipe",
    description: "Fastest, overwrites data once. Less secure, but quick for non-sensitive data.",
    tooltip: "Overwrites data with zeros a single time. Suitable for general data, but not for highly sensitive information.",
  },
  {
    id: "secure",
    name: "Secure Wipe (NIST 800-88)",
    description: "Follows NIST 800-88 guidelines for secure data sanitization.",
    tooltip: "Complies with NIST 800-88 guidelines, typically involving multiple passes to render data unrecoverable.",
  },
  {
    id: "custom",
    name: "Custom Wipe (DoD 5220.22-M)",
    description: "Multiple passes with specific patterns for high-security environments.",
    tooltip: "Implements the Department of Defense 5220.22-M standard, involving three passes with different character patterns. Highly secure.",
  },
];

export default function WipeMethodPage() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();

  const handleNext = () => {
    if (selectedMethod) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmWipe = () => {
    setShowConfirmation(false);
    // In a real app, you would pass selectedDevice and selectedMethod to the wipe process
    console.log(`Wipe confirmed for method: ${selectedMethod}`);
    router.push('/wipe-progress'); // Navigate to wipe in progress page
  };

  // Mock device summary for confirmation dialog - in a real app, this would come from device selection
  const mockDeviceSummary = "Samsung SSD 860 EVO (500 GB)";
  const selectedMethodObj = mockWipeMethods.find(method => method.id === selectedMethod);
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
          <RadioGroup onValueChange={setSelectedMethod} value={selectedMethod || ""} className="space-y-4">
            {mockWipeMethods.map((method) => (
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

          <Button onClick={handleNext} disabled={!selectedMethod} className="w-full py-3 text-lg">
            Next
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
