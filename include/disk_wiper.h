#ifndef DISK_WIPER_H
#define DISK_WIPER_H

#include <string>

class DiskWiper {
public:
    explicit DiskWiper(const std::string& devicePath);
    bool wipe();   // Wipe the device
private:
    std::string devicePath;
};

#endif
