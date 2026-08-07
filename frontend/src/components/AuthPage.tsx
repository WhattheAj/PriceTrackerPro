import React, { useState } from 'react';
import { AuthMode, User } from '../types';
import { loginUser, signupUser } from '../services/auth';
import { 
  User as UserIcon, 
  Smartphone, 
  Mail,
  Lock, 
  Eye, 
  EyeOff, 
  Coins, 
  Search, 
  FileSpreadsheet, 
  ArrowRight,
  Tag
} from 'lucide-react';

interface AuthPageProps {
  onAuthSuccess: (user: User) => void;
  onContinueAsGuest?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('signup'); // Default to signup to highlight initial tokens
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('لطفاً یک شماره تلفن همراه معتبر (مانند ۰۹۱۲۳۴۵۶۷۸۹) وارد کنید.');
      return;
    }

    if (mode === 'signup') {
      if (!firstName.trim()) {
        setError('لطفاً نام خود را وارد کنید.');
        return;
      }
      if (!lastName.trim()) {
        setError('لطفاً نام خانوادگی خود را وارد کنید.');
        return;
      }
    }

    if (!password || password.length < 4) {
      setError('کلمه عبور باید حداقل ۴ کاراکتر باشد.');
      return;
    }

    setIsLoading(true);

    try {
      let loggedUser: User;
      if (mode === 'signup') {
        loggedUser = await registerUserApi(firstName.trim(), lastName.trim(), cleanPhone, password);
      } else {
        loggedUser = await loginUserApi(cleanPhone, password);
      }
      onAuthSuccess(loggedUser);
    } catch (err: any) {
      console.error('Auth error:', err);
      const apiErrorMsg = err.response?.data?.detail || err.response?.data?.error || 'خطا در برقراری ارتباط با سرور. لطفاً مجدداً تلاش کنید.';
      setError(apiErrorMsg);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="max-w-6xl mx-auto my-6 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden min-h-[640px]">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* Left/Side Branding Panel */}
        <div className="lg:col-span-5 bg-slate-900 p-8 sm:p-12 flex flex-col justify-between text-white relative">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Tag className="w-5 h-5 text-white stroke-[2.5]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                PriceTracker<span className="text-indigo-400">Pro</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold leading-snug mb-6 text-white">
              ردیابی هوشمند قیمت‌ها <br />
              <span className="text-indigo-400 font-normal">برای خریدهای اقتصادی‌تر</span>
            </h1>

            {/* Value Propositions */}
            <div className="space-y-6 my-8">
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-slate-800 text-indigo-400 shrink-0">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-0.5">اتصال مستقیم به دیجی‌کالا</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    استخراج لحظه‌ای آخرین قیمت، درصد تخفیف، فروشنده و امتیاز محصول.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-slate-800 text-amber-400 shrink-0">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-0.5">اعتبار اولیه توکن‌ها</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    با اولین ثبت‌نام، ۱۰ توکن رایگان جهت استخراج لیست قیمت‌ها به حساب شما اضافه می‌شود.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-slate-800 text-emerald-400 shrink-0">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-0.5">خروجی اکسل (CSV)</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    دانلود کامل نتایج با انکودینگ UTF-8 جهت تحلیل دقیق قیمت‌ها.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            
            {/* Minimalist Tabs */}
            <div className="flex gap-8 mb-8 border-b border-slate-200">
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(null); }}
                className={`pb-4 text-sm font-bold transition-all relative cursor-pointer ${
                  mode === 'signup'
                    ? 'text-slate-950 border-b-2 border-indigo-600'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                ثبت‌نام کاربر جدید
                <span className="mr-2 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-extrabold">
                  ۱۰ توکن هدیه
                </span>
              </button>

              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                className={`pb-4 text-sm font-bold transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'text-slate-950 border-b-2 border-indigo-600'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                ورود به حساب
              </button>
            </div>

            {/* Header Title */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">
                {mode === 'login' ? 'خوش آمدید' : 'ایجاد حساب کاربری'}
              </h2>
              <p className="text-xs text-slate-500">
                {mode === 'login' 
                  ? 'شماره تلفن همراه و کلمه عبور خود را وارد کنید.' 
                  : 'با ثبت‌نام و وارد کردن شماره تلفن همراه ۱۰ توکن هدیه دریافت کنید.'}
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-5 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* 1. Phone Number Field (Always First) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  شماره تلفن همراه
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    className="w-full pr-10 pl-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ltr text-left placeholder:text-right"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Signup Fields (First Name, Last Name & Email) */}
              {mode === 'signup' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        نام
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="علی"
                          className="w-full pr-10 pl-3 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        نام خانوادگی
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="محمدی"
                          className="w-full pr-10 pl-3 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      پست الکترونیک (ایمیل) <span className="text-[10px] text-slate-400 font-normal">(اختیاری)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@example.com"
                        className="w-full pr-10 pl-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ltr text-left placeholder:text-right"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Password Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  کلمه عبور
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pr-10 pl-10 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ltr text-left"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{mode === 'login' ? 'ورود به پنل کاربری' : 'ثبت‌نام و دریافت ۱۰ توکن رایگان'}</span>
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </>
                )}
              </button>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
};

