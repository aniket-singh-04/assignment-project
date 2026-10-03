import { useState, useEffect, useCallback } from 'react';
import { fetchUsers } from '../../services/adminApi';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from '../../components/Sidebar';
import DataTable from '../../components/DataTable';
import Pagination from '../../components/Pagination';
import GlassCard from '../../components/GlassCard';
import CreateUserModal from '../../components/CreateUserModal';
import { FiSearch, FiFilter, FiEye, FiX, FiStar, FiUserCheck, FiPlus } from 'react-icons/fi';

export default function Users() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Specific filters
  const [nameFilter, setNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [addressFilter, setAddressFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [selectedUser, setSelectedUser] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const res = await fetchUsers({
        page,
        limit: 10,
        sortBy: sortConfig.key,
        sortOrder: sortConfig.direction,
        name: nameFilter,
        email: emailFilter,
        address: addressFilter,
        role: roleFilter,
      });
      setData(res.data || []);
      setTotal(res.total || 0);
    } catch (e) {
      console.error(e);
    }
  }, [page, nameFilter, emailFilter, addressFilter, roleFilter, sortConfig]);

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

  const links = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Users', path: '/admin/users' },
    { label: 'Stores', path: '/admin/stores' },
  ];

  const columns = [
    { header: 'Name', accessor: row => <span className="font-bold">{row.name}</span>, sortKey: 'name' },
    { header: 'Email', accessor: row => row.email, sortKey: 'email' },
    { header: 'Address', accessor: row => row.address || '-' },
    { 
      header: 'Role', 
      sortKey: 'role', 
      accessor: row => (
        <span className={`px-2.5 py-1 text-xs font-extrabold rounded-lg uppercase tracking-wider border ${
          row.role === 'ADMIN' ? 'bg-[#D90166]/20 text-[#D90166] border-[#D90166]/30' :
          row.role === 'OWNER' ? 'bg-[#FE2C54]/20 text-[#FE2C54] border-[#FE2C54]/30' :
          'bg-[#1D5DEC]/20 text-[#1D5DEC] border-[#1D5DEC]/30'
        }`}>
          {row.role}
        </span>
      )
    },
    { 
      header: 'Store Rating', 
      accessor: row => row.role === 'OWNER' ? (
        row.storeRating !== null ? (
          <div className="flex items-center gap-1 text-[#FE2C54] font-bold">
            <FiStar className="fill-current w-4 h-4" />
            <span>{row.storeRating}</span>
          </div>
        ) : <span className="opacity-50 text-xs">Unrated/No Store</span>
      ) : '-' 
    },
    {
      header: 'Actions',
      accessor: row => (
        <button
          onClick={() => setSelectedUser(row)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1D5DEC]/30 text-[#1D5DEC] hover:bg-[#1D5DEC]/10 font-semibold text-xs transition-colors"
        >
          <FiEye className="w-3.5 h-3.5" />
          <span>Details</span>
        </button>
      )
    }
  ];

  const inputStyle = isDark 
    ? 'bg-[#232323]/60 border-[#FFFFFF]/20 text-[#FFFFFF] placeholder-[#FFFFFF]/40 focus:border-[#1D5DEC]' 
    : 'bg-[#FFFFFF] border-[#232323]/20 text-[#232323] placeholder-[#232323]/40 focus:border-[#1D5DEC]';

  return (
    <div className="flex -mt-4 sm:-mt-6 lg:-mt-8 -mx-4 sm:-mx-6 lg:-mx-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Sidebar links={links} />
      <div className="flex-1 p-6 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-[#FFFFFF]' : 'text-[#232323]'}`}>Users Management</h2>
            <p className={isDark ? 'text-[#FFFFFF]/80 mt-1' : 'text-[#232323]/70 mt-1'}>Manage normal users, store owners, and admins</p>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)} 
            className="bg-[#1D5DEC] hover:bg-[#1D5DEC]/90 text-[#FFFFFF] px-5 py-2.5 rounded-xl shadow-md font-bold text-sm transition-all active:scale-[0.98] flex items-center gap-1.5"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add New User</span>
          </button>
        </div>

        {/* Filters */}
        <GlassCard className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4 font-bold text-xs uppercase tracking-wider text-[#FE2C54]">
            <FiFilter className="w-4 h-4" />
            <span>Filter Users</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <div>
              <select 
                value={roleFilter} 
                onChange={e => { setRoleFilter(e.target.value); setPage(1); }} 
                className={`w-full px-3 py-2.5 rounded-xl border text-sm transition-all ${
                  isDark ? 'bg-[#232323] border-[#FFFFFF]/20 text-[#FFFFFF]' : 'bg-[#FFFFFF] border-[#232323]/20 text-[#232323]'
                }`}
              >
                <option value="">All Roles</option>
                <option value="USER">Normal User (USER)</option>
                <option value="OWNER">Store Owner (OWNER)</option>
                <option value="ADMIN">Super Admin (ADMIN)</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Users Table */}
        <DataTable columns={columns} data={data} sortConfig={sortConfig} onSort={handleSort} />
        
        <Pagination page={page} totalPages={Math.ceil(total / 10)} onPageChange={setPage} />

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <GlassCard className="w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 !rounded-2xl p-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#FFFFFF]/15 mb-6">
                <div className="flex items-center gap-2.5">
                  <FiUserCheck className="w-6 h-6 text-[#1D5DEC]" />
                  <h3 className="text-xl font-bold">User Details</h3>
                </div>
                <button onClick={() => setSelectedUser(null)} className="opacity-70 hover:opacity-100 transition-opacity">
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-[#FFFFFF]/10">
                  <span className="opacity-70 text-sm font-semibold">Name</span>
                  <span className="font-bold">{selectedUser.name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#FFFFFF]/10">
                  <span className="opacity-70 text-sm font-semibold">Email</span>
                  <span className="font-bold">{selectedUser.email}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#FFFFFF]/10">
                  <span className="opacity-70 text-sm font-semibold">Address</span>
                  <span className="font-medium text-sm">{selectedUser.address || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#FFFFFF]/10">
                  <span className="opacity-70 text-sm font-semibold">Role</span>
                  <span className="font-bold text-xs uppercase px-2.5 py-1 rounded-md bg-[#1D5DEC]/20 text-[#1D5DEC] border border-[#1D5DEC]/30">{selectedUser.role}</span>
                </div>
                
                {selectedUser.role === 'OWNER' && (
                  <div className="flex justify-between items-center py-2 border-b border-[#FFFFFF]/10">
                    <span className="opacity-70 text-sm font-semibold">Store Rating</span>
                    <span className="font-bold text-base text-[#FE2C54] flex items-center gap-1">
                      <FiStar className="fill-current w-4 h-4" />
                      {selectedUser.storeRating !== null ? `${selectedUser.storeRating} / 5` : 'No Store/Unrated'}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-8 text-right">
                <button 
                  onClick={() => setSelectedUser(null)} 
                  className="bg-[#1D5DEC] text-[#FFFFFF] font-bold px-6 py-2.5 rounded-xl shadow-md text-sm hover:bg-[#1D5DEC]/90 transition-all"
                >
                  Close
                </button>
              </div>
            </GlassCard>
          </div>
        )}

        <CreateUserModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
          onSuccess={loadData} 
        />
      </div>
    </div>
  );
}
