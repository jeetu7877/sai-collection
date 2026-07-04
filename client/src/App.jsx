import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminLayout from "./components/AdminLayout.jsx";

import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import Cart from "./pages/Cart.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderHistory from "./pages/OrderHistory.jsx";
import Profile from "./pages/Profile.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";

function SiteLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(23,23,23,0.9)",
            color: "#fff",
            border: "1px solid rgba(255,107,0,0.3)",
          },
        }}
      />
      <Routes>
        {/* Public / customer-facing site */}
        <Route path="/" element={<SiteLayout><Home /></SiteLayout>} />
        <Route path="/shop" element={<SiteLayout><Shop /></SiteLayout>} />
        <Route path="/product/:slug" element={<SiteLayout><ProductPage /></SiteLayout>} />
        <Route path="/cart" element={<SiteLayout><Cart /></SiteLayout>} />
        <Route path="/wishlist" element={<SiteLayout><Wishlist /></SiteLayout>} />
        <Route path="/about" element={<SiteLayout><About /></SiteLayout>} />
        <Route path="/contact" element={<SiteLayout><Contact /></SiteLayout>} />
        <Route path="/login" element={<SiteLayout><Login /></SiteLayout>} />
        <Route path="/register" element={<SiteLayout><Register /></SiteLayout>} />
        <Route path="/verify-email" element={<SiteLayout><VerifyEmail /></SiteLayout>} />

        {/* Authenticated customer routes */}
        <Route
          path="/checkout"
          element={
            <SiteLayout>
              <ProtectedRoute roles={["customer", "admin", "staff"]}>
                <Checkout />
              </ProtectedRoute>
            </SiteLayout>
          }
        />
        <Route
          path="/orders"
          element={
            <SiteLayout>
              <ProtectedRoute roles={["customer", "admin", "staff"]}>
                <OrderHistory />
              </ProtectedRoute>
            </SiteLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <SiteLayout>
              <ProtectedRoute roles={["customer", "admin", "staff"]}>
                <Profile />
              </ProtectedRoute>
            </SiteLayout>
          }
        />

        {/* Admin / staff dashboard (own layout, no public navbar) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin", "staff"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
        </Route>

        <Route path="*" element={<SiteLayout><NotFound /></SiteLayout>} />
      </Routes>
    </>
  );
}
