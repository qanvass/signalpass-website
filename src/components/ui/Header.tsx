'use client'

export default function Header() {
  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
      {/* Brand Logo */}
      <a href="/" className="flex items-center space-x-2.5 group select-none">
        {/* Broadcaster Play Button Logo */}
        <div className="relative flex items-center justify-center w-8 h-8 flex-shrink-0 text-slate-900">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full"
          >
            {/* Left Signal Arcs */}
            <path d="M4.9 19.1C2.5 16.7 2.5 12.8 4.9 10.4" strokeWidth="2" opacity="0.65" />
            <path d="M7.8 16.2C6.2 14.6 6.2 12 7.8 10.4" strokeWidth="2" />
            
            {/* Center Circle & Play Button */}
            <circle cx="15" cy="12" r="6" />
            <polygon points="14,10 18,12 14,14" fill="currentColor" />
          </svg>
        </div>
        <span className="text-xl font-extrabold tracking-tight text-slate-900">
          SignalPass<span className="text-slate-400 font-medium">.tv</span>
        </span>
      </a>

      {/* Nav Links */}
      <nav className="hidden md:flex items-center space-x-8">
        <a href="#" className="relative text-sm font-semibold text-slate-900 transition-colors">
          Home
          <span className="nav-active-line" />
        </a>
        <a href="#tv-parser" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
          TV Parser
        </a>
        <a href="#pricing" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
          Pricing
        </a>
        <a href="#docs" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
          Docs
        </a>
        <a href="#contact" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
          Contact
        </a>
      </nav>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4">
        <a
          href="/login"
          className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-4 py-2 rounded-lg border border-slate-200/80 hover:border-slate-300 transition-all"
        >
          Sign In
        </a>
        <a
          href="#pricing"
          className="text-sm font-semibold bg-slate-950 hover:bg-slate-900 text-white px-5 py-2.5 rounded-lg transition-all shadow-sm"
        >
          Get Started
        </a>
      </div>
    </header>
  )
}
