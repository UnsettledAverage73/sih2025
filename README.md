# Secure Eraser Desktop Application

## Overview

Secure Eraser is a cross-platform desktop application built with Tauri, Next.js, and Rust, designed to provide a secure and intuitive way to erase data from various storage devices. The application features a user-friendly interface with both "Easy Mode" (wizard-driven) for general users and "Pro Mode" (dashboard-driven) for IT administrators requiring advanced functionalities like detailed logs and multiple wipe methods.

## Features

*   **Cross-Platform**: Built with Tauri for Windows, macOS, and Linux compatibility.
*   **Intuitive UI/UX**: Designed with a clean, modern interface using TailwindCSS and shadcn/ui.
*   **Welcome / Home Screen**: Guides users with a clear call to action and a toggle for Easy/Pro modes.
*   **Device Selection**: Lists detected storage devices (SSD, HDD, USB, Partitions) with essential details for selection.
*   **Wipe Method Selection**: Offers various secure wiping standards (Quick Wipe, NIST 800-88, DoD 5220.22-M) with informative tooltips.
*   **Confirmation Dialog**: A crucial step to prevent accidental data loss, summarizing the chosen device and method.
*   **Real-time Wipe Progress**: Displays a progress bar, estimated time, and real-time logs for technical users.
*   **Wipe Completion Summary**: Provides a clear success indication, wipe details, and options to download a verifiable certificate (PDF/JSON).
*   **Certificate Viewer**: A dedicated section to view and manage records of past wipe operations, with search and export capabilities.
*   **Settings Page**: Allows users to configure application preferences, including theme (dark/light) and notifications.
*   **Strongly Typed**: Entire codebase in TypeScript and Rust for enhanced reliability and maintainability.

## Tech Stack

*   **Desktop Shell**: Tauri (v2.x)
*   **Frontend Framework**: Next.js (v14.x) with React (v18.x)
*   **Language**: TypeScript (Frontend) & Rust (Tauri Backend)
*   **Styling**: TailwindCSS (v3.x) & shadcn/ui
*   **Backend Logic (Go)**: Placeholder for secure wiping logic (e.g., `wipe_tool` Go backend, mocked in frontend for now).
*   **Build Tool**: Next.js Static Export
*   **Code Quality**: ESLint, Prettier
*   **Testing**: Vitest (for frontend unit tests)
*   **Routing**: Next.js App Router

## Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/en/download/) (LTS version recommended)
*   [npm](https://www.npmjs.com/get-npm) (comes with Node.js)
*   [Rust](https://www.rust-lang.org/tools/install) (follow the `rustup` installation instructions)
*   [Tauri CLI](https://tauri.app/v1/guides/getting-started/prerequisites#install-tauri-cli):
    ```bash
    cargo install tauri-cli --version "^2.0.0-beta"
    ```

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd sih2025
    ```

2.  **Install frontend dependencies:**
    Navigate to the `ui` directory and install the Node.js dependencies:
    ```bash
    cd ui
    npm install
    cd .. # Go back to the project root
    ```

3.  **Install Rust dependencies:**
    Rust dependencies will be installed automatically by Tauri CLI when you run the application for the first time.

## Running the Application

To run the application in development mode, execute the following command from the **project root directory**:

```bash
tauri dev
```
if error found related to like Module not found: Can't resolve '@radix-ui/react-dropdown-menu' then do changes in ui/ 

npm install @radix-ui/react-dropdown-menu

This command will:

1.  Start the Next.js development server for the frontend.
2.  Compile and run the Tauri backend application.
3.  Open the desktop application window.

## Project Structure

The project follows a clear and scalable structure:

```
/sih2025
├── cmd/                  # Go backend commands
├── pkg/                  # Go shared packages (e.g., logging)
├── src-tauri/            # Tauri Rust backend source code
│   ├── src/
│   └── tauri.conf.json   # Tauri configuration
├── ui/                   # Frontend application (Next.js, React, TypeScript)
│   ├── public/
│   ├── src/
│   │   ├── app/          # Next.js App Router pages (welcome, dashboard, erase, etc.)
│   │   ├── components/   # Reusable React components
│   │   │   └── ui/       # shadcn/ui components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions (e.g., `cn` for Tailwind class merging)
│   │   └── tauri/        # Tauri-specific frontend utilities/bindings
│   ├── .eslintrc.cjs
│   ├── next.config.mjs
│   ├── package.json
│   ├── postcss.config.cjs
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── .gitignore
├── go.mod
├── go.sum
├── Makefile
└── README.md             # This file
```

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'feat: Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

## License

This project is licensed under the MIT License.
