"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRouter } from 'next/navigation';
import { CheckCircle } from "lucide-react";

export default function WipeCompletePage() {
  const router = useRouter();

  const wipeSummary = {
    device: "Samsung SSD 860 EVO (500 GB)",
    method: "Secure Wipe (NIST 800-88)",
    date: new Date().toLocaleString(),
    status: "Completed Successfully",
    certificateId: "WC-20250914-ABCD",
    hash: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
  };

  const handleDownloadCertificate = (format: "pdf" | "json") => {
    console.log(`Downloading certificate in ${format} format...`);
    // In a real application, you would trigger the download via Tauri commands
    if (format === "json") {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(wipeSummary, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `certificate-${wipeSummary.certificateId}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } else if (format === "pdf") {
      alert("PDF download initiated (mock).");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.16))] p-4 bg-muted/40">
      <Card className="w-full max-w-2xl text-center bg-background p-6 shadow-lg rounded-lg">
        <CardHeader>
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-3xl font-bold text-green-600">Wipe Complete!</CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            Your device has been securely erased.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2 text-left">
            <p className="text-sm"><span className="font-semibold">Device:</span> {wipeSummary.device}</p>
            <p className="text-sm"><span className="font-semibold">Method:</span> {wipeSummary.method}</p>
            <p className="text-sm"><span className="font-semibold">Date/Time:</span> {wipeSummary.date}</p>
            <p className="text-sm"><span className="font-semibold">Status:</span> {wipeSummary.status}</p>
            <p className="text-sm"><span className="font-semibold">Certificate ID:</span> {wipeSummary.certificateId}</p>
            <p className="text-sm"><span className="font-semibold">Hash:</span> {wipeSummary.hash}</p>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={() => handleDownloadCertificate("pdf")} variant="outline" className="flex-1 py-3 text-lg">
              Download PDF Certificate
            </Button>
            <Button onClick={() => handleDownloadCertificate("json")} className="flex-1 py-3 text-lg">
              Download JSON Certificate
            </Button>
          </div>

          <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-2">Scan QR for certificate verification:</p>
            {/* Placeholder for QR code */}
            <div className="bg-gray-200 h-32 w-32 mx-auto flex items-center justify-center rounded-md text-gray-500">
              QR Code Placeholder
            </div>
          </div>

          <Button onClick={() => router.push('/welcome')} variant="secondary" className="w-full py-3 text-lg mt-6">
            Wipe Another Device
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
