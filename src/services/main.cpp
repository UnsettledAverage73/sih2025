#include "disk_wiper.h"
#include <iostream>

int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cerr << "Usage: " << argv[0] << " <device_path>\n";
        return 1;
    }

    std::string device = argv[1];
    DiskWiper wiper(device);

    if (wiper.wipe()) {
        std::cout << "Wipe completed for " << device << std::endl;
    } else {
        std::cerr << "Wipe failed for " << device << std::endl;
        return 1;
    }

    return 0;
}
