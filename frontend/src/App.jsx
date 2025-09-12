// frontend/src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";

// Público / tienda
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import CheckoutForm from "./pages/CheckoutForm";
import CheckoutReview from "./pages/CheckoutReview";
import CheckoutConfirmation from "./pages/CheckoutConfirmation";

// Admin
import AdminLayout from "./pages/admin/AdminLayout";
import AdminProductsList from "./pages/admin/AdminProductsList";
import AdminProductForm from "./pages/admin/AdminProductForm";
import AdminGuard from "./components/AdminGuard";

export default function App() {
  return (
    <Routes>
      {/* Sitio público */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        {/* Redirige si entran a /product o /product/ sin SKU */}
        <Route path="/product" element={<Navigate to="/" replace />} />
        <Route path="/product/:sku" element={<ProductDetail />} />

        <Route path="/checkout" element={<CheckoutForm />} />
        <Route path="/checkout/review" element={<CheckoutReview />} />
        <Route path="/checkout/confirmation" element={<CheckoutConfirmation />} />

        {/* Fallback general público */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>

      {/* Panel Admin */}
      <Route path="/admin" element={<AdminLayout />}>
        {/* Si no hay token, AdminGuard muestra un mini login */}
        <Route element={<AdminGuard />}>
          <Route index element={<Navigate to="products" replace />} />
          <Route path="products" element={<AdminProductsList />} />
          <Route path="products/new" element={<AdminProductForm mode="create" />} />
          <Route path="products/:sku/edit" element={<AdminProductForm mode="edit" />} />
          <Route path="*" element={<Navigate to="products" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
