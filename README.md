# Coffee Tracker App ☕

A React Native mobile application for tracking your coffee consumption and brewing habits. Built with Expo Router, TypeScript, and a coffee-themed design system.

## Tech Stack

- **Framework:** Expo SDK (with Expo Router for navigation)
- **Language:** TypeScript
- **State Management:** Zustand
- **API Client:** Axios with automatic token refresh
- **Internationalization:** i18n-js with expo-localization
- **Secure Storage:** expo-secure-store
- **Styling:** React Native (with custom theming system)
- **Package Manager:** Bun

## Prerequisites

- [Bun](https://bun.sh/) installed
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator (macOS) or Android Emulator
- Backend API running (see backend repository)

## Installation

1. Clone the repository

2. Install dependencies

   ```bash
   bun install
   ```

3. Set up environment variables

   Copy the `.env.template` file to `.env` and update with your values:

   ```bash
   cp .env.template .env
   ```

   Update the values in `.env`:

   ```bash
   EXPO_PUBLIC_STAGE=dev
   EXPO_PUBLIC_API_URL=http://192.168.x.xx:3000/api
   EXPO_PUBLIC_API_URL_ANDROID=http://192.168.x.xx:3000/api
   EXPO_PUBLIC_API_URL_IOS=http://localhost:3000/api
   ```

   **Note:** Replace `192.168.x.xx` with your computer's local IP address.

## Running the App

1. Start the development server

   ```bash
   bun start
   ```

   Or:

   ```bash
   bunx expo start
   ```

2. Run on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

## Project Structure

```
coffee-tracker-app/
├── api/                    # API layer (axios, auth, token storage)
├── app/                    # Expo Router file-based routing
│   ├── (core-app)/        # Main app screens
│   ├── auth/              # Authentication screens (login/register)
│   └── _layout.tsx        # Root layout
├── assets/                # Images, fonts, SVGs
├── components/            # Reusable UI components
├── constants/             # App constants (colors, etc.)
├── hooks/                 # Custom React hooks
├── locales/               # i18n translations
├── stores/                # Zustand state management
└── .env                   # Environment variables (not committed)
```

## Features

- ✅ User authentication (login/register/logout)
- ✅ Automatic token refresh on 401
- ✅ Secure token storage
- ✅ Multi-language support (i18n)
- ✅ Light/Dark theme
- ✅ Coffee-themed design system
- ✅ Platform-specific API URLs

## Development

For detailed development guidelines and architecture patterns, see [CLAUDE.md](./CLAUDE.md).

## Environment Variables

| Variable                      | Description              | Example                        |
| ----------------------------- | ------------------------ | ------------------------------ |
| `EXPO_PUBLIC_STAGE`           | Environment stage        | `dev` / `prod`                 |
| `EXPO_PUBLIC_API_URL`         | Default API URL          | `http://192.168.1.24:3000/api` |
| `EXPO_PUBLIC_API_URL_ANDROID` | Android-specific API URL | `http://192.168.1.24:3000/api` |
| `EXPO_PUBLIC_API_URL_IOS`     | iOS-specific API URL     | `http://localhost:3000/api`    |

## Scripts

```bash
bun start              # Start Expo dev server
bun run android        # Run on Android
bun run ios            # Run on iOS
bun run web            # Run on web
bun run lint           # Run ESLint
bun run reset-project  # Reset to blank project
```

## Backend

This app requires a backend API. Make sure your backend server is running and accessible at the URL specified in your `.env` file.

Default backend endpoints:

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`
- `GET /api/auth/check-token`

## Troubleshooting

**"Unable to resolve axios"**

```bash
rm -rf .expo node_modules
bun install
bunx expo start --clear
```

**Network error / Cannot connect to API**

- Verify backend is running
- Check your local IP in `.env` matches your computer's IP
- Ensure device/emulator is on the same network

**iOS can use localhost, Android cannot**

- This is expected behavior
- Android uses your local IP (e.g., `192.168.1.24`)
- iOS Simulator can use `localhost`
