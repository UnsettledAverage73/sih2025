package wipe

import (
    "fmt"
    "os/exec"

    "sih2025/pkg/log"
)

func eraseAndroid(device string, passes int) error {
    cmd := exec.Command("dd", "if=/dev/urandom", "of="+device, "bs=1M", fmt.Sprintf("count=%d", passes*100))
    _, err := cmd.CombinedOutput()
    if err != nil {
        return fmt.Errorf("dd wipe failed: %v", err)
    }

    log.Info("Android wipe completed via dd")
    return nil
}
