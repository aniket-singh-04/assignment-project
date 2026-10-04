import { useState, useEffect, useCallback } from 'react';
import { fetchAdminStores, deleteStore } from '../../services/adminApi';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from '../../components/Sidebar';
import DataTable from '../../components/DataTable';
import Pagination from '../../components/Pagination';
import GlassCard from '../../components/GlassCard';
import CreateStoreModal from '../../components/CreateStoreModal';
import { FiSearch, FiFilter, FiStar, FiPlus, FiTrash2 } from 'react-icons/fi';

export default function Stores() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  
  // Specific filters
  const [nameFilter, setNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [addressFilter, setAddressFilter] = useState('');

  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const loadData = useCallback(async () => {
    try {
      const res = await fetchAdminStores({
        page,
        limit: 10,
        sortBy: sortConfig.key,
        sortOrder: sortConfig.direction,
        name: nameFilter,
        email: emailFilter,
        address: addressFilter,
      });
      setData(res.data || []);
      setTotal(res.total || 0);
    } catch (e) {
      console.error(e);
    }
  }, [page, nameFilter, emailFilter, addressFilter, sortConfig]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 300);
    return () => clearTimeout(timer);
  }, [loadData]);
  
  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
    setPage(1);
  };

  const handleDeleteStore = async (store) => {
    if (!window.confirm(`Are you sure you want to delete the store "${store.name}"? All associated ratings for this store will also be deleted.`)) {
      return;
    }

    try {
      setDeletingId(store.id);
      await deleteStore(store.id);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete store');
    } finally {
      setDeletingId(null);
    }
  };

  const links = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Users', path: '/admin/users' },
    { label: 'Stores', path: '/admin/stores' },
  ];

  const columns = [
    { header: 'Store Name', accessor: row => <span className="font-bold">{row.name}</span>, sortKey: 'name' },
    { header: 'Email', accessor: row => row.email, sortKey: 'email' },
    { header: 'Address', accessor: row => row.address || '-' },
    { 
      header: 'Rating', 
      accessor: row => (
        <div className="flex items-center gap-1.5 font-bold text-[#FE2C54]">
          <FiStar className="fill-current w-4 h-4" />
          <span>{row.averageRating || 'New'}</span>
        </div>
      ) 
    },
    { header: 'Owner', accessor: row => row.ownerName || row.owner_id || '-' },
    {
      header: 'Actions',
      accessor: row => (
        <button
          onClick={() => handleDeleteStore(row)}
          disabled={deletingId === row.id}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#FE2C54]/30 text-[#FE2C54] hover:bg-[#FE2C54]/10 font-semibold text-xs transition-colors disabled:opacity-50"
        >
          <FiTrash2 className="w-3.5 h-3.5" />
          <span>{deletingId === row.id ? 'Deleting...' : 'Delete'}</span>
        </button>
      )
    }
  ];

  const inputStyle = isDark 
    ? 'bg-[#232323]/60 border-[#FFFFFF]/20 text-[#FFFFFF] placeholder-[#FFFFFF]/40 focus:border-[#1D5DEC]' 
    : 'bg-[#FFFFFF] border-[#232323]/20 text-[#232323] placeholder-[#232323]/40 focus:border-[#1D5DEC]';

  return (
    <div className="flex flex-col md:flex-row w-full min-w-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Sidebar links={links} />
      <div className="flex-1 min-w-0 p-4 md:p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-[#FFFFFF]' : 'text-[#232323]'}`}>Stores Management</h2>
            <p className={isDark ? 'text-[#FFFFFF]/80 mt-1' : 'text-[#232323]/70 mt-1'}>Manage platform stores and store owners</p>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)} 
            className="bg-[#1D5DEC] hover:bg-[#1D5DEC]/90 text-[#FFFFFF] px-5 py-2.5 rounded-xl shadow-md font-bold text-sm transition-all active:scale-[0.98] flex items-center gap-1.5"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add New Store</span>
          </button>
        </div>
        
        {/* Filters */}
        <GlassCard className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4 font-bold text-xs uppercase tracking-wider text-[#FE2C54]">
            <FiFilter className="w-4 h-4" />
            <span>Filter Stores</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3.5 top-3.5 opacity-40" />
              <input 
                type="text" 
                placeholder="Filter by Name..." 
                value={nameFilter} 
                onChange={e => { setNameFilter(e.target.value); setPage(1); }} 
                className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm transition-all ${inputStyle}`} 
              />
            </div>
            <div className="relative">
              <FiSearch className="absolute left-3.5 top-3.5 opacity-40" />
              <input 
                type="text" 
                placeholder="Filter by Email..." 
                value={emailFilter} 
                onChange={e => { setEmailFilter(e.target.value); setPage(1); }} 
                className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm transition-all ${inputStyle}`} 
              />
            </div>
            <div className="relative">
              <FiSearch className="absolute left-3.5 top-3.5 opacity-40" />
              <input 
                type="text" 
                placeholder="Filter by Address..." 
                value={addressFilter} 
                onChange={e => { setAddressFilter(e.target.value); setPage(1); }} 
                className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm transition-all ${inputStyle}`} 
              />
            </div>
          </div>
        </GlassCard>

        {/* Stores Table */}
        <DataTable columns={columns} data={data} sortConfig={sortConfig} onSort={handleSort} />
        
        <Pagination page={page} totalPages={Math.ceil(total / 10)} onPageChange={setPage} />

        <CreateStoreModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
          onSuccess={loadData} 
        />
      </div>
    </div>
  );
}
