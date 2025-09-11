// frontend/src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import CheckoutForm from "./pages/CheckoutForm";
import CheckoutReview from "./pages/CheckoutReview";
import CheckoutConfirmation from "./pages/CheckoutConfirmation";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        {/* Redirige si entran a /product o /product/ sin SKU */}
        <Route path="/product" element={<Navigate to="/" replace />} />
        <Route path="/product/:sku" element={<ProductDetail />} />

        <Route path="/checkout" element={<CheckoutForm />} />
        <Route path="/checkout/review" element={<CheckoutReview />} />
        <Route path="/checkout/confirmation" element={<CheckoutConfirmation />} />

        {/* Fallback general */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
