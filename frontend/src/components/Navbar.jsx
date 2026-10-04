import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { logoutUser } from '../services/authApi';
import { useState } from 'react';
import { FiStar, FiMenu, FiX, FiLogOut, FiSun, FiMoon, FiGrid, FiUsers, FiShoppingBag, FiUser } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isDark = theme === 'dark';

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      // Ignore errors on logout
    } finally {
      setIsMenuOpen(false);
      logout();
      navigate('/login');
    }
  };

  const getNavLinks = () => {
    const role = user?.role?.toUpperCase();
    if (role === 'ADMIN') {
      return [
        { label: 'Dashboard', path: '/admin/dashboard', icon: <FiGrid className="w-4 h-4 text-[#1D5DEC]" /> },
        { label: 'Users Management', path: '/admin/users', icon: <FiUsers className="w-4 h-4 text-[#FE2C54]" /> },
        { label: 'Stores Management', path: '/admin/stores', icon: <FiShoppingBag className="w-4 h-4 text-[#D90166]" /> },
        { label: 'My Profile & Settings', path: '/profile', icon: <FiUser className="w-4 h-4 text-[#1D5DEC]" /> },
      ];
    }
    if (role === 'OWNER') {
      return [
        { label: 'Owner Dashboard', path: '/owner/dashboard', icon: <FiGrid className="w-4 h-4 text-[#1D5DEC]" /> },
        { label: 'My Profile & Password', path: '/profile', icon: <FiUser className="w-4 h-4 text-[#FE2C54]" /> },
      ];
    }
    return [
      { label: 'Explore Stores', path: '/user/stores', icon: <FiShoppingBag className="w-4 h-4 text-[#D90166]" /> },
      { label: 'My Profile & Settings', path: '/profile', icon: <FiUser className="w-4 h-4 text-[#1D5DEC]" /> },
    ];
  };

  return (
    <nav className={`px-4 sm:px-6 py-4 backdrop-blur-md border-b sticky top-0 z-50 transition-colors duration-300 relative ${
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

              {/* Mobile Hamburger Button */}
              <button 
                className={`md:hidden p-2.5 rounded-xl border transition-all ${
                  isDark ? 'bg-[#FFFFFF]/10 border-[#FFFFFF]/20 text-[#FFFFFF]' : 'bg-[#232323]/10 border-[#232323]/20 text-[#232323]'
                }`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle navigation menu"
              >
                {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Short Floating Absolute Positioned Hamburger Dropdown Menu */}
      {user && isMenuOpen && (
        <div 
          className={`absolute top-full right-4 sm:right-6 mt-2 w-72 max-w-[calc(100vw-2rem)] p-4 rounded-2xl border shadow-2xl z-50 backdrop-blur-xl animate-in zoom-in-95 duration-200 ${
            isDark 
              ? 'bg-[#232323]/95 border-[#FFFFFF]/15 text-[#FFFFFF]' 
              : 'bg-[#FFFFFF]/95 border-[#232323]/15 text-[#232323]'
          }`}
        >
          {/* User Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#FFFFFF]/10">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#1D5DEC] to-[#D90166] text-[#FFFFFF] flex items-center justify-center font-extrabold text-sm shrink-0">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-bold text-xs truncate leading-tight">{user.name}</h4>
                <p className="text-[10px] opacity-70 truncate">{user.email}</p>
              </div>
            </div>
            <span className="text-[10px] bg-[#1D5DEC]/20 text-[#1D5DEC] px-2 py-0.5 rounded-md font-extrabold uppercase shrink-0 border border-[#1D5DEC]/30">
              {user.role}
            </span>
          </div>

          {/* Integrated Navigation Links */}
          <div className="space-y-1 mb-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FE2C54] px-2 block mb-1">
              Navigation Menu
            </span>
            {getNavLinks().map((link, idx) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={idx}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                    isActive
                      ? 'bg-[#1D5DEC] text-[#FFFFFF] border-transparent shadow-sm'
                      : (isDark 
                          ? 'hover:bg-[#FFFFFF]/10 border-transparent text-[#FFFFFF]/80' 
                          : 'hover:bg-[#232323]/5 border-transparent text-[#232323]')
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="w-full py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-[#FE2C54]/20 border border-[#FE2C54]/30 text-[#FE2C54] hover:bg-[#FE2C54]/30 transition-all active:scale-[0.98]"
          >
            <FiLogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
}
