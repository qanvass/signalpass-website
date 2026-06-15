'use client'

import { useRef } from 'react'
import { ArrowRight, Monitor, Globe, RotateCw } from 'lucide-react'
import Header from './Header'
import TrustBar from './TrustBar'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768
    
    if (prefersReducedMotion || isMobile) {
      // Allow video to autoplay normally on mobile or reduced-motion
      if (videoRef.current) {
        videoRef.current.play().catch(() => {})
      }
      return
    }

    gsap.registerPlugin(ScrollTrigger)

    const video = videoRef.current
    if (!video) return

    // Pause video because GSAP will manually control video.currentTime based on scroll
    video.pause()

    const setupScrollTimeline = () => {
      const duration = video.duration || 1

      // Main pin scrolltrigger for the hero container that also scrubs video currentTime
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=1200',
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.1,
        onUpdate: (self) => {
          // Safely set currentTime to match scroll progress
          video.currentTime = self.progress * duration
        }
      })

      // Timeline to scrub and fade cards and scale video
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=1200',
          scrub: 0.1,
        }
      })

      // Fade out the floating UI cards quickly
      tl.to('.hero-floating-card', {
        opacity: 0,
        scale: 0.85,
        stagger: 0.05,
        ease: 'power1.out',
        duration: 0.4,
      }, 0)

      // Subtly scale and fade video as it approaches release
      tl.fromTo(video,
        { scale: 0.96 },
        { 
          scale: 1.04,
          ease: 'power1.inOut',
          duration: 1,
        },
        0
      )
    }

    // Safely wait for metadata if not loaded yet
    if (video.readyState >= 1) {
      setupScrollTimeline()
    } else {
      video.addEventListener('loadedmetadata', setupScrollTimeline)
      return () => {
        video.removeEventListener('loadedmetadata', setupScrollTimeline)
      }
    }
  }, { scope: containerRef })

  return (
    <section 
      ref={containerRef} 
      id="hero-container" 
      className="w-full min-h-screen bg-slate-50 flex flex-col justify-between relative overflow-hidden"
    >
      {/* Sticky-like Header rendered directly inside the hero container */}
      <Header />

      {/* Subtle background studio light gradients */}
      <div className="absolute top-0 right-[-10%] w-[60%] h-[70%] bg-blue-100/35 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[60%] bg-slate-200/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Grid Content */}
      <div className="hero-layout flex-grow max-w-7xl w-full mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center py-8 z-10">
        
        {/* Left Column: SaaS Typography & Copy */}
        <div className="hero-copy lg:col-span-6 flex flex-col items-start text-left space-y-6 md:space-y-8">
          
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100/80 px-3 py-1 rounded-full text-blue-600 text-xs font-bold select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span>Premium streaming. Zero limits.</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08] font-serif">
            All your streaming.<br />
            <span className="text-slate-900">One premium platform.</span>
          </h1>

          {/* Subheadline / Description */}
          <p className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-lg font-medium">
            Access live TV and on-demand content from anywhere. Built for quality, reliability, and freedom.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <a
              href="#pricing"
              className="bg-slate-950 hover:bg-slate-900 text-white font-semibold rounded-xl px-6 py-3.5 transition-all text-center flex items-center justify-center space-x-2 shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#setup"
              className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-semibold rounded-xl px-6 py-3.5 transition-all text-center flex items-center justify-center hover:bg-slate-50 active:scale-[0.98]"
            >
              Explore Features
            </a>
          </div>

          {/* Social Proof */}
          <div className="flex items-center space-x-4 pt-4 border-t border-slate-200/60 w-full">
            <div className="flex -space-x-2.5 avatar-stack">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="User portrait"
                className="w-9 h-9 rounded-full object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                alt="User portrait"
                className="w-9 h-9 rounded-full object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                alt="User portrait"
                className="w-9 h-9 rounded-full object-cover"
              />
            </div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
              <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-bold">2K+</span>
              <span>Trusted by viewers in 120+ countries</span>
            </div>
          </div>

        </div>

        {/* Right Column: Visual Stage (Raw MP4 scrollytelling video centerpiece) */}
        <div className="hero-video-stage lg:col-span-6 w-full flex items-center justify-center relative">
          
          <video
            ref={videoRef}
            src="/assets/tv/page-video-scrolly-instance.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="hero-scrolly-video w-full h-auto aspect-video object-contain rounded-[28px] shadow-2xl border border-white/70 bg-white z-20"
          />

          {/* Card 1: Top-Right (200+ Channels) */}
          <div className="hero-floating-card absolute -top-4 -right-4 bg-white/95 backdrop-blur border border-slate-100 rounded-xl p-3 shadow-md hidden sm:flex items-center space-x-2.5 z-30 pointer-events-auto hover:translate-y-[-2px] transition-transform duration-300">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Monitor className="w-4.5 h-4.5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900 leading-tight">200+ Channels</h5>
              <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">Live & global</p>
            </div>
          </div>

          {/* Card 2: Middle-Left (4K Ready) */}
          <div className="hero-floating-card absolute top-[40%] -left-12 bg-white/95 backdrop-blur border border-slate-100 rounded-xl p-3 shadow-md hidden sm:flex items-center space-x-2.5 z-30 pointer-events-auto hover:translate-y-[-2px] transition-transform duration-300">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-black text-[10px]">
              4K
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900 leading-tight">4K Ready</h5>
              <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">Crisp & clear</p>
            </div>
          </div>

          {/* Card 3: Middle-Right (Works Everywhere) */}
          <div className="hero-floating-card absolute top-[30%] -right-16 bg-white/95 backdrop-blur border border-slate-100 rounded-xl p-3 shadow-md hidden sm:flex items-center space-x-2.5 z-30 pointer-events-auto hover:translate-y-[-2px] transition-transform duration-300">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Globe className="w-4.5 h-4.5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900 leading-tight">Works Everywhere</h5>
              <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">Phone, tablet, TV, web</p>
            </div>
          </div>

          {/* Card 4: Bottom-Right (Updated Daily) */}
          <div className="hero-floating-card absolute -bottom-4 -right-4 bg-white/95 backdrop-blur border border-slate-100 rounded-xl p-3 shadow-md hidden sm:flex items-center space-x-2.5 z-30 pointer-events-auto hover:translate-y-[-2px] transition-transform duration-300">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <RotateCw className="w-4.5 h-4.5 animate-[spin_8s_linear_infinite]" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900 leading-tight">Updated Daily</h5>
              <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">New channels regularly</p>
            </div>
          </div>

        </div>

      </div>

      {/* Floating Bottom Trust Bar */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 pb-6 z-20">
        <TrustBar />
      </div>
      
    </section>
  )
}

