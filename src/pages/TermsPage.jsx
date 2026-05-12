import LegalDocument from "../components/legal/LegalDocument"
import {
  termsOfServiceMeta,
  termsOfServiceSections,
} from "../data/termsOfService"

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms of Service"
      metaTitle={termsOfServiceMeta.title}
      metaDescription={termsOfServiceMeta.description}
      updatedAt={termsOfServiceMeta.updatedAt}
      sections={termsOfServiceSections}
    />
  )
}
