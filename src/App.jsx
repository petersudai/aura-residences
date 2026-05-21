import { useState, useEffect, useRef } from 'react'
import {
  Waves, Dumbbell, Clock, Car, Wifi, Shield, Sparkles,
  Building2, ChevronRight, ChevronLeft, ArrowDown,
  MapPin, Phone, Mail, Check, X, Menu, Lock,
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

const _POOL   = 'https://images.unsplash.com/photo-1774281267183-93e0632b50d1?w=1400&q=85'
const _LOUNGE = 'https://images.unsplash.com/photo-1639563978014-0313208c2f82?w=1400&q=85'
const _CONC   = 'https://images.unsplash.com/photo-1776361984994-089a9df800f6?w=1400&q=85'
const _GYM    = 'https://images.unsplash.com/photo-1630703178161-1e2f9beddbf8?w=1400&q=85'
const _PARK   = 'https://images.unsplash.com/photo-1607284994847-7a9cfe7f1df2?w=1400&q=85'
const _SPA    = 'https://images.unsplash.com/photo-1772616748530-7cd73053f326?w=1400&q=85'
const _SEC    = 'https://images.unsplash.com/photo-1651959632999-40eb4f43d59a?w=1400&q=85'

const AMENITIES = [
  { icon: Waves,     photo: _POOL,   title: 'Infinity Edge Pool',  desc: 'Sky-level pool overlooking the full Nairobi skyline, open exclusively to residents' },
  { icon: Building2, photo: _LOUNGE, title: 'Rooftop Lounge',      desc: 'Residents-only terrace bar and private event space, perched above the city' },
  { icon: Dumbbell,  photo: _GYM,    title: 'Performance Gym',     desc: 'Technogym-equipped fitness studio with personal training available on request' },
  { icon: Clock,     photo: _CONC,   title: '24/7 Concierge',      desc: 'White-glove resident services around the clock — from reservations to deliveries' },
  { icon: Car,       photo: _PARK,   title: 'Secure Parking',      desc: 'Biometric-access basement with dedicated EV charging bays per residence' },
  { icon: Shield,    photo: _SEC,    title: 'Smart Security',      desc: 'Full-perimeter CCTV, facial recognition entry and rapid panic-response systems' },
  { icon: Sparkles,  photo: _SPA,    title: 'Wellness Spa',        desc: 'In-house sauna, steam room and private treatment suites for exclusive resident use' },
]

const GALLERY = [
  'https://images.unsplash.com/photo-1757924461488-ef9ad0670978?w=700&q=85',
  'https://images.unsplash.com/photo-1751290741340-85c4bdcc8d24?w=700&q=85',
  'https://images.unsplash.com/photo-1715985160020-d8cd6fdc8ba9?w=700&q=85',
  'https://images.unsplash.com/photo-1695002817411-203c7f19dfa3?w=700&q=85',
  'https://images.unsplash.com/photo-1758193431353-87812fbff5cd?w=700&q=85',
  'https://images.unsplash.com/photo-1776363116182-51694a04a1d5?w=700&q=85',
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

// ─── useInView hook ───────────────────────────────────────────────────────────

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

// ─── ScrollProgress ───────────────────────────────────────────────────────────

function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const handler = () => {
      const scrolled = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      setProgress(maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0)
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
  return (
    <div className="fixed top-0 left-0 right-0 z-[200] h-[2px] bg-white/[0.06]">
      <div
        className="h-full bg-gradient-to-r from-gold/70 to-gold"
        style={{ width: `${progress}%`, transition: 'none' }}
      />
    </div>
  )
}

// ─── NoiseOverlay ─────────────────────────────────────────────────────────────

function NoiseOverlay() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        opacity: 0.055,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 200px',
      }}
    />
  )
}

// ─── SkewDivider ─────────────────────────────────────────────────────────────
// fromLight=true → cream above, dark below (cream→dark transition)
// fromLight=false → dark above, cream below (dark→cream transition)

function SkewDivider({ fromLight = true }) {
  const fromColor = fromLight ? '#F5F0E8' : '#111111'
  const toColor   = fromLight ? '#111111' : '#F5F0E8'
  return (
    <div style={{
      height: 52,
      background: toColor,
      overflow: 'hidden',
      display: 'block',
      lineHeight: 0,
      fontSize: 0,
    }}>
      <div style={{
        height: '100%',
        background: fromColor,
        clipPath: 'polygon(0 0, 100% 0, 100% 20%, 0 80%)',
      }} />
    </div>
  )
}

// ─── GoldLine & SectionTag ────────────────────────────────────────────────────

function GoldLine({ center = false }) {
  return <div className={`w-8 h-px bg-gold${center ? ' mx-auto' : ''}`} />
}

function SectionTag({ children, number }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      {number !== undefined && (
        <span className="font-serif italic text-[11px] text-gold/40 tracking-[0.1em]">
          {String(number).padStart(2, '0')}
        </span>
      )}
      <GoldLine />
      <span className="text-[10px] tracking-[0.4em] uppercase text-gold">{children}</span>
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
      <div className="w-14 h-14 rounded-full bg-[#25D366] shadow-xl shadow-[#25D366]/30 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
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
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center border border-white/15 hover:border-white/40 text-white/50 hover:text-white transition-all duration-200 z-10"
        aria-label="Close"
      >
        <X size={17} />
      </button>
      <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] uppercase text-white/35 z-10 pointer-events-none">
        {current + 1} / {images.length}
      </span>
      <button
        onClick={prev}
        disabled={current === 0}
        className="absolute left-5 sm:left-8 w-12 h-12 flex items-center justify-center border border-white/15 hover:border-gold/50 text-white/50 hover:text-gold transition-all duration-200 disabled:opacity-15 disabled:cursor-not-allowed z-10"
        aria-label="Previous image"
      >
        <ChevronLeft size={22} />
      </button>
      <img
        key={current}
        src={images[current].replace('w=700', 'w=1400')}
        alt={`Aura Residences — image ${current + 1}`}
        className="max-h-[80vh] max-w-[92vw] sm:max-w-[78vw] object-contain shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        onClick={next}
        disabled={current === images.length - 1}
        className="absolute right-5 sm:right-8 w-12 h-12 flex items-center justify-center border border-white/15 hover:border-gold/50 text-white/50 hover:text-gold transition-all duration-200 disabled:opacity-15 disabled:cursor-not-allowed z-10"
        aria-label="Next image"
      >
        <ChevronRight size={22} />
      </button>
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

        {/* Desktop CTA + hamburger */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBookClick}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-light text-aura-black text-[10px] tracking-[0.22em] uppercase font-semibold transition-all duration-300 rounded-sm"
          >
            <Lock size={9} />
            Private Viewing
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
            className="mt-4 w-full py-3.5 bg-gold hover:bg-gold-light text-aura-black text-[10px] tracking-[0.25em] uppercase font-semibold transition-all duration-300 rounded-sm flex items-center justify-center gap-2"
          >
            <Lock size={9} />
            Private Viewing
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

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1598200816350-41038d5b7be4?w=2070&q=80')" }}
      />
      <div className="absolute inset-0 bg-aura-black/68" />
      <div className="absolute inset-0 bg-gradient-to-r from-aura-black/92 via-aura-black/55 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-aura-black via-transparent to-aura-black/50" />

      {/* Content */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 pt-24 pb-14 sm:pt-36 sm:pb-28 w-full"
        style={{ textShadow: '0 2px 24px rgba(0,0,0,0.85)' }}
      >
        <SectionTag number={1}>Westlands · Nairobi</SectionTag>

        <h1 className="font-serif text-4xl sm:text-7xl lg:text-[88px] font-light text-white leading-[1.05] max-w-4xl mt-2">
          Elevated Living<br />
          <em className="text-gold">in the Heart of</em><br />
          Westlands
        </h1>

        <p className="mt-6 sm:mt-8 text-white/80 text-sm sm:text-lg font-light leading-relaxed max-w-sm">
          A curated collection of 42 residences where architectural precision
          meets Nairobi's most prestigious address.
        </p>

        {/* Stats — glass card container for readability */}
        <div className="mt-8 mb-3 sm:mt-10 sm:mb-3 max-w-md">
          <div className="grid grid-cols-3 divide-x divide-white/15 bg-aura-black/55 backdrop-blur-sm border border-white/12">
            {[
              ['42',      'Residences'],
              ['3',       'Penthouse\nFloors'],
              ['KSh 14M', 'Starting\nPrice'],
            ].map(([val, lbl]) => (
              <div key={lbl} className="px-3 sm:px-6 py-4 sm:py-5">
                <div className="font-serif text-2xl sm:text-3xl text-gold leading-none">{val}</div>
                <div className="text-[10px] sm:text-[11px] tracking-[0.1em] sm:tracking-[0.15em] uppercase text-white/80 mt-2 leading-tight whitespace-pre-line">{lbl}</div>
              </div>
            ))}
          </div>

          {/* Scarcity bar */}
          <div className="mt-3 flex items-center gap-3">
            <div className="relative h-[3px] rounded-full bg-white/10 w-28">
              <div className="absolute inset-y-0 left-0 rounded-full bg-gold/75" style={{ width: '33%' }} />
            </div>
            <span className="text-[9px] tracking-[0.2em] uppercase text-white/45">
              14 of 42 residences remaining
            </span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8 sm:mt-10">
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
          <SectionTag number={2}>Our Residences</SectionTag>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-6xl text-aura-black font-light">
              Find Your Perfect<br />
              <em>Aura Residence</em>
            </h2>
            {/* Scarcity + payment callout */}
            <div className="sm:text-right space-y-1 sm:mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold/12 border border-gold/20">
                <span className="w-1.5 h-1.5 rounded-full bg-gold flex-none" />
                <span className="text-[9px] tracking-[0.18em] uppercase text-aura-black/70">
                  14 of 42 remaining
                </span>
              </div>
              <p className="text-[10px] text-aura-black/50 tracking-wide">
                80/20 off-plan · Bank financing supported
              </p>
            </div>
          </div>
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

        {/* Content */}
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

            {/* Payment callout */}
            <div className="mt-5 flex items-start gap-3 px-4 py-3 bg-aura-black/[0.03] border-l-2 border-gold/40">
              <span className="text-aura-black/65 text-xs leading-relaxed">
                <strong className="text-aura-black font-medium">80/20 off-plan available</strong>
                {' '}· Flexible milestone payments · Standard bank financing supported
              </span>
            </div>

            {/* Feature list */}
            <ul className="mt-6 space-y-3.5 mb-8">
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
              <Lock size={10} className="opacity-60" />
              Request Private Viewing
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
  const [activeIdx, setActiveIdx] = useState(0)
  const active = AMENITIES[activeIdx]

  return (
    <section id="amenities" className="relative bg-aura-dark overflow-hidden">
      <NoiseOverlay />

      <div className="relative z-[1] grid lg:grid-cols-2">

        {/* ── Left: Photo panel ───────────────────────────────── */}
        <div className="relative h-72 sm:h-[420px] lg:h-auto lg:min-h-[740px] overflow-hidden">

          {/* All photos stacked — CSS opacity crossfade */}
          {AMENITIES.map(({ photo, title }, i) => (
            <img
              key={title}
              src={photo}
              alt={title}
              loading={i === 0 ? 'eager' : 'lazy'}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out"
              style={{ opacity: i === activeIdx ? 1 : 0 }}
            />
          ))}

          {/* Atmospheric overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-aura-black/80 via-aura-black/15 to-aura-black/5" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-aura-dark/40" />

          {/* Caption — bottom-left, re-animates on change */}
          <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-10">
            <div key={activeIdx} className="animate-fade-in">
              <div className="flex items-center gap-3 mb-2.5">
                <GoldLine />
                <span className="text-[9px] tracking-[0.4em] uppercase text-gold">
                  {active.title}
                </span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed max-w-xs">
                {active.desc}
              </p>
            </div>
          </div>
        </div>

        {/* ── Right: Interactive list ──────────────────────────── */}
        <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-14 xl:px-16 py-12 sm:py-16 lg:py-20">

          <FadeIn>
            <SectionTag number={3}>Lifestyle</SectionTag>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-[56px] text-white font-light mb-8 sm:mb-10 lg:mb-12">
              Curated<br />
              <em className="text-gold">Amenities</em>
            </h2>
          </FadeIn>

          <div>
            {AMENITIES.map(({ icon: Icon, title }, i) => (
              <button
                key={title}
                onMouseEnter={() => setActiveIdx(i)}
                onClick={() => setActiveIdx(i)}
                className={`w-full flex items-center gap-4 py-4 sm:py-[18px] border-b text-left transition-all duration-200 ${
                  i === activeIdx ? 'border-white/12' : 'border-white/6 hover:border-white/10'
                }`}
              >
                {/* Active bar */}
                <div
                  className="flex-none w-[2px] rounded-full transition-all duration-300"
                  style={{
                    height: i === activeIdx ? 26 : 0,
                    background: i === activeIdx ? '#C4A265' : 'transparent',
                  }}
                />

                {/* Icon */}
                <Icon
                  size={16}
                  className={`flex-none transition-colors duration-300 ${
                    i === activeIdx ? 'text-gold' : 'text-white/20 group-hover:text-white/35'
                  }`}
                />

                {/* Title */}
                <span
                  className={`font-serif flex-1 leading-none transition-all duration-300 ${
                    i === activeIdx
                      ? 'text-white text-xl sm:text-2xl'
                      : 'text-white/30 text-lg sm:text-xl hover:text-white/50'
                  }`}
                >
                  {title}
                </span>

                {/* Arrow */}
                <ChevronRight
                  size={13}
                  className={`flex-none transition-all duration-300 ${
                    i === activeIdx
                      ? 'text-gold opacity-100 translate-x-0'
                      : 'opacity-0 -translate-x-1'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

// ─── Gallery Strip ────────────────────────────────────────────────────────────

function GalleryStrip({ onImageClick }) {
  return (
    <section className="relative bg-aura-black py-14 sm:py-24">
      <NoiseOverlay />

      <FadeIn className="relative z-[1] max-w-7xl mx-auto px-5 sm:px-6 mb-8 sm:mb-10">
        <SectionTag number={4}>Gallery</SectionTag>
        <h2 className="font-serif text-3xl sm:text-4xl text-white font-light">A Glimpse Inside</h2>
        <p className="text-white/45 text-xs mt-2 tracking-wide">Tap any image to view full screen</p>
      </FadeIn>

      <div className="relative z-[1] flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar px-5 sm:px-6">
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

// ─── Press Strip ─────────────────────────────────────────────────────────────

function PressStrip() {
  const mentions = [
    { pub: 'Business Daily',   note: 'Best New Development 2025' },
    { pub: 'The Standard',     note: 'Westlands Rising Star' },
    { pub: 'Forbes Africa',    note: 'Top 10 Luxury Builds' },
    { pub: 'Architecture KE',  note: 'Design Excellence Award' },
  ]
  return (
    <section className="relative bg-aura-black border-y border-white/5 py-10 sm:py-12">
      <NoiseOverlay />
      <FadeIn className="relative z-[1] max-w-7xl mx-auto px-5 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-14">
          <div className="flex-none">
            <div className="text-[9px] tracking-[0.45em] uppercase text-white/25 mb-0.5">As Seen In</div>
            <GoldLine />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 w-full">
            {mentions.map(({ pub, note }) => (
              <div key={pub} className="opacity-25 hover:opacity-60 transition-opacity duration-300 cursor-default">
                <div className="font-serif text-base sm:text-lg text-white tracking-wide leading-tight">{pub}</div>
                <div className="text-[9px] tracking-[0.18em] uppercase text-gold/80 mt-1">{note}</div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  )
}

// ─── Pull Quote ───────────────────────────────────────────────────────────────

function PullQuote() {
  return (
    <section className="bg-aura-cream py-20 sm:py-32">
      <FadeIn className="max-w-4xl mx-auto px-6 text-center">
        <GoldLine center />
        <blockquote className="font-serif text-3xl sm:text-4xl lg:text-5xl text-aura-black font-light italic leading-[1.25] mt-10 mb-10">
          "Forty-two residences.<br className="hidden sm:block" />
          One address."
        </blockquote>
        <GoldLine center />
        <p className="text-[9px] tracking-[0.4em] uppercase text-aura-black/35 mt-8">
          Aura Residences · Westlands, Nairobi
        </p>
      </FadeIn>
    </section>
  )
}

// ─── Location Section ─────────────────────────────────────────────────────────

function LocationSection() {
  return (
    <section className="bg-aura-cream py-14 sm:py-24 lg:py-36">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">

        {/* Text */}
        <FadeIn>
          <SectionTag number={5}>Location</SectionTag>
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

        {/* Cityscape */}
        <FadeIn delay={150} className="relative h-64 sm:h-96 lg:h-[500px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1676831238417-f104b770595d?w=900&q=80"
            alt="Aura Residences building — Westlands"
            loading="lazy"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-aura-black/50 via-transparent to-transparent" />
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
  const [calYear,      setCalYear]      = useState(today.getFullYear())
  const [calMonth,     setCalMonth]     = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [unitType,     setUnitType]     = useState('')
  const [form,         setForm]         = useState({ name: '', email: '', phone: '' })
  const [errors,       setErrors]       = useState({})

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
    <section id="scheduler" className="relative bg-aura-black py-14 sm:py-24 lg:py-36">
      <NoiseOverlay />
      <div className="relative z-[1] max-w-3xl mx-auto px-5 sm:px-6">

        {/* Header */}
        <FadeIn className="text-center mb-10 sm:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GoldLine />
            <span className="text-[10px] tracking-[0.4em] uppercase text-gold">
              <span className="font-serif italic text-gold/40 mr-2 text-[11px]">06</span>
              Exclusive Access
            </span>
            <GoldLine />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-6xl text-white font-light">
            Schedule Your<br />
            <em className="text-gold">Private Viewing</em>
          </h2>
          <p className="text-white/60 mt-5 text-sm max-w-sm mx-auto leading-relaxed">
            Our dedicated sales team will personally guide you through your
            preferred residence.
          </p>
        </FadeIn>

        <form onSubmit={handleSubmit} className="space-y-10" noValidate>

          {/* Step 1 */}
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
            {errors.unitType && <p className="text-red-400/65 text-xs mt-2">{errors.unitType}</p>}
          </div>

          {/* Step 2 — Calendar */}
          <div>
            <p className="text-[9px] tracking-[0.35em] uppercase text-white/55 mb-4">
              02 — Select Date
            </p>
            <div className="border border-white/8 p-5 sm:p-7">
              <div className="flex items-center justify-between mb-6">
                <button type="button" onClick={prevMonth} className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors">
                  <ChevronLeft size={17} />
                </button>
                <span className="font-serif text-xl text-white">{MONTHS[calMonth]} {calYear}</span>
                <button type="button" onClick={nextMonth} className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors">
                  <ChevronRight size={17} />
                </button>
              </div>
              <div className="grid grid-cols-7 mb-1">
                {DAYS.map(d => (
                  <div key={d} className="text-center text-[9px] tracking-widest uppercase text-white/45 pb-3">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0.5">
                {Array(startDay).fill(null).map((_, i) => <div key={`blank-${i}`} />)}
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
            {selectedDate && <p className="text-gold/65 text-xs mt-2 tracking-wide">Selected: {formatDate(selectedDate)}</p>}
            {errors.date && <p className="text-red-400/65 text-xs mt-1">{errors.date}</p>}
          </div>

          {/* Step 3 — Time */}
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
            {errors.time && <p className="text-red-400/65 text-xs mt-2">{errors.time}</p>}
          </div>

          {/* Step 4 — Details */}
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
                    onChange={e => { setForm(f => ({ ...f, [field]: e.target.value })); clearError(field) }}
                    className={inputCls(field)}
                  />
                  {errors[field] && <p className="text-red-400/65 text-xs mt-1">{errors[field]}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="group w-full py-5 bg-gold hover:bg-gold-light text-aura-black text-[11px] tracking-[0.3em] uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-3"
          >
            <Lock size={11} className="opacity-60" />
            Confirm Private Viewing
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
              Thank you, <strong className="text-white">{data.name}</strong>. Your private
              viewing is scheduled for{' '}
              <strong className="text-gold">{data.date}</strong> at{' '}
              <strong className="text-gold">{data.time}</strong>.
            </p>
            <p className="text-white/50 text-xs mt-2">Confirmation sent to {data.email}</p>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors flex-none" aria-label="Dismiss">
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
    <footer className="relative bg-aura-black border-t border-white/5 py-10 sm:py-16">
      <NoiseOverlay />
      <div className="relative z-[1] max-w-7xl mx-auto px-5 sm:px-6">
        <div className="grid sm:grid-cols-3 gap-8 sm:gap-12 mb-10 sm:mb-14">

          {/* Brand */}
          <div>
            <div className="flex flex-col leading-none mb-2">
              <span className="font-serif text-3xl font-light tracking-[0.18em] text-gold">AURA</span>
              <span className="text-[8px] tracking-[0.45em] text-white/45 uppercase mt-0.5">RESIDENCES</span>
            </div>
            <p className="text-[9px] tracking-[0.3em] uppercase text-white/20 mb-5">Est. MMXXV</p>
            <p className="text-white/50 text-xs leading-relaxed max-w-xs">
              Forty-two residences of extraordinary ambition. Westlands, Nairobi.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[9px] tracking-[0.35em] uppercase text-white/50 mb-5">Contact</h4>
            <div className="space-y-3.5">
              {[
                { Icon: Phone,  text: '+254 700 000 000' },
                { Icon: Mail,   text: 'hello@auraresidences.co.ke' },
                { Icon: MapPin, text: 'Westlands, Nairobi, Kenya' },
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
  const [lightbox, setLightbox] = useState(null)
  const schedulerRef = useRef(null)

  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="min-h-screen bg-aura-black font-sans">

      {/* Gold reading progress bar */}
      <ScrollProgress />

      <Navbar onBookClick={() => scrollTo(schedulerRef)} />

      <Hero
        onExplore={() => document.getElementById('residences')?.scrollIntoView({ behavior: 'smooth' })}
        onSchedule={() => scrollTo(schedulerRef)}
      />

      <PropertyExplorer />

      {/* Cream → Dark skew transition */}
      <SkewDivider fromLight={true} />

      <AmenitiesGrid />
      <GalleryStrip onImageClick={setLightbox} />
      <PressStrip />

      {/* Dark → Cream skew transition */}
      <SkewDivider fromLight={false} />

      <PullQuote />
      <LocationSection />

      {/* Cream → Dark skew transition */}
      <SkewDivider fromLight={true} />

      <div ref={schedulerRef}>
        <ViewingScheduler onSuccess={data => setToast(data)} />
      </div>

      <Footer />

      {lightbox !== null && (
        <Lightbox images={GALLERY} index={lightbox} onClose={() => setLightbox(null)} />
      )}

      {toast && <Toast data={toast} onClose={() => setToast(null)} />}

      <WhatsAppCTA />
    </div>
  )
}
