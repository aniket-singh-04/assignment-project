import { useState, useEffect } from 'react';
import { FiX, FiStar } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import GlassCard from './GlassCard';

export default function ReviewModal({ isOpen, onClose, onSubmit, initialRating = 0, initialReview = '' }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [rating, setRating] = useState(initialRating);
  const [review, setReview] = useState(initialReview);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRating(initialRating);
      setReview(initialReview || '');
    }
  }, [isOpen, initialRating, initialReview]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(rating, review);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <GlassCard className="w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 !rounded-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#FFFFFF]/15">
          <h3 className={`text-xl font-bold ${isDark ? 'text-[#FFFFFF]' : 'text-[#232323]'}`}>
            {initialRating ? 'Update Your Review' : 'Write a Review'}
          </h3>
          <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity">
            <FiX className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6 flex justify-center">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-4xl hover:scale-110 transition-transform ${
                    rating >= star ? 'text-[#FE2C54]' : 'opacity-20'
                  }`}
                >
                  <FiStar className={rating >= star ? 'fill-current' : ''} />
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Your Review (Optional)</label>
            <textarea 
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Tell others about your experience..."
              rows={4}
              className={`w-full border rounded-xl p-3.5 transition-colors text-sm ${
                isDark 
                  ? 'border-[#FFFFFF]/20 bg-[#232323]/50 text-[#FFFFFF] placeholder-[#FFFFFF]/40 focus:border-[#1D5DEC]' 
                  : 'border-[#232323]/20 bg-[#FFFFFF] text-[#232323] placeholder-[#232323]/40 focus:border-[#1D5DEC]'
              }`}
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm ${
                isDark ? 'hover:bg-[#FFFFFF]/10 text-[#FFFFFF]' : 'hover:bg-[#232323]/10 text-[#232323]'
              }`}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={rating === 0 || loading}
              className="px-5 py-2.5 rounded-xl font-bold text-[#FFFFFF] bg-[#1D5DEC] hover:bg-[#1D5DEC]/90 disabled:opacity-50 transition-all shadow-md text-sm active:scale-[0.98]"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
