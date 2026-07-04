import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      navigate("/");
    } catch (err) {
      if (err.response?.data?.needsVerification) {
        navigate("/verify-email", { state: { email: err.response.data.email } });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="glass rounded-2xl p-8">
        <h1 className="font-heading text-2xl font-bold text-white mb-1">Welcome back</h1>
        <p className="text-gray-500 text-sm mb-6">Login to access your account and rewards.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register("email", { required: true })} type="email" placeholder="Email address" className="input-field" />
          <input {...register("password", { required: true })} type="password" placeholder="Password" className="input-field" />
          <button disabled={loading} className="btn-primary w-full justify-center">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account? <Link to="/register" className="text-accent hover:underline">Sign up</Link>
        </p>

        <div className="mt-6 border-t border-white/10 pt-4 text-xs text-gray-600">
          <p>Demo accounts:</p>
          <p>Admin: admin@menstylepro.com / admin123</p>
          <p>Customer: rahul@example.com / customer123</p>
        </div>
      </div>
    </div>
  );
}
