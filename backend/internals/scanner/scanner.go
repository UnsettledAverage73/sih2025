package scanner

import (
	"bufio"
	"bytes"
	"fmt"
	"os/exec"
	"runtime"
	"strconv"
	"strings"
)

// Device represents a scannable storage device.
type Device struct {
	Name string `json:"name"`
	Path string `json:"path"`
	Type string `json:"type"` // e.g., "disk", "ssd", "hdd", "usb"
	Size string `json:"size"`
}

func ScanDevices() ([]Device, error) {
	var devices []Device
	switch runtime.GOOS {
	case "windows":
		// Use wmic to get disk drive information
		cmd := exec.Command("wmic", "diskdrive", "get", "Caption,Size,Name", "/format:list")
		output, err := cmd.Output()
		if err != nil {
			return nil, fmt.Errorf("failed to run wmic command: %w", err)
		}
		scanner := bufio.NewScanner(bytes.NewReader(output))
		var currentDevice Device
		for scanner.Scan() {
			line := strings.TrimSpace(scanner.Text())
			if line == "" {
				if currentDevice.Name != "" {
					devices = append(devices, currentDevice)
					currentDevice = Device{} // Reset for next device
				}
				continue
			}

			parts := strings.SplitN(line, "=", 2)
			if len(parts) == 2 {
				key := strings.TrimSpace(parts[0])
				value := strings.TrimSpace(parts[1])
				switch key {
				case "Caption":
					currentDevice.Name = value
				case "Name":
					currentDevice.Path = value // e.g., \\.\PHYSICALDRIVE0
				case "Size":
					// Convert size from bytes to a human-readable format
					if s, e := parseSize(value); e == nil {
						currentDevice.Size = s
					} else {
						currentDevice.Size = "Unknown"
					}
				}
			}
		}
		// Add the last device if any
		if currentDevice.Name != "" {
			devices = append(devices, currentDevice)
		}

	case "linux":
		// Use lsblk to get block device information
		cmd := exec.Command("lsblk", "-b", "-o", "NAME,TYPE,SIZE", "-n", "-p")
		output, err := cmd.Output()
		if err != nil {
			return nil, fmt.Errorf("failed to run lsblk command: %w", err)
		}

		scanner := bufio.NewScanner(bytes.NewReader(output))
		for scanner.Scan() {
			line := scanner.Text()
			fields := strings.Fields(line)
			if len(fields) >= 3 {
				name := fields[0]
				devType := fields[1]
				sizeBytes := fields[2]

				if devType == "disk" || devType == "loop" {
					var d Device
					d.Path = name
					d.Name = strings.TrimPrefix(name, "/dev/") // User-friendly name
					d.Type = devType
					if s, e := parseSize(sizeBytes); e == nil {
						d.Size = s
					} else {
						d.Size = "Unknown"
					}
					devices = append(devices, d)
				}
			}
		}

	case "android":
		// For Android, `df` command can list storage, but proper device wiping might require root access.
		// This is a simplified placeholder.
		cmd := exec.Command("df", "-h")
		output, err := cmd.Output()
		if err != nil {
			return nil, fmt.Errorf("failed to run df command: %w", err)
		}
		// Example: parse df output to find mounted devices, for simplicity adding a placeholder
		devices = append(devices, Device{Name: "Android Internal", Path: "/storage/emulated/0", Type: "flash", Size: "Unknown"})
		fmt.Println(string(output)) // Log df output for debugging
	}

	return devices, nil
}

// parseSize converts size in bytes to a human-readable format (e.g., KB, MB, GB).
func parseSize(sizeStr string) (string, error) {
	size, err := strconv.ParseUint(sizeStr, 10, 64)
	if err != nil {
		return "", fmt.Errorf("invalid size format: %w", err)
	}

	const (
		_         = iota // ignore first value by assigning to blank identifier
		KB uint64 = 1 << (10 * iota)
		MB
		GB
		TB
	)

	switch {
	case size >= TB:
		return fmt.Sprintf("%.2f TB", float64(size)/float64(TB)), nil
	case size >= GB:
		return fmt.Sprintf("%.2f GB", float64(size)/float64(GB)), nil
	case size >= MB:
		return fmt.Sprintf("%.2f MB", float64(size)/float64(MB)), nil
	case size >= KB:
		return fmt.Sprintf("%.2f KB", float64(size)/float64(KB)), nil
	default:
		return fmt.Sprintf("%d Bytes", size), nil
	}
}
