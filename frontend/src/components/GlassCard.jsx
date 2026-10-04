import { useTheme } from '../context/ThemeContext';

export default function GlassCard({ children, className = '', interactive = false, ...props }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const baseStyles = isDark 
    ? 'bg-[#232323]/75 backdrop-blur-md border border-[#FFFFFF]/15 text-[#FFFFFF] shadow-2xl' 
    : 'bg-[#FFFFFF]/80 backdrop-blur-md border border-[#232323]/15 text-[#232323] shadow-lg';

  const interactiveStyles = interactive 
    ? (isDark 
        ? 'hover:bg-[#232323]/95 hover:border-[#1D5DEC]/60 transition-all cursor-pointer' 
        : 'hover:bg-[#FFFFFF]/95 hover:border-[#1D5DEC]/60 transition-all cursor-pointer')
    : '';

  return (
    <div 
      className={`${baseStyles} rounded-2xl ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
