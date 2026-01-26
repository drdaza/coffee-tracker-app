# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

React Native coffee tracking app built with Expo Router and TypeScript. Features: coffee CRUD, collections, authentication, i18n (en/es), dark/light themes.

## Commands

```bash
bun start          # Start Expo dev server
bun run ios        # iOS simulator
bun run android    # Android emulator
bun run lint       # ESLint
bun install        # Install deps
bun add <pkg>      # Add package
```

## Directory Structure

```
/api                # Client, services, types, errors
/app                # Expo Router screens
/components         # UI, layout, common, coffee
/constants          # Colors, AuthStatus
/hooks              # Theme, i18n, utils, coffee
/locales            # en.ts, es.ts translations
/stores             # Zustand (auth, coffee, translation)
```

## Detailed Documentation

For in-depth reference, see `.claude/context/`:

| File | Content |
|------|---------|
| `components.md` | All components with props |
| `hooks.md` | All hooks with signatures |
| `stores.md` | Zustand stores state/actions |
| `api.md` | API services, types, enums, errors |
| `routing.md` | Full route structure |
| `theming.md` | Colors, theme patterns |

## Key Patterns

### Price Handling
```typescript
// API stores cents. Display: cents → dollars
const display = `$${(coffee.price / 100).toFixed(2)}`;

// Submit: dollars → cents
const cents = Math.round(dollars * 100);
```

### Permission Check
```typescript
const canModify = coffee.isCreator || user?.role === 'ADMIN';
```

### Theme Colors
```typescript
const bg = useThemeColor({}, 'background');
const text = useThemeColor({}, 'text');
const tint = useThemeColor({}, 'tint');
```

### Screen Layout
```tsx
<ScreenLayout loading={isLoading} error={error} isEmpty={!data.length}>
  {/* content */}
</ScreenLayout>
```

### Store Usage
```typescript
const { coffees, fetchCoffees } = useCoffeeStore();
const { user, authStatus } = useAuthStore();
```

## Development Guidelines

- Use `CustomButton`, `CustomInput` for consistency
- Use `useThemeColor()` - never hardcode colors
- Wrap screens with `ScreenLayout` for loading/error states
- Use store actions for API calls, handle errors in UI
- SVG imports: `import Logo from '@/assets/svgs/logo.svg'`

## Task Tracking

Remaining tasks: `.claude/tasks/p1-coffee-management/`