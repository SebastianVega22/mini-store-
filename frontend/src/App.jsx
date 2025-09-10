import { Routes, Route } from "react-router-dom";
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
        <Route path="/" element={<Home />} />
        <Route path="/product/:sku" element={<ProductDetail />} />
        <Route path="/checkout" element={<CheckoutForm />} />
        <Route path="/checkout/review" element={<CheckoutReview />} />
        <Route path="/checkout/confirmation" element={<CheckoutConfirmation />} />
      </Route>
    </Routes>
  );
}
