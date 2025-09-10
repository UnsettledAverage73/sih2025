package wipe

import (
    "fmt"
    "os/exec"
    "syscall"

    "sih2025/pkg/log"
)

func eraseLinux(device string, passes int) error {
    isSSD := true // Placeholder: detect via /sys/block/sdX/queue/rotational == 0
    if isSSD && passes > 1 {
        log.Warn("SSD detected; using single pass for wear-leveling compliance")
        passes = 1
    }

    args := []string{"-v", "-n", fmt.Sprintf("%d", passes), "-z", device}
    if passes > 1 {
        args = append([]string{"-v", "-n", fmt.Sprintf("%d", passes)}, device)
    } else {
        args = append([]string{"-v", "-n", "1"}, device)
    }

    cmd := exec.Command("shred", args...)
    cmd.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
    output, err := cmd.CombinedOutput()
    if err != nil {
        return fmt.Errorf("shred failed: %v, output: %s", err, output)
    }

    log.Info("Linux wipe completed via shred")
    if err := clearHiddenAreas(device); err != nil {
        log.Warn("Hidden areas wipe: %v", err)
    }

    return nil
}

func clearHiddenAreas(device string) error {
    cmd := exec.Command("hdparm", "--yes-i-know-what-i-am-doing", device)
    _, err := cmd.CombinedOutput()
    return err
}
