import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Accueil" },
    { path: "/portfolio", label: "Portfolio" },
    { path: "/about", label: "À Propos" },
    { path: "/contact", label: "Contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop Navigation - Horizontal Top */}
      <nav
        className="hidden md:flex fixed top-0 left-0 w-full h-20 items-center justify-between px-12 z-50 bg-black/80 backdrop-blur-md border-b border-fdm-border"
        data-testid="desktop-navigation"
      >
        {/* Logo */}
        <Link to="/" className="group" data-testid="nav-logo">
          <div className="flex items-center gap-1">
            <span className="font-display text-2xl font-bold tracking-tighter">
              FDM
            </span>
            <span className="red-dot"></span>
          </div>
        </Link>

        {/* Nav Links - Horizontal */}
        <div className="flex items-center gap-12">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link font-display text-xs uppercase tracking-[0.3em] transition-colors ${
                isActive(link.path)
                  ? "text-fdm-accent"
                  : "text-fdm-text-secondary hover:text-fdm-text"
              }`}
              data-testid={`nav-link-${link.label.toLowerCase().replace(" ", "-")}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Admin Link */}
        <Link
          to="/admin/login"
          className="text-fdm-text-secondary hover:text-fdm-accent transition-colors font-display text-xs uppercase tracking-[0.3em]"
          data-testid="nav-admin-link"
        >
          <span>Admin</span>
        </Link>
      </nav>

      {/* Mobile Navigation */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-t border-fdm-border"
        data-testid="mobile-navigation"
      >
        <div className="flex items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="font-display text-lg font-bold tracking-tighter"
          >
            FDM<span className="red-dot"></span>
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2"
            data-testid="mobile-menu-toggle"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-full left-0 right-0 bg-black border-t border-fdm-border"
            >
              <div className="flex flex-col p-6 gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`font-display text-sm uppercase tracking-[0.3em] ${
                      isActive(link.path) ? "text-fdm-accent" : "text-fdm-text"
                    }`}
                    data-testid={`mobile-nav-link-${link.label.toLowerCase().replace(" ", "-")}`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className="text-fdm-text-secondary font-display text-xs uppercase tracking-[0.3em] mt-4 pt-4 border-t border-fdm-border"
                >
                  Admin
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navigation;
