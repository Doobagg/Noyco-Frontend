import { generatePageMetadata, pageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: 'Authentication - Noyco Mental Health Support',
  description: 'Securely access your Noyco account for personalized AI therapy and mental health support.',
  noindex: true, // Auth pages typically shouldn't be indexed
});

export default function AuthLayout({ children }) {
  return <>{children}</>;
}
