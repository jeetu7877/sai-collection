import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState({ products: [] });

  const fetchWishlist = useCallback(async () => {
    if (!user) return setWishlist({ products: [] });
    try {
      const { data } = await api.get("/wishlist");
      setWishlist(data);
    } catch (err) {}
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (productId) => {
    if (!user) {
      toast.error("Please login to save favorites");
      return;
    }
    try {
      const { data } = await api.post("/wishlist/toggle", { productId });
      setWishlist(data);
      const isIn = data.products.some((p) => p._id === productId);
      toast.success(isIn ? "Added to wishlist" : "Removed from wishlist");
    } catch (err) {
      toast.error("Could not update wishlist");
    }
  };

  const isWishlisted = (productId) => wishlist.products?.some((p) => p._id === productId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
