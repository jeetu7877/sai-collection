import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register, handleSubmit } = useForm();
  const { register: signup } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await signup(data);
      navigate("/verify-email", { state: { email: data.email } });
    } catch {} finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="glass rounded-2xl p-8">
        <h1 className="font-heading text-2xl font-bold text-white mb-1">Create an account</h1>
        <p className="text-gray-500 text-sm mb-6">Join for loyalty rewards, wishlists, and faster checkout. We'll email you a code to verify your account.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register("name", { required: true })} placeholder="Full name" className="input-field" />
          <input {...register("email", { required: true })} type="email" placeholder="Email address" className="input-field" />
          <input {...register("phone")} placeholder="Phone number" className="input-field" />
          <input {...register("password", { required: true, minLength: 6 })} type="password" placeholder="Password (min 6 characters)" className="input-field" />
          <input {...register("referralCode")} placeholder="Referral code (optional)" className="input-field" />
          <button disabled={loading} className="btn-primary w-full justify-center">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account? <Link to="/login" className="text-accent hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
