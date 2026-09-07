import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { AdminEntreprisesPage } from "./pages/AdminEntreprisesPage";
import { CommentCaMarchePage } from "./pages/CommentCaMarchePage";
import { ContactPage } from "./pages/ContactPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LandingPage } from "./pages/LandingPage";
import { LegalNoticePage } from "./pages/LegalNoticePage";
import { LoginPage } from "./pages/LoginPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { ServicesPage } from "./pages/ServicesPage";
import { SuiviPage } from "./pages/SuiviPage";
import { SuivreLookupPage } from "./pages/SuivreLookupPage";

function ProtectedRoute({
  children,
  adminOnly,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const { auth } = useAuth();
  if (!auth) return <Navigate to="/login" replace />;
  if (adminOnly && auth.role !== "admin") return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/comment-ca-marche" element={<CommentCaMarchePage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/politique-de-confidentialite" element={<PrivacyPolicyPage />} />
      <Route path="/mentions-legales" element={<LegalNoticePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/entreprises"
        element={
          <ProtectedRoute adminOnly>
            <AdminEntreprisesPage />
          </ProtectedRoute>
        }
      />
      <Route path="/suivre" element={<SuivreLookupPage />} />
      <Route path="/suivi/:trackingCode" element={<SuiviPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
