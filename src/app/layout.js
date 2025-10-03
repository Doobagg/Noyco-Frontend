import "./globals.css";
import { ReduxProvider } from "@/store/provider";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
