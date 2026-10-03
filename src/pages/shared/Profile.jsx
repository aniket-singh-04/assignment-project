import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { changePassword, updateProfile } from '../../services/authApi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../../components/GlassCard';
import { FiUser, FiMail, FiMapPin, FiShield, FiLock, FiKey, FiCheckCircle, FiAlertCircle, FiEdit3 } from 'react-icons/fi';

const ProfileUpdateSchema = z.object({
  name: z.string().min(20, 'Name must be at least 20 characters').max(60, 'Name must be at most 60 characters'),
  address: z.string().max(400, 'Address must be at most 400 characters').optional(),
});

const PasswordChangeSchema = z.object({
  oldPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must be at most 16 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Profile Form
  const [profileMsg, setProfileMsg] = useState('');
  const [profileErr, setProfileErr] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  const { register: regProfile, handleSubmit: handleProfileSubmit, setValue: setProfileValue, formState: { errors: profileErrors } } = useForm({
    resolver: zodResolver(ProfileUpdateSchema)
  });

  // Password Form
  const [passMsg, setPassMsg] = useState('');
  const [passErr, setPassErr] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  const { register: regPass, handleSubmit: handlePassSubmit, reset: resetPass, formState: { errors: passErrors } } = useForm({
    resolver: zodResolver(PasswordChangeSchema)
  });

  useEffect(() => {
    if (user) {
      setProfileValue('name', user.name || '');
      setProfileValue('address', user.address || '');
    }
  }, [user, setProfileValue]);

  if (!user) return null;

  const onUpdateProfile = async (data) => {
    setProfileLoading(true);
    setProfileMsg('');
    setProfileErr('');
    try {
      const res = await updateProfile(data);
      const updatedData = res.data || res;
      updateUser({ name: updatedData.name, address: updatedData.address });
      setProfileMsg('Profile information updated successfully!');
    } catch (err) {
      setProfileErr(err.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const onChangePassword = async (data) => {
    setPassLoading(true);
    setPassMsg('');
    setPassErr('');
    try {
      await changePassword(data);
      setPassMsg('Security password changed successfully!');
      resetPass();
    } catch (err) {
      setPassErr(err.message || 'Failed to change password');
    } finally {
      setPassLoading(false);
    }
  };

  const roleColorClass = user.role === 'ADMIN' 
    ? 'bg-[#D90166]/20 text-[#D90166] border-[#D90166]/30' 
    : user.role === 'OWNER' 
      ? 'bg-[#FE2C54]/20 text-[#FE2C54] border-[#FE2C54]/30' 
      : 'bg-[#1D5DEC]/20 text-[#1D5DEC] border-[#1D5DEC]/30';

  const inputStyle = isDark 
    ? 'bg-[#232323]/60 border-[#FFFFFF]/20 text-[#FFFFFF] placeholder-[#FFFFFF]/40 focus:border-[#1D5DEC]' 
    : 'bg-[#FFFFFF] border-[#232323]/20 text-[#232323] placeholder-[#232323]/40 focus:border-[#1D5DEC]';

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Header Hero Card */}
      <GlassCard className="p-8 relative overflow-hidden !rounded-3xl border border-[#FFFFFF]/15 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#1D5DEC] rounded-full mix-blend-screen filter blur-3xl opacity-25"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#D90166] rounded-full mix-blend-screen filter blur-3xl opacity-25"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#1D5DEC] via-[#D90166] to-[#FE2C54] p-1 shadow-xl">
              <div className="w-full h-full rounded-full bg-[#232323] flex items-center justify-center text-3xl font-extrabold text-[#FFFFFF]">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
            <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#232323] shadow-md" title="Active Session"></div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <h1 className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-[#FFFFFF]' : 'text-[#232323]'}`}>
                {user.name}
              </h1>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border ${roleColorClass}`}>
                {user.role}
              </span>
            </div>
            <p className="opacity-80 text-sm flex items-center justify-center md:justify-start gap-2">
              <FiMail className="w-4 h-4 text-[#1D5DEC]" />
              <span>{user.email}</span>
            </p>
          </div>
        </div>
      </GlassCard>

      {/* 2-Column Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Profile Info & Name Update */}
        <GlassCard className="p-8 space-y-6 !rounded-3xl">
          <div className="flex items-center gap-2.5 border-b border-[#FFFFFF]/10 pb-4">
            <FiEdit3 className="w-5 h-5 text-[#FE2C54]" />
            <h3 className={`text-xl font-bold ${isDark ? 'text-[#FFFFFF]' : 'text-[#232323]'}`}>Update Profile Details</h3>
          </div>

          {profileMsg && (
            <div className="bg-[#1D5DEC]/20 border-l-4 border-[#1D5DEC] text-[#FFFFFF] p-4 rounded-2xl text-sm font-semibold flex items-center gap-2.5">
              <FiCheckCircle className="w-5 h-5 text-[#1D5DEC] shrink-0" />
              <span>{profileMsg}</span>
            </div>
          )}

          {profileErr && (
            <div className="bg-[#FE2C54]/20 border-l-4 border-[#FE2C54] text-[#FE2C54] p-4 rounded-2xl text-sm font-semibold flex items-center gap-2.5">
              <FiAlertCircle className="w-5 h-5 text-[#FE2C54] shrink-0" />
              <span>{profileErr}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold opacity-90 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FiUser className="w-4 h-4 text-[#1D5DEC]" /> Full Name
                </span>
                <span className="text-xs opacity-60">20 - 60 chars</span>
              </label>
              <input 
                {...regProfile('name')}
                placeholder="Enter full name (20-60 characters)"
                className={`w-full rounded-2xl p-3.5 border transition-all text-sm ${inputStyle}`}
              />
              {profileErrors.name && <p className="text-[#FE2C54] text-xs mt-1.5 font-semibold">{profileErrors.name.message}</p>}
            </div>

            {/* Email (Readonly) */}
            <div>
              <label className="block text-sm font-semibold opacity-90 mb-1.5 flex items-center gap-1.5">
                <FiMail className="w-4 h-4 text-[#D90166]" /> Email Address
              </label>
              <input 
                type="email" 
                value={user.email || ''} 
                disabled 
                className={`w-full rounded-2xl p-3.5 border text-sm opacity-60 cursor-not-allowed ${
                  isDark ? 'bg-[#232323] border-[#FFFFFF]/10 text-[#FFFFFF]' : 'bg-[#232323]/5 border-[#232323]/10 text-[#232323]'
                }`}
              />
              <p className="text-[11px] opacity-50 mt-1">Email address cannot be changed directly.</p>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold opacity-90 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FiMapPin className="w-4 h-4 text-[#FE2C54]" /> Address Location
                </span>
                <span className="text-xs opacity-60">Max 400 chars</span>
              </label>
              <textarea 
                {...regProfile('address')}
                rows={3}
                placeholder="Enter street address..."
                className={`w-full rounded-2xl p-3.5 border transition-all text-sm ${inputStyle}`}
              />
              {profileErrors.address && <p className="text-[#FE2C54] text-xs mt-1.5 font-semibold">{profileErrors.address.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={profileLoading}
              className="w-full flex justify-center py-3.5 px-6 rounded-2xl shadow-md text-sm font-bold text-[#FFFFFF] bg-[#1D5DEC] hover:bg-[#1D5DEC]/90 disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              {profileLoading ? 'Saving Profile...' : 'Save Profile Changes'}
            </button>
          </form>
        </GlassCard>

        {/* Right Column: Password Update */}
        <GlassCard className="p-8 space-y-6 !rounded-3xl">
          <div className="flex items-center gap-2.5 border-b border-[#FFFFFF]/10 pb-4">
            <FiLock className="w-5 h-5 text-[#1D5DEC]" />
            <h3 className={`text-xl font-bold ${isDark ? 'text-[#FFFFFF]' : 'text-[#232323]'}`}>Update Password</h3>
          </div>

          {passMsg && (
            <div className="bg-[#1D5DEC]/20 border-l-4 border-[#1D5DEC] text-[#FFFFFF] p-4 rounded-2xl text-sm font-semibold flex items-center gap-2.5">
              <FiCheckCircle className="w-5 h-5 text-[#1D5DEC] shrink-0" />
              <span>{passMsg}</span>
            </div>
          )}

          {passErr && (
            <div className="bg-[#FE2C54]/20 border-l-4 border-[#FE2C54] text-[#FE2C54] p-4 rounded-2xl text-sm font-semibold flex items-center gap-2.5">
              <FiAlertCircle className="w-5 h-5 text-[#FE2C54] shrink-0" />
              <span>{passErr}</span>
            </div>
          )}

          <form onSubmit={handlePassSubmit(onChangePassword)} className="space-y-5">
            {/* Old Password */}
            <div>
              <label className="block text-sm font-semibold opacity-90 mb-1.5 flex items-center gap-1.5">
                <FiKey className="w-4 h-4 text-[#D90166]" /> Current Password
              </label>
              <input 
                {...regPass('oldPassword')}
                type="password" 
                placeholder="Enter current password"
                className={`w-full rounded-2xl p-3.5 border transition-all text-sm ${inputStyle}`}
              />
              {passErrors.oldPassword && <p className="text-[#FE2C54] text-xs mt-1.5 font-semibold">{passErrors.oldPassword.message}</p>}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold opacity-90 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FiLock className="w-4 h-4 text-[#FE2C54]" /> New Password
                </span>
                <span className="text-xs opacity-60">8-16 chars (1 Upper, 1 Special)</span>
              </label>
              <input 
                {...regPass('newPassword')}
                type="password" 
                placeholder="Enter new password"
                className={`w-full rounded-2xl p-3.5 border transition-all text-sm ${inputStyle}`}
              />
              {passErrors.newPassword && <p className="text-[#FE2C54] text-xs mt-1.5 font-semibold">{passErrors.newPassword.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={passLoading}
              className="w-full flex justify-center py-3.5 px-6 rounded-2xl shadow-md text-sm font-bold text-[#FFFFFF] bg-gradient-to-r from-[#D90166] to-[#FE2C54] hover:opacity-90 disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              {passLoading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </GlassCard>

      </div>
    </div>
  );
}
