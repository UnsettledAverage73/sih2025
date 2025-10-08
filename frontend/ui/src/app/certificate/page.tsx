"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Search, Download } from "lucide-react";

interface Certificate {
  id: string;
  deviceName: string;
  date: string;
  method: string;
  hash: string;
  status: string;
}

const mockCertificates: Certificate[] = [
  {
    id: "WC123456789",
    deviceName: "Samsung SSD 860 EVO 500GB",
    date: "2025-09-14",
    method: "DoD 5220.22-M",
    hash: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
    status: "Completed Successfully",
  },
  {
    id: "WC123456790",
    deviceName: "Western Digital HDD 1TB",
    date: "2025-09-10",
    method: "NIST 800-88",
    hash: "b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0",
    status: "Completed Successfully",
  },
  {
    id: "WC123456791",
    deviceName: "SanDisk USB 64GB",
    date: "2025-09-05",
    method: "Quick Wipe",
    hash: "c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0",
    status: "Completed with Warnings",
  },
];

export default function CertificatePage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCertificates = mockCertificates.filter(cert =>
    Object.values(cert).some(value =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleExportAll = (format: "pdf" | "json") => {
    console.log(`Exporting all certificates in ${format} format...`);
    // Implement actual export logic via Tauri commands
    if (format === "json") {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mockCertificates, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `all-certificates-${new Date().toISOString()}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } else if (format === "pdf") {
      alert("Exporting all certificates to PDF (mock action).");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.16))] p-4 bg-muted/40">
      <Card className="w-full max-w-4xl bg-background p-6 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Wipe Certificates</CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            View and manage records of past secure wipe operations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-auto flex-grow">
              <Input
                type="text"
                placeholder="Search certificates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button onClick={() => handleExportAll("pdf")} variant="outline" className="flex-1">
                <Download className="mr-2 h-4 w-4" /> Export PDF
              </Button>
              <Button onClick={() => handleExportAll("json")} className="flex-1">
                <Download className="mr-2 h-4 w-4" /> Export JSON
              </Button>
            </div>
          </div>

          <Separator />

          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Certificate ID</TableHead>
                  <TableHead>Device Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCertificates.length > 0 ? (
                  filteredCertificates.map((cert) => (
                    <TableRow key={cert.id}>
                      <TableCell className="font-medium">{cert.id}</TableCell>
                      <TableCell>{cert.deviceName}</TableCell>
                      <TableCell>{cert.date}</TableCell>
                      <TableCell>{cert.method}</TableCell>
                      <TableCell>{cert.status}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No certificates found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile List View */}
          <div className="md:hidden space-y-4">
            {filteredCertificates.length > 0 ? (
              filteredCertificates.map((cert) => (
                <Card key={cert.id} className="p-4">
                  <p className="text-sm"><span className="font-semibold">ID:</span> {cert.id}</p>
                  <p className="text-sm"><span className="font-semibold">Device:</span> {cert.deviceName}</p>
                  <p className="text-sm"><span className="font-semibold">Date:</span> {cert.date}</p>
                  <p className="text-sm"><span className="font-semibold">Method:</span> {cert.method}</p>
                  <p className="text-sm"><span className="font-semibold">Status:</span> {cert.status}</p>
                </Card>
              ))
            ) : (
              <p className="text-center text-muted-foreground">No certificates found.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
