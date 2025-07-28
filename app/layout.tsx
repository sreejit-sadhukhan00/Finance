import type { Metadata } from "next";
import { Inter, Raleway } from "next/font/google";
import "./globals.css";
import Footer from "@/component/Footer";
import Header from "@/component/Header";
import { ClerkProvider } from "@clerk/nextjs";
const raleway = Raleway({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900']
})


export const metadata: Metadata = {
  title: "Finance Tracker",
  description: "Track your finances with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>

    <html lang="en">
      <body
        className={`${raleway.className}`}
      >
           {/* header */}
            <Header/>
        <main className="min-h-screen pt-30">
          {children} 
        </main>
         <Footer/>
      </body>
    </html>
    </ClerkProvider>
  );
}
