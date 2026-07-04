import { Link } from "react-router-dom";
import { FiInstagram, FiFacebook, FiPhone, FiMail, FiMapPin } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-base-900/60 mt-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <span className="font-display text-2xl text-white">
            MenStyle<span className="text-accent">Pro</span>
          </span>
          <p className="mt-3 text-sm text-gray-400 leading-relaxed">
            Premium menswear — shirts, denim, and tailoring, curated for the modern man.
          </p>
          <div className="mt-4 flex gap-4 text-gray-400">
            <a href="#" aria-label="Instagram" className="hover:text-accent"><FiInstagram size={18} /></a>
            <a href="#" aria-label="Facebook" className="hover:text-accent"><FiFacebook size={18} /></a>
          </div>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-white mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/shop?type=Shirt" className="hover:text-accent">Shirts</Link></li>
            <li><Link to="/shop?type=Jeans" className="hover:text-accent">Jeans</Link></li>
            <li><Link to="/shop?type=T-Shirt" className="hover:text-accent">T-Shirts</Link></li>
            <li><Link to="/shop?type=Blazer" className="hover:text-accent">Blazers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-white mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/about" className="hover:text-accent">Our Story</Link></li>
            <li><Link to="/contact" className="hover:text-accent">Contact Us</Link></li>
            <li><Link to="/profile" className="hover:text-accent">My Account</Link></li>
            <li><Link to="/orders" className="hover:text-accent">Track Order</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-white mb-4">Get in touch</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-center gap-2"><FiMapPin className="text-accent shrink-0" /> Jaipur, Rajasthan, India</li>
            <li className="flex items-center gap-2"><FiPhone className="text-accent shrink-0" /> +91 98765 43210</li>
            <li className="flex items-center gap-2"><FiMail className="text-accent shrink-0" /> hello@menstylepro.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} MenStyle Pro. All rights reserved.
      </div>
    </footer>
  );
}
