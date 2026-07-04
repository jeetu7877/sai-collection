export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div className="h-10 w-10 rounded-full border-2 border-white/10 border-t-accent animate-spin" />
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
