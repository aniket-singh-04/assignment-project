import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import GlassCard from './GlassCard';
import { FiGrid, FiUsers, FiShoppingBag, FiUser, FiLogOut, FiShield, FiMenu, FiX, FiSidebar } from 'react-icons/fi';

export default function Sidebar({ links }) {
  const location = useLocation();
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const isDark = theme === 'dark';
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const getIcon = (label) => {
    const l = label.toLowerCase();
    if (l.includes('dashboard') || l.includes('overview')) return <FiGrid className="w-4 h-4" />;
    if (l.includes('user')) return <FiUsers className="w-4 h-4" />;
    if (l.includes('store')) return <FiShoppingBag className="w-4 h-4" />;
    if (l.includes('profile')) return <FiUser className="w-4 h-4" />;
    return <FiShield className="w-4 h-4" />;
  };

  const SidebarContent = () => (
    <div className="flex flex-col justify-between h-full space-y-6">
      <div className="space-y-6">
        {/* Navigation Section Title & Mobile Close */}
        <div className="flex items-center justify-between px-3 pt-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FE2C54]">
            Main Menu
          </span>
          {/* Mobile Close Button */}
          <button 
            onClick={() => setIsOpenMobile(false)}
            className="md:hidden p-1.5 rounded-lg opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Close menu"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Links List */}
        <div className="space-y-1.5">
          {links.map((link, idx) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={idx}
                to={link.path}
                onClick={() => setIsOpenMobile(false)}
                className={`px-4 py-3 rounded-2xl transition-all font-bold text-sm flex items-center gap-3 border ${
                  isActive 
                    ? 'bg-[#1D5DEC] text-[#FFFFFF] shadow-md border-transparent scale-[1.02]' 
                    : (isDark 
                        ? 'text-[#FFFFFF]/80 border-transparent hover:bg-[#D90166]/20 hover:text-[#FFFFFF]' 
                        : 'text-[#232323] border-transparent hover:bg-[#1D5DEC]/10 hover:text-[#1D5DEC]')
                }`}
              >
                {getIcon(link.label)}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer Profile Box */}
      {user && (
        <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${
          isDark ? 'bg-[#232323]/50 border-[#FFFFFF]/10' : 'bg-[#FFFFFF]/80 border-[#232323]/10'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1D5DEC] to-[#D90166] text-[#FFFFFF] flex items-center justify-center font-extrabold text-sm shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden">
              <h4 className={`text-xs font-bold truncate ${isDark ? 'text-[#FFFFFF]' : 'text-[#232323]'}`}>
                {user.name}
              </h4>
              <p className="text-[10px] font-semibold text-[#1D5DEC] uppercase tracking-wider truncate">
                {user.role}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsOpenMobile(false);
              logout();
            }}
            className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
              isDark 
                ? 'border-[#FE2C54]/30 text-[#FE2C54] hover:bg-[#FE2C54]/20' 
                : 'border-[#FE2C54]/30 text-[#FE2C54] hover:bg-[#FE2C54]/10'
            }`}
          >
            <FiLogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <div className="md:hidden w-full mb-4">
        <button
          onClick={() => setIsOpenMobile(true)}
          className={`w-full py-3 px-4 rounded-2xl border flex items-center justify-between font-bold text-sm shadow-md transition-all ${
            isDark 
              ? 'bg-[#232323]/70 border-[#FFFFFF]/15 text-[#FFFFFF]' 
              : 'bg-[#FFFFFF]/90 border-[#232323]/15 text-[#232323]'
          }`}
        >
          <div className="flex items-center gap-2 text-[#1D5DEC]">
            <FiSidebar className="w-5 h-5" />
            <span>Open Navigation Menu</span>
          </div>
          <FiMenu className="w-5 h-5 opacity-70" />
        </button>
      </div>

      {/* Mobile Drawer Backdrop & Floating Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-[#000000]/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsOpenMobile(false)}
          />
          <div className="relative z-10 w-72 max-w-[calc(100vw-2rem)] my-4 ml-4 flex-1 animate-in slide-in-from-left duration-300">
            <GlassCard className="h-[calc(100vh-2rem)] p-5 !rounded-3xl shadow-2xl overflow-y-auto border border-[#FFFFFF]/15">
              <SidebarContent />
            </GlassCard>
          </div>
        </div>
      )}

      {/* Desktop Floating Sidebar with Rounded Corners */}
      <GlassCard className="w-64 min-h-[calc(100vh-6rem)] p-5 hidden md:flex flex-col justify-between !rounded-3xl shadow-xl shrink-0 my-1 mr-4 border border-[#FFFFFF]/15">
        <SidebarContent />
      </GlassCard>
    </>
  );
}
