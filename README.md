# 🐾 PetConnect - Pet Adoption & Care Platform

A comprehensive full-stack web application for pet adoption, donation campaigns, and pet care management. Built with React, Firebase, and modern web technologies.

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
- **Error Handling**: Comprehensive error pages and boundaries

### 🛡️ Error Handling
- **404 Not Found**: Custom page for missing resources
- **401 Unauthorized**: Authentication required pages
- **403 Forbidden**: Access denied for restricted content
- **500 Server Error**: Internal server error handling
- **Error Boundary**: React error boundary for JavaScript errors
- **Graceful Degradation**: Fallback UI for failed components

## 🛠️ Tech Stack

### Frontend
- **React 18+** - Modern React with hooks and context
- **React Router 6+** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind
- **TanStack Query** - Data fetching and state management
- **TipTap** - Rich text editor
- **Vite** - Build tool and dev server

### Authentication & Backend
- **Firebase** - Authentication and backend services
- **Axios** - HTTP client for API calls
- **Stripe** - Payment processing

### Form Management & Validation
- **Formik** - Form handling
- **Yup** - Schema validation
- **React Select** - Enhanced select components

### UI Enhancement
- **React Icons** - Icon library
- **Lottie React** - Animation library
- **SweetAlert2** - Beautiful alerts and modals
- **Date-fns** - Date manipulation

### Development Tools
- **ESLint** - Code linting
- **Vite** - Development server and build tool

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Firebase project setup
- ImgBB API key (for image uploads)
- Stripe account (for payments)

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

3. **Environment Setup**
Create a `.env` file in the root directory:
```env
# Firebase Configuration
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_project.firebaseapp.com
VITE_projectId=your_project_id
VITE_storageBucket=your_project.appspot.com
VITE_messagingSenderId=your_sender_id
VITE_appId=your_app_id

# API Configuration
VITE_API_URL=https://your-api-url.com

# Third-party Services
VITE_IMGBB_API_KEY=your_imgbb_api_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. **Start the development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Admin/          # Admin-specific components
│   ├── Donation/       # Donation-related components
│   ├── PetListing/     # Pet listing components
│   ├── AdoptionRequestForm.jsx
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
- **Adoption Requests**: Users can submit adoption requests
- **Request Management**: Pet owners can approve/reject requests
- **Communication**: Built-in messaging system for adopters and owners

### Donation Campaigns
- **Campaign Creation**: Rich text editor for detailed campaign descriptions
- **Goal Tracking**: Visual progress bars and donation tracking
- **Payment Processing**: Secure Stripe integration
- **Campaign Management**: Edit, pause, or close campaigns

### Admin Features
- **User Management**: View and manage all users
- **Pet Oversight**: Monitor all pets and adoption requests
- **Donation Oversight**: Track all campaigns and donations
- **Analytics**: Comprehensive dashboard with statistics

## 🎨 UI/UX Features

### Design System
- **Custom DaisyUI Theme**: `petconnecttheme` with light/dark variants
- **Color Palette**: 
  - Primary: #2CA58D (Teal)
  - Secondary: #F76C5E (Coral)
  - Accent: #FBBF24 (Amber)
- **Typography**: Inter & Nunito font families
- **Responsive**: Mobile-first design approach

### Interactive Elements
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Toast notifications and alerts
- **Smooth Transitions**: CSS transitions and animations

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
- **Custom Error Pages**: User-friendly error handling
- **Error Boundaries**: React error boundary for graceful failures
- **Route Protection**: Unauthorized access prevention
- **Input Validation**: Client and server-side validation
- **CORS Configuration**: Proper cross-origin setup
- **Secure Headers**: Security best practices

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

### 🔄 Recent Updates
- Cleaned up unused files and components
- Removed backup and temporary files
- Optimized project structure
- Updated dependencies
- Enhanced error handling
- Improved performance optimizations

### 🚀 Future Enhancements
- **Push Notifications**: Real-time notifications for adoption requests
- **Chat System**: Real-time messaging between users
- **AI Recommendations**: ML-based pet matching
- **Mobile App**: React Native mobile application
- **Advanced Analytics**: Detailed insights and reporting
- **PWA Features**: Service workers and offline support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Developer**: Saif Smran  
**GitHub**: [Programming-Hero-Web-Course4](https://github.com/Programming-Hero-Web-Course4)  
**Repository**: [b11a12-client-side-Saif-Smran](https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-Saif-Smran)

---

<div align="center">
  <p>Made with ❤️ for pet lovers everywhere</p>
  <p>© 2024 PetConnect. All rights reserved.</p>
</div>
