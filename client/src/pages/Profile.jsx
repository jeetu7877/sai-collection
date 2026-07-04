import { useAuth } from "../context/AuthContext";
import { FiAward, FiGift, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";

const tierColors = { Standard: "text-gray-400", Silver: "text-silver", Gold: "text-gold", VIP: "text-accent" };

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-4xl px-4 md:px-8 py-10">
      <h1 className="section-title mb-8">My Account</h1>

      <div className="grid md:grid-cols-3 gap-5 mb-8">
        <div className="glass rounded-2xl p-6">
          <FiUser className="text-accent mb-3" size={22} />
          <p className="font-heading font-semibold text-white">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
        <div className="glass rounded-2xl p-6">
          <FiAward className={`mb-3 ${tierColors[user?.membershipTier] || "text-gray-400"}`} size={22} />
          <p className={`font-heading font-bold text-lg ${tierColors[user?.membershipTier] || "text-white"}`}>
            {user?.membershipTier || "Standard"} Member
          </p>
          <p className="text-sm text-gray-500">Membership tier</p>
        </div>
        <div className="glass rounded-2xl p-6">
          <FiGift className="text-accent mb-3" size={22} />
          <p className="font-heading font-bold text-lg text-white">{user?.rewardPoints || 0} Points</p>
          <p className="text-sm text-gray-500">= ₹{Math.floor((user?.rewardPoints || 0) / 10)} discount available</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="font-heading font-semibold text-white mb-4">Quick Links</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/orders" className="btn-outline !py-2 text-sm">My Orders</Link>
          <Link to="/wishlist" className="btn-outline !py-2 text-sm">My Wishlist</Link>
          <Link to="/cart" className="btn-outline !py-2 text-sm">My Cart</Link>
        </div>
      </div>
    </div>
  );
}
