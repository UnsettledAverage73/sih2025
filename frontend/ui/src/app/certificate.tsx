import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const CertificatePage = () => {
  const certificateData = {
    id: "WC123456789",
    deviceName: "Samsung SSD 860 EVO 500GB",
    wipeMethod: "DoD 5220.22-M",
    passes: 3,
    wipeDate: "2025-09-14 10:30:00 UTC",
    status: "Completed Successfully",
    operator: "John Doe",
  };

  const exportPdf = () => {
    console.log("Exporting to PDF:", certificateData);
    // Implement actual PDF export logic here
    alert("Exporting certificate to PDF (mock action).");
  };

  const exportJson = () => {
    console.log("Exporting to JSON:", certificateData);
    // Implement actual JSON export logic here
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(certificateData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `certificate-${certificateData.id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Wipe Certificate</CardTitle>
          <CardDescription>Details of the secure data wipe operation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Certificate ID:</h3>
              <p>{certificateData.id}</p>
            </div>
            <div>
              <h3 className="font-semibold">Device Name:</h3>
              <p>{certificateData.deviceName}</p>
            </div>
            <div>
              <h3 className="font-semibold">Wipe Method:</h3>
              <p>{certificateData.wipeMethod}</p>
            </div>
            <div>
              <h3 className="font-semibold">Passes:</h3>
              <p>{certificateData.passes}</p>
            </div>
            <div>
              <h3 className="font-semibold">Wipe Date:</h3>
              <p>{certificateData.wipeDate}</p>
            </div>
            <div>
              <h3 className="font-semibold">Status:</h3>
              <p>{certificateData.status}</p>
            </div>
            <div>
              <h3 className="font-semibold">Operator:</h3>
              <p>{certificateData.operator}</p>
            </div>
          </div>
          <Separator />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={exportPdf}>Export to PDF</Button>
            <Button onClick={exportJson}>Export to JSON</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificatePage;
