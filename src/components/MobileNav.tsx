
import { Home, LogIn } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

const MobileNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-lg border-t border-gray-200 flex items-center justify-around md:hidden">
      <Link
        to="/"
        className={`flex flex-col items-center space-y-1 ${
          location.pathname === "/" ? "text-primary" : "text-gray-500"
        }`}
      >
        <Home size={20} />
        <span className="text-xs">Home</span>
      </Link>
      <Link
        to="/login"
        className={`flex flex-col items-center space-y-1 ${
          location.pathname === "/login" ? "text-primary" : "text-gray-500"
        }`}
      >
        <LogIn size={20} />
        <span className="text-xs">Login</span>
      </Link>
    </nav>
  );
};

export default MobileNav;
