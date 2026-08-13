# TaskFlow Pro — Modern Firebase Todo List Application

A state-of-the-art Todo application built with React 19, Vite, Tailwind CSS v4, Framer Motion, and Cloud Firebase Firestore backend.

![TaskFlow Pro Banner](client/public/favicon.svg)

---

## Key Features

- **Modern 2026 UI**: Ambient glassmorphism, responsive sidebar, smooth micro-interactions, custom fonts (Inter & Poppins).
- **Firebase Firestore Backend**: Serverless cloud database operations with automatic synchronization.
- **Dark & Light Mode**: Instant theme toggle with `localStorage` preference caching.
- **Drag-and-Drop Reordering**: Interactive 60fps drag reordering powered by Framer Motion.
- **Completion Progress Bar**: Visual completion percentage fill with dynamic motivation badges.
- **Category & Priority Color Tags**: Distinct color coding for categories (`Development`, `Work`, `Personal`, `Design`, `General`) and priorities (`High`, `Medium`, `Low`).
- **Real-Time Toast Alerts**: Success and error notifications using `react-hot-toast`.
- **Skeleton Loaders & Custom Delete Modal**: Glassmorphism skeleton pulse loading and custom confirmation dialogs.
- **Keyboard Accessibility**: `Enter` to submit forms, `Esc` to close modal dialogs.
- **Production Ready**: Full environment variable support and automated build scripts.

---

## Directory Architecture

```
TODO list app/
├── client/                     # React + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/         # Navbar, Sidebar, TodoList, TodoCard, Modals, Progress Bar
│   │   ├── context/            # ThemeContext (Dark / Light mode)
│   │   ├── firebase/           # Firebase initialization & Firestore config
│   │   ├── hooks/useTodos.js   # Custom hook for state & toast feedback
│   │   └── services/           # Firestore service CRUD layer
│   ├── .env                    # Firebase Environment variables
│   ├── .env.example            # Firebase Environment template
│   ├── index.html              # HTML entry shell & fonts
│   ├── package.json
│   └── vite.config.js
├── package.json                # Root package with client scripts
├── run_app.bat                 # 1-Click Windows Batch launcher
├── run_app.ps1                 # 1-Click PowerShell launcher
├── deployment.md               # Cloud deployment guide (Vercel & Firebase)
└── README.md                   # Project documentation
```

---

## Environment Variables

### Client (`client/.env`)
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## Quick Start (Local Development)

### Option A: 1-Click Launcher (Windows)
Double click `run_app.bat` or run:
```powershell
.\run_app.ps1
```

### Option B: Manual Command Line

1. **Install & Start Application**:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   *Runs on `http://localhost:3000`*

---

## Production Build

To build the client application for production:
```bash
npm run build
```
