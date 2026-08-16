import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Safe lazy loader that auto-retries on deployment chunk hash changes
function lazyWithRetry(componentImport) {
  return lazy(async () => {
    const pageHasBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem('retry_chunk_' + window.location.pathname) || 'false'
    );

    try {
      const component = await componentImport();
      window.sessionStorage.removeItem('retry_chunk_' + window.location.pathname);
      return component;
    } catch (error) {
      if (!pageHasBeenForceRefreshed) {
        window.sessionStorage.setItem('retry_chunk_' + window.location.pathname, 'true');
        window.location.reload();
        return { default: () => null };
      }
      throw error;
    }
  });
}

// Public pages
const Home = lazyWithRetry(() => import('../pages/public/Home.jsx'));
const Catalog = lazyWithRetry(() => import('../pages/public/Catalog.jsx'));
const TemplateDetail = lazyWithRetry(() => import('../pages/public/TemplateDetail.jsx'));
const PublicInvitation = lazyWithRetry(() => import('../pages/public/PublicInvitation.jsx'));
const Login = lazyWithRetry(() => import('../pages/auth/LoginPage.jsx'));
const Register = lazyWithRetry(() => import('../pages/auth/RegisterPage.jsx'));

// User Cabinet pages
const Dashboard = lazyWithRetry(() => import('../pages/DashboardPage.jsx'));
const CheckoutPage = lazyWithRetry(() => import('../pages/dashboard/CheckoutPage.jsx'));
const EditorPage = lazyWithRetry(() => import('../pages/dashboard/EditorPage.jsx'));
const PreviewPage = lazyWithRetry(() => import('../pages/dashboard/PreviewPage.jsx'));
const RsvpDashboard = lazyWithRetry(() => import('../pages/dashboard/RsvpDashboard.jsx'));

// Admin pages
const AdminLayout = lazyWithRetry(() => import('../pages/admin/AdminLayout.jsx'));
const AdminDashboard = lazyWithRetry(() => import('../pages/admin/AdminDashboard.jsx'));
const AdminUsers = lazyWithRetry(() => import('../pages/admin/AdminUsers.jsx'));
const AdminOrders = lazyWithRetry(() => import('../pages/admin/AdminOrders.jsx'));
const AdminTemplates = lazyWithRetry(() => import('../pages/admin/AdminTemplates.jsx'));
const AdminInvitations = lazyWithRetry(() => import('../pages/admin/AdminInvitations.jsx'));

// Luxury Lightweight Page Loader
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center bg-ivory">
    <div className="w-10 h-10 border-2 border-champagne border-t-transparent rounded-full animate-spin mb-3" />
  </div>
);

export default function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/templates/:slug" element={<TemplateDetail />} />
        <Route path="/w/:slug" element={<PublicInvitation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* User Dashboard Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/checkout/:orderId" element={<CheckoutPage />} />
        <Route path="/editor/:id" element={<EditorPage />} />
        <Route path="/preview/:id" element={<PreviewPage />} />
        <Route path="/dashboard/rsvp/:id" element={<RsvpDashboard />} />

        {/* Admin Panel Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="templates" element={<AdminTemplates />} />
          <Route path="invitations" element={<AdminInvitations />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
