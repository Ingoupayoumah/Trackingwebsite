import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { AdminEntreprisesPage } from "./pages/AdminEntreprisesPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { SuiviPage } from "./pages/SuiviPage";

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
      <Route path="/suivi/:trackingCode" element={<SuiviPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
