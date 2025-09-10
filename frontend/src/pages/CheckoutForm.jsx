import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCartStore } from "../store/cart.store";
import { useCheckoutStore } from "../store/checkout.store";

const ShippingZ = z.object({
  fullName: z.string().min(3, "Nombre muy corto"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(7, "Teléfono inválido"),
  address: z.string().min(5, "Dirección corta"),
  city: z.string().min(2, "Ciudad inválida"),
});

export default function CheckoutForm() {
  const navigate = useNavigate();

  // ✅ Suscripción estable: objeto items (no crea nuevas referencias)
  const itemsObj = useCartStore((s) => s.items);
  const list = useMemo(() => Object.values(itemsObj), [itemsObj]);

  const setShipping = useCheckoutStore((s) => s.setShipping);
  const shippingPrev = useCheckoutStore((s) => s.shipping);

  useEffect(() => {
    if (!list.length) navigate("/");
  }, [list.length, navigate]); // 👈 depende del length, no del array completo

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(ShippingZ),
    defaultValues: shippingPrev || {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
    },
  });

  useEffect(() => {
    if (shippingPrev) {
      Object.entries(shippingPrev).forEach(([k, v]) => setValue(k, v));
    }
  }, [setValue, shippingPrev]);

  const onSubmit = (data) => {
    setShipping(data);
    navigate("/checkout/review");
  };

  return (
    <div className="container py-4">
      <h2 className="mb-3">Checkout - Envío</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Nombre completo</label>
          <input className="form-control" {...register("fullName")} />
          {errors.fullName && <div className="text-danger small">{errors.fullName.message}</div>}
        </div>
        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input className="form-control" {...register("email")} />
          {errors.email && <div className="text-danger small">{errors.email.message}</div>}
        </div>
        <div className="col-md-6">
          <label className="form-label">Teléfono</label>
          <input className="form-control" {...register("phone")} />
          {errors.phone && <div className="text-danger small">{errors.phone.message}</div>}
        </div>
        <div className="col-md-8">
          <label className="form-label">Dirección</label>
          <input className="form-control" {...register("address")} />
          {errors.address && <div className="text-danger small">{errors.address.message}</div>}
        </div>
        <div className="col-md-4">
          <label className="form-label">Ciudad</label>
          <input className="form-control" {...register("city")} />
          {errors.city && <div className="text-danger small">{errors.city.message}</div>}
        </div>

        <div className="col-12 d-flex gap-2">
          <button className="btn btn-primary" type="submit">Continuar</button>
          <button className="btn btn-outline-secondary" type="button" onClick={() => navigate("/")}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
