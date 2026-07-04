import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";

export default function Wishlist() {
  const { wishlist } = useWishlist();

  if (!wishlist.products || wishlist.products.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h2 className="section-title mb-4">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-8">Save items you love to find them here later.</p>
        <Link to="/shop" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-10">
      <h1 className="section-title mb-8">My Wishlist</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {wishlist.products.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>
    </div>
  );
}
