# OpenFresher Native Android App 📱

A modern, high-performance Native Android Application built for **OpenFresher** ([openfresher.com](https://www.openfresher.com)).

## 🌟 Key Features

1. **Direct Native HTML Post Reader**:
   - Blog posts are fetched directly via Blogger RSS JSON feed and rendered using native mobile containers (without any external browser frames).
   - Instant loading, responsive layout, dark theme, and formatted typography.

2. **Verified Recruitment & Apply Now Actions**:
   - Prominent **Apply Now** button directing users to official recruitment career portals.
   - Native Share options for WhatsApp, Telegram, and system sharing.

3. **Job Alert Categories & Live Search**:
   - Filter jobs by *Freshers Jobs*, *MNC Jobs*, *Software Engineer*, *Engineering Jobs*, *Remote Jobs*, and *Internships*.
   - Fast keyword search across titles and categories.

4. **Offline Bookmarks**:
   - Save favorite job postings to local storage for offline reading anytime.

5. **Future-Proof Rewarded Ad Lock Architecture**:
   - Includes `src/services/adAccessStore.js` for a 4-hour Rewarded Ad access timer system (ready to turn ON after receiving AdMob approval).

6. **AdSense Safety Filter**:
   - Web AdSense tags automatically stripped from Blogger HTML content to keep your website's AdSense account safe.

---

## 🛠️ Folder Structure

```
blogger_android_app/
├── src/
│   ├── components/
│   │   ├── Header.jsx           # App top bar & branding
│   │   ├── CategoryChips.jsx    # Category filters
│   │   ├── JobCard.jsx          # Job alert feed card
│   │   ├── JobDetailModal.jsx   # Direct HTML Post Reader
│   │   ├── SearchModal.jsx      # Instant job search
│   │   ├── BookmarksView.jsx    # Saved jobs screen
│   │   └── BottomNav.jsx        # Mobile bottom tab navigation
│   ├── services/
│   │   ├── bloggerApi.js        # openfresher.com feed parser & bookmarks
│   │   └── adAccessStore.js     # 4-hour access state manager
│   ├── utils/
│   │   └── cleanAdSense.js      # AdSense HTML sanitizer
│   ├── App.jsx                  # Main app controller
│   ├── index.css                # Glassmorphism & post typography styles
│   └── main.jsx
├── capacitor.config.json        # Capacitor Android package setup
├── index.html
├── package.json
└── vite.config.js
```

---

## 🚀 Running & Building

### 1. Run Development Server
```bash
npm run dev
```

### 2. Build Production Web Bundle
```bash
npm run build
```

### 3. Add & Build Native Android APK
```bash
npx cap add android
npx cap sync android
cd android
./gradlew assembleDebug
```
The compiled debug `.apk` will be generated inside `android/app/build/outputs/apk/debug/app-debug.apk`.
