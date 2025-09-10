package wipe

import (
    "fmt"
    "os/exec"
    "syscall"

    "github.com/impossibleclone/sih2025/pkg/utils/log"
)

func eraseWindows(device string, passes int) error {
    if passes > 1 {
        log.Warn("Windows cipher uses 3 passes by default; ignoring custom passes")
    }

    cmd := exec.Command("cipher", "/w", device)
    cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
    output, err := cmd.CombinedOutput()
    if err != nil {
        return fmt.Errorf("cipher failed: %v, output: %s", err, output)
    }

    log.Info("Windows wipe completed via cipher /w")
    return nil
}
