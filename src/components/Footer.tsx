import React from 'react';
import { ShoppingBag, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-200/80 bg-white/60 backdrop-blur-md pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-200/60">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 text-base">
                Smart Campus Marketplace
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              The official peer-to-peer textbook and lab equipment marketplace built specifically for BCA students to trade within campus easily.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Marketplace Categories
            </h4>
            <ul className="text-xs text-slate-600 space-y-1.5 font-medium">
              <li>Textbooks & Study Guides</li>
              <li>Arduino & IoT Electronics</li>
              <li>Digital Logic & Microprocessor Kits</li>
              <li>Calculators & Accessories</li>
            </ul>
          </div>

          {/* Safety & Guidelines */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Campus Safety Guidelines</span>
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Always inspect items in person during campus hours (e.g., Library or Student Center). Verify roll numbers before exchange.
            </p>
          </div>

        </div>

        {/* Bottom Credit */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Smart Campus Marketplace. Built for BCA Department.</p>
          <p className="flex items-center gap-1">
            <span>Powered by Next.js 14 & Tailwind CSS</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
