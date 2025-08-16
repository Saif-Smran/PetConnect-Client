# 🐾 PetConnect – Pet Adoption & Care Platform

Comprehensive web application for discovering, adopting, and supporting pets through structured donation campaigns. Built with modern React (v19), React Router v7, Tailwind CSS v4, Firebase Auth, and Stripe.

<p align="center">
  <a href="#-tech-stack"><img alt="Tech" src="https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white" /></a>
  <a href="#-tech-stack"><img alt="Router" src="https://img.shields.io/badge/React_Router-7-red?logo=reactrouter" /></a>
  <a href="#-tech-stack"><img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss&logoColor=white" /></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/License-MIT-green" /></a>
</p>

---

## 📑 Table of Contents
1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Getting Started](#-getting-started)
4. [Environment Variables](#-environment-variables)
5. [Project Structure](#-project-structure)
6. [Key Feature Details](#-key-features-details)
7. [UI / UX](#-uiux-features)
8. [API & Data Flow](#-api-integration)
9. [Security](#-security-features)
10. [Performance](#-performance-optimizations)
11. [Scripts](#-development-scripts)
12. [Status & Roadmap](#-project-status)
13. [Contributing](#-contributing)
14. [License](#-license)
15. [Contact](#-contact)

## 🌟 Features

### 🏠 Core Features
- **Pet Adoption System**: Browse, search, and adopt pets with detailed profiles
- **Donation Campaigns**: Create and support fundraising campaigns for pet care
- **User Authentication**: Secure login/signup with Firebase (Email/Password, Google, GitHub)
- **Admin Dashboard**: Comprehensive management system for users, pets, and donations
- **Rich Text Editor**: TipTap-powered editor for creating detailed pet descriptions
- **Payment Integration**: Stripe integration for donations and adoption fees
- **Image Upload**: ImgBB integration for pet photo management

### 🎯 User Roles
- **Regular Users**: Browse pets, make adoption requests, create/support donation campaigns
- **Admins**: Manage all users, pets, donations, and site content
- **Pet Owners**: Add pets for adoption, manage adoption requests

### 📱 User Interface
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Mode**: Theme switching with DaisyUI
- **Modern UI Components**: Beautiful, accessible components with React Icons
- **Interactive Animations**: Lottie animations for enhanced UX
- **Dynamic Page Titles**: Automatic page title updates based on content
- **Error Handling**: Comprehensive error pages and boundaries

### 🛡️ Error Handling
- **404 Not Found**: Custom page for missing resources
- **401 Unauthorized**: Authentication required pages
- **403 Forbidden**: Access denied for restricted content
- **500 Server Error**: Internal server error handling
- **Error Boundary**: React error boundary for JavaScript errors
- **Graceful Degradation**: Fallback UI for failed components

## 🛠️ Tech Stack

| Layer | Library / Service | Version (package.json) | Purpose |
|-------|-------------------|------------------------|---------|
| UI Core | React | 19.1.x | Component library (hooks, concurrent-ready) |
| Routing | react-router-dom | 7.6.x | Declarative routing & data APIs |
| Styling | Tailwind CSS | 4.1.x | Utility-first styling |
| Component Theme | daisyUI | 5.0.x | Prebuilt themed components |
| Data Fetching | @tanstack/react-query | 5.81.x | Server-state caching & syncing |
| Tables | @tanstack/react-table | 8.21.x | Headless table utilities |
| Rich Text | TipTap (starter-kit + extensions) | 2.25.x | WYSIWYG editor for descriptions |
| Forms | formik / yup | 2.4.x / 1.6.x | Form state + schema validation |
| Auth | Firebase | 11.10.x | Authentication (Email/OAuth) |
| HTTP | axios | 1.10.x | REST calls + interceptors |
| Payments | Stripe (react + js) | 3.7.x / 7.4.x | Secure donation & fee payments |
| Media | ImgBB API | — | Pet image hosting |
| Animations | lottie-react | 2.4.x | Lottie JSON animations |
| Icons | react-icons | 5.5.x | Iconography |
| Alerts | sweetalert2 | 11.22.x | User feedback modals |
| Dates | date-fns | 4.1.x | Date formatting & math |
| Build Tool | Vite | 7.x | Fast dev server & bundler |
| Linting | ESLint (@eslint/js) | 9.29.x | Code quality enforcement |

> Note: Versions are kept intentionally flexible (caret ranges). Lock with a lockfile for deterministic builds.

## 🚀 Getting Started

### Prerequisites
- Node.js LTS v20+ (tested) – v18 should work but not regularly validated
- npm (bundled) or pnpm/yarn (adjust commands accordingly)
- Firebase project (Authentication enabled: Email/Password + desired OAuth providers)
- ImgBB API key (for image uploads) or replace with another image host
- Stripe account + Publishable key (test mode for development)
- Backend REST API (if using a custom server) reachable via `VITE_API_URL`

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-Saif-Smran.git
cd PetConnect-Client
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup** – create a `.env` (or `.env.local`) in project root:
```bash
# Firebase
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_project.firebaseapp.com
VITE_projectId=your_project_id
VITE_storageBucket=your_project.appspot.com
VITE_messagingSenderId=your_sender_id
VITE_appId=your_app_id

# REST API Base (if applicable)
VITE_API_URL=https://your-api-url.com

# Third‑Party Keys
VITE_IMGBB_API_KEY=your_imgbb_api_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. **(Optional) Verify versions**
```pwsh
node -v
npm -v
```

5. **Start the development server**

4. **Start the development server**
```bash
npm run dev
```

6. **Build for production**
```bash
npm run build
```

7. **Preview production build locally**
```bash
npm run preview
```

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| VITE_apiKey | ✅ | Firebase API key |
| VITE_authDomain | ✅ | Firebase auth domain |
| VITE_projectId | ✅ | Firebase project id |
| VITE_storageBucket | ✅ | Firebase storage bucket |
| VITE_messagingSenderId | ✅ | Firebase messaging sender id |
| VITE_appId | ✅ | Firebase app id |
| VITE_API_URL | ➖ | Backend REST base URL (if using custom server) |
| VITE_IMGBB_API_KEY | ✅ (current impl) | ImgBB upload key |
| VITE_STRIPE_PUBLISHABLE_KEY | ✅ (donations) | Stripe publishable key |

Security tip: Never commit real keys. Use `.env.local` (git‑ignored). For deployments, configure environment variables via your hosting provider.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Admin/          # Admin-specific components
│   ├── Donation/       # Donation-related components
│   ├── PetListing/     # Pet listing components
│   ├── AdoptionRequestForm.jsx
│   ├── DynamicTitle.jsx # Dynamic page title management
│   ├── ErrorBoundary.jsx
│   ├── Footer.jsx
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   ├── TiptapEditor.jsx
│   └── UserRoute.jsx
├── contexts/           # React contexts
│   └── ThemeContext.jsx
├── hooks/              # Custom hooks
│   └── useAuth.js
├── Layout/             # Layout components
│   ├── AdminLayout.jsx
│   ├── AdminLayoutRoute.jsx
│   ├── DashboardLayout.jsx
│   ├── MainLayout.jsx
│   └── UserDashboardLayout.jsx
├── pages/              # Page components
│   ├── Admin/         # Admin pages
│   │   ├── AdminAllDonations.jsx
│   │   ├── AdminAllPets.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── AdminUsers.jsx
│   ├── ErrorPages/    # Error pages
│   │   ├── Forbidden.jsx       # 403 Forbidden
│   │   ├── NotFound.jsx        # 404 Not Found
│   │   ├── ServerError.jsx     # 500 Internal Server Error
│   │   ├── Unauthorized.jsx    # 401 Unauthorized
│   │   └── index.js
│   ├── Home/          # Home page sections
│   ├── PetList/       # Pet listing page
│   ├── About.jsx
│   ├── AddPet.jsx
│   ├── AdoptionRequests.jsx
│   ├── CreateDonationCampaign.jsx
│   ├── Dashboard.jsx
│   ├── DonationCampaigns.jsx
│   ├── DonationDetails.jsx
│   ├── EditDonationCampaign.jsx
│   ├── Login.jsx
│   ├── MyAddedPets.jsx
│   ├── MyDonationCampaigns.jsx
│   ├── MyDonations.jsx
│   ├── Overview.jsx
│   ├── PetDetails.jsx
│   ├── Profile.jsx
│   ├── Register.jsx
│   └── UpdatePet.jsx
├── Provider/           # Context providers
│   ├── AuthProvider.jsx
│   └── firebase.init.js
├── Router/             # Route definitions
│   └── Routes.jsx
├── utils/              # Utility functions
│   ├── api.js
│   ├── imageUpload.js
│   ├── notifications.js
│   └── tokenUtils.js
└── index.css          # Global styles
```

## 🔑 Key Features Details

### Pet Management
- **Add Pets**: Rich form with image upload and detailed descriptions
- **Pet Categories**: Dogs, Cats, Birds, Fish, Rabbits, and more
- **Search & Filter**: Advanced filtering by category, location, and characteristics
- **Pet Profiles**: Comprehensive pet information with photo galleries

### Adoption System
- **Adoption Requests**: Users submit requests with contextual info
- **Request Management**: Pet owners approve / reject with status updates
- **(Planned)** Direct messaging / chat (see roadmap)

### Donation Campaigns
- **Campaign Creation**: Rich text (TipTap) with media
- **Goal Tracking**: Progress indicators & real-time totals
- **Payment Processing**: Secure Stripe client elements
- **Campaign Management**: Edit / pause / close

### Admin Features
- **User Management**: Role oversight & access
- **Pet Oversight**: Global visibility of listings & statuses
- **Donation Oversight**: Monitor campaigns and transactions
- **Analytics (Foundational)**: High-level metrics (expandable)

## 🎨 UI/UX Features

### Design System
- **Custom DaisyUI Theme**: `petconnecttheme` with light/dark variants
- **Color Palette**: 
  - Primary: #2CA58D (Teal)
  - Secondary: #F76C5E (Coral)
  - Accent: #FBBF24 (Amber)
- **Typography**: Inter & Nunito font families
- **Responsive**: Mobile-first design approach

### UI Enhancement
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Toast notifications and alerts
- **Smooth Transitions**: CSS transitions and animations
- **Dynamic Titles**: Contextual page titles that update based on content

## 🔧 API Integration

### Endpoints
- **Authentication**: `/auth/*` - User registration, login, profile management
- **Pets**: `/pets/*` - CRUD operations for pets
- **Donations**: `/donations/*` - Campaign and donation management
- **Admin**: `/admin/*` - Administrative functions
- **Adoption**: `/adoption-requests/*` - Adoption request handling

### Data Flow
- **React Query**: Efficient data fetching with caching
- **Firebase Auth**: JWT token-based authentication
- **Axios Interceptors**: Automatic token attachment
- **Error Handling**: Centralized error management

### Error Handling
- **HTTP Status Codes**: Proper error status handling
- **User-Friendly Messages**: Clear error communication
- **Retry Logic**: Automatic retry for failed requests
- **Fallback UI**: Graceful degradation on errors

## 🔐 Security Features

### Authentication
- **Firebase Auth**: Industry-standard authentication
- **Protected Routes**: Route-level protection
- **Token Management**: Automatic token refresh
- **Role-based Access**: Admin and user role separation

### Error Handling & Security
- **Custom Error Pages**: Friendly fallbacks
- **Error Boundaries**: React runtime isolation
- **Route Protection**: Role gating & auth guard
- **Input Validation**: Client + server (schema-driven)
- **CORS Configuration**: Controlled origin access
- **Secure Headers**: (Configure at hosting layer)

### Error Routes
- **404 Not Found** (`/error/404`, `/*`): Missing pages and resources
- **401 Unauthorized** (`/error/401`): Authentication required
- **403 Forbidden** (`/error/403`): Access denied for restricted content
- **500 Server Error** (`/error/500`): Internal server errors
- **Error Boundary**: JavaScript runtime error handling

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Mobile Features
- **Touch Interactions**: Optimized for touch devices
- **Mobile Navigation**: Collapsible sidebar menu
- **Responsive Images**: Optimized image loading
- **Mobile-first**: Designed for mobile experience

## 🚀 Performance Optimizations

### Code Splitting
- **Route-based Splitting**: Lazy loading for pages
- **Component Splitting**: Dynamic imports for large components

### Data Management
- **React Query**: Intelligent caching and background updates
- **Image Optimization**: Lazy loading and compression

### Build Optimization
- **Vite**: Fast build and development server
- **Tree Shaking**: Unused code elimination
- **Minification**: Optimized production builds

## 🧪 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 📈 Project Status

### ✅ Completed Features
- **User Authentication**: Complete Firebase authentication system
- **Pet Management**: Full CRUD operations for pets
- **Donation System**: Campaign creation and management
- **Admin Dashboard**: Comprehensive admin controls
- **Responsive UI**: Mobile-first design implementation
- **Image Upload**: ImgBB integration for pet photos
- **Rich Text Editor**: TipTap editor for descriptions
- **Payment Integration**: Stripe payment processing
- **Role-based Access**: Admin and user permissions
- **Search & Filter**: Advanced pet search functionality
- **Dynamic Page Titles**: Contextual titles for all pages

### 🔄 Recent Updates
- Cleaned up unused files and components
- Removed backup and temporary files
- Optimized project structure
- Updated dependencies
- Enhanced error handling
- Improved performance optimizations

### 🚀 Future Enhancements
- **Push Notifications** (Firebase Cloud Messaging)
- **Chat System** (WebSocket / Firestore realtime)
- **AI Recommendations** (content-based pet matching)
- **Mobile App** (React Native / Expo)
- **Advanced Analytics** (segmented dashboards)
- **PWA Features** (offline cache, install prompts)
- **Accessibility Audit** (WCAG AA compliance pass)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License. See [LICENSE](./LICENSE) for full text.

## 📞 Contact

**Developer**: Saif Smran  
**GitHub**: [Saif-Smran](https://github.com/Saif-Smran)  
**Repository**: [PetConnect-Client](https://github.com/Saif-Smran/PetConnect-Client)

---

<div align="center">
  <p>Made with ❤️ for pet lovers everywhere</p>
  <p>© 2024 PetConnect. All rights reserved.</p>
</div>
