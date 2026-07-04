import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Checkout() {
  const { cart, subtotal, fetchCart } = useCart();
  const { user } = useAuth();
  const { register, handleSubmit } = useForm();
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h2 className="section-title mb-4">Nothing to checkout</h2>
        <Link to="/shop" className="btn-primary">Go Shopping</Link>
      </div>
    );
  }

  const onSubmit = async (address) => {
    setPlacing(true);
    try {
      const items = cart.items.map((i) => ({
        productId: i.product._id,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
      }));
      const { data } = await api.post("/orders", {
        items,
        shippingAddress: address,
        paymentMethod,
        couponCode: location.state?.couponCode,
      });
      toast.success(`Order ${data.orderNumber} placed successfully!`);
      await fetchCart();
      navigate("/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 md:px-8 py-10">
      <h1 className="section-title mb-8">Checkout</h1>
      <div className="grid md:grid-cols-[1fr_320px] gap-8">
        <form onSubmit={handleSubmit(onSubmit)} className="glass rounded-2xl p-6 space-y-4">
          <h3 className="font-heading font-semibold text-white">Shipping Address</h3>
          <input {...register("line1", { required: true })} placeholder="Address line 1" className="input-field" defaultValue="" />
          <input {...register("line2")} placeholder="Address line 2 (optional)" className="input-field" />
          <div className="grid grid-cols-2 gap-3">
            <input {...register("city", { required: true })} placeholder="City" className="input-field" />
            <input {...register("state", { required: true })} placeholder="State" className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input {...register("pincode", { required: true })} placeholder="Pincode" className="input-field" />
            <input {...register("phone", { required: true })} placeholder="Phone" className="input-field" />
          </div>

          <h3 className="font-heading font-semibold text-white pt-4">Payment Method</h3>
          <div className="grid grid-cols-4 gap-2">
            {["UPI", "Card", "Cash", "QR"].map((m) => (
              <button
                type="button"
                key={m}
                onClick={() => setPaymentMethod(m)}
                className={`rounded-xl border py-3 text-sm ${paymentMethod === m ? "border-accent text-accent bg-accent/10" : "border-white/15 text-gray-400"}`}
              >
                {m}
              </button>
            ))}
          </div>

          <button disabled={placing} className="btn-primary w-full justify-center mt-4">
            {placing ? "Placing order..." : "Place Order"}
          </button>
        </form>

        <div className="glass rounded-2xl p-6 h-fit">
          <h3 className="font-heading font-semibold text-white mb-4">Order Summary</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {cart.items.map((item) => (
              <div key={`${item.product._id}-${item.size}`} className="flex justify-between text-sm text-gray-400">
                <span>{item.product.name} × {item.quantity}</span>
                <span>₹{(item.product.price * item.quantity).toFixed(0)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 mt-4 pt-4 flex justify-between font-heading font-bold text-white">
            <span>Subtotal</span><span className="text-accent">₹{subtotal.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">GST and applicable coupon discount will be calculated on order placement.</p>
        </div>
      </div>
    </div>
  );
}
