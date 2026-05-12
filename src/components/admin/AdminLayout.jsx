import Background from "../layout/Background"

export default function AdminLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Background />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
