import { useState, useEffect, useRef } from 'react'
import {
  Waves, Dumbbell, Clock, Car, Wifi, Shield, Sparkles,
  Building2, ChevronRight, ChevronLeft, ArrowDown,
  MapPin, Phone, Mail, Check, X, Menu,
} from 'lucide-react'

// ─── Static data ─────────────────────────────────────────────────────────────

const PROPERTIES = [
  {
    id: '1br',
    label: '1-Bedroom Executive',
    price: 'From KSh 14M',
    size: '85 sqm',
    beds: 1,
    baths: 1,
    image: 'https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?w=900&q=85',
    features: [
      'Italian Calacatta marble flooring',
      'Floor-to-ceiling curtain-wall glazing',
      'Bosch integrated appliance suite',
      'Ensuite with rainfall shower & soaking tub',
      'Private balcony with city panorama',
      'Smart lighting & climate control',
    ],
  },
  {
    id: '2br',
    label: '2-Bedroom Duplex',
    price: 'From KSh 22M',
    size: '145 sqm',
    beds: 2,
    baths: 2,
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=900&q=85',
    features: [
      'Double-volume open-plan living',
      "Chef's kitchen with waterfall island",
      'Master suite with walk-in wardrobe',
      'Private upper-deck terrace',
      'Full Crestron smart home system',
      'Dedicated basement parking × 2',
    ],
  },
  {
    id: 'penthouse',
    label: 'The Aura Penthouse',
    price: 'From KSh 65M',
    size: '380 sqm',
    beds: 4,
    baths: 5,
    // white sofa + panoramic city view — high-floor apartment interior
    image: 'https://images.unsplash.com/photo-1629236714859-3a1ec2d8f6c3?w=900&q=85',
    features: [
      '360° panoramic views of Nairobi skyline',
      'Private infinity plunge pool',
      'Home cinema — 4K Dolby Atmos',
      'Dedicated chef & butler service',
      'Private elevator with biometric access',
      'Climate-controlled wine cellar',
    ],
  },
]

const AMENITIES = [
  { icon: Waves,     title: 'Infinity Edge Pool',   desc: 'Sky-level pool overlooking the Nairobi skyline' },
  { icon: Building2, title: 'Rooftop Lounge',        desc: 'Exclusive residents-only terrace bar & event space' },
  { icon: Dumbbell,  title: 'Performance Gym',       desc: 'Technogym-equipped private fitness studio' },
  { icon: Clock,     title: '24/7 Concierge',        desc: 'White-glove resident services around the clock' },
  { icon: Car,       title: 'Secure Parking',        desc: 'Biometric basement with dedicated EV charging bays' },
  { icon: Shield,    title: 'Smart Security',        desc: 'CCTV, facial recognition & panic-response systems' },
  { icon: Wifi,      title: '1 Gbps Fibre',          desc: 'Dedicated high-speed fibre per unit, no contention' },
  { icon: Sparkles,  title: 'Wellness Spa',          desc: 'In-house sauna, steam & private treatment rooms' },
]

const GALLERY = [
  'https://images.unsplash.com/photo-1757924461488-ef9ad0670978?w=700&q=85', // living room — large windows
  'https://images.unsplash.com/photo-1751290741340-85c4bdcc8d24?w=700&q=85', // living room — soft lighting
  'https://images.unsplash.com/photo-1715985160020-d8cd6fdc8ba9?w=700&q=85', // kitchen — island + stools
  'https://images.unsplash.com/photo-1695002817411-203c7f19dfa3?w=700&q=85', // bathroom — tub & mirror
  'https://images.unsplash.com/photo-1758193431353-87812fbff5cd?w=700&q=85', // rooftop patio — city view
  'https://images.unsplash.com/photo-1776363116182-51694a04a1d5?w=700&q=85', // balcony — hanging chair
]

const LOCATIONS = [
  { place: 'Sarit Centre',      distance: '4 min walk' },
  { place: 'Westgate Mall',     distance: '5 min walk' },
  { place: 'US Embassy',        distance: '8 min drive' },
  { place: 'USIU-Africa',       distance: '12 min drive' },
  { place: 'Aga Khan Hospital', distance: '10 min drive' },
  { place: 'JKIA Airport',      distance: '35 min drive' },
]

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '04:00 PM', '05:00 PM',
]

const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December']
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

// ─── Calendar helpers ─────────────────────────────────────────────────────────

function daysInMonth(y, m)  { return new Date(y, m + 1, 0).getDate() }
function firstDayOf(y, m)   { return new Date(y, m, 1).getDay() }
function formatDate(d) {
  if (!d) return ''
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

// ─── useInView hook (scroll-triggered animations) ─────────────────────────────

function useInView(threshold = 0.12) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

// ─── FadeIn wrapper ───────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0, className = '' }) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}

// ─── WhatsApp CTA ─────────────────────────────────────────────────────────────

function WhatsAppCTA() {
  return (
    <a
      href="https://wa.me/254700000000"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 left-6 z-[90] group flex items-center gap-3"
    >
      <div className="w-14 h-14 rounded-full bg-[#25D366] shadow-xl shadow-[#25D366]/25 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
        <svg viewBox="0 0 24 24" fill="white" width="26" height="26">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </div>
      <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 bg-aura-charcoal text-white text-[10px] tracking-[0.2em] uppercase px-3 py-2 shadow-lg whitespace-nowrap pointer-events-none">
        Chat with us
      </span>
    </a>
  )
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({ images, index, onClose }) {
  const [current, setCurrent] = useState(index)

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape')      onClose()
      if (e.key === 'ArrowLeft')   setCurrent(c => Math.max(0, c - 1))
      if (e.key === 'ArrowRight')  setCurrent(c => Math.min(images.length - 1, c + 1))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, images.length])

  const prev = (e) => { e.stopPropagation(); setCurrent(c => Math.max(0, c - 1)) }
  const next = (e) => { e.stopPropagation(); setCurrent(c => Math.min(images.length - 1, c + 1)) }

  return (
    <div
      className="fixed inset-0 z-[150] bg-aura-black/95 flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center border border-white/15 hover:border-white/40 text-white/50 hover:text-white transition-all duration-200 z-10"
        aria-label="Close"
      >
        <X size={17} />
      </button>

      {/* Counter */}
      <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] uppercase text-white/35 z-10 pointer-events-none">
        {current + 1} / {images.length}
      </span>

      {/* Prev */}
      <button
        onClick={prev}
        disabled={current === 0}
        className="absolute left-5 sm:left-8 w-12 h-12 flex items-center justify-center border border-white/15 hover:border-gold/50 text-white/50 hover:text-gold transition-all duration-200 disabled:opacity-15 disabled:cursor-not-allowed z-10"
        aria-label="Previous image"
      >
        <ChevronLeft size={22} />
      </button>

      {/* Full-res image */}
      <img
        key={current}
        src={images[current].replace('w=700', 'w=1400')}
        alt={`Aura Residences — image ${current + 1}`}
        className="max-h-[80vh] max-w-[92vw] sm:max-w-[78vw] object-contain shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Next */}
      <button
        onClick={next}
        disabled={current === images.length - 1}
        className="absolute right-5 sm:right-8 w-12 h-12 flex items-center justify-center border border-white/15 hover:border-gold/50 text-white/50 hover:text-gold transition-all duration-200 disabled:opacity-15 disabled:cursor-not-allowed z-10"
        aria-label="Next image"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dot nav */}
      <div className="absolute bottom-7 flex items-center gap-2 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setCurrent(i) }}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === current ? 'bg-gold w-6' : 'bg-white/30 w-1.5 hover:bg-white/55'
            }`}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

// ─── GoldLine ─────────────────────────────────────────────────────────────────

function GoldLine() {
  return <div className="w-8 h-px bg-gold" />
}

function SectionTag({ children }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <GoldLine />
      <span className="text-[10px] tracking-[0.4em] uppercase text-gold">{children}</span>
    </div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ onBookClick }) {
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = [
    { label: 'Overview',   href: '#hero' },
    { label: 'Residences', href: '#residences' },
    { label: 'Amenities',  href: '#amenities' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-aura-black/90 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">

        {/* Logo */}
        <a href="#hero" className="flex flex-col leading-none group">
          <span className="font-serif text-2xl font-light tracking-[0.18em] text-gold group-hover:text-gold-light transition-colors duration-300">
            AURA
          </span>
          <span className="text-[8px] tracking-[0.45em] text-white/55 uppercase mt-0.5">
            RESIDENCES
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          {links.map(l => (
            <a
              key={l.label}
              href={l.href}
              className="text-[10px] tracking-[0.22em] uppercase text-white/70 hover:text-white transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA + mobile hamburger */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBookClick}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-light text-aura-black text-[10px] tracking-[0.22em] uppercase font-semibold transition-all duration-300 rounded-sm"
          >
            Book Viewing
            <ChevronRight size={11} />
          </button>
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="md:hidden text-white/50 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } bg-aura-black/95 backdrop-blur-xl border-t border-white/5`}
      >
        <div className="px-6 py-4">
          {links.map(l => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-[10px] tracking-[0.25em] uppercase text-white/70 hover:text-white transition-colors border-b border-white/5"
            >
              {l.label}
            </a>
          ))}
          <button
            onClick={() => { onBookClick(); setMobileOpen(false) }}
            className="mt-4 w-full py-3.5 bg-gold hover:bg-gold-light text-aura-black text-[10px] tracking-[0.25em] uppercase font-semibold transition-all duration-300 rounded-sm"
          >
            Book Viewing
          </button>
        </div>
      </div>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ onExplore, onSchedule }) {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center overflow-hidden">

      {/* Background — modern apartment tower with glass balconies */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1598200816350-41038d5b7be4?w=2070&q=80')",
        }}
      />
      {/* Layer 1 — strong base scrim for daytime building photo */}
      <div className="absolute inset-0 bg-aura-black/68" />
      {/* Layer 2 — directional: left text area pushed to near-black */}
      <div className="absolute inset-0 bg-gradient-to-r from-aura-black/92 via-aura-black/55 to-transparent" />
      {/* Layer 3 — vertical: ground the bottom, soften the sky */}
      <div className="absolute inset-0 bg-gradient-to-t from-aura-black via-transparent to-aura-black/50" />

      {/* Content */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 pt-24 pb-14 sm:pt-36 sm:pb-28 w-full"
        style={{ textShadow: '0 2px 24px rgba(0,0,0,0.85)' }}
      >
        <SectionTag>Westlands · Nairobi</SectionTag>

        <h1 className="font-serif text-4xl sm:text-7xl lg:text-[88px] font-light text-white leading-[1.05] max-w-4xl mt-2">
          Elevated Living<br />
          <em className="text-gold">in the Heart of</em><br />
          Westlands
        </h1>

        <p className="mt-6 sm:mt-8 text-white/80 text-sm sm:text-lg font-light leading-relaxed max-w-sm">
          A curated collection of 42 residences where architectural precision
          meets Nairobi's most prestigious address.
        </p>

        {/* Stats — grid forces all three onto one row */}
        <div className="grid grid-cols-3 gap-3 sm:gap-10 mt-8 mb-10 sm:mt-12 sm:mb-14">
          {[['42', 'Residences'], ['3', 'Penthouse Floors'], ['KSh 14M', 'Starting Price']].map(
            ([val, lbl]) => (
              <div key={lbl}>
                <div className="font-serif text-2xl sm:text-3xl text-gold">{val}</div>
                <div className="text-[8px] sm:text-[9px] tracking-[0.18em] sm:tracking-[0.25em] uppercase text-white/60 mt-1 leading-tight">{lbl}</div>
              </div>
            )
          )}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onExplore}
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-gold hover:bg-gold-light text-aura-black text-[10px] tracking-[0.28em] uppercase font-semibold transition-all duration-300"
          >
            Explore Residences
            <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform duration-200" />
          </button>
          <button
            onClick={onSchedule}
            className="group flex items-center justify-center gap-3 px-8 py-4 border border-white/20 hover:border-gold/60 text-white hover:text-gold text-[10px] tracking-[0.28em] uppercase transition-all duration-300"
          >
            Schedule VIP Viewing
            <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>

      {/* Scroll nudge */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
        <span className="text-[8px] tracking-[0.35em] uppercase">Scroll</span>
        <ArrowDown size={13} className="animate-bounce" />
      </div>
    </section>
  )
}

// ─── Property Explorer ────────────────────────────────────────────────────────

function PropertyExplorer() {
  const [activeId, setActiveId] = useState('1br')
  const active = PROPERTIES.find(p => p.id === activeId)

  return (
    <section id="residences" className="bg-aura-cream py-14 sm:py-24 lg:py-36">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">

        {/* Header */}
        <FadeIn className="mb-8 sm:mb-14">
          <SectionTag>Our Residences</SectionTag>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-6xl text-aura-black font-light">
            Find Your Perfect<br />
            <em>Aura Residence</em>
          </h2>
        </FadeIn>

        {/* Tabs */}
        <div className="flex border-b border-aura-black/12 mb-8 sm:mb-12 overflow-x-auto no-scrollbar">
          {PROPERTIES.map(p => (
            <button
              key={p.id}
              onClick={() => setActiveId(p.id)}
              className={`flex-none pb-4 px-4 sm:px-6 first:pl-0 text-[9px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.22em] uppercase transition-all duration-300 whitespace-nowrap ${
                activeId === p.id
                  ? 'text-aura-black border-b-2 border-gold -mb-px'
                  : 'text-aura-black/50 hover:text-aura-black/75'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Content — re-mounts on tab change to trigger fade animation */}
        <div key={activeId} className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-start animate-fade-in">

          {/* Image */}
          <div className="relative group overflow-hidden">
            <img
              src={active.image}
              alt={active.label}
              loading="lazy"
              className="w-full h-64 sm:h-[400px] lg:h-[560px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-aura-black/80 to-transparent p-8">
              <div className="font-serif text-3xl text-white">{active.price}</div>
              <div className="text-[9px] tracking-[0.3em] uppercase text-white/70 mt-1">
                {active.size} · {active.beds} Bed{active.beds > 1 ? 's' : ''} · {active.baths} Bath{active.baths > 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-[42px] text-aura-black font-light leading-tight">
              {active.label}
            </h3>

            {/* Stats row */}
            <div className="flex gap-6 sm:gap-8 mt-4 sm:mt-5 pb-6 sm:pb-8 border-b border-aura-black/10">
              {[
                [active.size, 'Floor Area'],
                [`${active.beds} Bed${active.beds > 1 ? 's' : ''}`, 'Bedrooms'],
                [active.baths, 'Bathrooms'],
              ].map(([v, l]) => (
                <div key={l}>
                  <div className="font-serif text-2xl text-gold">{v}</div>
                  <div className="text-[9px] tracking-[0.22em] uppercase text-aura-black/60 mt-1">{l}</div>
                </div>
              ))}
            </div>

            {/* Feature list */}
            <ul className="mt-8 space-y-4 mb-10">
              {active.features.map(f => (
                <li key={f} className="flex items-start gap-3.5 text-aura-black/80 text-sm leading-relaxed">
                  <span className="flex-none mt-0.5 w-5 h-5 rounded-full bg-gold/15 flex items-center justify-center">
                    <Check size={10} className="text-gold" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            {/* Floor plan placeholder */}
            <div className="border border-aura-black/10 p-1 mb-8">
              <div className="bg-white/50 h-36 flex flex-col items-center justify-center gap-3">
                <GoldLine />
                <span className="text-[9px] tracking-[0.3em] uppercase text-aura-black/25">
                  Floor Plan — {active.label}
                </span>
              </div>
            </div>

            <a
              href="#scheduler"
              className="group flex items-center justify-center gap-3 w-full sm:w-auto sm:self-start px-8 py-4 bg-aura-black hover:bg-aura-charcoal text-white text-[10px] tracking-[0.22em] uppercase font-medium transition-all duration-300"
            >
              Request Information
              <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform duration-200" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Amenities Grid ───────────────────────────────────────────────────────────

function AmenitiesGrid() {
  return (
    <section id="amenities" className="bg-aura-dark py-14 sm:py-24 lg:py-36">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">

        {/* Header */}
        <FadeIn className="mb-10 sm:mb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-6">
          <div>
            <SectionTag>Lifestyle</SectionTag>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-6xl text-white font-light">
              Curated<br />
              <em className="text-gold">Amenities</em>
            </h2>
          </div>
          <p className="lg:max-w-xs text-white/65 text-sm leading-relaxed">
            Every detail at Aura Residences is designed to elevate your daily
            experience beyond the ordinary.
          </p>
        </FadeIn>

        {/* Grid — 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
          {AMENITIES.map(({ icon: Icon, title, desc }, i) => (
            <FadeIn key={title} delay={i * 75}>
              <div className="group bg-aura-dark hover:bg-aura-charcoal p-5 sm:p-8 h-full transition-colors duration-300 cursor-default">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-sm border border-white/8 group-hover:border-gold/35 flex items-center justify-center mb-4 sm:mb-6 transition-colors duration-300">
                  <Icon size={15} className="text-white/25 group-hover:text-gold transition-colors duration-300 sm:hidden" />
                  <Icon size={18} className="text-white/25 group-hover:text-gold transition-colors duration-300 hidden sm:block" />
                </div>
                <h3 className="text-white text-xs sm:text-sm font-medium tracking-wide mb-1.5 sm:mb-2">{title}</h3>
                <p className="text-white/60 text-[11px] sm:text-xs leading-relaxed">{desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Gallery Strip ────────────────────────────────────────────────────────────

function GalleryStrip({ onImageClick }) {
  return (
    <section className="bg-aura-black py-14 sm:py-24">
      <FadeIn className="max-w-7xl mx-auto px-5 sm:px-6 mb-8 sm:mb-10">
        <SectionTag>Gallery</SectionTag>
        <h2 className="font-serif text-3xl sm:text-4xl text-white font-light">A Glimpse Inside</h2>
        <p className="text-white/45 text-xs mt-2 tracking-wide">Tap any image to view full screen</p>
      </FadeIn>

      <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar px-5 sm:px-6">
        {GALLERY.map((src, i) => (
          <FadeIn key={i} delay={i * 60} className="flex-none">
            <div
              className="w-64 sm:w-72 md:w-96 h-48 sm:h-60 md:h-80 overflow-hidden group cursor-zoom-in relative"
              onClick={() => onImageClick(i)}
            >
              <img
                src={src}
                alt={`Aura Residences interior ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* hover overlay hint */}
              <div className="absolute inset-0 bg-aura-black/0 group-hover:bg-aura-black/20 transition-colors duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[9px] tracking-[0.35em] uppercase text-white border border-white/40 px-3 py-1.5">
                  View
                </span>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

// ─── Location ─────────────────────────────────────────────────────────────────

function LocationSection() {
  return (
    <section className="bg-aura-cream py-14 sm:py-24 lg:py-36">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">

        {/* Text */}
        <FadeIn>
          <SectionTag>Location</SectionTag>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-aura-black font-light mb-5 sm:mb-6">
            At the Pulse of<br />
            <em>Westlands</em>
          </h2>
          <p className="text-aura-black/70 leading-relaxed mb-8 sm:mb-12 max-w-md text-sm">
            Aura Residences sits at the nexus of Nairobi's most prestigious
            commercial and diplomatic quarter — walk to everything, retreat to
            your sanctuary.
          </p>

          <div className="grid grid-cols-2 gap-px bg-aura-black/10">
            {LOCATIONS.map(({ place, distance }, i) => (
              <FadeIn key={place} delay={i * 60}>
                <div className="bg-aura-cream hover:bg-white/60 p-5 transition-colors duration-200">
                  <div className="flex items-start gap-2 mb-1">
                    <MapPin size={11} className="text-gold mt-0.5 flex-none" />
                    <span className="text-aura-black text-sm font-medium">{place}</span>
                  </div>
                  <span className="text-aura-black/65 text-xs tracking-wide pl-[19px]">
                    {distance}
                  </span>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>

        {/* Map / cityscape */}
        <FadeIn delay={150} className="relative h-64 sm:h-96 lg:h-[500px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1676831238417-f104b770595d?w=900&q=80"
            alt="Aura Residences building — Westlands"
            loading="lazy"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-aura-black/50 via-transparent to-transparent" />
          {/* Pin overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gold shadow-2xl shadow-gold/40 flex items-center justify-center">
                <MapPin size={20} className="text-aura-black" fill="currentColor" />
              </div>
              <div className="mt-3 px-4 py-2 bg-aura-black/80 backdrop-blur-sm">
                <span className="text-[9px] tracking-[0.35em] uppercase text-white">
                  Aura Residences
                </span>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ─── Viewing Scheduler ────────────────────────────────────────────────────────

function ViewingScheduler({ onSuccess }) {
  const today  = new Date()
  const [calYear,       setCalYear]       = useState(today.getFullYear())
  const [calMonth,      setCalMonth]      = useState(today.getMonth())
  const [selectedDate,  setSelectedDate]  = useState(null)
  const [selectedTime,  setSelectedTime]  = useState(null)
  const [unitType,      setUnitType]      = useState('')
  const [form,          setForm]          = useState({ name: '', email: '', phone: '' })
  const [errors,        setErrors]        = useState({})

  const totalDays = daysInMonth(calYear, calMonth)
  const startDay  = firstDayOf(calYear, calMonth)

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11) }
    else setCalMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0) }
    else setCalMonth(m => m + 1)
  }

  const isPast = (day) => {
    const d = new Date(calYear, calMonth, day)
    const t = new Date(); t.setHours(0,0,0,0)
    d.setHours(0,0,0,0)
    return d < t
  }

  const clearError = (field) => setErrors(e => { const n = { ...e }; delete n[field]; return n })

  const validate = () => {
    const e = {}
    if (!unitType)     e.unitType = 'Please select a residence type'
    if (!selectedDate) e.date     = 'Please pick a viewing date'
    if (!selectedTime) e.time     = 'Please choose a time slot'
    if (!form.name.trim())                e.name  = 'Name is required'
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.phone.trim())               e.phone = 'Phone number is required'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSuccess({ ...form, unitType, date: formatDate(selectedDate), time: selectedTime })
  }

  const inputCls = (field) =>
    `w-full bg-aura-charcoal border ${
      errors[field] ? 'border-red-500/40' : 'border-white/12'
    } text-white placeholder-white/40 px-4 py-3.5 text-sm focus:outline-none focus:border-gold/60 transition-colors duration-200`

  return (
    <section id="scheduler" className="bg-aura-black py-14 sm:py-24 lg:py-36">
      <div className="max-w-3xl mx-auto px-5 sm:px-6">

        {/* Header */}
        <FadeIn className="text-center mb-10 sm:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GoldLine />
            <span className="text-[10px] tracking-[0.4em] uppercase text-gold">Exclusive Access</span>
            <GoldLine />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-6xl text-white font-light">
            Schedule Your<br />
            <em className="text-gold">VIP Viewing</em>
          </h2>
          <p className="text-white/60 mt-5 text-sm max-w-sm mx-auto leading-relaxed">
            Our dedicated sales team will personally guide you through your
            preferred residence.
          </p>
        </FadeIn>

        <form onSubmit={handleSubmit} className="space-y-10" noValidate>

          {/* Step 1 — Unit type */}
          <div>
            <p className="text-[9px] tracking-[0.35em] uppercase text-white/55 mb-4">
              01 — Select Residence
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              {PROPERTIES.map(p => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => { setUnitType(p.id); clearError('unitType') }}
                  className={`p-4 border text-left transition-all duration-200 ${
                    unitType === p.id
                      ? 'border-gold bg-gold/8'
                      : 'border-white/8 hover:border-white/25'
                  }`}
                >
                  <div className="font-serif text-xl text-white leading-tight">{p.price}</div>
                  <div className="text-[9px] tracking-widest uppercase text-white/60 mt-1.5">{p.label}</div>
                </button>
              ))}
            </div>
            {errors.unitType && (
              <p className="text-red-400/65 text-xs mt-2">{errors.unitType}</p>
            )}
          </div>

          {/* Step 2 — Calendar */}
          <div>
            <p className="text-[9px] tracking-[0.35em] uppercase text-white/55 mb-4">
              02 — Select Date
            </p>
            <div className="border border-white/8 p-5 sm:p-7">

              {/* Month navigation */}
              <div className="flex items-center justify-between mb-6">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  <ChevronLeft size={17} />
                </button>
                <span className="font-serif text-xl text-white">
                  {MONTHS[calMonth]} {calYear}
                </span>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  <ChevronRight size={17} />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-1">
                {DAYS.map(d => (
                  <div
                    key={d}
                    className="text-center text-[9px] tracking-widest uppercase text-white/45 pb-3"
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-0.5">
                {Array(startDay).fill(null).map((_, i) => (
                  <div key={`blank-${i}`} />
                ))}
                {Array(totalDays).fill(null).map((_, i) => {
                  const day    = i + 1
                  const date   = new Date(calYear, calMonth, day)
                  const past   = isPast(day)
                  const sel    = selectedDate?.getTime() === date.getTime()
                  const isTday = calYear  === today.getFullYear()
                              && calMonth === today.getMonth()
                              && day      === today.getDate()

                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={past}
                      onClick={() => { setSelectedDate(date); clearError('date') }}
                      className={`relative aspect-square flex items-center justify-center text-xs sm:text-sm rounded-sm transition-all duration-150 ${
                        past
                          ? 'text-white/25 line-through decoration-white/15 cursor-not-allowed'
                          : sel
                            ? 'bg-gold text-aura-black font-bold shadow-md shadow-gold/30'
                            : isTday
                              ? 'text-gold font-semibold ring-1 ring-gold/60 hover:bg-gold/15'
                              : 'text-white/90 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {day}
                      {isTday && !sel && (
                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {selectedDate && (
              <p className="text-gold/65 text-xs mt-2 tracking-wide">
                Selected: {formatDate(selectedDate)}
              </p>
            )}
            {errors.date && (
              <p className="text-red-400/65 text-xs mt-1">{errors.date}</p>
            )}
          </div>

          {/* Step 3 — Time slots */}
          <div>
            <p className="text-[9px] tracking-[0.35em] uppercase text-white/55 mb-4">
              03 — Choose Time
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TIME_SLOTS.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setSelectedTime(t); clearError('time') }}
                  className={`py-3 text-[11px] tracking-wider border transition-all duration-200 ${
                    selectedTime === t
                      ? 'border-gold bg-gold/8 text-gold'
                      : 'border-white/15 text-white/65 hover:border-white/35 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            {errors.time && (
              <p className="text-red-400/65 text-xs mt-2">{errors.time}</p>
            )}
          </div>

          {/* Step 4 — Contact details */}
          <div>
            <p className="text-[9px] tracking-[0.35em] uppercase text-white/55 mb-4">
              04 — Your Details
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { field: 'name',  placeholder: 'Full Name',     type: 'text' },
                { field: 'email', placeholder: 'Email Address', type: 'email' },
                { field: 'phone', placeholder: 'Phone Number',  type: 'tel' },
              ].map(({ field, placeholder, type }) => (
                <div key={field}>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={form[field]}
                    onChange={e => {
                      setForm(f => ({ ...f, [field]: e.target.value }))
                      clearError(field)
                    }}
                    className={inputCls(field)}
                  />
                  {errors[field] && (
                    <p className="text-red-400/65 text-xs mt-1">{errors[field]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="group w-full py-5 bg-gold hover:bg-gold-light text-aura-black text-[11px] tracking-[0.3em] uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-3"
          >
            Confirm VIP Viewing
            <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform duration-200" />
          </button>

          <p className="text-center text-white/45 text-xs tracking-wide">
            Our team will confirm your viewing within 24 hours
          </p>
        </form>
      </div>
    </section>
  )
}

// ─── Success Toast ────────────────────────────────────────────────────────────

function Toast({ data, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 7000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className="fixed bottom-6 right-6 z-[100] max-w-sm w-full animate-slide-up">
      <div className="bg-aura-charcoal border border-gold/25 p-6 shadow-2xl shadow-black/60">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 flex-none rounded-sm bg-gold/12 flex items-center justify-center">
            <Check size={17} className="text-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-medium text-sm mb-1">Viewing Confirmed</h4>
            <p className="text-white/70 text-xs leading-relaxed">
              Thank you,{' '}
              <strong className="text-white">{data.name}</strong>. Your VIP
              viewing is scheduled for{' '}
              <strong className="text-gold">{data.date}</strong> at{' '}
              <strong className="text-gold">{data.time}</strong>.
            </p>
            <p className="text-white/50 text-xs mt-2">
              Confirmation sent to {data.email}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors flex-none"
            aria-label="Dismiss"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-aura-black border-t border-white/5 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <div className="grid sm:grid-cols-3 gap-8 sm:gap-12 mb-10 sm:mb-14">

          {/* Brand */}
          <div>
            <div className="flex flex-col leading-none mb-6">
              <span className="font-serif text-3xl font-light tracking-[0.18em] text-gold">AURA</span>
              <span className="text-[8px] tracking-[0.45em] text-white/45 uppercase mt-0.5">RESIDENCES</span>
            </div>
            <p className="text-white/50 text-xs leading-relaxed max-w-xs">
              Forty-two residences of extraordinary ambition. Westlands, Nairobi.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[9px] tracking-[0.35em] uppercase text-white/50 mb-5">Contact</h4>
            <div className="space-y-3.5">
              {[
                { Icon: Phone, text: '+254 700 000 000' },
                { Icon: Mail,  text: 'hello@auraresidences.co.ke' },
                { Icon: MapPin,text: 'Westlands, Nairobi, Kenya' },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-white/55 text-xs hover:text-white transition-colors cursor-default">
                  <Icon size={12} className="text-gold/55 flex-none" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-[9px] tracking-[0.35em] uppercase text-white/50 mb-5">Explore</h4>
            <div className="space-y-3">
              {['Overview', 'Residences', 'Amenities', 'Gallery', 'Schedule Viewing'].map(l => (
                <div key={l} className="text-white/55 text-xs hover:text-white transition-colors cursor-pointer tracking-wide">
                  {l}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">© 2026 Aura Residences Ltd. All rights reserved.</p>
          <p className="text-white/14 text-xs tracking-wide">Westlands, Nairobi, Kenya</p>
        </div>
      </div>
    </footer>
  )
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [toast,    setToast]    = useState(null)
  const [lightbox, setLightbox] = useState(null)   // null = closed, number = open index
  const schedulerRef = useRef(null)

  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="min-h-screen bg-aura-black font-sans">
      <Navbar onBookClick={() => scrollTo(schedulerRef)} />

      <Hero
        onExplore={() => document.getElementById('residences')?.scrollIntoView({ behavior: 'smooth' })}
        onSchedule={() => scrollTo(schedulerRef)}
      />

      <PropertyExplorer />
      <AmenitiesGrid />
      <GalleryStrip onImageClick={setLightbox} />
      <LocationSection />

      <div ref={schedulerRef}>
        <ViewingScheduler onSuccess={data => setToast(data)} />
      </div>

      <Footer />

      {/* Gallery lightbox */}
      {lightbox !== null && (
        <Lightbox images={GALLERY} index={lightbox} onClose={() => setLightbox(null)} />
      )}

      {/* Booking confirmation toast */}
      {toast && <Toast data={toast} onClose={() => setToast(null)} />}

      {/* WhatsApp floating CTA */}
      <WhatsAppCTA />
    </div>
  )
}
