import AppShell from "@/components/AppShell";
import { AuthProvider } from "@/components/AuthProvider";
import FirebaseNotice from "@/components/FirebaseNotice";
import "./globals.css";

export const metadata = {
  title: "SavBlogs",
  description: "A modern SavBlogs experience built with Next.js and Firebase."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AppShell>
            <FirebaseNotice />
            {children}
          </AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
