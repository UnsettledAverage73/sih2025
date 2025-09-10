package wipe

import (
    "crypto/ecdsa"
    "crypto/elliptic"
    "crypto/rand"
    "crypto/sha256"
    "encoding/hex"
    "encoding/json"
    "fmt"
    "runtime"
    "time"

    "sih2025/pkg/log"
)

type WipeCertificate struct {
    Device     string    `json:"device"`
    Passes     int       `json:"passes"`
    StartTime  time.Time `json:"start_time"`
    EndTime    time.Time `json:"end_time"`
    Duration   string    `json:"duration"`
    Platform   string    `json:"platform"`
    Method     string    `json:"method"`
    Signature  string    `json:"signature"`
    PublicKey  string    `json:"public_key"`
    Standards  []string  `json:"standards"`
}

func GenerateCertificate(device string, passes int, duration time.Duration, platform string) *WipeCertificate {
    cert := &WipeCertificate{
        Device:    device,
        Passes:    passes,
        StartTime: time.Now().Add(-duration),
        EndTime:   time.Now(),
        Duration:  duration.String(),
        Platform:  platform,
        Method:    "Multi-pass overwrite (NIST 800-88 compliant)",
        Standards: []string{"NIST SP 800-88"},
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

func Erase(device string, passes int) error {
    log.Info("Erasing device %s with %d passes", device, passes)
    switch platform := getPlatform(); platform {
    case "windows":
        return eraseWindows(device, passes)
    case "linux":
        return eraseLinux(device, passes)
    case "android":
        return eraseAndroid(device, passes)
    default:
        return fmt.Errorf("unsupported platform: %s", platform)
    }
}

func getPlatform() string {
    return runtime.GOOS
}

func eraseWindows(device string, passes int) error {
    return fmt.Errorf("windows platform not supported in this build")
}

func eraseAndroid(device string, passes int) error {
    return fmt.Errorf("android platform not supported in this build")
}
