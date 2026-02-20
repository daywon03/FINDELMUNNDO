import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const MinimalArrowButton = ({ to, text }) => {
  return (
    <Link 
      to={to} 
      className="group flex flex-col items-center gap-6"
      data-testid="minimal-arrow-button"
    >
      {/* Optional Text */}
      {text && (
        <span className="font-display text-xs uppercase tracking-[0.3em] text-fdm-text opacity-80 group-hover:opacity-100 transition-opacity duration-500">
          {text}
        </span>
      )}

      {/* Button Circle */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="w-16 h-16 rounded-full border-[1px] border-white/40 flex items-center justify-center bg-transparent backdrop-blur-sm group-hover:bg-white/5 group-hover:border-white/80 transition-colors duration-500"
      >
        <ArrowRight 
          size={20} 
          className="text-white opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500" 
          strokeWidth={1.5}
        />
      </motion.div>
    </Link>
  );
};

export default MinimalArrowButton;
