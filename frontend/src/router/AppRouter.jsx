import { Routes, Route } from 'react-router-dom';
import Home from '../pages/public/Home.jsx';
import Catalog from '../pages/public/Catalog.jsx';
import TemplateDetail from '../pages/public/TemplateDetail.jsx';
import Login from '../pages/auth/LoginPage.jsx';
import Register from '../pages/auth/RegisterPage.jsx';
import Dashboard from '../pages/DashboardPage.jsx';
import CheckoutPage from '../pages/dashboard/CheckoutPage.jsx';
import EditorPage from '../pages/dashboard/EditorPage.jsx';
import PreviewPage from '../pages/dashboard/PreviewPage.jsx';
import PublicInvitation from '../pages/public/PublicInvitation.jsx';
import RsvpDashboard from '../pages/dashboard/RsvpDashboard.jsx';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/catalog" element={<Catalog />} />
      <Route path="/templates/:slug" element={<TemplateDetail />} />
      <Route path="/w/:slug" element={<PublicInvitation />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/checkout/:orderId" element={<CheckoutPage />} />
      <Route path="/editor/:id" element={<EditorPage />} />
      <Route path="/preview/:id" element={<PreviewPage />} />
      <Route path="/dashboard/rsvp/:id" element={<RsvpDashboard />} />
    </Routes>
  );
}
