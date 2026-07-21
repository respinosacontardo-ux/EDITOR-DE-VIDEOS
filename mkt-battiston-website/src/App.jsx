import { useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import HeroSection from './components/HeroSection.jsx'
import VentajasSection from './components/VentajasSection.jsx'
import SoftwareSection from './components/SoftwareSection.jsx'
import ComparisonSection from './components/ComparisonSection.jsx'
import FinalCTASection from './components/FinalCTASection.jsx'
import Footer from './components/Footer.jsx'
import { SOFTWARES } from './data/content.js'

export default function App() {
  const scrollRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => setScrolled(el.scrollTop > 40)
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-base text-[#F5F5F5]">
      <Navbar scrolled={scrolled} />

      <main
        ref={scrollRef}
        className="snap-container relative w-full h-full overflow-y-scroll z-20 scroll-smooth"
      >
        <HeroSection />
        <VentajasSection />
        {SOFTWARES.map((software, i) => (
          <SoftwareSection key={software.id} software={software} flip={i % 2 === 1} />
        ))}
        <ComparisonSection />
        <FinalCTASection />
        <Footer />
      </main>
    </div>
  )
}
