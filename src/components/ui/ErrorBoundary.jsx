import { Component } from "react"
import Button from "./Button"
import GlassCard from "./GlassCard"

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    const { sectionName } = this.props

    console.error(
      sectionName
        ? `[Bryant Labs] ${sectionName} section error:`
        : "[Bryant Labs] Section error:",
      error,
      errorInfo,
    )
  }

  handleRefresh = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
            <GlassCard
              hover={false}
              className="border border-white/10 p-8 text-center sm:p-10"
            >
              <h2 className="text-xl font-semibold text-white">
                Something went wrong in this section.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Refresh the page or try again in a moment.
              </p>
              <Button
                type="button"
                variant="secondary"
                className="mt-6"
                onClick={this.handleRefresh}
              >
                Refresh Page
              </Button>
            </GlassCard>
          </div>
        </section>
      )
    }

    return this.props.children
  }
}
