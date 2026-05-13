import AppShell from "@/components/AppShell";
import { AuthProvider } from "@/components/AuthProvider";
import SupabaseNotice from "@/components/SupabaseNotice";
import "./globals.css";

export const metadata = {
  title: "SavBlogs",
  description: "A modern SavBlogs experience built with Next.js and Supabase.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AppShell>
            <SupabaseNotice />
            {children}
          </AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
