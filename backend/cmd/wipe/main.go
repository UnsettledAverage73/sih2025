package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"time"

	"sih2025/internals/scanner"
	"sih2025/internals/wipe"
	"sih2025/pkg/log"

	"github.com/jung-kurt/gofpdf"
)

var (
	device  string
	passes  int
	output  string
	certDir string
	scanCmd bool   // New flag for scanning devices
	method  string // New flag for wipe method
)

func init() {
	flag.StringVar(&device, "device", "", "Path to the device or drive to wipe (e.g., /dev/sda or C:\\)")
	flag.IntVar(&passes, "passes", 3, "Number of wipe passes (1 for SSD quick erase, 3+ for HDD)")
	flag.StringVar(&output, "output", "", "Output directory for certificates")
	flag.StringVar(&certDir, "cert-dir", "./certs", "Directory for certificates")
	flag.BoolVar(&scanCmd, "scan", false, "Scan for available devices")
	flag.StringVar(&method, "method", wipe.MethodSecure, "Wipe method (e.g., \"Secure Wipe\", \"NIST 800-88\")") // Define new method flag
	flag.Parse()

	if !scanCmd {
		if device == "" {
			log.Fatal("Device path is required for wiping operation")
		}
		if output == "" {
			output = filepath.Join(certDir, fmt.Sprintf("wipe-cert-%s-%s", time.Now().Format("20060102-150405"), filepath.Base(device)))
		}
	}
}

func main() {
	log.Init()

	if scanCmd {
		devices, err := scanner.ScanDevices()
		if err != nil {
			log.Error("Failed to scan devices: %v", err)
			os.Exit(1)
		}
		jsonOutput, err := json.Marshal(devices)
		if err != nil {
			log.Error("Failed to marshal device list to JSON: %v", err)
			os.Exit(1)
		}
		fmt.Println(string(jsonOutput))
		return // Exit after scanning and printing devices
	}

	log.Info("Starting secure wipe process for device: %s", device)
	log.Info("Platform: %s, Passes: %d, Method: %s", runtime.GOOS, passes, method)

	startTime := time.Now()
	err := wipe.Erase(device, passes, method)
	if err != nil {
		log.Error("Wipe failed: %v", err)
		os.Exit(1)
	}
	duration := time.Since(startTime)
	log.Info("Wipe completed successfully in %v", duration)

	cert := wipe.GenerateCertificate(device, passes, duration, runtime.GOOS, method)
	if err := saveCertificate(cert, output); err != nil {
		log.Error("Failed to save certificate: %v", err)
		os.Exit(1)
	}

	log.Info("Certificate saved to: %s.pdf and %s.json", output, output)
	log.Info("Wipe process finished.")
}

func saveCertificate(cert *wipe.WipeCertificate, output string) error {
	jsonData, err := json.MarshalIndent(cert, "", "  ")
	if err != nil {
		return err
	}
	if err := os.WriteFile(output+".json", jsonData, 0644); err != nil {
		return err
	}

	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.AddPage()
	pdf.SetFont("Arial", "B", 16)
	pdf.Cell(40, 10, "Secure Wipe Certificate")
	pdf.Ln(10)
	pdf.SetFont("Arial", "", 12)
	pdf.Cell(40, 10, fmt.Sprintf("Device: %s", cert.Device))
	pdf.Ln(10)
	pdf.Cell(40, 10, fmt.Sprintf("Passes: %d", cert.Passes))
	pdf.Ln(10)
	pdf.Cell(40, 10, fmt.Sprintf("Duration: %s", cert.Duration))
	pdf.Ln(10)
	pdf.Cell(40, 10, fmt.Sprintf("Platform: %s", cert.Platform))
	return pdf.OutputFileAndClose(output + ".pdf")
}
