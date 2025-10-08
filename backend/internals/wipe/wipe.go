package wipe

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"runtime"
	"time"

	"sih2025/pkg/log"
)

// ProgressUpdate represents a structured progress message from the wipe tool.
type ProgressUpdate struct {
	Percentage  float64 `json:"percentage"`
	CurrentPass int     `json:"current_pass"`
	TotalPasses int     `json:"total_passes"`
	Status      string  `json:"status"`
	Error       string  `json:"error,omitempty"`
}

// Define constants for wipe methods
const (
	MethodSecure = "Secure Wipe"
	MethodNIST   = "NIST 800-88"
	MethodDoD    = "DoD 5220.22-M"
	MethodQuick  = "Quick Erase"
)

type WipeCertificate struct {
	Device    string    `json:"device"`
	Passes    int       `json:"passes"`
	StartTime time.Time `json:"start_time"`
	EndTime   time.Time `json:"end_time"`
	Duration  string    `json:"duration"`
	Platform  string    `json:"platform"`
	Method    string    `json:"method"`
	Signature string    `json:"signature"`
	PublicKey string    `json:"public_key"`
	Standards []string  `json:"standards"`
}

func GenerateCertificate(device string, passes int, duration time.Duration, platform string, method string) *WipeCertificate {
	cert := &WipeCertificate{
		Device:    device,
		Passes:    passes,
		StartTime: time.Now().Add(-duration),
		EndTime:   time.Now(),
		Duration:  duration.String(),
		Platform:  platform,
		Method:    method,
		Standards: []string{},
	}

	switch method {
	case MethodNIST:
		cert.Standards = []string{"NIST SP 800-88 Revision 1"}
	case MethodDoD:
		cert.Standards = []string{"DoD 5220.22-M"}
	case MethodSecure:
		cert.Standards = []string{"Custom Secure Overwrite"}
	case MethodQuick:
		cert.Standards = []string{"Quick Erase"}
	}

	privKey, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		log.Warn("Failed to generate keys for demo: %v", err)
		return cert
	}

	data, _ := json.Marshal(cert)
	hash := sha256.Sum256(data)
	sig, err := ecdsa.SignASN1(rand.Reader, privKey, hash[:])
	if err != nil {
		log.Warn("Signing failed: %v", err)
	} else {
		cert.Signature = hex.EncodeToString(sig)
		pubKeyBytes := elliptic.Marshal(elliptic.P256(), privKey.PublicKey.X, privKey.PublicKey.Y)
		cert.PublicKey = hex.EncodeToString(pubKeyBytes)
	}

	return cert
}

// Erase dispatches to the appropriate wipe function based on the method and platform.
func Erase(devicePath string, passes int, method string) error {
	log.Info("Erasing device %s with method %s and %d passes", devicePath, method, passes)

	// Send initial progress update
	sendProgress(0, 0, passes, fmt.Sprintf("Data wiping started for %s with method %s.", filepath.Base(devicePath), method), "")

	switch method {
	case MethodQuick:
		// Implement a quick erase (e.g., single pass zero fill)
		return fmt.Errorf("quick erase method not yet implemented")
	case MethodSecure:
		return secureOverwrite(devicePath, passes)
	case MethodNIST:
		// TODO: Implement NIST 800-88 compliant wipe, potentially using nvme-cli for NVMe devices.
		return fmt.Errorf("NIST 800-88 method not yet implemented")
	case MethodDoD:
		// TODO: Implement DoD 5220.22-M compliant wipe.
		return fmt.Errorf("DoD 5220.22-M method not yet implemented")
	default:
		return fmt.Errorf("unsupported wipe method: %s", method)
	}
}

// secureOverwrite performs a multi-pass overwrite of the device with zeros.
func secureOverwrite(devicePath string, passes int) error {
	log.Info("Starting secure overwrite for device: %s", devicePath)
	file, err := os.OpenFile(devicePath, os.O_WRONLY, 0)
	if err != nil {
		return fmt.Errorf("failed to open device %s: %w", devicePath, err)
	}
	defer file.Close()

	// Get device size for accurate progress reporting.
	// NOTE: This is a critical part of a real wiping tool. For demonstration, we'll use a mock size
	// or assume the device is fully overwritable by seeking to end and getting its offset.
	deviceInfo, err := file.Stat()
	if err != nil {
		log.Warn("Could not stat device %s for size: %v. Progress will be based on buffer writes.", devicePath, err)
	}
	deviceSize := deviceInfo.Size()

	bufferSize := 4 * 1024 * 1024 // 4 MB buffer
	zeroBuffer := make([]byte, bufferSize)

	totalBytesWritten := int64(0)

	for i := 0; i < passes; i++ {
		log.Info("Starting Pass %d/%d", i+1, passes)
		sendProgress(float64(i)*100.0/float64(passes), i+1, passes, fmt.Sprintf("Pass %d/%d: Initializing...", i+1, passes), "")

		if _, err := file.Seek(0, io.SeekStart); err != nil {
			return fmt.Errorf("failed to seek to start of device: %w", err)
		}

		currentPassBytesWritten := int64(0)
		for {
			n, err := file.Write(zeroBuffer)
			if err != nil {
				if err == io.EOF {
					break // Reached end of device
				}
				return fmt.Errorf("failed to write to device: %w", err)
			}
			if n == 0 {
				break // Nothing more to write
			}
			currentPassBytesWritten += int64(n)
			totalBytesWritten += int64(n)

			// Calculate progress more accurately if deviceSize is known, otherwise approximate.
			if deviceSize > 0 {
				currentPassProgress := float64(currentPassBytesWritten) / float64(deviceSize) * 100.0
				overallProgress := (float64(i) * 100.0 / float64(passes)) + (currentPassProgress / float64(passes))
				sendProgress(overallProgress, i+1, passes, fmt.Sprintf("Pass %d/%d: Writing data (%.2f%%)...", i+1, passes, currentPassProgress), "")
			} else {
				// Approximate progress if device size is unknown
				sendProgress(float64(totalBytesWritten%100)/100.0+float64(i)*100.0/float64(passes), i+1, passes, fmt.Sprintf("Pass %d/%d: Writing data...", i+1, passes), "")
			}
		}
	}

	log.Info("Secure overwrite completed for device: %s", devicePath)
	sendProgress(100, passes, passes, "Wipe complete! Device erased.", "")
	return nil
}

// sendProgress sends a ProgressUpdate message to stdout as JSON.
func sendProgress(percentage float64, currentPass, totalPasses int, status, err string) {
	update := ProgressUpdate{
		Percentage:  percentage,
		CurrentPass: currentPass,
		TotalPasses: totalPasses,
		Status:      status,
		Error:       err,
	}
	jsonOutput, e := json.Marshal(update)
	if e != nil {
		log.Error("Failed to marshal progress update: %v", e)
		return
	}
	fmt.Println(string(jsonOutput))
}

// TODO: Implement NIST 800-88 compliant wipe using nvme-cli for NVMe devices.
/*
func nistWipe(devicePath string) error {
    log.Info("Performing NIST 800-88 wipe on %s", devicePath)

    // Example using nvme-cli for NVMe sanitize
    // This would typically involve:
    // 1. Check if device is NVMe: `nvme id-ctrl /dev/nvme0`
    // 2. Perform NVM Subsystem Reset (optional, for some sanitization):
    //    `nvme admin-passthru /dev/nvme0 -o "NVM Subsystem Reset" -r`
    // 3. Perform sanitize operation:
    //    `nvme sanitize /dev/nvme0 -a 2 -i 1` // -a 2 for block erase, -i 1 for overwrite

    return fmt.Errorf("NIST 800-88 wipe not yet implemented")
}
*/

// TODO: Implement DoD 5220.22-M compliant wipe.
/*
func doDWipe(devicePath string, passes int) error {
    log.Info("Performing DoD 5220.22-M wipe on %s with %d passes", devicePath, passes)
    return fmt.Errorf("DoD 5220.22-M wipe not yet implemented")
}
*/

func getPlatform() string {
	return runtime.GOOS
}
