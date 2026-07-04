import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) return setCart({ items: [] });
    try {
      const { data } = await api.get("/cart");
      setCart(data);
    } catch (err) {
      // silent fail (e.g. not logged in)
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, size, color, quantity = 1) => {
    if (!user) {
      toast.error("Please login to add items to your cart");
      return false;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/cart", { productId, size, color, quantity });
      setCart(data);
      toast.success("Added to cart");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add to cart");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, size, color, quantity) => {
    try {
      const { data } = await api.put("/cart", { productId, size, color, quantity });
      setCart(data);
    } catch (err) {
      toast.error("Could not update cart");
    }
  };

  const removeFromCart = async (productId, size, color) => {
    try {
      const { data } = await api.delete("/cart", { data: { productId, size, color } });
      setCart(data);
      toast.success("Removed from cart");
    } catch (err) {
      toast.error("Could not remove item");
    }
  };

  const itemCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const subtotal = cart.items?.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{ cart, itemCount, subtotal, addToCart, updateQuantity, removeFromCart, fetchCart, loading }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
