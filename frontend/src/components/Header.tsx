import React from 'react';
import { User, ViewMode } from '../types';
import { toPersianDigits } from '../utils/farsi';
import { 
  Coins, 
  User as UserIcon, 
  LogOut, 
  History, 
  PlusCircle, 
  Tag
} from 'lucide-react';

interface HeaderProps {
  user: User | null;
  activeView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  onOpenTokenModal: () => void;
  onOpenHistoryModal: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  activeView,
  onSelectView,
  onOpenTokenModal,
  onOpenHistoryModal,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Name */}
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => onSelectView(user ? 'dashboard' : 'auth')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <Tag className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">PriceTracker<span className="text-indigo-600">Pro</span></span>
            </div>
          </div>



          {/* Right Action / User Profile Status */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Token Balance Badge */}
                <div 
                  onClick={onOpenTokenModal}
                  className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl cursor-pointer transition-all shadow-2xs group"
                  title="کلیک جهت افزایش موجودی توکن"
                >
                  <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                    <Coins className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] text-amber-800 font-medium leading-none">اعتبار توکن</span>
                    <span className="text-xs font-extrabold text-amber-900 leading-tight">
                      {toPersianDigits(user.tokens)} <span className="text-[10px] font-normal">توکن</span>
                    </span>
                  </div>
                  <PlusCircle className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform mr-1" />
                </div>

                {/* History Button */}
                <button
                  onClick={onOpenHistoryModal}
                  className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-all"
                  title="تاریخچه جستجوها"
                >
                  <History className="w-5 h-5" />
                </button>

                {/* User Info Avatar & Logout */}
                <div className="flex items-center gap-2 border-r border-slate-200 mr-1 pr-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-300">
                    <UserIcon className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-xs font-bold text-slate-800 truncate max-w-[120px]">{user.name}</span>
                    <span className="text-[10px] text-slate-500 dir-ltr text-right">{user.phone}</span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors mr-1"
                    title="خروج از حساب"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : null}
          </div>

        </div>
      </div>
    </header>
  );
};
