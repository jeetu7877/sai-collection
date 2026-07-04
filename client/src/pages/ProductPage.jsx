import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiHeart, FiShare2, FiStar, FiCheck } from "react-icons/fi";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function ProductPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    setData(null);
    api.get(`/products/${slug}`).then((res) => {
      setData(res.data);
      setActiveImg(0);
      setSize("");
      setColor("");
    });
    api.get(`/reviews/${slug}`).catch(() => {});
  }, [slug]);

  if (!data) return <Loader label="Loading product..." />;
  const { product, related } = data;

  const availableColors = [...new Set(product.variants.map((v) => v.color))];
  const availableSizes = [...new Set(product.variants.map((v) => v.size))];
  const selectedVariant = product.variants.find((v) => v.size === size && v.color === color);

  const handleAddToCart = () => {
    if (!size || !color) return toast.error("Please select size and color");
    if (!selectedVariant || selectedVariant.stock === 0) return toast.error("Selected combination is out of stock");
    addToCart(product._id, size, color, 1);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to leave a review");
    try {
      await api.post("/reviews", { productId: product._id, ...reviewForm });
      toast.success("Review submitted!");
      setReviewForm({ rating: 5, comment: "" });
      const { data } = await api.get(`/reviews/${product._id}`);
      setReviews(data);
    } catch {
      toast.error("Could not submit review");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-10">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="rounded-2xl overflow-hidden glass aspect-[3/4] mb-4">
            <img src={product.images[activeImg]} alt={product.name} className="h-full w-full object-cover" />
          </div>
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`h-16 w-16 rounded-lg overflow-hidden border-2 ${activeImg === i ? "border-accent" : "border-transparent"}`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <p className="text-xs text-accent uppercase tracking-wide">{product.brand?.name || product.type}</p>
          <h1 className="font-heading text-3xl font-bold text-white mt-1">{product.name}</h1>
          {product.ratingCount > 0 && (
            <div className="flex items-center gap-1 mt-2 text-sm text-gray-400">
              <FiStar className="text-accent" fill="currentColor" /> {product.ratingAvg} ({product.ratingCount} reviews)
            </div>
          )}

          <div className="mt-4 flex items-center gap-3">
            <span className="text-3xl font-bold text-accent">₹{product.price}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-gray-500 line-through">₹{product.mrp}</span>
                <span className="badge bg-accent/15 text-accent">-{product.discountPercent}%</span>
              </>
            )}
          </div>

          <p className="mt-5 text-gray-400 text-sm leading-relaxed">{product.description}</p>

          <div className="mt-6">
            <p className="text-sm font-heading font-semibold text-white mb-2">Color</p>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`rounded-full border px-4 py-1.5 text-sm ${
                    color === c ? "border-accent text-accent bg-accent/10" : "border-white/15 text-gray-400"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-sm font-heading font-semibold text-white mb-2">Size</p>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`h-10 w-10 rounded-lg border text-sm ${
                    size === s ? "border-accent text-accent bg-accent/10" : "border-white/15 text-gray-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {selectedVariant && (
            <p className="mt-3 text-xs text-gray-500">
              {selectedVariant.stock > 0 ? (
                <span className="text-green-400 flex items-center gap-1"><FiCheck /> In stock ({selectedVariant.stock} left)</span>
              ) : (
                <span className="text-red-400">Out of stock</span>
              )}
            </p>
          )}

          <div className="mt-8 flex gap-3">
            <button onClick={handleAddToCart} className="btn-primary flex-1 justify-center">Add to Cart</button>
            <button
              onClick={() => toggleWishlist(product._id)}
              className={`btn-outline !px-4 ${isWishlisted(product._id) ? "border-accent text-accent" : ""}`}
            >
              <FiHeart fill={isWishlisted(product._id) ? "currentColor" : "none"} />
            </button>
            <button className="btn-outline !px-4"><FiShare2 /></button>
          </div>

          <div className="mt-8 glass rounded-xl p-5 grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-gray-500">Material</p><p className="text-white">{product.material}</p></div>
            <div><p className="text-gray-500">Fit</p><p className="text-white">{product.fitType}</p></div>
            <div><p className="text-gray-500">Sleeve</p><p className="text-white">{product.sleeve}</p></div>
            <div><p className="text-gray-500">Care</p><p className="text-white">{product.washInstructions}</p></div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16 grid md:grid-cols-2 gap-10">
        <div>
          <h3 className="section-title !text-2xl mb-4">Customer Reviews</h3>
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r._id} className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white text-sm">{r.user?.name}</p>
                    <div className="flex text-accent">{[...Array(r.rating)].map((_, i) => <FiStar key={i} fill="currentColor" size={12} />)}</div>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h3 className="section-title !text-2xl mb-4">Write a Review</h3>
          <form onSubmit={submitReview} className="glass rounded-xl p-5 space-y-4">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button type="button" key={n} onClick={() => setReviewForm((f) => ({ ...f, rating: n }))}>
                  <FiStar className={n <= reviewForm.rating ? "text-accent" : "text-gray-600"} fill={n <= reviewForm.rating ? "currentColor" : "none"} size={22} />
                </button>
              ))}
            </div>
            <textarea
              value={reviewForm.comment}
              onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
              placeholder="Share your experience..."
              rows={4}
              className="input-field"
            />
            <button className="btn-primary w-full justify-center">Submit Review</button>
          </form>
        </div>
      </div>

      {/* Related */}
      {related?.length > 0 && (
        <div className="mt-16">
          <h3 className="section-title mb-6">You May Also Like</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
