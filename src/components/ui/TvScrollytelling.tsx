'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flame, Globe, RotateCw, Monitor, Film, Radio, Cpu, Wifi, Play, Sparkles, Tv } from 'lucide-react'

export default function TvScrollytelling() {
  const containerRef = useRef<HTMLDivElement>(null)
  const tvScreenRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useGSAP(() => {
    // Check for prefers-reduced-motion or mobile screens to skip heavy animations
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768
    
    if (prefersReducedMotion || isMobile) {
      // Hide static noise overlay to show video normally in TV
      gsap.set('.tv-static-layer', { opacity: 0 })
      return
    }

    gsap.registerPlugin(ScrollTrigger)

    // Base Timeline for the scroll-controlled pop-out animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: typeof document !== 'undefined' ? (document.getElementById('hero-container') || '#hero-container') : '#hero-container',
        start: 'top top',
        end: '+=1200',
        scrub: 1,
      }
    })

    // Setup timeline durations matching specifications (total duration = 1.0)
    
    // 1. 0% to 15%: static overlay fades from visible (0.75) to hidden (0)
    tl.to('.tv-static-layer', {
      opacity: 0,
      ease: 'none',
      duration: 0.15
    }, 0)

    // 2. 15% to 35%: video brightness/saturation increases slightly
    tl.fromTo('.tv-video-element',
      { filter: 'brightness(0.8) saturate(0.8)' },
      { filter: 'brightness(1.15) saturate(1.25)', ease: 'power1.inOut', duration: 0.20 },
      0.15
    )

    // 3. 25% to 70%: spill elements scale from 0 to 1 and move from the TV screen center outward
    // We use xPercent: -50 and yPercent: -50 to keep them perfectly centered as they scale up from center
    tl.fromTo('.spill-item', 
      {
        scale: 0,
        opacity: 0,
        x: 0,
        y: 0,
        z: -150,
        xPercent: -50,
        yPercent: -50,
        rotation: 0
      },
      {
        scale: 1,
        opacity: 1,
        xPercent: -50,
        yPercent: -50,
        stagger: 0.02,
        duration: 0.45,
        ease: 'power2.out',
        // Disperse them outwards based on custom data coordinates
        x: (_i, target: any) => target.dataset.targetX || 0,
        y: (_i, target: any) => target.dataset.targetY || 0,
        z: (_i, target: any) => target.dataset.targetZ || 50,
        rotation: (_i, target: any) => target.dataset.targetRot || 0,
      },
      0.25
    )

    // 4. 70% to 100%: spill elements settle around the hero (subtle float/drift)
    tl.to('.spill-item', {
      y: '+=15',
      rotation: '+=4',
      ease: 'sine.inOut',
      duration: 0.30
    }, 0.70)

  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center justify-center relative py-2 select-none">
      
      {/* 3D Perspective container */}
      <div className="tv-perspective-container w-full max-w-[480px] aspect-square relative flex items-center justify-center">
        
        {/* ========================================================================= */}
        {/* FIRST LAYER: The Static Hero Layout (TV, Podium, and 4 Main Floating Cards) */}
        {/* ========================================================================= */}
        
        {/* A. Double-Tier Podium Background shadow */}
        <div className="absolute bottom-2 w-[85%] h-8 bg-slate-900/5 blur-xl rounded-full pointer-events-none" />

        {/* B. Retro TV Shell Image */}
        <img
          src="/assets/tv/retro_tv_podium.png"
          alt="Retro TV Display"
          className="w-full h-auto object-contain z-10 relative pointer-events-none"
        />

        {/* C. Interactive CRT Video Screen */}
        <div 
          ref={tvScreenRef} 
          className="absolute top-[27.2%] left-[24.2%] w-[39.0%] h-[32.8%] overflow-hidden z-20 bg-slate-950 border border-slate-900/60 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"
          style={{ borderRadius: '12px 12px 14px 14px / 20px' }}
        >
          {/* Loop Video */}
          <video
            ref={videoRef}
            src="/assets/tv/page-video-scrolly-instance.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="tv-video-element absolute object-cover"
            style={{
              width: '568.18%',
              height: '301.66%',
              left: '-333.52%',
              top: '-89.38%',
            }}
          />

          {/* Screen glare/vignette overlays */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20 pointer-events-none rounded-xl" />
          <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.9)] pointer-events-none" />

          {/* CRT scanlines noise overlay (fades out on scroll) */}
          <div className="tv-static-layer absolute inset-0 screen-static opacity-75 pointer-events-none z-10 transition-opacity duration-300" />
        </div>

        {/* D. Initial Floating Info Cards (Hidden on mobile for clean layouts) */}
        
        {/* Card 1: Top-Right (200+ Channels) */}
        <div className="absolute -top-6 -right-4 bg-white/95 backdrop-blur border border-slate-100 rounded-xl p-3 shadow-[0_12px_24px_-8px_rgba(15,23,42,0.06)] hidden sm:flex items-center space-x-2.5 z-30 pointer-events-auto hover:translate-y-[-2px] transition-transform duration-300">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <Monitor className="w-4.5 h-4.5" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-900 leading-tight">200+ Channels</h5>
            <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">Live & global</p>
          </div>
        </div>

        {/* Card 2: Middle-Left (4K Ready) */}
        <div className="absolute top-[40%] -left-12 bg-white/95 backdrop-blur border border-slate-100 rounded-xl p-3 shadow-[0_12px_24px_-8px_rgba(15,23,42,0.06)] hidden sm:flex items-center space-x-2.5 z-30 pointer-events-auto hover:translate-y-[-2px] transition-transform duration-300">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-black text-[10px]">
            4K
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-900 leading-tight">4K Ready</h5>
            <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">Crisp. Clear. Beautiful.</p>
          </div>
        </div>

        {/* Card 3: Middle-Right (Works Everywhere) */}
        <div className="absolute top-[32%] -right-16 bg-white/95 backdrop-blur border border-slate-100 rounded-xl p-3 shadow-[0_12px_24px_-8px_rgba(15,23,42,0.06)] hidden sm:flex items-center space-x-2.5 z-30 pointer-events-auto hover:translate-y-[-2px] transition-transform duration-300">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <Globe className="w-4.5 h-4.5" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-900 leading-tight">Works Everywhere</h5>
            <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">Phone, tablet, TV, web</p>
          </div>
        </div>

        {/* Card 4: Bottom-Right (Updated Daily) */}
        <div className="absolute -bottom-2 -right-6 bg-white/95 backdrop-blur border border-slate-100 rounded-xl p-3 shadow-[0_12px_24px_-8px_rgba(15,23,42,0.06)] hidden sm:flex items-center space-x-2.5 z-30 pointer-events-auto hover:translate-y-[-2px] transition-transform duration-300">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <RotateCw className="w-4.5 h-4.5 animate-[spin_8s_linear_infinite]" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-900 leading-tight">Updated Daily</h5>
            <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">New channels regularly</p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECOND LAYER: Spill Elements (Emerge from TV Screen center on scroll)    */}
        {/* ========================================================================= */}
        {/* All spill items start absolute at the center of the CRT screen:           */}
        {/* top-[43.6%] left-[43.7%] and are centered via GSAP's xPercent/yPercent.   */}
        {/* We hardcode inline styles to hide them and disable pointer events on load.*/}
        {/* ========================================================================= */}
        
        {/* 1. Glowing Sports Ball (emerges top-right) */}
        <div 
          data-target-x="180" 
          data-target-y="-140" 
          data-target-z="140" 
          data-target-rot="45"
          className="spill-item absolute top-[43.6%] left-[43.7%] w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 shadow-[0_0_20px_rgba(249,115,22,0.85)] flex items-center justify-center border border-orange-300/80 z-30 pointer-events-none"
          style={{ opacity: 0, transform: 'scale(0) translate(-50%, -50%)', transformOrigin: 'center center', pointerEvents: 'none' }}
        >
          <Flame className="w-5 h-5 text-white" />
        </div>

        {/* 2. LIVE Badge (Top Left) */}
        <div 
          data-target-x="-180" 
          data-target-y="-120" 
          data-target-z="100" 
          data-target-rot="-12"
          className="spill-item absolute top-[43.6%] left-[43.7%] bg-slate-900 text-white rounded-lg px-3 py-1.5 shadow-xl hidden md:flex items-center space-x-2 z-30 pointer-events-none"
          style={{ opacity: 0, transform: 'scale(0) translate(-50%, -50%)', transformOrigin: 'center center', pointerEvents: 'none' }}
        >
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <Radio className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[10px] font-extrabold tracking-wide uppercase">LIVE</span>
        </div>

        {/* 3. MOVIES Badge (Middle Left Lower) */}
        <div 
          data-target-x="-130" 
          data-target-y="120" 
          data-target-z="150" 
          data-target-rot="8"
          className="spill-item absolute top-[43.6%] left-[43.7%] bg-white border border-slate-100 rounded-lg p-2.5 shadow-xl hidden md:flex items-center space-x-2.5 z-30 pointer-events-none"
          style={{ opacity: 0, transform: 'scale(0) translate(-50%, -50%)', transformOrigin: 'center center', pointerEvents: 'none' }}
        >
          <Film className="w-4 h-4 text-blue-600" />
          <div className="text-left">
            <span className="block text-[9px] font-extrabold uppercase text-slate-400">4K Ready</span>
            <span className="text-[10px] font-bold text-slate-900">Movie Moment</span>
          </div>
        </div>

        {/* 4. SPORTS Badge (Middle Right) */}
        <div 
          data-target-x="220" 
          data-target-y="-40" 
          data-target-z="120" 
          data-target-rot="-10"
          className="spill-item absolute top-[43.6%] left-[43.7%] bg-white border border-slate-100 rounded-lg p-2.5 shadow-xl hidden md:flex items-center space-x-2.5 z-30 pointer-events-none"
          style={{ opacity: 0, transform: 'scale(0) translate(-50%, -50%)', transformOrigin: 'center center', pointerEvents: 'none' }}
        >
          <Flame className="w-4 h-4 text-orange-500" />
          <div className="text-left">
            <span className="block text-[9px] font-extrabold uppercase text-slate-400">Live TV</span>
            <span className="text-[10px] font-bold text-slate-900">Sports Moment</span>
          </div>
        </div>

        {/* 5. EPG Active Tile (Bottom Right) */}
        <div 
          data-target-x="220" 
          data-target-y="60" 
          data-target-z="80" 
          data-target-rot="12"
          className="spill-item absolute top-[43.6%] left-[43.7%] bg-white border border-slate-100 rounded-lg p-2.5 shadow-xl hidden md:flex items-center space-x-2.5 z-30 pointer-events-none"
          style={{ opacity: 0, transform: 'scale(0) translate(-50%, -50%)', transformOrigin: 'center center', pointerEvents: 'none' }}
        >
          <Cpu className="w-4 h-4 text-blue-600" />
          <div className="text-left">
            <span className="block text-[9px] font-extrabold uppercase text-slate-400">Smart Guide</span>
            <span className="text-[10px] font-bold text-slate-900">Guide Sync</span>
          </div>
        </div>

        {/* 6. Signal Wave (Top Center) */}
        <div 
          data-target-x="-20" 
          data-target-y="-210" 
          data-target-z="60" 
          data-target-rot="-5"
          className="spill-item absolute top-[43.6%] left-[43.7%] bg-white/95 border border-slate-100 rounded-full py-1.5 px-3 shadow-md hidden md:flex items-center space-x-1.5 z-30 pointer-events-none"
          style={{ opacity: 0, transform: 'scale(0) translate(-50%, -50%)', transformOrigin: 'center center', pointerEvents: 'none' }}
        >
          <Wifi className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Signal Feed</span>
        </div>

        {/* 7. [NEW] Media Card (Top-Right-Center) */}
        <div 
          data-target-x="140" 
          data-target-y="-210" 
          data-target-z="130" 
          data-target-rot="15"
          className="spill-item absolute top-[43.6%] left-[43.7%] bg-white border border-slate-100 rounded-xl p-3 shadow-xl hidden md:flex items-center space-x-3 z-30 pointer-events-none"
          style={{ opacity: 0, transform: 'scale(0) translate(-50%, -50%)', transformOrigin: 'center center', pointerEvents: 'none' }}
        >
          <div className="w-8 h-10 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0">
            <Play className="w-3 h-3 fill-white" />
          </div>
          <div className="text-left">
            <div className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-blue-500 fill-blue-500/20" />
              <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider">Premium Stream</span>
            </div>
            <h6 className="text-[11px] font-bold text-slate-900 leading-tight">Featured Series</h6>
            <p className="text-[8px] text-slate-400 mt-0.5">Global Stream • 48m left</p>
          </div>
        </div>

        {/* 8. [NEW] Channel Tile (Middle Left) */}
        <div 
          data-target-x="-220" 
          data-target-y="20" 
          data-target-z="120" 
          data-target-rot="-8"
          className="spill-item absolute top-[43.6%] left-[43.7%] bg-white border border-slate-100 rounded-xl p-2.5 shadow-xl hidden md:flex items-center space-x-2.5 z-30 pointer-events-none"
          style={{ opacity: 0, transform: 'scale(0) translate(-50%, -50%)', transformOrigin: 'center center', pointerEvents: 'none' }}
        >
          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 flex-shrink-0">
            <Tv className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-slate-900">Cinema Preview</span>
            </div>
            <span className="text-[8px] text-slate-400 block mt-0.5">On-Demand</span>
          </div>
        </div>

        {/* 9. [NEW] Mini Video Frame (Bottom Left) */}
        <div 
          data-target-x="-120" 
          data-target-y="200" 
          data-target-z="100" 
          data-target-rot="5"
          className="spill-item absolute top-[43.6%] left-[43.7%] bg-slate-900/95 border border-slate-800 rounded-xl p-2.5 shadow-xl hidden md:flex flex-col w-[130px] z-30 pointer-events-none"
          style={{ opacity: 0, transform: 'scale(0) translate(-50%, -50%)', transformOrigin: 'center center', pointerEvents: 'none' }}
        >
          {/* Simulated player screen */}
          <div className="w-full aspect-video rounded-lg bg-gradient-to-tr from-blue-600/30 to-purple-600/30 border border-slate-800 flex items-center justify-center relative overflow-hidden mb-2">
            <Play className="w-4 h-4 text-white fill-white/20 z-10" />
            <div className="absolute inset-0 bg-slate-950/20" />
            <div className="absolute bottom-1.5 left-1.5 bg-red-600 text-[8px] font-extrabold px-1 rounded-sm text-white uppercase tracking-wider leading-none py-0.5">
              Live Preview
            </div>
          </div>
          {/* Mini play bar */}
          <div className="w-full h-1 bg-slate-850 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-blue-500" />
          </div>
          <div className="flex justify-between items-center mt-1.5">
            <span className="text-[8px] text-slate-400">Stream Health</span>
            <span className="text-[8px] text-emerald-400 font-bold">99.8%</span>
          </div>
        </div>

        {/* 10. Light Streaks (Horizontal glow lines) */}
        <div 
          data-target-x="-150" 
          data-target-y="-50" 
          data-target-z="180" 
          className="spill-item absolute top-[43.6%] left-[43.7%] w-[100px] h-[1px] bg-gradient-to-r from-blue-500/0 via-blue-500/85 to-blue-500/0 z-30 pointer-events-none"
          style={{ opacity: 0, transform: 'scale(0) translate(-50%, -50%)', transformOrigin: 'center center', pointerEvents: 'none' }}
        />
        <div 
          data-target-x="150" 
          data-target-y="50" 
          data-target-z="180" 
          className="spill-item absolute top-[43.6%] left-[43.7%] w-[100px] h-[1px] bg-gradient-to-r from-blue-500/0 via-blue-500/85 to-blue-500/0 z-30 pointer-events-none"
          style={{ opacity: 0, transform: 'scale(0) translate(-50%, -50%)', transformOrigin: 'center center', pointerEvents: 'none' }}
        />

        {/* 11. Blue Particles */}
        <div 
          data-target-x="-120" 
          data-target-y="-90" 
          data-target-z="200" 
          className="spill-item absolute top-[43.6%] left-[43.7%] w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.8)] hidden md:block z-30 pointer-events-none"
          style={{ opacity: 0, transform: 'scale(0) translate(-50%, -50%)', transformOrigin: 'center center', pointerEvents: 'none' }}
        />
        <div 
          data-target-x="120" 
          data-target-y="-40" 
          data-target-z="200" 
          className="spill-item absolute top-[43.6%] left-[43.7%] w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)] hidden md:block z-30 pointer-events-none"
          style={{ opacity: 0, transform: 'scale(0) translate(-50%, -50%)', transformOrigin: 'center center', pointerEvents: 'none' }}
        />
        <div 
          data-target-x="40" 
          data-target-y="180" 
          data-target-z="180" 
          className="spill-item absolute top-[41.5%] left-[38.2%] w-3.5 h-3.5 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.8)] hidden md:block z-30 pointer-events-none"
          style={{ opacity: 0, transform: 'scale(0) translate(-50%, -50%)', transformOrigin: 'center center', pointerEvents: 'none' }}
        />

      </div>

    </div>
  )
}
