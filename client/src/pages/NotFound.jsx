import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-32 text-center">
      <h1 className="font-display text-8xl text-accent">404</h1>
      <p className="text-gray-400 mt-4 mb-8">This page doesn't exist. Let's get you back on track.</p>
      <Link to="/" className="btn-primary">Back to Home</Link>
    </div>
  );
}
