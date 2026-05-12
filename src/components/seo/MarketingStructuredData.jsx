import { buildMarketingStructuredData } from "../../config/seo"

export default function MarketingStructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(buildMarketingStructuredData()),
      }}
    />
  )
}
