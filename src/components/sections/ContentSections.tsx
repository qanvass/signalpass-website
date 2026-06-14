import {
  Check,
  Crown,
  Headphones,
  Monitor,
  Smartphone,
  Tv,
  Wrench,
  Sparkles,
  Cpu,
  Layers,
  ArrowRight,
  Globe,
  Activity,
  CheckCircle2,
} from "lucide-react";

const PLANS = [
  {
    name: "Essential",
    price: "$12",
    period: "/mo",
    highlight: false,
    features: [
      "1,000+ live channels",
      "HD streaming",
      "1 device",
      "7-day catch-up",
      "Email support",
    ],
  },
  {
    name: "Premium",
    price: "$18",
    period: "/mo",
    highlight: true,
    features: [
      "3,000+ live channels",
      "HD & 4K streaming",
      "3 devices",
      "Full VOD library",
      "EPG & favorites",
      "Priority support",
    ],
  },
  {
    name: "Ultimate",
    price: "$28",
    period: "/mo",
    highlight: false,
    features: [
      "5,000+ live channels",
      "4K & HDR where available",
      "5 devices",
      "Sports & PPV events",
      "Adult lock & parental controls",
      "24/7 live chat support",
    ],
  },
];

const SETUP_STEPS = [
  {
    step: "01",
    title: "Choose your plan",
    body: "Pick the package that fits your household. Checkout takes under two minutes.",
    icon: Crown,
  },
  {
    step: "02",
    title: "Install the app",
    body: "Works on Fire Stick, Android TV, Smart TVs, phones, tablets, and MAG boxes.",
    icon: Tv,
  },
  {
    step: "03",
    title: "Enter your credentials",
    body: "We email your login details instantly. Paste them into the app and start watching.",
    icon: Wrench,
  },
];

const FAQ = [
  {
    q: "How fast is activation?",
    a: "Most accounts are active within minutes of payment. You'll receive credentials by email.",
  },
  {
    q: "Which devices are supported?",
    a: "Fire Stick, Android, iOS, Smart TVs (Samsung/LG), Windows, MAG, and most IPTV players.",
  },
  {
    q: "Can I use multiple devices?",
    a: "Yes — device limits depend on your plan. Upgrade anytime from your account dashboard.",
  },
];

export default function ContentSections() {
  return (
    <div className="w-full bg-white text-slate-900">
      
      {/* ========================================== */}
      {/* SECTION 1: Built for serious streaming     */}
      {/* ========================================== */}
      <section className="py-24 bg-white border-t border-slate-100/80 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <span className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100/80 px-3 py-1 rounded-full text-blue-600 text-xs font-bold mb-4 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Core Platform</span>
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-serif mb-4">
            Built for serious streaming experiences
          </h2>
          <p className="text-slate-500 font-medium text-base md:text-lg max-w-2xl mx-auto mb-16">
            A high-performance pipeline designed to manage, validate, and deliver clean, organized playlist data.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-8">
            {/* Card 1 */}
            <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-8 hover:translate-y-[-4px] hover:shadow-[0_20px_40px_-15px_rgba(15,23,42,0.06)] hover:border-blue-100 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Playlist Intelligence</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Analyze M3U and Xtream format headers automatically. Extract nested channels, groups, and logos instantly without server lag.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-8 hover:translate-y-[-4px] hover:shadow-[0_20px_40px_-15px_rgba(15,23,42,0.06)] hover:border-blue-100 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Multi-Device Delivery</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Format and sync playlists perfectly tailored to your hardware. Zero configuration needed on Android TV, Apple TV, and mobile players.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-8 hover:translate-y-[-4px] hover:shadow-[0_20px_40px_-15px_rgba(15,23,42,0.06)] hover:border-blue-100 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Clean Viewer Experience</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Remove dead links, bypass broken stream loops, and keep your category layout organized with smart automated EPG updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* SECTION 2: From playlist to premium        */}
      {/* ========================================== */}
      <section className="py-24 bg-slate-50/50 border-t border-b border-slate-100/80 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/20 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center relative z-10">
          <span className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100/80 px-3 py-1 rounded-full text-blue-600 text-xs font-bold mb-4 uppercase tracking-wider">
            <span>System Pipeline</span>
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-serif mb-4">
            From playlist to premium interface
          </h2>
          <p className="text-slate-500 font-medium text-base md:text-lg max-w-2xl mx-auto mb-16">
            Our processing engine takes raw playlist data and delivers a structured, premium visual streaming guide.
          </p>

          {/* Process Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left mt-8 relative">
            
            {/* Step 1 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_12px_24px_-8px_rgba(15,23,42,0.04)] relative">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs mb-4">
                01
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Parse Playlist</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                M3U indices and Xtream credentials are parsed to build your custom channel list registry.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_12px_24px_-8px_rgba(15,23,42,0.04)] relative">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs mb-4">
                02
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Validate Streams</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                High-speed network checks verify stream status, content codecs, and connection latency.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_12px_24px_-8px_rgba(15,23,42,0.04)] relative">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs mb-4">
                03
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Organize Channels</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Groups categories cleanly, auto-attaches high-res logos, and removes duplicate stream pathways.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_12px_24px_-8px_rgba(15,23,42,0.04)] relative">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs mb-4">
                04
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Deliver Interface</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Loads details directly into the player interface for an intuitive, remote-friendly viewing grid.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* SECTION 3: Unified media dashboard         */}
      {/* ========================================== */}
      <section className="py-24 bg-gradient-to-b from-blue-50/20 via-white to-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left info column */}
          <div className="lg:col-span-5 text-left space-y-6">
            <span className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100/80 px-3 py-1 rounded-full text-blue-600 text-xs font-bold uppercase tracking-wider">
              <span>Smart Interface</span>
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight font-serif leading-tight">
              Live TV, movies, sports, and guides — unified
            </h2>
            <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed">
              No more jumping between applications or searching nested directories. SignalPass organizes your streaming data into a single, cohesive experience with real-time stream status indicators.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3 text-sm font-semibold text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                <span>Zero Hardcoded Protected Brands</span>
              </div>
              <div className="flex items-center space-x-3 text-sm font-semibold text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                <span>Unified Category Filter Management</span>
              </div>
              <div className="flex items-center space-x-3 text-sm font-semibold text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                <span>Instant Cloud-Sync Favoriting</span>
              </div>
            </div>
          </div>

          {/* Right mock UI showcase column */}
          <div className="lg:col-span-7 flex flex-col space-y-4 relative">
            
            {/* UI Card 1: Channel List */}
            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-[0_20px_40px_-15px_rgba(15,23,42,0.06)] max-w-md ml-auto w-full">
              <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-3">
                <span className="text-xs font-bold text-slate-900">Channel Group: News</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold">12 Active</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50/60 border border-slate-100/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">N1</div>
                    <span className="text-xs font-bold text-slate-700">Global Stream 1</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">1080p • 60fps</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-100/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">N2</div>
                    <span className="text-xs font-bold text-slate-700">Live News Feed</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">720p • 30fps</span>
                </div>
              </div>
            </div>

            {/* UI Card 2: Stream Health / Guides */}
            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-[0_20px_40px_-15px_rgba(15,23,42,0.06)] max-w-md mr-auto w-full relative -mt-4 z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900">Stream Health Analyzer</span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold">Auto-check</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-blue-50/40 border border-blue-100/30 rounded-lg p-2.5 text-center">
                  <span className="block text-[8px] font-extrabold uppercase text-slate-400">Latency</span>
                  <span className="text-xs font-bold text-slate-800">12ms</span>
                </div>
                <div className="bg-emerald-50/40 border border-emerald-100/30 rounded-lg p-2.5 text-center">
                  <span className="block text-[8px] font-extrabold uppercase text-slate-400">Stream Status</span>
                  <span className="text-xs font-bold text-emerald-600">99.9%</span>
                </div>
                <div className="bg-indigo-50/40 border border-indigo-100/30 rounded-lg p-2.5 text-center">
                  <span className="block text-[8px] font-extrabold uppercase text-slate-400">Resolution</span>
                  <span className="text-xs font-bold text-indigo-600">4K Ready</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* SECTION 4: Designed for the big screen     */}
      {/* ========================================== */}
      <section id="tv-parser" className="py-24 bg-white border-t border-slate-100/80 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <span className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100/80 px-3 py-1 rounded-full text-blue-600 text-xs font-bold mb-4 uppercase tracking-wider">
            <span>Responsive Guide</span>
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-serif mb-4">
            Designed for the big screen
          </h2>
          <p className="text-slate-500 font-medium text-base md:text-lg max-w-2xl mx-auto mb-16">
            Stream cleanly on any device. Your lists, favorites, and settings sync instantly across all interface platforms.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8 text-left">
            {/* Device 1 */}
            <div className="bg-slate-50/40 border border-slate-100 rounded-2xl p-6 hover:translate-y-[-2px] transition-transform duration-300">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                <Tv className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1.5">TV Player</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Optimized D-pad/remote controls specifically built for Android TV, Fire Stick, and smart devices.
              </p>
            </div>

            {/* Device 2 */}
            <div className="bg-slate-50/40 border border-slate-100 rounded-2xl p-6 hover:translate-y-[-2px] transition-transform duration-300">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                <Monitor className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1.5">Tablet Dashboard</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Spacious sidebar navigation designed for quick category swapping and list editing.
              </p>
            </div>

            {/* Device 3 */}
            <div className="bg-slate-50/40 border border-slate-100 rounded-2xl p-6 hover:translate-y-[-2px] transition-transform duration-300">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                <Smartphone className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1.5">Mobile Streamer</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Compact, responsive mobile app with full remote controller casting capability.
              </p>
            </div>

            {/* Device 4 */}
            <div className="bg-slate-50/40 border border-slate-100 rounded-2xl p-6 hover:translate-y-[-2px] transition-transform duration-300">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                <Globe className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1.5">Web Portal</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Log in and view your stream listings on any standard desktop browser with zero setups.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* EXISTING SECTION: Plans (Pricing)          */}
      {/* ========================================== */}
      <section id="pricing" className="py-24 bg-white border-t border-slate-100 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <p className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100/80 px-3 py-1 rounded-full text-blue-600 text-xs font-bold mb-4 uppercase tracking-wider">Pricing</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-serif mb-4">Plans built for every screen</h2>
          <p className="text-slate-500 font-medium text-base md:text-lg max-w-2xl mx-auto mb-16">
            Transparent packages with instant activation. No contracts — cancel
            anytime.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-8">
            {PLANS.map((plan) => (
              <article
                key={plan.name}
                className={`bg-white border border-slate-100 rounded-2xl p-8 shadow-[0_20px_40px_-15px_rgba(15,23,42,0.05)] flex flex-col justify-between relative transition-all duration-300 hover:translate-y-[-4px] hover:shadow-[0_20px_40px_-15px_rgba(15,23,42,0.08)] ${
                  plan.highlight ? "ring-2 ring-blue-600 border-transparent bg-gradient-to-b from-blue-50/10 to-white" : ""
                }`}
              >
                {plan.highlight && (
                  <span className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Most popular
                  </span>
                )}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="mb-6">
                    <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                    <span className="text-slate-400 text-sm font-semibold">{plan.period}</span>
                  </p>
                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center space-x-2.5 text-slate-600 text-sm font-medium">
                        <Check size={14} strokeWidth={2.5} className="text-blue-600 flex-shrink-0" aria-hidden />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href="#login"
                  className={`block text-center py-3 px-6 rounded-xl font-bold text-sm transition-all ${
                    plan.highlight
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/10"
                      : "bg-slate-950 text-white hover:bg-slate-900"
                  }`}
                >
                  Get {plan.name}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* EXISTING SECTION: Setup Guide              */}
      {/* ========================================== */}
      <section id="setup" className="py-24 bg-slate-50/50 border-t border-b border-slate-100 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <p className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100/80 px-3 py-1 rounded-full text-blue-600 text-xs font-bold mb-4 uppercase tracking-wider">Setup Guide</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-serif mb-4">Up and running in three steps</h2>
          <p className="text-slate-500 font-medium text-base md:text-lg max-w-2xl mx-auto mb-16">
            No technical experience needed. Our guides walk you through every
            device.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-8">
            {SETUP_STEPS.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.step} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-[0_12px_24px_-8px_rgba(15,23,42,0.03)] flex flex-col justify-between">
                  <div>
                    <span className="text-blue-600/85 text-xs font-black tracking-widest uppercase block mb-2">{item.step}</span>
                    <Icon className="text-slate-700 mb-6" size={24} strokeWidth={1.8} aria-hidden />
                    <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.body}</p>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="flex justify-center items-center gap-3 mt-12 flex-wrap">
            <span className="inline-flex items-center space-x-2 bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200/40">
              <Tv size={13} aria-hidden /> <span>Smart TV</span>
            </span>
            <span className="inline-flex items-center space-x-2 bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200/40">
              <Monitor size={13} aria-hidden /> <span>Fire Stick</span>
            </span>
            <span className="inline-flex items-center space-x-2 bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200/40">
              <Smartphone size={13} aria-hidden /> <span>Mobile</span>
            </span>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* EXISTING SECTION: Support                  */}
      {/* ========================================== */}
      <section id="support" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <p className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100/80 px-3 py-1 rounded-full text-blue-600 text-xs font-bold mb-4 uppercase tracking-wider">Support</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-serif mb-4">We're here when you need us</h2>
          <p className="text-slate-500 font-medium text-base md:text-lg max-w-2xl mx-auto mb-16">
            Real humans, real answers — before and after you subscribe.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mt-8">
            <article className="bg-slate-50/50 border border-slate-100 rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <Headphones className="text-blue-600 mb-6" size={24} aria-hidden />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Live chat</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  Available 24/7 for Premium and Ultimate subscribers. Or drop us an email anytime.
                </p>
              </div>
              <a href="mailto:support@signalpass.tv" className="inline-flex items-center space-x-1 text-blue-600 font-bold text-sm hover:underline">
                <span>support@signalpass.tv</span>
              </a>
            </article>

            <article className="bg-slate-50/50 border border-slate-100 rounded-2xl p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Common questions</h3>
              <dl className="space-y-5">
                {FAQ.map((item) => (
                  <div key={item.q} className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                    <dt className="text-sm font-bold text-slate-800">{item.q}</dt>
                    <dd className="text-slate-500 text-xs mt-1.5 leading-relaxed">{item.a}</dd>
                  </div>
                ))}
              </dl>
            </article>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* EXISTING SECTION: Learn More / About       */}
      {/* ========================================== */}
      <section id="learn-more" className="py-24 bg-slate-50/50 border-t border-b border-slate-100 relative">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100/80 px-3 py-1 rounded-full text-blue-600 text-xs font-bold mb-4 uppercase tracking-wider">About SignalPass</p>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-serif mb-6">Independent reseller, premium experience</h2>
          <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed mb-8">
            SignalPass.tv is an independent IPTV reseller and customer support
            storefront. We handle account activation, device compatibility validation, 
            and list troubleshooting so you can focus on streaming high-quality channels 
            hassle-free.
          </p>
          <a href="#pricing" className="inline-flex items-center justify-center space-x-2 bg-slate-950 text-white font-bold text-sm py-3 px-6 rounded-xl hover:bg-slate-900 shadow-md">
            <span>Explore plans</span>
          </a>
        </div>
      </section>

      {/* ========================================== */}
      {/* EXISTING SECTION: Account Login            */}
      {/* ========================================== */}
      <section id="login" className="py-24 bg-white relative">
        <div className="max-w-md mx-auto px-6 border border-slate-100 rounded-3xl p-8 md:p-10 shadow-[0_20px_40px_-15px_rgba(15,23,42,0.05)] bg-white relative z-10">
          <p className="text-blue-600/85 text-xs font-black tracking-widest uppercase text-center mb-2">Account</p>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight text-center mb-6">Sign in to your account</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <label className="block text-left text-xs font-bold text-slate-700">
              Email
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full mt-1.5 p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm font-medium bg-slate-50/30"
              />
            </label>
            <label className="block text-left text-xs font-bold text-slate-700">
              Password
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full mt-1.5 p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm font-medium bg-slate-50/30"
              />
            </label>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 px-6 rounded-xl transition-all shadow-md mt-2">
              Sign in
            </button>
            <p className="text-slate-400 text-xs text-center mt-4 font-semibold">
              New here?{" "}
              <a href="#pricing" className="text-blue-600 hover:underline">
                Choose a plan
              </a>{" "}
              to get started.
            </p>
          </form>
        </div>
      </section>

      {/* ========================================== */}
      {/* SECTION 5: Final CTA (Premium Card Layout) */}
      {/* ========================================== */}
      <section className="py-16 bg-white relative px-6">
        <div className="max-w-5xl mx-auto bg-slate-950 text-white rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(15,23,42,0.3)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.18)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-serif text-white">
              Ready to launch a premium streaming experience?
            </h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              SignalPass.tv gives your audience a clean, modern way to access live and on-demand content. Set up your private portal in minutes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              <a
                href="#pricing"
                className="bg-white text-slate-950 hover:bg-slate-100 font-bold text-sm py-3.5 px-7 rounded-xl transition-all shadow-lg flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </a>
              <a
                href="#tv-parser"
                className="border border-slate-700 hover:border-slate-500 hover:bg-white/5 text-white font-bold text-sm py-3.5 px-7 rounded-xl transition-all"
              >
                Explore TV Parser
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 text-center text-slate-400 text-xs font-semibold">
        <p>© {new Date().getFullYear()} SignalPass.tv — Independent IPTV reseller</p>
      </footer>
    </div>
  );
}
