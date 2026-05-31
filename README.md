# 🛏️ Royale Sleepy — Complete Website

Premium luxury mattress showroom website for **Royale Sleepy**, Berhampur, Odisha.

## Tech Stack
- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, React Router
- **Backend:** Firebase (Auth, Firestore, Storage, Hosting)
- **AI Chatbot:** Google Gemini API

---

## 🚀 Quick Setup Guide

### Step 1 — Install Dependencies

```bash
cd royale-sleepy
npm install
```

### Step 2 — Create Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add Project"** → Name it `royale-sleepy`
3. Enable **Google Analytics** (optional)
4. In your project, go to:
   - **Authentication** → Sign-in method → Enable **Email/Password**
   - **Firestore Database** → Create database → Start in **production mode**
   - **Storage** → Get started
5. Go to **Project Settings** → **Web Apps** → Add app → Copy config

### Step 3 — Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your Firebase config:

```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=royale-sleepy.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=royale-sleepy
VITE_FIREBASE_STORAGE_BUCKET=royale-sleepy.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Optional — for AI Chatbot
VITE_GEMINI_API_KEY=AIzaSy...
```

### Step 4 — Firebase Security Rules

**Firestore Rules** (Firebase Console → Firestore → Rules):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public reads for products, reviews, offers
    match /products/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /reviews/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /offers/{doc} { allow read: if true; allow write: if request.auth != null; }
    // Leads: anyone can create, only admin reads
    match /leads/{doc} { allow create: if true; allow read, update, delete: if request.auth != null; }
  }
}
```

**Storage Rules**:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Step 5 — Create Admin User

In Firebase Console → Authentication → Users → **Add User**:
- Email: `admin@royalesleepy.com` (or your email)
- Password: (set a strong password)

### Step 6 — Update Store Details

Edit `src/utils/constants.js`:

```js
export const STORE_INFO = {
  name: 'Royale Sleepy',
  address: 'Your actual address, Berhampur',
  phone: '+91 XXXXX XXXXX',
  whatsapp: '91XXXXXXXXXX', // country code + number, no +
  email: 'your@email.com',
}
```

Edit `src/utils/whatsapp.js`:
```js
export const WHATSAPP_NUMBER = '91XXXXXXXXXX' // Your WhatsApp number
```

### Step 7 — Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Step 8 — Build for Production

```bash
npm run build
```

---

## 🌐 Deployment

### Option A — Firebase Hosting (Recommended)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Set public directory to: dist
# Configure as single-page app: Yes
npm run build
firebase deploy
```

### Option B — Vercel

1. Push code to GitHub
2. Go to [https://vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add all environment variables from `.env`
5. Deploy

---

## 📱 Admin Dashboard

URL: `yoursite.com/admin`

Features:
- ✅ Product Management (Add/Edit/Delete + image upload)
- ✅ Review Management
- ✅ Customer Leads viewer
- ✅ Offer Popup Settings

---

## 📁 Project Structure

```
royale-sleepy/
├── src/
│   ├── components/
│   │   ├── common/          # Navbar, Footer, WhatsApp, Chatbot, Cards
│   │   ├── home/            # Hero, Featured, WhyUs, Testimonials, Offers
│   │   └── products/        # ProductModal
│   ├── context/             # AuthContext
│   ├── firebase/            # Firebase config
│   ├── hooks/               # useProducts, useReviews
│   ├── pages/               # Home, Mattresses, About, Reviews, Contact, Admin
│   └── utils/               # constants, whatsapp helpers
├── .env.example
├── tailwind.config.js
└── vite.config.js
```

---

## 🎨 Customization

| What | Where |
|------|-------|
| Colors | `tailwind.config.js` → `theme.extend.colors` |
| Fonts | `index.html` → Google Fonts link |
| Store details | `src/utils/constants.js` |
| WhatsApp number | `src/utils/whatsapp.js` |
| Hero image | `src/components/home/HeroSection.jsx` |
| Demo products | `src/utils/constants.js` → `DEMO_PRODUCTS` |

---

## 💡 Features Summary

| Feature | Status |
|---------|--------|
| 6 Pages (Home, Mattresses, About, Reviews, Contact, Admin) | ✅ |
| Luxury animated hero section | ✅ |
| Product grid with search & filter | ✅ |
| Product detail modal | ✅ |
| WhatsApp integration (floating + per product) | ✅ |
| AI Chatbot (Gemini) | ✅ |
| Lead capture popup | ✅ |
| Offer popup (admin-controlled) | ✅ |
| Testimonials slider | ✅ |
| Admin dashboard (products, reviews, leads) | ✅ |
| Firebase auth (admin) | ✅ |
| Firebase image upload | ✅ |
| Mobile responsive | ✅ |
| SEO optimized | ✅ |
| Framer Motion animations | ✅ |

