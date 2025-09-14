# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native coffee tracking application built with Expo Router, using TypeScript and file-based routing. The app follows a coffee-themed color scheme with light and dark mode support.

## Development Commands

### Essential Commands
- `bun start` or `bunx expo start` - Start the Expo development server
- `bun run android` - Start on Android emulator
- `bun run ios` - Start on iOS simulator
- `bun run web` - Start web version
- `bun run lint` - Run ESLint checks
- `bun run reset-project` - Reset to a blank project (moves current code to app-example/)

### Package Management
This project uses Bun as the package manager. Use `bun install` to install dependencies and `bun add <package>` to add new packages.

## Architecture

### Routing Structure
The app uses Expo Router with a nested route structure:
- Root layout: `app/_layout.tsx` (handles theming, fonts, status bar)
- Core app: `app/(core-app)/_layout.tsx` (main app navigation)
- Home screen: `app/(core-app)/(home)/index.tsx` (current main screen)

### Component Architecture
- **Custom Components**: Located in `/components/`
  - `CustomButton.tsx` - Reusable button with types (base, delete, action) and sizes (small, medium, large, full)
  - `CustomInput.tsx` - Input component with theming support
  - `ThemedText.tsx` - Text component with automatic theme support

### Theming System
- **Colors**: Defined in `constants/Colors.ts` with coffee-themed palette
  - Light theme: cream backgrounds (#f0e2cd), coffee brown tint (#725437)
  - Dark theme: espresso black background (#0c0907), latte brown tint (#c19a6b)
- **Hooks**:
  - `useThemeColor()` - Get theme-appropriate colors
  - `useColorScheme()` - Detect system color scheme (with web fallback)

### Asset Handling
- **SVG Support**: Metro config includes react-native-svg-transformer for SVG imports
- **Fonts**: SpaceMono font loaded via expo-font
- **Icons/Images**: Located in `/assets/` with adaptive icons for Android

## Configuration

### Expo Configuration
- **App Scheme**: `coffetrackerapp://`
- **New Architecture**: Enabled (`newArchEnabled: true`)
- **Typed Routes**: Enabled for better TypeScript support
- **Orientation**: Portrait only
- **Edge-to-Edge**: Enabled for Android

### Key Dependencies
- **Navigation**: React Navigation with Expo Router
- **Animation**: react-native-reanimated
- **Gestures**: react-native-gesture-handler
- **SVG**: react-native-svg with transformer
- **Web**: react-native-web support included

## Development Guidelines

### Component Patterns
- Use the existing `CustomButton` and `CustomInput` components for consistency
- Follow the established theming system using `useThemeColor()` hook
- Import SVGs directly as components (e.g., `import Logo from '@/assets/svgs/logo.svg'`)

### Styling Conventions
- Coffee-themed color palette is established - use colors from `constants/Colors.ts`
- Support both light and dark themes
- Use consistent sizing patterns (small/medium/large/full for components)

### File Structure
- Components go in `/components/`
- Constants (colors, etc.) in `/constants/`
- Hooks in `/hooks/`
- App screens in `/app/` following Expo Router file-based routing
- Assets in `/assets/` with organized subdirectories

## Testing & Quality

Currently no test framework is configured. The project uses:
- ESLint with Expo configuration for code quality
- TypeScript for type checking