#include "disk_wiper.h"
#include <iostream>
#include <fstream>

DiskWiper::DiskWiper(const std::string& path) : devicePath(path) {}

bool DiskWiper::wipe() {
    std::cout << "Pretending to wipe: " << devicePath << std::endl;
    // TODO: Implement actual wiping with fstream/ioctl
    return true;
}
