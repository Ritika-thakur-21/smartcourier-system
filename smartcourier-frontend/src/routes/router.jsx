import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import MainLayout from '../layouts/MainLayout';
import { useAppSelector } from '../store';
import PageLoader from '../shared/components/PageLoader';

// Lazy load pages
const LandingPage = lazy(() => import('../features/landing/LandingPage'));
const LoginPage = lazy(() => import('../features/auth/LoginPage'));
const RegisterPage = lazy(() => import('../features/auth/RegisterPage'));

// Customer Pages
const CustomerDashboard = lazy(() => import('../features/customer/dashboard/CustomerDashboard'));
const BookDelivery = lazy(() => import('../features/customer/deliveries/BookDelivery'));
const MyDeliveries = lazy(() => import('../features/customer/deliveries/MyDeliveries'));
const DeliveryDetail = lazy(() => import('../features/customer/deliveries/DeliveryDetail'));
const TrackParcel = lazy(() => import('../features/customer/tracking/TrackParcel'));

// Admin Pages
const AdminDashboard = lazy(() => import('../features/admin/dashboard/AdminDashboard'));
const AllDeliveries = lazy(() => import('../features/admin/deliveries/AllDeliveries'));
const DeliveryManage = lazy(() => import('../features/admin/deliveries/DeliveryManage'));
const TrackingEvents = lazy(() => import('../features/admin/tracking/TrackingEvents'));
const ReportsPage = lazy(() => import('../features/admin/reports/ReportsPage'));

// Utility Pages
const Unauthorized = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6">
    <h1 className="text-[120px] font-extrabold font-heading text-faint leading-none">403</h1>
    <div className="space-y-2">
      <p className="text-2xl font-bold text-primary">Access Denied</p>
      <p className="text-secondary font-medium">You don't have permission to view this page.</p>
    </div>
    <Navigate to="/dashboard" replace />
  </div>
);

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6">
    <h1 className="text-[120px] font-extrabold font-heading text-faint leading-none">404</h1>
    <div className="space-y-2">
      <p className="text-2xl font-bold text-primary">Page Not Found</p>
      <p className="text-secondary font-medium">The page you're looking for doesn't exist.</p>
    </div>
    <Link to="/" className="glass-button">Go home</Link>
  </div>
);

const Link = ({ to, children, className }) => <a href={to} className={className}>{children}</a>;

// Route Guards
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

const AdminRoute = ({ children }) => {
  const { role } = useAppSelector(state => state.auth);
  
  if (role !== 'ADMIN') {
    return <Navigate to="/unauthorized" replace />;
  }
  return <>{children}</>;
};

const AuthRoute = ({ children }) => {
  const { isAuthenticated, role } = useAppSelector(state => state.auth);
  
  if (isAuthenticated) {
    return <Navigate to={role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} replace />;
  }
  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Suspense fallback={<PageLoader />}><LandingPage /></Suspense> },
      { 
        path: 'login', 
        element: <AuthRoute><Suspense fallback={<PageLoader />}><LoginPage /></Suspense></AuthRoute> 
      },
      { 
        path: 'register', 
        element: <AuthRoute><Suspense fallback={<PageLoader />}><RegisterPage /></Suspense></AuthRoute> 
      },
      { path: 'track', element: <Suspense fallback={<PageLoader />}><TrackParcel /></Suspense> },
    ]
  },
  {
    path: '/',
    element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
    children: [
      // Customer Routes
      { path: 'dashboard', element: <Suspense fallback={<PageLoader />}><CustomerDashboard /></Suspense> },
      { path: 'deliveries/book', element: <Suspense fallback={<PageLoader />}><BookDelivery /></Suspense> },
      { path: 'deliveries/my', element: <Suspense fallback={<PageLoader />}><MyDeliveries /></Suspense> },
      { path: 'deliveries/:id', element: <Suspense fallback={<PageLoader />}><DeliveryDetail /></Suspense> },
      
      // Admin Routes
      { 
        path: 'admin/dashboard', 
        element: <AdminRoute><Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense></AdminRoute> 
      },
      { 
        path: 'admin/deliveries', 
        element: <AdminRoute><Suspense fallback={<PageLoader />}><AllDeliveries /></Suspense></AdminRoute> 
      },
      { 
        path: 'admin/deliveries/:id', 
        element: <AdminRoute><Suspense fallback={<PageLoader />}><DeliveryManage /></Suspense></AdminRoute> 
      },
      { 
        path: 'admin/tracking', 
        element: <AdminRoute><Suspense fallback={<PageLoader />}><TrackingEvents /></Suspense></AdminRoute> 
      },
      { 
        path: 'admin/reports', 
        element: <AdminRoute><Suspense fallback={<PageLoader />}><ReportsPage /></Suspense></AdminRoute> 
      },
    ]
  },
  { path: 'unauthorized', element: <Unauthorized /> },
  { path: '*', element: <NotFound /> }
]);

export { router };
