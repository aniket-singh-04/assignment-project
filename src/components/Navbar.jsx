import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { logoutUser } from '../services/authApi';
import { useState } from 'react';
import { FiStar, FiMenu, FiX, FiLogOut, FiSun, FiMoon } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isDark = theme === 'dark';

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      // Ignore errors on logout
    } finally {
      logout();
      navigate('/login');
    }
  };

  return (
    <nav className={`px-4 sm:px-6 py-4 backdrop-blur-md border-b sticky top-0 z-50 transition-colors duration-300 ${
      isDark 
        ? 'bg-[#232323]/80 border-[#FFFFFF]/15 text-[#FFFFFF] shadow-xl' 
        : 'bg-[#FFFFFF]/85 border-[#232323]/15 text-[#232323] shadow-md'
    }`}>
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="bg-gradient-to-tr from-[#D90166] to-[#FE2C54] text-[#FFFFFF] p-2 rounded-xl group-hover:scale-105 transition-transform shadow-md">
            <FiStar className="w-5 h-5 fill-current" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#1D5DEC] via-[#D90166] to-[#FE2C54] bg-clip-text text-transparent">
            TruRate
          </span>
        </Link>
        
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`p-2.5 rounded-xl border backdrop-blur-md transition-all flex items-center justify-center ${
              isDark 
                ? 'bg-[#FFFFFF]/10 border-[#FFFFFF]/20 text-[#FE2C54] hover:bg-[#FFFFFF]/20 shadow-inner' 
                : 'bg-[#232323]/10 border-[#232323]/20 text-[#1D5DEC] hover:bg-[#232323]/20 shadow-sm'
            }`}
          >
            {isDark ? <FiSun className="w-5 h-5 text-[#FE2C54]" /> : <FiMoon className="w-5 h-5 text-[#1D5DEC]" />}
          </button>

          {user && (
            <>
              {/* Desktop View */}
              <div className="hidden md:flex items-center gap-4">
                <Link 
                  to="/profile" 
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-all border ${
                    isDark 
                      ? 'hover:bg-[#FFFFFF]/10 border-transparent hover:border-[#FFFFFF]/15 text-[#FFFFFF]' 
                      : 'hover:bg-[#232323]/5 border-transparent hover:border-[#232323]/15 text-[#232323]'
                  }`}
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#1D5DEC] to-[#D90166] text-[#FFFFFF] flex items-center justify-center font-bold text-sm shadow-md">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-sm leading-tight">{user.name}</span>
                    <span className="text-[10px] opacity-75 uppercase tracking-wider font-semibold text-[#FE2C54]">{user.role}</span>
                  </div>
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className={`px-4 py-2 rounded-xl border font-semibold text-sm transition-all flex items-center gap-2 shadow-sm ${
                    isDark 
                      ? 'bg-[#1D5DEC] hover:bg-[#1D5DEC]/90 text-[#FFFFFF] border-transparent' 
                      : 'bg-[#232323] hover:bg-[#000000] text-[#FFFFFF] border-transparent'
                  }`}
                >
                  <FiLogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>

              {/* Mobile Toggle */}
              <button 
                className={`md:hidden p-2.5 rounded-xl border ${
                  isDark ? 'bg-[#FFFFFF]/10 border-[#FFFFFF]/20 text-[#FFFFFF]' : 'bg-[#232323]/10 border-[#232323]/20 text-[#232323]'
                }`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {user && isMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-[#FFFFFF]/20 flex flex-col gap-4">
          <Link 
            to="/profile" 
            onClick={() => setIsMenuOpen(false)} 
            className={`flex items-center justify-between p-3 rounded-xl transition-colors border ${
              isDark ? 'hover:bg-[#FFFFFF]/10 border-[#FFFFFF]/10' : 'hover:bg-[#232323]/5 border-[#232323]/15'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#1D5DEC] text-[#FFFFFF] flex items-center justify-center font-bold shadow-md">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold leading-tight">{user.name}</span>
                <span className="text-xs opacity-75">{user.email}</span>
              </div>
            </div>
            <span className="text-xs bg-[#D90166]/20 text-[#FE2C54] px-3 py-1 rounded-full uppercase font-semibold">{user.role}</span>
          </Link>
          
          <button 
            onClick={handleLogout}
            className="w-full py-2.5 rounded-xl font-semibold text-sm text-center flex items-center justify-center gap-2 bg-[#1D5DEC] text-[#FFFFFF] shadow-sm"
          >
            <FiLogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
