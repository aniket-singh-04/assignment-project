import { useState, useEffect } from 'react';
import { fetchOwnerDashboard, fetchOwnerRatings } from '../../services/ownerApi';
import { useTheme } from '../../context/ThemeContext';
import Loading from '../../components/Loading';
import Sidebar from '../../components/Sidebar';
import DataTable from '../../components/DataTable';
import GlassCard from '../../components/GlassCard';
import { FiStar, FiUsers, FiShoppingBag, FiMapPin, FiMessageSquare } from 'react-icons/fi';

export default function Dashboard() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [dashboardData, setDashboardData] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([fetchOwnerDashboard(), fetchOwnerRatings()])
      .then(([dashboardRes, ratingsRes]) => {
        const dData = dashboardRes.data || dashboardRes;
        const rData = ratingsRes.data || ratingsRes;
        setDashboardData(dData);
        setRatings(Array.isArray(rData) ? rData : (rData.data || []));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const links = [
    { label: 'Dashboard', path: '/owner/dashboard' },
    { label: 'Profile & Password', path: '/profile' },
  ];

  const columns = [
    { 
      header: 'User Name', 
      accessor: row => <span className={`font-bold ${isDark ? 'text-[#FFFFFF]' : 'text-[#232323]'}`}>{row.user?.name || 'Anonymous User'}</span> 
    },
    { 
      header: 'User Email', 
      accessor: row => <span className="opacity-80 text-sm">{row.user?.email || 'N/A'}</span> 
    },
    { 
      header: 'Rating Given', 
      accessor: row => (
        <div className="flex items-center gap-1.5 font-extrabold text-[#FE2C54]">
          <FiStar className="h-4 w-4 fill-current text-[#FE2C54]" />
          <span>{row.rating} <span className="opacity-50 text-xs font-normal">/ 5</span></span>
        </div>
      ) 
    },
    {
      header: 'Review Comment',
      accessor: row => (
        <span className="opacity-90 text-sm italic">
          {row.review ? `"${row.review}"` : <span className="opacity-40">Star rating only</span>}
        </span>
      )
    },
    {
      header: 'Submitted On',
      accessor: row => (
        <span className="opacity-60 text-xs">
          {row.created_at ? new Date(row.created_at).toLocaleDateString() : '-'}
        </span>
      )
    }
  ];

  return (
    <div className="flex -mt-4 sm:-mt-6 lg:-mt-8 -mx-4 sm:-mx-6 lg:-mx-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Sidebar links={links} />
      <div className="flex-1 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-[#FFFFFF]' : 'text-[#232323]'}`}>
              Store Owner Dashboard
            </h2>
            <p className={isDark ? 'text-[#FFFFFF]/80 mt-1' : 'text-[#232323]/70 mt-1'}>
              Track your store performance and customer ratings
            </p>
          </div>
          
          {dashboardData?.store && (
            <GlassCard className="px-4 py-2.5 flex items-center gap-3">
              <FiShoppingBag className="w-5 h-5 text-[#FE2C54]" />
              <div>
                <h4 className={`font-bold text-sm leading-none ${isDark ? 'text-[#FFFFFF]/70' : 'text-[#232323]/70'}`}>{dashboardData.store.name}</h4>
                <p className={`opacity-70 text-xs mt-1 flex items-center gap-1 ${isDark ? 'text-[#FFFFFF]/70' : 'text-[#232323]/70'}`}>
                  <FiMapPin className="w-3 h-3 text-[#1D5DEC]" />
                  {dashboardData.store.address || 'No address registered'}
                </p>
              </div>
            </GlassCard>
          )}
        </div>
        
        {error && (
          <div className="bg-[#FE2C54]/20 border-l-4 border-[#FE2C54] text-[#FE2C54] p-4 rounded-xl mb-8 shadow-sm text-sm font-medium">
            {error}
          </div>
        )}
        
        {loading ? <Loading /> : (
          <div className="space-y-8">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <GlassCard className="p-6 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <FiStar className="h-16 w-16 text-[#FE2C54]" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#FE2C54]">Average Store Rating</h3>
                <div className="flex items-baseline gap-2 mt-4">
                  <p className="text-5xl font-extrabold text-[#FE2C54]">
                    {dashboardData?.stats?.averageRating !== undefined ? dashboardData.stats.averageRating : 'N/A'}
                  </p>
                  <span className="opacity-60 text-sm font-semibold">/ 5.0</span>
                </div>
              </GlassCard>
              
              <GlassCard className="p-6 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <FiUsers className="h-16 w-16 text-[#1D5DEC]" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1D5DEC]">Total Customer Ratings</h3>
                <p className="text-5xl font-extrabold text-[#1D5DEC] mt-4">
                  {dashboardData?.stats?.totalRatings ?? 0}
                </p>
              </GlassCard>
            </div>
            
            {/* User Ratings Table */}
            <GlassCard className="overflow-hidden !p-0">
              <div className={`px-6 py-5 border-b flex items-center justify-between ${
                isDark ? 'border-[#FFFFFF]/10 bg-[#000000]/20' : 'border-[#232323]/10 bg-[#232323]/5'
              }`}>
                <div className="flex items-center gap-2">
                  <FiMessageSquare className="w-5 h-5 text-[#FE2C54]" />
                  <h3 className="text-lg font-bold">Ratings Submitted for Your Store</h3>
                </div>
                <span className="text-xs font-semibold opacity-70 bg-[#1D5DEC]/20 text-[#1D5DEC] px-3 py-1 rounded-full border border-[#1D5DEC]/30">
                  {ratings.length} Rating(s)
                </span>
              </div>
              <div className="p-0">
                <DataTable columns={columns} data={ratings} />
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
}
