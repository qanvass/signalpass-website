'use client'

import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import TvScrollytelling from './TvScrollytelling'
import TrustBar from './TrustBar'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768
    
    if (prefersReducedMotion || isMobile) return

    gsap.registerPlugin(ScrollTrigger)

    // Pin the hero container during scroll-triage to let TV spill anim run
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=1200',
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      scrub: 1,
    })
  }, { scope: containerRef })

  return (
    <section 
      ref={containerRef} 
      id="hero-container" 
      className="w-full min-h-screen bg-slate-50 flex flex-col justify-between relative overflow-hidden"
    >
      {/* Subtle background studio light gradients */}
      <div className="absolute top-0 right-[-10%] w-[60%] h-[70%] bg-blue-100/35 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[60%] bg-slate-200/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Grid Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center py-4 lg:py-6 z-10">
        
        {/* Left Column: SaaS Typography & Copy */}
        <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6 md:space-y-8">
          
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

        {/* Right Column: Visual Stage (Podium, TV, Floating cards, Spill items) */}
        <div className="lg:col-span-6 w-full flex items-center justify-center">
          <TvScrollytelling />
        </div>

      </div>

      {/* Floating Bottom Trust Bar */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 pb-4 lg:pb-6 z-20">
        <TrustBar />
      </div>
      
    </section>
  )
}
