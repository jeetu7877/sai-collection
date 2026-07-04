import { Link, useNavigate } from "react-router-dom";
import { FiTrash2, FiPlus, FiMinus, FiArrowRight } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Cart() {
  const { cart, subtotal, updateQuantity, removeFromCart } = useCart();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(null);
  const navigate = useNavigate();

  const applyCoupon = async () => {
    try {
      const { data } = await api.post("/coupons/validate", { code: coupon, subtotal });
      setApplied(data);
      toast.success(`Coupon applied! You saved ₹${data.discount.toFixed(0)}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid coupon");
      setApplied(null);
    }
  };

  const discount = applied?.discount || 0;
  const gst = ((subtotal - discount) * 0.05);
  const total = subtotal - discount + gst;

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h2 className="section-title mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-8 py-10">
      <h1 className="section-title mb-8">Shopping Cart</h1>
      <div className="grid md:grid-cols-[1fr_340px] gap-8">
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div key={`${item.product._id}-${item.size}-${item.color}`} className="glass rounded-2xl p-4 flex gap-4">
              <img src={item.product.images?.[0]} alt={item.product.name} className="h-24 w-20 object-cover rounded-lg" />
              <div className="flex-1">
                <Link to={`/product/${item.product.slug}`} className="font-heading font-semibold text-white hover:text-accent">
                  {item.product.name}
                </Link>
                <p className="text-xs text-gray-500 mt-1">Size: {item.size} · Color: {item.color}</p>
                <p className="text-accent font-bold mt-1">₹{item.product.price}</p>

                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-2 glass rounded-full px-2 py-1">
                    <button onClick={() => updateQuantity(item.product._id, item.size, item.color, item.quantity - 1)} className="p-1 text-gray-400 hover:text-accent">
                      <FiMinus size={12} />
                    </button>
                    <span className="text-sm w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product._id, item.size, item.color, item.quantity + 1)} className="p-1 text-gray-400 hover:text-accent">
                      <FiPlus size={12} />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.product._id, item.size, item.color)} className="text-gray-500 hover:text-red-400">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-6 h-fit sticky top-24">
          <h3 className="font-heading font-semibold text-white mb-4">Order Summary</h3>

          <div className="flex gap-2 mb-4">
            <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Coupon code" className="input-field !py-2 text-sm" />
            <button onClick={applyCoupon} className="btn-outline !py-2 !px-4 text-sm shrink-0">Apply</button>
          </div>

          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-400"><span>Discount</span><span>-₹{discount.toFixed(2)}</span></div>}
            <div className="flex justify-between"><span>GST (5%)</span><span>₹{gst.toFixed(2)}</span></div>
          </div>
          <div className="border-t border-white/10 mt-4 pt-4 flex justify-between font-heading font-bold text-white text-lg">
            <span>Total</span><span className="text-accent">₹{total.toFixed(2)}</span>
          </div>

          <button onClick={() => navigate("/checkout", { state: { couponCode: applied ? coupon : null } })} className="btn-primary w-full justify-center mt-6">
            Checkout <FiArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
