# Compiler and flags
CXX = g++
CXXFLAGS = -std=c++17 -Iinclude -Wall

# Source files
SRCS = src/core/disk_wiper.cpp src/services/main.cpp

# Output executable
TARGET = build/wipedevs

# Default target
all: $(TARGET)

# Build executable
$(TARGET): $(SRCS)
	@mkdir -p build
	$(CXX) $(CXXFLAGS) $^ -o $@

# Clean build artifacts
clean:
	rm -rf build/*

.PHONY: all clean
