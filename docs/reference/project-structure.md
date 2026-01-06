# Project Structure

This document provides a high-level overview of the **Control Markets** project organization.

## 📂 Root Directory Structure

- **`.angular/`**: Angular build cache and local development configuration.
- **`.storybook/`**: Storybook configuration files.
- **`.vscode/`**: Visual Studio Code workspace settings and recommended extensions.
- **`android/`**: Android-specific files for Capacitor deployment.
- **`docs/`**: Project documentation (Markdown files).
  - **`concepts/`**: High-level architecture and design principles.
  - **`how-to/`**: Practical, step-by-step instructions.
  - **`plans/`**: Design documents and future implementation strategies.
  - **`reference/`**: Technical facts, specifications, and API-level details.
- **`ios/`**: iOS-specific files for Capacitor deployment.
- **`node_modules/`**: Project dependencies (managed by pnpm).
- **`public/`**: Static assets served at the root (config files, icons, etc.).
- **`scripts/`**: Utility scripts for build and automation tasks.
- **`src/`**: Main source code of the Angular application.
  - **`app/`**: Application logic, components, services, and modules.
  - **`assets/`**: Static assets for the application.
  - **`environments/`**: Environment-specific configuration files.
  - **`theme/`**: Global styles and theme variables.

## 📄 Key Configuration Files

- **`angular.json`**: Angular CLI configuration, including build targets and assets.
- **`capacitor.config.ts`**: Configuration for Capacitor (native mobile bridge).
- **`firebase.json`**: Firebase Hosting and Functions configuration.
- **`ionic.config.json`**: Ionic CLI configuration.
- **`package.json`**: Project metadata, dependencies, and npm scripts.
- **`tsconfig.json`**: TypeScript compiler configuration.
- **`readme.md`**: Main project entry point and quick start guide.

## 🛠️ Tooling & Infrastructure

- **Angular 21**: Core frontend framework.
- **Ionic**: UI component library and mobile integration.
- **Firebase**: Backend services (Auth, Firestore, Hosting).
- **Ngx-Markdown**: Used for rendering these documentation files within the app.
- **Storybook**: Component development and documentation environment.
- **Capacitor**: Cross-platform bridge for iOS and Android.
