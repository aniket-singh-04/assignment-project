import { FiSearch } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

export default function SearchFilter({ search, onSearchChange, placeholder = "Search..." }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="mb-6 relative max-w-md">
      <FiSearch className={`absolute left-3.5 top-3.5 w-4 h-4 ${isDark ? 'text-white/50' : 'text-slate-400'}`} />
      <input 
        type="text" 
        placeholder={placeholder}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border backdrop-blur-md transition-all text-sm shadow-sm ${
          isDark 
            ? 'bg-slate-900/40 border-white/20 text-white placeholder-white/50 focus:border-teal-400 focus:ring-1 focus:ring-teal-400' 
            : 'bg-white/70 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
        }`}
      />
    </div>
  );
}
