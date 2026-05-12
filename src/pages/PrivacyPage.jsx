import LegalDocument from "../components/legal/LegalDocument"
import {
  privacyPolicyMeta,
  privacyPolicySections,
} from "../data/privacyPolicy"

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      metaTitle={privacyPolicyMeta.title}
      metaDescription={privacyPolicyMeta.description}
      updatedAt={privacyPolicyMeta.updatedAt}
      sections={privacyPolicySections}
    />
  )
}
