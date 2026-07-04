import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { useWishlist } from "../context/WishlistContext";

export default function ProductCard({ product }) {
  const { toggleWishlist, isWishlisted } = useWishlist();

  return (
    <div className="group relative glass glass-hover rounded-2xl overflow-hidden animate-fade-up">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-base-800">
          <img
            src={product.images?.[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.discountPercent > 0 && (
            <span className="badge absolute top-3 left-3 bg-accent text-white">
              -{product.discountPercent}%
            </span>
          )}
          {product.isNewArrival && (
            <span className="badge absolute top-3 right-3 bg-white/10 text-white backdrop-blur">
              New
            </span>
          )}
        </div>
      </Link>
      <button
        onClick={() => toggleWishlist(product._id)}
        aria-label="Toggle wishlist"
        className={`absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur transition-colors ${
          product.isNewArrival ? "top-12" : ""
        } ${isWishlisted?.(product._id) ? "bg-accent text-white" : "bg-black/40 text-white hover:bg-accent"}`}
      >
        <FiHeart size={14} fill={isWishlisted?.(product._id) ? "currentColor" : "none"} />
      </button>

      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide">{product.type}</p>
        <Link to={`/product/${product.slug}`}>
          <h3 className="mt-1 font-heading font-semibold text-white truncate hover:text-accent transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-accent font-bold">₹{product.price}</span>
          {product.mrp > product.price && (
            <span className="text-xs text-gray-500 line-through">₹{product.mrp}</span>
          )}
        </div>
        {product.ratingCount > 0 && (
          <p className="mt-1 text-xs text-gray-500">
            ★ {product.ratingAvg} ({product.ratingCount})
          </p>
        )}
      </div>
    </div>
  );
}
