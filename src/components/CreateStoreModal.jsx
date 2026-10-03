import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiX, FiShoppingBag, FiMail, FiMapPin, FiUser } from 'react-icons/fi';
import { createStore, fetchUsers } from '../services/adminApi';
import { useTheme } from '../context/ThemeContext';
import GlassCard from './GlassCard';

const AdminCreateStoreSchema = z.object({
  name: z.string().min(1, 'Store Name is required'),
  email: z.string().email('Invalid store email format'),
  address: z.string().min(1, 'Address is required').max(400, 'Address must be at most 400 characters'),
  ownerEmail: z.string().email('Please select an owner user'),
});

export default function CreateStoreModal({ isOpen, onClose, onSuccess }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(AdminCreateStoreSchema)
  });

  useEffect(() => {
    if (isOpen) {
      setError('');
      reset();
      setLoadingUsers(true);
      fetchUsers({ role: 'OWNER', limit: 100 })
        .then(res => {
          const ownerList = (res.data || []).filter(u => u.role === 'OWNER');
          setUsers(ownerList);
          if (ownerList.length > 0) {
            setValue('ownerEmail', ownerList[0].email);
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoadingUsers(false));
    }
  }, [isOpen, reset, setValue]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError('');
    try {
      await createStore(data);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create store');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = isDark 
    ? 'bg-[#232323]/60 border-[#FFFFFF]/20 text-[#FFFFFF] placeholder-[#FFFFFF]/40 focus:border-[#1D5DEC]' 
    : 'bg-[#FFFFFF] border-[#232323]/20 text-[#232323] placeholder-[#232323]/40 focus:border-[#1D5DEC]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <GlassCard className="w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200 !rounded-2xl p-0">
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-5 border-b ${
          isDark ? 'border-[#FFFFFF]/15 bg-[#000000]/20' : 'border-[#232323]/10 bg-[#232323]/5'
        }`}>
          <div className="flex items-center gap-2.5">
            <FiShoppingBag className="w-5 h-5 text-[#FE2C54]" />
            <h3 className={`text-xl font-bold ${isDark ? 'text-[#FFFFFF]' : 'text-[#232323]'}`}>
              Create New Store
            </h3>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className={`p-1 rounded-lg transition-colors ${
              isDark ? 'hover:bg-[#FFFFFF]/10 text-[#FFFFFF]/70' : 'hover:bg-[#232323]/10 text-[#232323]/70'
            }`}
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {error && (
            <div className="bg-[#FE2C54]/20 border-l-4 border-[#FE2C54] text-[#FE2C54] p-3.5 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Store Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80 flex items-center gap-1.5">
                <FiShoppingBag className="text-[#FE2C54]" /> Store Name
              </label>
              <input 
                {...register('name')} 
                placeholder="Acme Store"
                className={`w-full rounded-xl p-3 border transition-colors text-sm ${inputStyle}`} 
              />
              {errors.name && <p className="text-[#FE2C54] text-xs mt-1 font-semibold">{errors.name.message}</p>}
            </div>

            {/* Store Official Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80 flex items-center gap-1.5">
                <FiMail className="text-[#1D5DEC]" /> Store Email (Official)
              </label>
              <input 
                {...register('email')} 
                type="email" 
                placeholder="store@domain.com"
                className={`w-full rounded-xl p-3 border transition-colors text-sm ${inputStyle}`} 
              />
              {errors.email && <p className="text-[#FE2C54] text-xs mt-1 font-semibold">{errors.email.message}</p>}
            </div>

            {/* Store Address */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80 flex items-center gap-1.5">
                <FiMapPin className="text-[#D90166]" /> Store Address
              </label>
              <input 
                {...register('address')} 
                placeholder="Street Address, City, Country..."
                className={`w-full rounded-xl p-3 border transition-colors text-sm ${inputStyle}`} 
              />
              {errors.address && <p className="text-[#FE2C54] text-xs mt-1 font-semibold">{errors.address.message}</p>}
            </div>

            {/* Assign Store Owner User */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80 flex items-center gap-1.5">
                <FiUser className="text-[#1D5DEC]" /> Assign Store Owner User
              </label>
              
              {loadingUsers ? (
                <div className="p-3 text-xs italic opacity-70">Loading available Store Owners...</div>
              ) : (
                <select 
                  {...register('ownerEmail')} 
                  className={`w-full rounded-xl p-3 border transition-colors text-sm ${
                    isDark ? 'bg-[#232323] border-[#FFFFFF]/20 text-[#FFFFFF]' : 'bg-[#FFFFFF] border-[#232323]/20 text-[#232323]'
                  }`}
                >
                  <option value="">-- Select an Owner User Email --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.email}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              )}
              {errors.ownerEmail && <p className="text-[#FE2C54] text-xs mt-1 font-semibold">{errors.ownerEmail.message}</p>}
              <p className={`text-xs mt-1.5 ${isDark ? 'text-[#FFFFFF]/60' : 'text-[#232323]/60'}`}>
                Note: Only registered users with the <strong className="text-[#1D5DEC]">OWNER</strong> role are listed above.
              </p>
            </div>
          </div>

          {/* Footer actions */}
          <div className={`flex items-center justify-end gap-3 pt-4 border-t ${
            isDark ? 'border-[#FFFFFF]/10' : 'border-[#232323]/10'
          }`}>
            <button 
              type="button" 
              onClick={onClose}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                isDark ? 'hover:bg-[#FFFFFF]/10 text-[#FFFFFF]' : 'hover:bg-[#232323]/10 text-[#232323]'
              }`}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl font-bold text-[#FFFFFF] bg-[#1D5DEC] hover:bg-[#1D5DEC]/90 disabled:opacity-50 transition-all shadow-md text-sm active:scale-[0.98]"
            >
              {submitting ? 'Creating Store...' : 'Create Store'}
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
