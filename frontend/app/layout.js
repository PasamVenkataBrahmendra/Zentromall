import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '../src/context/AuthContext';
import { CartProvider } from '../src/context/CartContext';
import { WishlistProvider } from '../src/context/WishlistContext';
import { RecentlyViewedProvider } from '../src/context/RecentlyViewedContext';
import { CheckoutProvider } from '../src/context/CheckoutContext';
import { ComparisonProvider } from '../src/context/ComparisonContext';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'ZentroMall',
  description: 'Your one-stop shop for everything',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <RecentlyViewedProvider>
                <CheckoutProvider>
                  <ComparisonProvider>
                    <Navbar />
                    <main className="main-content">
                      {children}
                    </main>
                    <Footer />
                  </ComparisonProvider>
                </CheckoutProvider>
              </RecentlyViewedProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
