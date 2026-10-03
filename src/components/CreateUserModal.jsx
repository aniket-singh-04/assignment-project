import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiX, FiUser, FiMail, FiLock, FiMapPin, FiShield } from 'react-icons/fi';
import { createUser } from '../services/adminApi';
import { useTheme } from '../context/ThemeContext';
import { RegisterSchema } from '../validation/schemas';
import GlassCard from './GlassCard';

const AdminCreateUserSchema = RegisterSchema.extend({
  role: z.enum(['ADMIN', 'USER', 'OWNER'], { required_error: 'Role is required' }),
});

export default function CreateUserModal({ isOpen, onClose, onSuccess }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(AdminCreateUserSchema)
  });

  useEffect(() => {
    if (isOpen) {
      setError('');
      reset();
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError('');
    try {
      await createUser(data);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create user');
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
            <FiUser className="w-5 h-5 text-[#1D5DEC]" />
            <h3 className={`text-xl font-bold ${isDark ? 'text-[#FFFFFF]' : 'text-[#232323]'}`}>
              Create New User
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
            {/* Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80 flex items-center gap-1.5">
                <FiUser className="text-[#1D5DEC]" /> Full Name
              </label>
              <input 
                {...register('name')} 
                placeholder="John Doe"
                className={`w-full rounded-xl p-3 border transition-colors text-sm ${inputStyle}`} 
              />
              {errors.name && <p className="text-[#FE2C54] text-xs mt-1 font-semibold">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80 flex items-center gap-1.5">
                <FiMail className="text-[#1D5DEC]" /> Email Address
              </label>
              <input 
                {...register('email')} 
                type="email" 
                placeholder="john@example.com"
                className={`w-full rounded-xl p-3 border transition-colors text-sm ${inputStyle}`} 
              />
              {errors.email && <p className="text-[#FE2C54] text-xs mt-1 font-semibold">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80 flex items-center gap-1.5">
                <FiLock className="text-[#D90166]" /> Password
              </label>
              <input 
                {...register('password')} 
                type="password" 
                placeholder="••••••••"
                className={`w-full rounded-xl p-3 border transition-colors text-sm ${inputStyle}`} 
              />
              {errors.password && <p className="text-[#FE2C54] text-xs mt-1 font-semibold">{errors.password.message}</p>}
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80 flex items-center gap-1.5">
                <FiShield className="text-[#FE2C54]" /> Account Role
              </label>
              <select 
                {...register('role')} 
                className={`w-full rounded-xl p-3 border transition-colors text-sm ${
                  isDark ? 'bg-[#232323] border-[#FFFFFF]/20 text-[#FFFFFF]' : 'bg-[#FFFFFF] border-[#232323]/20 text-[#232323]'
                }`}
              >
                <option value="">Select a role</option>
                <option value="USER">Normal User (USER)</option>
                <option value="OWNER">Store Owner (OWNER)</option>
                <option value="ADMIN">Super Admin (ADMIN)</option>
              </select>
              {errors.role && <p className="text-[#FE2C54] text-xs mt-1 font-semibold">{errors.role.message}</p>}
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80 flex items-center gap-1.5">
                <FiMapPin className="text-[#1D5DEC]" /> Address
              </label>
              <input 
                {...register('address')} 
                placeholder="City, State, Zip Code..."
                className={`w-full rounded-xl p-3 border transition-colors text-sm ${inputStyle}`} 
              />
              {errors.address && <p className="text-[#FE2C54] text-xs mt-1 font-semibold">{errors.address.message}</p>}
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
              {submitting ? 'Creating User...' : 'Create User'}
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
