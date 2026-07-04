import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-8xl font-Audiowide font-extrabold bg-gradient-to-r from-sky-900 via-cyan-400 to-white bg-clip-text text-transparent mb-4">
        404
      </h1>
      <p className="text-2xl font-semibold mb-2">Page Not Found</p>
      <p className="text-gray-400 mb-8">
        Looks like you wandered off the map. Respawn at the home base.
      </p>
      <Link
        to="/"
        className="bg-cyan-500 text-black px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-cyan-400 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
