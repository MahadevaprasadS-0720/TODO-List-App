# TaskFlow Pro — Deployment Guide (Firebase + Vercel)

This guide covers step-by-step instructions for setting up Firebase Firestore database and deploying the React frontend application.

## Cloud Architecture

| Layer | Provider | Free Tier Available? | URL Example |
| :--- | :--- | :--- | :--- |
| **Frontend (React + Vite)** | **Vercel** or **Netlify** | ✅ Yes | `https://taskflow-app.vercel.app` |
| **Backend & Database** | **Google Firebase Firestore** | ✅ Yes (Spark Plan) | Firestore Database |

---

## Step 1: Firebase Project Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and give your project a name (e.g., `TaskFlow-Todo-App`).
3. Click **Create Project**.
4. In project settings, add a Web App (`</>`).
5. Copy your Firebase Configuration Keys:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

---

## Step 2: Enable Cloud Firestore Database

1. In the left navigation bar of Firebase Console, click **Build** -> **Firestore Database**.
2. Click **Create Database**.
3. Choose your database location.
4. Start in **Production mode** or **Test mode**.
5. Under Security Rules, ensure read/write access for your tasks collection:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /todos/{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

---

## Step 3: Deploy Frontend Client (Vercel)

1. Sign up / log in to [Vercel](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository (`TODO-List-App`).
4. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add **Environment Variables**:
   - `VITE_FIREBASE_API_KEY`: *Your API Key*
   - `VITE_FIREBASE_AUTH_DOMAIN`: *Your Auth Domain*
   - `VITE_FIREBASE_PROJECT_ID`: *Your Project ID*
   - `VITE_FIREBASE_STORAGE_BUCKET`: *Your Storage Bucket*
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`: *Your Sender ID*
   - `VITE_FIREBASE_APP_ID`: *Your App ID*
6. Click **Deploy**. Vercel will build and deploy your React app.
