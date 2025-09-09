cmake_minimum_required(VERSION 3.10)
project(sih2025)

set(CMAKE_CXX_STANDARD 17)

# Add include directory
include_directories(include)

# Add executable
add_executable(wipe_tool
    src/core/disk_wiper.cpp
    src/services/main.cpp
)
