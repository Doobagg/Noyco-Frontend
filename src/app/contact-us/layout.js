import { generatePageMetadata, pageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata(pageMetadata.contact);

export default function ContactLayout({ children }) {
  return <>{children}</>;
}
