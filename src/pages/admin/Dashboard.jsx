import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAdminDashboard } from '../../services/adminApi';
import { useTheme } from '../../context/ThemeContext';
import Loading from '../../components/Loading';
import Sidebar from '../../components/Sidebar';
import GlassCard from '../../components/GlassCard';
import CreateUserModal from '../../components/CreateUserModal';
import CreateStoreModal from '../../components/CreateStoreModal';
import { FiUsers, FiShoppingBag, FiStar, FiPlus, FiArrowRight, FiActivity, FiShield, FiTrendingUp } from 'react-icons/fi';

export default function Dashboard() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);

  const loadDashboard = () => {
    setLoading(true);
    fetchAdminDashboard()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const links = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Users', path: '/admin/users' },
    { label: 'Stores', path: '/admin/stores' },
  ];

  return (
    <div className="flex -mt-4 sm:-mt-6 lg:-mt-8 -mx-4 sm:-mx-6 lg:-mx-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Sidebar links={links} />
      
      <div className="flex-1 p-6 md:p-8 space-y-8">
        {/* Header Hero Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-[#FFFFFF]' : 'text-[#232323]'}`}>
              Super Admin Overview
            </h2>
            <p className={isDark ? 'text-[#FFFFFF]/80 mt-1' : 'text-[#232323]/70 mt-1'}>
              Real-time administrative control panel & key platform metrics
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsUserModalOpen(true)}
              className="bg-[#1D5DEC] hover:bg-[#1D5DEC]/90 text-[#FFFFFF] font-bold px-4 py-2.5 rounded-xl shadow-md text-sm transition-all active:scale-[0.98] flex items-center gap-2"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add User</span>
            </button>
            <button
              onClick={() => setIsStoreModalOpen(true)}
              className="bg-[#D90166] hover:bg-[#D90166]/90 text-[#FFFFFF] font-bold px-4 py-2.5 rounded-xl shadow-md text-sm transition-all active:scale-[0.98] flex items-center gap-2"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Store</span>
            </button>
          </div>
        </div>
        
        {loading ? <Loading /> : (
          <div className="space-y-8">
            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Users Card */}
              <GlassCard className="p-6 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.01] transition-transform">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <FiUsers className="h-20 w-20 text-[#1D5DEC]" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1D5DEC]">Total Users</span>
                    <span className="p-2 rounded-xl bg-[#1D5DEC]/15 text-[#1D5DEC]">
                      <FiUsers className="w-5 h-5" />
                    </span>
                  </div>
                  <p className="text-5xl font-extrabold text-[#1D5DEC] mt-4 tracking-tight">
                    {stats?.totalUsers || 0}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#FFFFFF]/10 flex items-center justify-between text-xs">
                  <span className="opacity-70 font-medium">Registered Accounts</span>
                  <Link to="/admin/users" className="text-[#1D5DEC] font-bold hover:underline flex items-center gap-1">
                    Manage <FiArrowRight />
                  </Link>
                </div>
              </GlassCard>

              {/* Total Stores Card */}
              <GlassCard className="p-6 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.01] transition-transform">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <FiShoppingBag className="h-20 w-20 text-[#D90166]" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#D90166]">Total Stores</span>
                    <span className="p-2 rounded-xl bg-[#D90166]/15 text-[#D90166]">
                      <FiShoppingBag className="w-5 h-5" />
                    </span>
                  </div>
                  <p className="text-5xl font-extrabold text-[#D90166] mt-4 tracking-tight">
                    {stats?.totalStores || 0}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#FFFFFF]/10 flex items-center justify-between text-xs">
                  <span className="opacity-70 font-medium">Listed Businesses</span>
                  <Link to="/admin/stores" className="text-[#D90166] font-bold hover:underline flex items-center gap-1">
                    Manage <FiArrowRight />
                  </Link>
                </div>
              </GlassCard>

              {/* Total Ratings Card */}
              <GlassCard className="p-6 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.01] transition-transform">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <FiStar className="h-20 w-20 text-[#FE2C54]" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#FE2C54]">Submitted Ratings</span>
                    <span className="p-2 rounded-xl bg-[#FE2C54]/15 text-[#FE2C54]">
                      <FiStar className="w-5 h-5" />
                    </span>
                  </div>
                  <p className="text-5xl font-extrabold text-[#FE2C54] mt-4 tracking-tight">
                    {stats?.totalRatings || 0}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#FFFFFF]/10 flex items-center justify-between text-xs">
                  <span className="opacity-70 font-medium">Customer Reviews</span>
                  <span className="text-[#FE2C54] font-bold flex items-center gap-1">
                    <FiTrendingUp /> Active Feedback
                  </span>
                </div>
              </GlassCard>
            </div>

            {/* Quick Actions & Platform Status Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Management Shortcuts */}
              <GlassCard className="p-6 space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#FFFFFF]/10">
                  <FiActivity className="w-5 h-5 text-[#1D5DEC]" />
                  <h3 className={`text-lg font-bold ${isDark ? 'text-[#FFFFFF]' : 'text-[#232323]'}`}>
                    Quick Management Actions
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <button
                    onClick={() => setIsUserModalOpen(true)}
                    className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] flex items-center justify-between ${
                      isDark ? 'bg-[#232323]/50 border-[#FFFFFF]/10 hover:border-[#1D5DEC]' : 'bg-[#FFFFFF] border-[#232323]/10 hover:border-[#1D5DEC]'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-sm text-[#1D5DEC]">Add New User</h4>
                      <p className="text-xs opacity-70 mt-0.5">Register Normal User, Owner or Admin</p>
                    </div>
                    <FiPlus className="w-5 h-5 text-[#1D5DEC]" />
                  </button>

                  <button
                    onClick={() => setIsStoreModalOpen(true)}
                    className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] flex items-center justify-between ${
                      isDark ? 'bg-[#232323]/50 border-[#FFFFFF]/10 hover:border-[#D90166]' : 'bg-[#FFFFFF] border-[#232323]/10 hover:border-[#D90166]'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-sm text-[#D90166]">Add New Store</h4>
                      <p className="text-xs opacity-70 mt-0.5">Create store and assign Store Owner</p>
                    </div>
                    <FiPlus className="w-5 h-5 text-[#D90166]" />
                  </button>
                </div>
              </GlassCard>

              {/* System Security & Roles Card */}
              <GlassCard className="p-6 space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#FFFFFF]/10">
                  <FiShield className="w-5 h-5 text-[#FE2C54]" />
                  <h3 className={`text-lg font-bold ${isDark ? 'text-[#FFFFFF]' : 'text-[#232323]'}`}>
                    Security & Role Access
                  </h3>
                </div>

                <div className="space-y-3 pt-1 text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-[#FFFFFF]/10">
                    <span className="opacity-70 text-xs font-semibold uppercase">Super Admin Access</span>
                    <span className="font-bold text-xs uppercase px-2.5 py-1 rounded-md bg-[#D90166]/20 text-[#D90166] border border-[#D90166]/30">Full Control</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-[#FFFFFF]/10">
                    <span className="opacity-70 text-xs font-semibold uppercase">Store Owner Access</span>
                    <span className="font-bold text-xs uppercase px-2.5 py-1 rounded-md bg-[#FE2C54]/20 text-[#FE2C54] border border-[#FE2C54]/30">Store Dashboard</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="opacity-70 text-xs font-semibold uppercase">Normal User Access</span>
                    <span className="font-bold text-xs uppercase px-2.5 py-1 rounded-md bg-[#1D5DEC]/20 text-[#1D5DEC] border border-[#1D5DEC]/30">Store Rating</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        )}
      </div>

      {/* Popups */}
      <CreateUserModal 
        isOpen={isUserModalOpen} 
        onClose={() => setIsUserModalOpen(false)} 
        onSuccess={loadDashboard} 
      />
      <CreateStoreModal 
        isOpen={isStoreModalOpen} 
        onClose={() => setIsStoreModalOpen(false)} 
        onSuccess={loadDashboard} 
      />
    </div>
  );
}
