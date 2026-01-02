<div align="center">
  <h1>🔥 LitCode</h1>
  <p>A modern Q&A platform for developers to ask questions, share knowledge, and build reputation</p>
  
  ![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)
  ![React](https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Routes](#-api-routes)
- [Environment Variables](#-environment-variables)
- [Styling & Components](#-styling--components)
- [State Management](#-state-management)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**LitCode** is a Stack Overflow-inspired Q&A platform built with cutting-edge technologies, designed for developers who want to learn, share, and grow together. The platform features a modern, glassmorphic UI with smooth animations and a premium dark theme.

### Why LitCode?

- 💬 **Ask Questions** - Get expert answers to your programming challenges
- 💡 **Share Knowledge** - Help others by answering their questions
- 🏆 **Build Reputation** - Earn recognition for your contributions
- 👥 **Join Community** - Connect with developers worldwide

---

## ✨ Features

### Core Functionality

- **Question Management**
  - Ask, edit, and delete questions
  - Rich markdown editor for formatted content
  - Tag-based categorization
  - Vote system (upvote/downvote)
  
- **Answer System**
  - Post detailed answers with markdown support
  - Community voting on answers
  - Accept best answers
  - Track answer history

- **User Profiles**
  - Customizable user profiles
  - Reputation tracking
  - Activity feed (questions, answers, votes)
  - Edit profile capabilities

- **Authentication & Authorization**
  - Secure user registration and login
  - Session management with Appwrite
  - Protected routes and middleware
  - Role-based access control

- **Search & Discovery**
  - Tag-based filtering
  - Question search
  - Browse by latest/popular
  - Top contributors leaderboard

### UI/UX Highlights

- 🎨 Modern glassmorphic design
- 🌙 Premium dark theme
- ✨ Smooth micro-animations
- 📱 Fully responsive layout
- 🎉 Interactive confetti effects
- 🔥 Gradient accents and icons

---

## 🛠 Tech Stack

### Frontend

- **Framework:** [Next.js 16.1](https://nextjs.org) (App Router)
- **UI Library:** [React 19.1](https://react.dev)
- **Language:** [TypeScript 5.x](https://www.typescriptlang.org)
- **Styling:** [Tailwind CSS 4.0](https://tailwindcss.com)
- **Icons:** [@tabler/icons-react](https://tabler-icons.io)
- **Animations:** [Motion](https://motion.dev)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs)

### Backend & Services

- **Backend as a Service:** [Appwrite](https://appwrite.io)
  - Authentication
  - Database
  - Storage
  - Server-side SDK (Node Appwrite)

### UI Components

- **Radix UI:** Accessible component primitives
  - `@radix-ui/react-label`
  - `@radix-ui/react-slot`
- **shadcn/ui:** Pre-built components with Tailwind
- **Markdown Editor:** `@uiw/react-md-editor`
- **Confetti:** `canvas-confetti`

### Development Tools

- **Package Manager:** npm
- **Code Quality:** ESLint
- **CSS Processing:** PostCSS
- **Type Safety:** TypeScript strict mode
- **Hot Reload:** Turbopack (Next.js dev mode)

---

## 🏗 Architecture

### Application Structure

LitCode follows the Next.js App Router architecture with a feature-based folder structure:

```
src/
├── app/              # App Router pages and layouts
│   ├── (auth)/       # Authentication routes (grouped)
│   ├── api/          # API route handlers
│   ├── questions/    # Question-related pages
│   ├── tags/         # Tag browsing
│   └── users/        # User profile pages
├── components/       # Reusable UI components
├── lib/              # Utility functions and configs
├── models/           # Appwrite database models
├── store/            # Zustand state stores
└── utils/            # Helper functions
```

### Key Design Patterns

- **Server Components by Default:** Optimized performance
- **Client Components:** Interactive UI with `'use client'`
- **API Routes:** RESTful endpoints in `/api`
- **Middleware:** Authentication and route protection
- **State Management:** Zustand for client-side state
- **Type Safety:** Full TypeScript coverage

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** 20.x or higher
- **npm:** 10.x or higher
- **Appwrite Instance:** Cloud or self-hosted

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/litcode.git
cd litcode
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_API_KEY=your_api_key

# Database IDs
NEXT_PUBLIC_DATABASE_ID=your_database_id
NEXT_PUBLIC_USERS_COLLECTION_ID=your_users_collection_id
NEXT_PUBLIC_QUESTIONS_COLLECTION_ID=your_questions_collection_id
NEXT_PUBLIC_ANSWERS_COLLECTION_ID=your_answers_collection_id

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Run the development server**

```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

---

## 📁 Project Structure

```
litcode/
│
├── .next/                    # Next.js build output
├── node_modules/             # Dependencies
├── public/                   # Static assets
│   ├── images/
│   └── favicon.ico
│
├── src/
│   ├── app/
│   │   ├── (auth)/           # Auth group routes
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── api/              # API endpoints
│   │   ├── components/       # App-specific components
│   │   ├── questions/        # Question pages
│   │   ├── tags/             # Tag pages
│   │   ├── users/            # User profile pages
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   │
│   ├── components/           # Shared components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   │
│   ├── lib/                  # Libraries and configs
│   │   └── utils.ts          # Utility functions
│   │
│   ├── models/               # Appwrite models
│   │   ├── user.model.ts
│   │   ├── question.model.ts
│   │   └── answer.model.ts
│   │
│   ├── store/                # Zustand stores
│   │   └── authStore.ts
│   │
│   ├── utils/                # Helper functions
│   │   └── validators.ts
│   │
│   └── middleware.ts         # Next.js middleware
│
├── .env                      # Environment variables
├── .gitignore
├── components.json           # shadcn/ui config
├── eslint.config.mjs         # ESLint config
├── next.config.ts            # Next.js config
├── package.json
├── postcss.config.mjs        # PostCSS config
├── README.md
├── tailwind.config.js        # Tailwind config
└── tsconfig.json             # TypeScript config
```

---

## 🔌 API Routes

LitCode uses Next.js API Routes for server-side logic:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User authentication |
| `/api/auth/register` | POST | New user registration |
| `/api/questions` | GET | Fetch questions list |
| `/api/questions` | POST | Create new question |
| `/api/questions/[id]` | GET | Get question details |
| `/api/questions/[id]` | PATCH | Update question |
| `/api/questions/[id]` | DELETE | Delete question |
| `/api/answers` | POST | Submit answer |
| `/api/users/[id]` | GET | Get user profile |
| `/api/votes` | POST | Vote on question/answer |

All API routes are located in `src/app/api/`

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_APPWRITE_PROJECT_ID` | Appwrite project ID | ✅ |
| `NEXT_PUBLIC_APPWRITE_ENDPOINT` | Appwrite API endpoint | ✅ |
| `APPWRITE_API_KEY` | Appwrite server API key | ✅ |
| `NEXT_PUBLIC_DATABASE_ID` | Appwrite database ID | ✅ |
| `NEXT_PUBLIC_USERS_COLLECTION_ID` | Users collection ID | ✅ |
| `NEXT_PUBLIC_QUESTIONS_COLLECTION_ID` | Questions collection ID | ✅ |
| `NEXT_PUBLIC_ANSWERS_COLLECTION_ID` | Answers collection ID | ✅ |
| `NEXT_PUBLIC_APP_URL` | Base application URL | ⚪ |

---

## 🎨 Styling & Components

### Tailwind CSS 4.0

LitCode uses the latest Tailwind CSS with custom configurations:

- **Custom Colors:** Brand gradients (orange-pink, blue-cyan, purple-pink)
- **Glassmorphism:** Border overlays with backdrop blur
- **Dark Theme:** Premium dark mode design
- **Animations:** Custom transitions and hover effects

### Component Library

- **shadcn/ui:** Pre-styled, accessible components
- **Radix UI:** Headless UI primitives
- **Custom Components:** Built with Tailwind utility classes

### Typography

- Gradient text effects
- Responsive font sizes
- Optimized font loading with `next/font`

---

## 🗄 State Management

### Zustand Store

LitCode uses Zustand for lightweight, performant state management:

```typescript
// Example: Auth Store
import { create } from 'zustand'

interface AuthState {
  user: User | null
  setUser: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}))
```

### Immutable Updates

Using `immer` for clean, immutable state updates.

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/litcode)

1. **Connect your repository** to Vercel
2. **Add environment variables** in Vercel dashboard
3. **Deploy** - Vercel will auto-detect Next.js

### Other Platforms

LitCode can be deployed to any platform supporting Next.js:

- **Netlify**
- **Railway**
- **Render**
- **AWS Amplify**
- **DigitalOcean App Platform**

### Build Command

```bash
npm run build
```

### Start Command

```bash
npm start
```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### 1. Fork the Repository

Click the "Fork" button at the top right of this page.

### 2. Clone Your Fork

```bash
git clone https://github.com/yourusername/litcode.git
cd litcode
```

### 3. Create a Feature Branch

```bash
git checkout -b feature/amazing-feature
```

### 4. Make Your Changes

- Follow existing code style
- Write TypeScript with strict typing
- Use Tailwind for styling
- Add comments for complex logic

### 5. Commit Your Changes

```bash
git add .
git commit -m "feat: add amazing feature"
```

**Commit Message Convention:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test updates
- `chore:` Build/config changes

### 6. Push to Your Fork

```bash
git push origin feature/amazing-feature
```

### 7. Create a Pull Request

Go to the original repository and click "New Pull Request"

---

## 📝 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 LitCode

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">
  <p>Made with ❤️ by the LitCode Team</p>
  <p>
    <a href="https://github.com/yourusername/litcode">⭐ Star us on GitHub</a> •
    <a href="https://github.com/yourusername/litcode/issues">🐛 Report Bug</a> •
    <a href="https://github.com/yourusername/litcode/issues">✨ Request Feature</a>
  </p>
</div>
