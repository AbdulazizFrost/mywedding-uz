import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Public pages
const Home = lazy(() => import('../pages/public/Home.jsx'));
const Catalog = lazy(() => import('../pages/public/Catalog.jsx'));
const TemplateDetail = lazy(() => import('../pages/public/TemplateDetail.jsx'));
const PublicInvitation = lazy(() => import('../pages/public/PublicInvitation.jsx'));
const Login = lazy(() => import('../pages/auth/LoginPage.jsx'));
const Register = lazy(() => import('../pages/auth/RegisterPage.jsx'));

// User Cabinet pages
const Dashboard = lazy(() => import('../pages/DashboardPage.jsx'));
const CheckoutPage = lazy(() => import('../pages/dashboard/CheckoutPage.jsx'));
const EditorPage = lazy(() => import('../pages/dashboard/EditorPage.jsx'));
const PreviewPage = lazy(() => import('../pages/dashboard/PreviewPage.jsx'));
const RsvpDashboard = lazy(() => import('../pages/dashboard/RsvpDashboard.jsx'));

// Admin pages
const AdminLayout = lazy(() => import('../pages/admin/AdminLayout.jsx'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard.jsx'));
const AdminUsers = lazy(() => import('../pages/admin/AdminUsers.jsx'));
const AdminOrders = lazy(() => import('../pages/admin/AdminOrders.jsx'));
const AdminTemplates = lazy(() => import('../pages/admin/AdminTemplates.jsx'));
const AdminInvitations = lazy(() => import('../pages/admin/AdminInvitations.jsx'));

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
