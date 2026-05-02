# Converting HTML/CSS/JavaScript Apps

Use this template as the monetized native shell. Each app should be converted into React Native components, then imported from `src/apps/NativeAppScreen.tsx`.

## Mapping

| Web app piece | React Native equivalent |
| --- | --- |
| `div`, `main`, `section` | `View` |
| `h1`, `p`, `span`, labels | `Text` |
| `button` | `Pressable` or `TouchableOpacity` |
| `input`, `select`, `textarea` | `TextInput`, picker library, custom controls |
| CSS classes | `StyleSheet.create` objects |
| CSS flexbox | React Native flexbox, mostly the same but column is default |
| DOM events | component props like `onPress`, `onChangeText`, `onLayout` |
| `localStorage` | `@react-native-async-storage/async-storage` |
| `window`, `document`, DOM queries | React state, refs, and props |
| Canvas apps | `react-native-svg`, `react-native-skia`, or `expo-gl` depending on complexity |

## Recommended Structure

```text
src/apps/
  NativeAppScreen.tsx
  components/
  hooks/
  logic/
  storage/
```

Keep pure JavaScript calculation code in `logic/` when possible. Convert only the DOM and styling layer to native components.

## Conversion Steps

1. Identify the app state that was stored in DOM nodes or globals.
2. Move that state into React `useState`, `useReducer`, or a small custom hook.
3. Convert HTML tags to React Native components.
4. Convert CSS to `StyleSheet.create`.
5. Replace browser storage and browser APIs.
6. Test on a real Android device or emulator.
7. Keep ads outside the app screen so they remain consistent across every converted app.

The ad purchase state is already global, so converted apps do not need to know about ads unless a specific screen needs extra spacing or a custom monetization moment.

## App Assets

When converting a new HTML app, also update the app identity and asset files so the native build does not keep the template branding.

- Update `.env` values such as `EXPO_PUBLIC_APP_NAME`, `EXPO_PUBLIC_APP_SLUG`, and `EXPO_PUBLIC_ANDROID_PACKAGE`.
- If the project already has an `android/` directory, update its native identity as well. EAS may build the native project directly, so `app.config.ts` alone is not enough:
  - `android/app/build.gradle`: `namespace` and `defaultConfig.applicationId`
  - `android/app/src/main/java/<package path>/MainActivity.kt`
  - `android/app/src/main/java/<package path>/MainApplication.kt`
  - `android/app/src/main/res/values/strings.xml`
  - `android/settings.gradle`
  - `android/app/src/main/AndroidManifest.xml` dev-client scheme, if present
- Add or replace app artwork in an `assets/` folder, including the launcher icon, Android adaptive icon foreground, splash/background artwork if used, and any in-app images required by the converted screen.
- Wire new app-level assets into `app.config.ts` with Expo config fields such as `icon`, `android.adaptiveIcon.foregroundImage`, `android.adaptiveIcon.backgroundColor`, and `splash` when those assets are present.
- Keep generated source images outside build-only folders, and commit the final optimized PNG/WebP files that the app imports.
- After changing app icons or splash assets, rebuild the native app. Expo config asset changes are not always fully reflected by a JavaScript reload.

## AI Conversion Prompt

Use this prompt with the single-file HTML/CSS/JavaScript app as input. Paste the prompt first, then paste the full source file.

```text
You are converting a standalone single-file HTML/CSS/JavaScript app into a native Expo React Native app screen.

Target project:
- Expo Android React Native app
- No WebView
- No browser DOM APIs
- No direct use of window, document, querySelector, addEventListener, localStorage, sessionStorage, alert, prompt, confirm, or inline HTML
- The monetization shell already exists outside this screen, so do not add ads, purchase buttons, or billing logic
- The output should replace or be imported by src/apps/NativeAppScreen.tsx

Input:
- I will provide one complete HTML file that may contain <style> and <script> tags.
- Convert the app behavior, state, styling, and layout into native React Native code.

Requirements:
1. Create a React Native TypeScript component named NativeAppScreen.
2. Use React Native primitives: View, Text, Pressable, ScrollView, TextInput, Switch, Modal, FlatList, Image, and StyleSheet as appropriate.
3. Convert DOM-driven state into React state using useState, useMemo, useCallback, useEffect, or useReducer.
4. Convert CSS into StyleSheet.create.
5. Preserve the original app's user-facing functionality and main visual hierarchy.
6. Make the UI responsive on Android phones, including small screens.
7. Keep touch targets at least 44px high where practical.
8. Use @expo/vector-icons if icons improve clarity, but do not add a new icon library.
9. Use @react-native-async-storage/async-storage for persistent state if the original uses localStorage.
10. Replace browser alerts/prompts/confirms with native React Native UI such as Modal, inline messages, or Alert from react-native when appropriate.
11. If the original app uses canvas, SVG, audio, drag-and-drop, file APIs, downloads, clipboard, or other browser-specific features, explain the best React Native replacement and implement a practical native version when possible.
12. Keep pure calculation/business logic separate from rendering when that makes the conversion easier to maintain.
13. Do not create a landing page or marketing page. Build the actual app screen.
14. Do not include WebView, react-native-webview, dangerouslySetInnerHTML, generated HTML strings, or a wrapper around the original file.
15. Do not add ads or purchase code; the template already handles that globally.

Design guidance:
- Match the original app's intent, but make it feel like a polished native mobile app.
- Avoid oversized hero sections unless the original app truly needs one.
- Avoid nested cards and excessive decoration.
- Prefer clear controls: Pressable buttons, Switch for binary settings, TextInput for text/number entry, FlatList for repeated rows, Modal for focused dialogs.
- Ensure text does not overlap, overflow buttons, or depend on viewport-width font sizing.

Output format:
1. Briefly summarize any browser-specific features you replaced.
2. Provide the complete contents for src/apps/NativeAppScreen.tsx in a TypeScript code block.
3. If additional helper files are genuinely needed, provide their paths and complete contents.
4. List any package dependencies required. Prefer packages already installed in the template.
5. List manual testing steps for Android.

Now convert the following single-file HTML/CSS/JavaScript app:
```

## AI Asset Generation Prompt

Use this prompt when you need a downloadable asset pack for the converted app. Paste the prompt first, then describe the app's purpose, visual style, target audience, and any required colors or motifs.

```text
You are creating production-ready visual assets for an Expo Android React Native app converted from a standalone HTML/CSS/JavaScript app.

Goal:
- Generate a cohesive downloadable asset pack that replaces template branding.
- The assets should feel native, polished, and specific to the app's actual purpose.
- Avoid generic stock-app artwork, tiny unreadable text, and designs that only work on one background color.

Required files:
1. assets/icon.png
   - 1024x1024 PNG
   - Full app launcher icon
   - No transparent outer padding unless the concept requires it
2. assets/adaptive-icon-foreground.png
   - 1024x1024 PNG with transparent background
   - Main symbol centered with safe padding for Android adaptive icon masking
3. assets/splash.png
   - 2048x2048 PNG
   - Centered mark or simple brand artwork suitable for a splash screen
4. assets/feature-graphic.png
   - 1024x500 PNG
   - Store/listing-style promotional graphic without tiny body text
5. Any in-app image assets needed by the converted React Native screen
   - Use clear filenames under assets/app/
   - Prefer PNG for UI art and WebP/JPEG for photo-like images

Design constraints:
- Use a clear, recognizable shape at small launcher-icon sizes.
- Keep text out of the icon unless it is a short brand initial or symbol.
- Make the adaptive icon foreground work on a configurable solid background color.
- Include the recommended adaptive icon background color as a hex value.
- Make the splash artwork simple enough to look good on small Android screens.
- Use a visual style that matches the app, not the template.

Output format:
1. Provide a zip file or downloadable files with the exact filenames above.
2. Provide a short manifest listing each file, dimensions, format, and intended use.
3. Provide the recommended `app.config.ts` asset configuration snippet.
4. If any assets are meant to be imported by `src/apps/NativeAppScreen.tsx`, list the import paths.

App description:
```
