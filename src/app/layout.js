import "./globals.css";
import { ReduxProvider } from "@/store/provider";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { generatePageMetadata } from "@/lib/seo";

// Generate metadata for the root layout
export const metadata = generatePageMetadata({
  title: 'Noyco - AI Mental Health Support & Online Therapy 24/7',
  description: 'Get instant mental health support with Noyco\'s AI therapy platform. Access 24/7 online counseling for anxiety, depression, and loneliness. Private, secure, and always available.',
  keywords: [
    'AI therapy',
    'mental health support',
    'online counseling',
    'anxiety therapy',
    'depression support',
    '24/7 therapy',
  ],
});

export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
  
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico.ico" />
        <meta name="theme-color" content="#5d83b8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        {gaId && <GoogleAnalytics measurementId={gaId} />}
      </head>
      <body>
        <ReduxProvider>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </ReduxProvider>
      </body>
    </html>
  )
}
