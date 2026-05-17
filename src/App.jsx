import { Suspense, lazy } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import SiteLayout from "./components/layout/SiteLayout"
import HomePage from "./pages/HomePage"

const ProtectedAdminRoute = lazy(() => import("./components/admin/ProtectedAdminRoute"))
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"))
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"))
const ClientLoginPage = lazy(() => import("./pages/ClientLoginPage"))
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"))
const TermsPage = lazy(() => import("./pages/TermsPage"))

function RouteLoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <p className="text-sm text-white/70">Loading…</p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          <Route path="admin/login" element={<AdminLoginPage />} />
          <Route element={<ProtectedAdminRoute />}>
            <Route path="admin" element={<AdminDashboardPage />} />
          </Route>
          <Route element={<SiteLayout />}>
            <Route index element={<HomePage />} />
            <Route path="client-login" element={<ClientLoginPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="terms" element={<TermsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
