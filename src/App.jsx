import { BrowserRouter, Route, Routes } from "react-router-dom"
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute"
import SiteLayout from "./components/layout/SiteLayout"
import AdminDashboardPage from "./pages/admin/AdminDashboardPage"
import AdminLoginPage from "./pages/admin/AdminLoginPage"
import HomePage from "./pages/HomePage"
import PrivacyPage from "./pages/PrivacyPage"
import TermsPage from "./pages/TermsPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="admin/login" element={<AdminLoginPage />} />
        <Route element={<ProtectedAdminRoute />}>
          <Route path="admin" element={<AdminDashboardPage />} />
        </Route>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
