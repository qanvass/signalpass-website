import SmoothScroll from './components/ui/SmoothScroll'
import HeroSection from './components/ui/HeroSection'
import ContentSections from './components/sections/ContentSections'

export default function App() {
  return (
    <SmoothScroll>
      <div className="w-full min-h-screen bg-white text-slate-900 selection:bg-blue-100 select-none">
        <main className="w-full flex flex-col">
          <HeroSection />
          <ContentSections />
        </main>
      </div>
    </SmoothScroll>
  )
}

