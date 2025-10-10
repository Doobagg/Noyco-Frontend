import { generatePageMetadata, pageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata(pageMetadata.marketingFunnel);

export default function MarketingFunnelLayout({ children }) {
  return <>{children}</>;
}
