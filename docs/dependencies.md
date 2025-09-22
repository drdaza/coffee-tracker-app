# i18n Dependencies Documentation

## Core Dependencies

### 1. i18n-js (`^4.4.3`)
**Purpose**: Core internationalization library for JavaScript applications

**Why chosen**:
- ✅ **Expo Compatible**: Official Expo recommendation
- ✅ **Lightweight**: ~2KB gzipped
- ✅ **Feature Complete**: Supports interpolation, pluralization, fallbacks
- ✅ **TypeScript Ready**: Full TypeScript support
- ✅ **Mature**: Battle-tested in production apps

**Key Features**:
- Translation key lookup with dot notation (`t('home.welcome')`)
- String interpolation (`t('greeting', { name: 'John' })`)
- Pluralization support for different languages
- Automatic fallback to default locale
- Nested translation objects

**Bundle Impact**: ~2KB to final app size

---

### 2. expo-localization (`^16.0.4`)
**Purpose**: Access device locale settings and preferences

**Why chosen**:
- ✅ **Native Integration**: Direct access to device locale settings
- ✅ **Cross-platform**: Works on iOS, Android, and Web
- ✅ **Automatic Detection**: No user configuration needed
- ✅ **Expo Optimized**: Built specifically for Expo apps
- ✅ **Rich Locale Data**: Provides language, region, timezone, calendar info

**Key Features**:
- `getLocales()` - Get ordered list of user's preferred languages
- `getCalendars()` - Access calendar preferences
- `getCurrencies()` - Get currency preferences
- `getTimeZone()` - Access timezone information
- `isRTL()` - Detect right-to-left languages

**Bundle Impact**: ~1KB (mostly native code, minimal JS)

---

### 3. zustand (`^5.0.8`)
**Purpose**: Global state management for React applications

**Why chosen over alternatives**:

| Library | Bundle Size | Learning Curve | Performance | TypeScript |
|---------|-------------|----------------|-------------|------------|
| **Zustand** | ~2KB | Minimal | Excellent | Excellent |
| Redux Toolkit | ~12KB | Steep | Good | Good |
| Context API | 0KB | Medium | Poor* | Good |
| Jotai | ~3KB | Medium | Excellent | Excellent |

*Context API causes unnecessary re-renders for complex state

**Key Features**:
- **Minimal Boilerplate**: No providers, actions, or reducers needed
- **TypeScript First**: Built with TypeScript, excellent inference
- **Reactive**: Components automatically re-render on state changes
- **Devtools**: Redux DevTools integration available
- **Immer Integration**: Optional immutable updates
- **Persistence**: Built-in persistence middleware

**Bundle Impact**: ~2KB to final app size

---

## Total Bundle Impact

| Dependency | Size | Purpose |
|------------|------|---------|
| i18n-js | ~2KB | Translation engine |
| expo-localization | ~1KB | Device locale detection |
| zustand | ~2KB | Global state management |
| **Total** | **~5KB** | **Complete i18n solution** |

## Alternative Solutions Considered

### ❌ react-i18next
- **Pros**: Very popular, feature-rich
- **Cons**: Heavy (~15KB), complex setup, React-specific
- **Verdict**: Overkill for mobile apps

### ❌ React Context + useState
- **Pros**: No additional dependencies
- **Cons**: Performance issues, complex state management, no persistence
- **Verdict**: Poor scaling for global translation state

### ❌ Redux Toolkit
- **Pros**: Powerful state management
- **Cons**: Heavy bundle (~12KB), complex setup, steep learning curve
- **Verdict**: Overkill for simple translation state

## Performance Characteristics

### Memory Usage
- **Static Memory**: ~50KB for translation files
- **Runtime Overhead**: Minimal (~1KB state)
- **Per-Component**: No memory overhead

### Runtime Performance
- **Translation Lookup**: O(1) hash table lookup
- **State Updates**: Optimized with Zustand subscriptions
- **Re-renders**: Only affected components re-render
- **First Load**: ~5ms initialization time

### Network Impact
- **Bundle Size**: +5KB to JavaScript bundle
- **Translation Files**: Bundled with app (no network requests)
- **Caching**: Translations cached in memory after first access