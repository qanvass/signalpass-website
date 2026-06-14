'use client'

import { Tv, Play, Smartphone, Star, ShieldCheck } from 'lucide-react'

export default function TrustBar() {
  return (
    <div className="w-full bg-white border border-slate-100 rounded-2xl shadow-[0_20px_40px_-15px_rgba(15,23,42,0.05)] p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
      
      {/* 1. Live TV */}
      <div className="flex items-center space-x-4 flex-1 pb-4 md:pb-0 md:pr-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
          <Tv className="w-6 h-6" strokeWidth={1.8} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">Live TV</h4>
          <p className="text-xs text-slate-500 mt-0.5">80+ channels and counting</p>
        </div>
      </div>

      {/* 2. On-Demand */}
      <div className="flex items-center space-x-4 flex-1 pt-4 md:pt-0 md:px-6">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Play className="w-4 h-4 fill-blue-600 stroke-blue-600 translation-x-[1px]" />
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">On-Demand</h4>
          <p className="text-xs text-slate-500 mt-0.5">Movies, shows, and more</p>
        </div>
      </div>

      {/* 3. Any Device */}
      <div className="flex items-center space-x-4 flex-1 pt-4 md:pt-0 md:px-6">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
          <Smartphone className="w-6 h-6" strokeWidth={1.8} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">Any Device</h4>
          <p className="text-xs text-slate-500 mt-0.5">Stream on what you love</p>
        </div>
      </div>

      {/* 4. Rating & Reviews */}
      <div className="flex items-center justify-between flex-1 pt-4 md:pt-0 md:pl-6 gap-2">
        <div className="flex items-center space-x-3">
          <span className="text-base font-extrabold text-slate-900">4.8</span>
          <div className="flex flex-col">
            <div className="flex items-center space-x-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-blue-600 stroke-blue-600" />
              ))}
            </div>
            <span className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wide">
              from 2,000+ reviews
            </span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0 hover:text-emerald-500 transition-colors">
          <ShieldCheck className="w-5 h-5" strokeWidth={2} />
        </div>
      </div>
      
    </div>
  )
}
