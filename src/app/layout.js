'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/FixPage/Navbar/page";
import AuthProvider from "@/Component/AuthProvider";
import Footer from "@/FixPage/Footer/page";
import PrivateRoute from "@/Component/PrivateRoute";
import { usePathname } from "next/navigation";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/Authintaction/login";

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          {!isLoginPage && <Navbar />}
          {isLoginPage ? (
            children
          ) : (
            <PrivateRoute allowedRoles={['admin', 'employee', 'client']}>
              <main>{children}</main>
            </PrivateRoute>
          )}
          {!isLoginPage && <Footer />}
        </AuthProvider>
      </body>
    </html>
  );
}
