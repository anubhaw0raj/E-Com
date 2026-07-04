function Spinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <div className="w-10 h-10 border-4 border-gray-700 border-t-cyan-400 rounded-full animate-spin mb-4"></div>
      <p>{label}</p>
    </div>
  );
}

export default Spinner;
