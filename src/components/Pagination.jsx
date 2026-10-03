import { useTheme } from '../context/ThemeContext';
import GlassCard from './GlassCard';

export default function Pagination({ page, totalPages, onPageChange }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (totalPages <= 1) return null;
  
  return (
    <GlassCard className="flex flex-col sm:flex-row items-center gap-4 justify-between mt-8 p-4">
      <button 
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className={`w-full sm:w-auto px-6 py-2 border rounded-xl disabled:opacity-40 transition-colors font-medium text-sm shadow-sm ${
          isDark 
            ? 'border-white/20 text-white hover:bg-white/10' 
            : 'border-slate-300 text-slate-800 hover:bg-slate-100'
        }`}
      >
        Previous
      </button>
      
      <span className={`px-4 py-2 text-sm font-semibold rounded-xl border ${
        isDark ? 'bg-black/20 border-white/10 text-white' : 'bg-slate-100/80 border-slate-200 text-slate-800'
      }`}>
        Page <span className="text-teal-500 font-bold">{page}</span> of {totalPages || 1}
      </span>
      
      <button 
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className={`w-full sm:w-auto px-6 py-2 border rounded-xl disabled:opacity-40 transition-colors font-medium text-sm shadow-sm ${
          isDark 
            ? 'border-white/20 text-white hover:bg-white/10' 
            : 'border-slate-300 text-slate-800 hover:bg-slate-100'
        }`}
      >
        Next
      </button>
    </GlassCard>
  );
}
