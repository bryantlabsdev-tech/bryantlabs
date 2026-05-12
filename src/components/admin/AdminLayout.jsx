import Background from "../layout/Background"
import DeveloperAnalyticsOptOut from "../analytics/DeveloperAnalyticsOptOut"

export default function AdminLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Background />
      <DeveloperAnalyticsOptOut />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
