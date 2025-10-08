"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WelcomePage() {
  const [isProMode, setIsProMode] = useState(false);
  const router = useRouter();

  const handleStartWipe = () => {
    if (isProMode) {
      router.push('/dashboard'); // Redirect to dashboard for Pro Mode (assuming dashboard is the starting point for advanced actions)
    } else {
      router.push('/device-selection'); // Redirect to device selection for Easy Mode
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.16))] p-4 bg-muted/40">
      <Card className="w-full max-w-md text-center bg-background p-6 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Welcome to Secure Eraser</CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            Your trusted partner for secure data wiping.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button onClick={handleStartWipe} className="w-full py-3 text-lg">
            Start Wipe
          </Button>
          <Link href="/certificate" passHref>
            <Button variant="link" className="w-full text-base">
              View Certificates
            </Button>
          </Link>

          <div className="flex items-center justify-center space-x-2 mt-6">
            <span className="text-sm text-muted-foreground">Easy Mode</span>
            <Toggle
              pressed={isProMode}
              onPressedChange={setIsProMode}
              aria-label="Toggle Pro Mode"
              className="data-[state=on]:bg-primary"
            >
              {/* You can add an icon here if needed */}
            </Toggle>
            <span className="text-sm text-muted-foreground">Pro Mode</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
