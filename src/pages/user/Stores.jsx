import { useState, useEffect, useCallback } from 'react';
import { FiSearch, FiFilter, FiStar, FiMessageSquare, FiEdit2, FiMapPin, FiUserCheck } from 'react-icons/fi';
import { fetchStores, submitRating, updateRating } from '../../services/storeApi';
import { useTheme } from '../../context/ThemeContext';
import ReviewModal from '../../components/ReviewModal';
import Loading from '../../components/Loading';
import GlassCard from '../../components/GlassCard';

export default function Stores() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Advanced filters
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [minRating, setMinRating] = useState('');
  const [maxRating, setMaxRating] = useState('');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Review Modal State
  const [modalState, setModalState] = useState({ isOpen: false, storeId: null, rating: 0, review: '', isUpdate: false });

  const loadStores = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (name) params.name = name;
      if (address) params.address = address;
      if (minRating) params.minRating = minRating;
      if (maxRating) params.maxRating = maxRating;
      
      const res = await fetchStores(params);
      setStores(res.data || []);
      setTotalPages(Math.ceil((res.total || 0) / (res.limit || 10)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, name, address, minRating, maxRating]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadStores();
    }, 300);
    return () => clearTimeout(timer);
  }, [loadStores]);

  const openReviewModal = (store) => {
    setModalState({
      isOpen: true,
      storeId: store.id,
      rating: store.currentUserRating || 0,
      review: store.currentUserReview || '',
      isUpdate: !!store.currentUserRating
    });
  };

  const handleReviewSubmit = async (rating, review) => {
    try {
      if (modalState.isUpdate) {
        await updateRating(modalState.storeId, rating, review);
      } else {
        await submitRating(modalState.storeId, rating, review);
      }
      loadStores();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading && stores.length === 0) return <Loading />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-[#FFFFFF]' : 'text-[#232323]'}`}>Explore Stores</h2>
          <p className={isDark ? 'text-[#FFFFFF]/80 mt-1' : 'text-[#232323]/70 mt-1'}>Find and rate the best stores around you</p>
        </div>
      </div>

      {error && <div className="text-[#FE2C54] bg-[#FE2C54]/20 border border-[#FE2C54]/40 p-4 rounded-xl font-medium text-sm">{error}</div>}

      {/* Filter Section */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4 font-bold text-xs uppercase tracking-wider text-[#FE2C54]">
          <FiFilter className="w-4 h-4" />
          <span>Search Stores</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-3.5 opacity-50" />
            <input 
              type="text" 
              placeholder="Search by Store Name..." 
              value={name} 
              onChange={e => {setName(e.target.value); setPage(1);}} 
              className={`w-full pl-10 pr-3 py-2.5 rounded-xl border transition-all text-sm ${
                isDark 
                  ? 'bg-[#232323]/60 border-[#FFFFFF]/20 text-[#FFFFFF] placeholder-[#FFFFFF]/50 focus:border-[#1D5DEC]' 
                  : 'bg-[#FFFFFF] border-[#232323]/20 text-[#232323] placeholder-[#232323]/40 focus:border-[#1D5DEC]'
              }`} 
            />
          </div>
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-3.5 opacity-50" />
            <input 
              type="text" 
              placeholder="Search by Address..." 
              value={address} 
              onChange={e => {setAddress(e.target.value); setPage(1);}} 
              className={`w-full pl-10 pr-3 py-2.5 rounded-xl border transition-all text-sm ${
                isDark 
                  ? 'bg-[#232323]/60 border-[#FFFFFF]/20 text-[#FFFFFF] placeholder-[#FFFFFF]/50 focus:border-[#1D5DEC]' 
                  : 'bg-[#FFFFFF] border-[#232323]/20 text-[#232323] placeholder-[#232323]/40 focus:border-[#1D5DEC]'
              }`} 
            />
          </div>
          <div>
            <select 
              value={minRating} 
              onChange={e => {setMinRating(e.target.value); setPage(1);}} 
              className={`w-full px-3 py-2.5 rounded-xl border transition-all text-sm ${
                isDark 
                  ? 'bg-[#232323] border-[#FFFFFF]/20 text-[#FFFFFF]' 
                  : 'bg-[#FFFFFF] border-[#232323]/20 text-[#232323]'
              }`}
            >
              <option value="">Min Overall Rating (Any)</option>
              <option value="1">★ 1+</option>
              <option value="2">★ 2+</option>
              <option value="3">★ 3+</option>
              <option value="4">★ 4+</option>
              <option value="5">★ 5</option>
            </select>
          </div>
          <div>
            <select 
              value={maxRating} 
              onChange={e => {setMaxRating(e.target.value); setPage(1);}} 
              className={`w-full px-3 py-2.5 rounded-xl border transition-all text-sm ${
                isDark 
                  ? 'bg-[#232323] border-[#FFFFFF]/20 text-[#FFFFFF]' 
                  : 'bg-[#FFFFFF] border-[#232323]/20 text-[#232323]'
              }`}
            >
              <option value="">Max Overall Rating (Any)</option>
              <option value="4">★ 4 or less</option>
              <option value="3">★ 3 or less</option>
              <option value="2">★ 2 or less</option>
              <option value="1">★ 1 or less</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Stores List */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {stores.map(store => (
          <GlassCard key={store.id} interactive className="flex flex-col overflow-hidden !p-0">
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className={`text-xl font-bold line-clamp-1 ${isDark ? 'text-[#FFFFFF]' : 'text-[#232323]'}`}>{store.name}</h3>
                <div className="bg-[#FE2C54]/20 text-[#FE2C54] font-extrabold px-3 py-1 rounded-lg flex items-center gap-1.5 text-sm border border-[#FE2C54]/30 shrink-0">
                  <FiStar className="fill-current text-[#FE2C54]" />
                  <span>{store.averageRating ? `${store.averageRating} / 5` : 'New'}</span>
                </div>
              </div>

              {/* Address */}
              <p className={`text-xs opacity-75 mb-4 flex items-center gap-1.5 line-clamp-2 h-8 ${isDark ? 'text-[#FFFFFF]/70' : 'text-[#232323]/70'}`}>
                <FiMapPin className="w-3.5 h-3.5 text-[#1D5DEC] shrink-0" />
                <span>{store.address || 'Address not available'}</span>
              </p>

              {/* User Rating Badge */}
              <div className={`p-3 rounded-xl mb-5 flex items-center justify-between border ${
                store.currentUserRating 
                  ? (isDark ? 'bg-[#1D5DEC]/20 border-[#1D5DEC]/40 text-[#FFFFFF]' : 'bg-[#1D5DEC]/10 border-[#1D5DEC]/30 text-[#232323]') 
                  : (isDark ? 'bg-[#232323]/60 border-[#FFFFFF]/10 text-[#FFFFFF]/70' : 'bg-[#FFFFFF] border-[#232323]/10 text-[#232323]/70')
              }`}>
                <span className={`text-xs font-semibold flex items-center gap-1.5 ${isDark ? 'text-[#FFFFFF]/90' : 'text-[#232323]/90'}`}>
                  <FiUserCheck className="w-4 h-4 text-[#1D5DEC]" />
                  Your Rating:
                </span>
                <span className="font-extrabold text-sm">
                  {store.currentUserRating ? (
                    <span className="text-[#FE2C54] flex items-center gap-1">
                      <FiStar className="fill-current w-3.5 h-3.5" />
                      {store.currentUserRating} / 5
                    </span>
                  ) : (
                    <span className={`text-xs italic ${isDark ? 'text-[#FFFFFF]/50' : 'text-[#232323]/50'}`}>Not rated yet</span>
                  )}
                </span>
              </div>
              
              {/* Submit / Modify Rating Button */}
              <button 
                onClick={() => openReviewModal(store)}
                className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md border ${
                  store.currentUserRating 
                    ? (isDark ? 'bg-[#D90166]/20 border-[#D90166]/40 text-[#FFFFFF] hover:bg-[#D90166]/30' : 'bg-[#D90166]/10 border-[#D90166]/30 text-[#D90166] hover:bg-[#D90166]/20')
                    : 'bg-[#1D5DEC] text-[#FFFFFF] border-transparent hover:bg-[#1D5DEC]/90'
                }`}
              >
                {store.currentUserRating ? (
                  <><FiEdit2 /> Modify Your Rating (★ {store.currentUserRating})</>
                ) : (
                  <><FiMessageSquare /> Rate & Review Store</>
                )}
              </button>
            </div>
            
            {/* Recent Reviews Preview */}
            {store.recentReviews && store.recentReviews.length > 0 && (
              <div className={`p-5 border-t flex-1 ${isDark ? 'bg-[#000000]/30 border-[#FFFFFF]/10' : 'bg-[#232323]/5 border-[#232323]/10'}`}>
                <h4 className="text-xs font-bold uppercase tracking-wider opacity-80 mb-3 flex items-center gap-2 text-[#FE2C54]">
                  <FiMessageSquare className="w-3.5 h-3.5" /> Recent Customer Reviews
                </h4>
                <div className="space-y-3">
                  {store.recentReviews.slice(0, 2).map((rev, i) => (
                    <div key={i} className="text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-xs">{rev.userName}</span>
                        <div className="flex text-[#FE2C54] text-xs">
                          {[...Array(5)].map((_, idx) => (
                            <FiStar key={idx} className={idx < rev.rating ? 'fill-current' : 'opacity-20'} />
                          ))}
                        </div>
                      </div>
                      <p className="opacity-80 line-clamp-2 text-xs leading-snug">{rev.review || <span className="italic opacity-50">Star rating given</span>}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>
        ))}
      </div>

      {stores.length === 0 && !loading && (
        <GlassCard className="p-12 text-center">
          <FiStar className="w-12 h-12 opacity-30 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No stores found</h3>
          <p className="opacity-70">Try adjusting your search query or filters.</p>
        </GlassCard>
      )}

      {/* Pagination */}
      <GlassCard className="flex flex-col sm:flex-row items-center gap-4 justify-between p-4">
        <button 
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className={`w-full sm:w-auto px-6 py-2.5 border rounded-xl disabled:opacity-40 transition-colors font-medium text-sm ${
            isDark 
              ? 'border-[#FFFFFF]/20 text-[#FFFFFF] hover:bg-[#FFFFFF]/10' 
              : 'border-[#232323]/20 text-[#232323] hover:bg-[#232323]/10'
          }`}
        >
          Previous
        </button>
        <span className="px-4 py-2 text-sm font-semibold opacity-90">Page <span className="text-[#1D5DEC] font-bold">{page}</span> of {totalPages || 1}</span>
        <button 
          disabled={page >= totalPages}
          onClick={() => setPage(p => p + 1)}
          className={`w-full sm:w-auto px-6 py-2.5 border rounded-xl disabled:opacity-40 transition-colors font-medium text-sm ${
            isDark 
              ? 'border-[#FFFFFF]/20 text-[#FFFFFF] hover:bg-[#FFFFFF]/10' 
              : 'border-[#232323]/20 text-[#232323] hover:bg-[#232323]/10'
          }`}
        >
          Next
        </button>
      </GlassCard>

      <ReviewModal 
        isOpen={modalState.isOpen}
        initialRating={modalState.rating}
        initialReview={modalState.review}
        onClose={() => setModalState(s => ({ ...s, isOpen: false }))}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
}
