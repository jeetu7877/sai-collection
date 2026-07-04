import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyEmail, resendVerification } = useAuth();

  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyEmail(email, code);
      navigate("/");
    } catch {
      // toast already shown in context
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    if (!email) return;
    setResending(true);
    try {
      await resendVerification(email);
    } catch {
      // toast already shown in context
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="glass rounded-2xl p-8">
        <h1 className="font-heading text-2xl font-bold text-white mb-1">Verify your email</h1>
        <p className="text-gray-500 text-sm mb-6">
          We've sent a 6-digit code to your email address. Enter it below to activate your account.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="input-field"
            required
          />
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="6-digit code"
            inputMode="numeric"
            className="input-field text-center tracking-[0.5em] text-lg"
            maxLength={6}
            required
          />
          <button disabled={loading} className="btn-primary w-full justify-center">
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>

        <button
          onClick={onResend}
          disabled={resending || !email}
          className="mt-4 text-sm text-accent hover:underline disabled:opacity-50 disabled:no-underline w-full text-center"
        >
          {resending ? "Sending..." : "Resend code"}
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          Wrong email? <Link to="/register" className="text-accent hover:underline">Sign up again</Link>
        </p>
      </div>
    </div>
  );
}
