import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LoginSchema } from '../../validation/schemas';
import { loginUser } from '../../services/authApi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FiStar } from 'react-icons/fi';
import GlassCard from '../../components/GlassCard';

export default function Login() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(LoginSchema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    try {
      const response = await loginUser(data);
      const payload = response.data || response;
      const userData = payload.user || { 
        id: payload.id, 
        name: payload.name, 
        email: payload.email, 
        role: payload.role 
      };
      login(userData, payload.token);
      navigate('/');
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-w-0 min-h-[calc(100vh-6rem)] flex items-center justify-center py-6 sm:py-10">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Branding Box (Equal size & rounded box matching the form box) */}
        <div className="hidden lg:flex bg-gradient-to-br from-[#232323] via-[#442A1F] to-[#000000] text-[#FFFFFF] flex-col justify-between p-8 rounded-2xl border border-[#FFFFFF]/15 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#1D5DEC] rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#D90166] rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-8">
              <div className="bg-[#D90166] text-[#FFFFFF] p-2.5 rounded-xl shadow-md">
                <FiStar className="w-6 h-6 fill-current" />
              </div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-[#1D5DEC] via-[#D90166] to-[#FE2C54] bg-clip-text text-transparent">
                TruRate
              </span>
            </div>
            
            <h1 className="text-3xl font-extrabold mb-4 leading-snug bg-gradient-to-r from-[#FFFFFF] via-[#FE2C54] to-[#1D5DEC] bg-clip-text text-transparent">
              Your compass for honest, authentic store reviews.
            </h1>
            <p className="text-[#FFFFFF]/80 text-sm leading-relaxed mb-6">
              Join thousands of users discovering the best local stores. Rate your experiences, read genuine reviews, and manage your store's reputation all in one place.
            </p>
          </div>

          <div className="relative z-10 pt-4 border-t border-[#FFFFFF]/15 flex items-center gap-4">
            <div className="flex -space-x-3">
              <div className="w-9 h-9 rounded-full bg-[#1D5DEC] text-[#FFFFFF] border-2 border-[#232323] flex items-center justify-center font-bold text-xs">A</div>
              <div className="w-9 h-9 rounded-full bg-[#D90166] text-[#FFFFFF] border-2 border-[#232323] flex items-center justify-center font-bold text-xs">B</div>
              <div className="w-9 h-9 rounded-full bg-[#FE2C54] text-[#FFFFFF] border-2 border-[#232323] flex items-center justify-center font-bold text-xs">C</div>
            </div>
            <span className="text-xs font-semibold opacity-90">Trusted by 10,000+ users</span>
          </div>
        </div>

        {/* Form Box */}
        <GlassCard className="p-8 flex flex-col justify-between !rounded-2xl">
          <div>
            <div className="mb-8 text-center lg:text-left">
              <div className="lg:hidden flex justify-center mb-4">
                <div className="bg-[#D90166] text-[#FFFFFF] p-2.5 rounded-xl shadow-md">
                  <FiStar className="w-7 h-7 fill-current" />
                </div>
              </div>
              <h2 className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-[#FFFFFF]' : 'text-[#232323]'}`}>Welcome back</h2>
              <p className={isDark ? 'text-[#FFFFFF]/70 mt-1.5 text-sm' : 'text-[#232323]/70 mt-1.5 text-sm'}>Please enter your details to sign in.</p>
            </div>
            
            {serverError && (
              <div className="bg-[#FE2C54]/20 border-l-4 border-[#FE2C54] text-[#FE2C54] p-4 rounded-xl mb-6 shadow-sm text-sm font-medium">
                {serverError}
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-1.5 opacity-90">Email address</label>
                <input 
                  {...register('email')} 
                  type="email" 
                  className={`block w-full rounded-xl border p-3.5 transition-colors text-sm ${
                    isDark 
                      ? 'border-[#FFFFFF]/20 bg-[#232323]/60 text-[#FFFFFF] placeholder-[#FFFFFF]/40 focus:border-[#1D5DEC]' 
                      : 'border-[#232323]/20 bg-[#FFFFFF] text-[#232323] placeholder-[#232323]/40 focus:border-[#1D5DEC]'
                  }`}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-[#FE2C54] text-xs mt-1.5 font-medium">{errors.email.message}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold opacity-90">Password</label>
                  <a href="#" className="text-xs font-semibold text-[#1D5DEC] hover:text-[#D90166] transition-colors">Forgot password?</a>
                </div>
                <input 
                  {...register('password')} 
                  type="password" 
                  className={`block w-full rounded-xl border p-3.5 transition-colors text-sm ${
                    isDark 
                      ? 'border-[#FFFFFF]/20 bg-[#232323]/60 text-[#FFFFFF] placeholder-[#FFFFFF]/40 focus:border-[#1D5DEC]' 
                      : 'border-[#232323]/20 bg-[#FFFFFF] text-[#232323] placeholder-[#232323]/40 focus:border-[#1D5DEC]'
                  }`}
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-[#FE2C54] text-xs mt-1.5 font-medium">{errors.password.message}</p>}
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-[#FFFFFF] bg-gradient-to-r from-[#1D5DEC] to-[#D90166] hover:opacity-90 disabled:opacity-50 transition-all active:scale-[0.98] mt-2"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>
          
          <div className="mt-6 pt-4 border-t border-[#FFFFFF]/10 text-center text-sm opacity-80">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-[#1D5DEC] hover:text-[#D90166] transition-colors">
              Create one now
            </Link>
          </div>
        </GlassCard>

      </div>
    </div>
  );
}
