import { useState, useRef, useEffect } from 'react'

// ── Feature icons ──────────────────────────────────────────

function FiDrink() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M6 3H18L16.5 19H7.5L6 3Z" stroke="#1B63D4" strokeWidth="2" strokeLinejoin="round" />
      <path d="M10 19H14M12 14V19" stroke="#1B63D4" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function FiBook() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 5C9.2 3.8 6.5 4.2 3 6.2V19.2C6.5 17.2 9.2 17.6 12 18.8C14.8 17.6 17.5 17.2 21 19.2V6.2C17.5 4.2 14.8 3.8 12 5Z" stroke="#0881CC" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 5V18.8" stroke="#0881CC" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function FiTrend() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="12" width="4" height="8" rx="1" stroke="#5B52DC" strokeWidth="2" strokeLinejoin="round" />
      <rect x="10" y="7" width="4" height="13" rx="1" stroke="#5B52DC" strokeWidth="2" strokeLinejoin="round" />
      <rect x="17" y="3" width="4" height="17" rx="1" stroke="#5B52DC" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

function FiTrophy() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M6 4H4C4 8 5.5 11 8.5 11M18 4H20C20 8 18.5 11 15.5 11M12 13V17M8 20H16M7 4H17V9C17 12 14.8 13 12 13C9.2 13 7 12 7 9V4Z" stroke="#0A8EBA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── UI icons ───────────────────────────────────────────────

function HelpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="9" stroke="#1C1C1A" strokeWidth="1.5" />
      <path d="M8.5 8.5a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5" stroke="#1C1C1A" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="11" cy="15.5" r="0.8" fill="#1C1C1A" />
    </svg>
  )
}

function Chevron() {
  return (
    <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
      <path d="M1 1l5 5-5 5" stroke="#8A8682" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Data ───────────────────────────────────────────────────

const CARD_W = 318
const CARD_GAP = 12
const SLIDE_STEP = CARD_W + CARD_GAP

const slides = [
  {
    id: 0,
    label: null,
    title: 'Understand your drinking as you get older',
    image: 'https://images.unsplash.com/photo-1611077094733-db54f4445a4e?w=636&h=400&fit=crop&auto=format',
    alt: 'Woman holding a warm ceramic mug, a quiet moment of reflection',
    heroBg: '#28605C',
    labelColor: '',
    showLearnMore: false,
    topicId: null,
  },
  {
    id: 1,
    label: 'Alcohol & ageing',
    title: 'How alcohol affects your body differently with age',
    image: 'https://images.unsplash.com/photo-1764173039543-f9f197744e1b?w=636&h=400&fit=crop&auto=format',
    alt: 'Three seniors talking and smiling together',
    heroBg: '#EDF6F5',
    labelColor: '#28605C',
    showLearnMore: true,
    topicId: 'alcohol-ageing',
  },
  {
    id: 2,
    label: 'Standard drinks',
    title: 'What counts as one standard drink',
    image: 'https://images.unsplash.com/photo-1783701481560-d5456a47189e?w=636&h=400&fit=crop&auto=format',
    alt: 'Pouring a dark drink into a stemmed glass',
    heroBg: '#FDF3EC',
    labelColor: '#C4784A',
    showLearnMore: true,
    topicId: 'standard-drinks',
  },
  {
    id: 3,
    label: 'Know your drink',
    title: 'Discover the alcohol content in common drinks',
    image: 'https://images.unsplash.com/photo-1713680914377-f160d954fa0c?w=636&h=400&fit=crop&auto=format',
    alt: 'Woman drinking a glass of white wine in natural light',
    heroBg: '#F3EEF9',
    labelColor: '#6B4C8A',
    showLearnMore: true,
    topicId: 'alcohol-health',
  },
]

const features = [
  {
    title: 'Record your drinks',
    subtitle: "Understand what you're drinking",
    iconBg: '#DDEEFF',
    icon: <FiDrink />,
    nav: 'record' as const,
  },
  {
    title: 'Learn about alcohol',
    subtitle: 'Alcohol, ageing and guidelines',
    iconBg: '#D8EFFE',
    icon: <FiBook />,
    nav: 'learn' as const,
  },
  {
    title: 'Understand your patterns',
    subtitle: 'Review your drinking over time',
    iconBg: '#ECEAFF',
    icon: <FiTrend />,
    nav: 'trends' as const,
  },
  {
    title: 'Earn awards',
    subtitle: 'Recognise your progress',
    iconBg: '#D8F2FB',
    icon: <FiTrophy />,
    nav: 'awards' as const,
  },
]

// ── Component ──────────────────────────────────────────────

type HomePageProps = {
  onNavigateLearn: (topicId?: string) => void
  onNavigateTab: (tab: 'Record' | 'Trends' | 'Awards') => void
}

export default function HomePage({ onNavigateLearn, onNavigateTab }: HomePageProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showAbout, setShowAbout] = useState(false)
  const startX = useRef(0)
  const deltaX = useRef(0)
  const dragging = useRef(false)
  const trackRef = useRef<HTMLDivElement>(null)

  const setTrackTransform = (slide: number, drag = 0, animated = true) => {
    if (!trackRef.current) return
    trackRef.current.style.transition = animated
      ? 'transform 1.1s cubic-bezier(0.25,0.46,0.45,0.94)'
      : 'none'
    trackRef.current.style.transform = `translateX(${-slide * SLIDE_STEP + drag}px)`
  }

  const applyDrag = (clientX: number, slide: number) => {
    const delta = clientX - startX.current
    deltaX.current = delta
    const atStart = slide === 0 && delta > 0
    const atEnd = slide === slides.length - 1 && delta < 0
    const drag = atStart || atEnd ? delta * 0.18 : delta
    setTrackTransform(slide, drag, false)
  }

  const settle = (slide: number) => {
    const delta = deltaX.current
    let next = slide
    if (delta < -44 && slide < slides.length - 1) next = slide + 1
    else if (delta > 44 && slide > 0) next = slide - 1
    setTrackTransform(next, 0, true)
    setCurrentSlide(next)
    deltaX.current = 0
  }

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    deltaX.current = 0
  }
  const onTouchMove = (e: React.TouchEvent) => {
    applyDrag(e.touches[0].clientX, currentSlide)
  }
  const onTouchEnd = () => settle(currentSlide)

  // Mouse handlers
  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true
    startX.current = e.clientX
    deltaX.current = 0
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return
    applyDrag(e.clientX, currentSlide)
  }
  const onMouseUp = () => {
    if (!dragging.current) return
    dragging.current = false
    settle(currentSlide)
  }
  const onMouseLeave = () => {
    if (!dragging.current) return
    dragging.current = false
    settle(currentSlide)
  }

  // Auto-advance every 10 s; pause while dragging
  useEffect(() => {
    const id = setInterval(() => {
      if (dragging.current) return
      setCurrentSlide((prev) => {
        const next = prev < slides.length - 1 ? prev + 1 : 0
        setTrackTransform(next, 0, true)
        return next
      })
    }, 10000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative">
      <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar app-scroll-nav-clearance">
      {/* Page header */}
      <div className="px-5 pt-3 pb-3 flex items-center justify-between">
        <h1 className="font-display text-[36px] text-[#1C1C1A] leading-tight">Home</h1>
        <button
          className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F5F3EF] active:opacity-70 transition-opacity flex-shrink-0"
          onClick={() => setShowAbout(true)}
          aria-label="About this app"
        >
          <HelpIcon />
        </button>
      </div>

      {/* Carousel */}
      <div className="flex-shrink-0 mt-2">
        <div
          className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
        >
          <div
            ref={trackRef}
            className="flex pl-5"
            style={{ gap: `${CARD_GAP}px`, transform: 'translateX(0px)', transition: 'none' }}
          >
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="flex-shrink-0 rounded-2xl overflow-hidden flex flex-col shadow-md"
                style={{ width: `${CARD_W}px` }}
              >
                <div className="relative h-[212px] bg-[#C8C4BE]">
                  <img src={slide.image} alt={slide.alt} className="w-full h-full object-cover" draggable={false} />
                  {slide.label && (
                    <span
                      className="absolute top-3 left-3 text-[12px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm"
                      style={{ color: slide.labelColor }}
                    >
                      {slide.label}
                    </span>
                  )}
                </div>
                <div
                  className="flex flex-col justify-between px-5 pt-4 pb-5"
                  style={{ backgroundColor: slide.heroBg || '#FFFFFF', minHeight: '108px' }}
                >
                  <p
                    className="font-display leading-snug"
                    style={{
                      fontSize: slide.id === 0 ? '22px' : '19px',
                      color: slide.id === 0 ? '#FFFFFF' : '#1C1C1A',
                    }}
                  >
                    {slide.title}
                  </p>
                  {slide.showLearnMore && slide.topicId && (
                    <button
                      className="mt-3 self-start flex items-center gap-1 text-[16px] font-semibold tracking-wide active:opacity-70 transition-opacity"
                      style={{ color: slide.labelColor || '#28605C' }}
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => { e.stopPropagation(); onNavigateLearn(slide.topicId!) }}
                    >
                      Learn more
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                        <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center items-center gap-2 mt-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setTrackTransform(i, 0, true); setCurrentSlide(i) }}
              className="rounded-full transition-all duration-200"
              style={{
                width: i === currentSlide ? '18px' : '6px',
                height: '6px',
                backgroundColor: i === currentSlide ? '#28605C' : '#D0CBC5',
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="px-5 pt-4 pb-5">
        <h2 className="font-display text-[25px] leading-tight text-[#1C1C1A] mb-3">
          What you can do here
        </h2>
        <div className="flex flex-col gap-4">
          {features.map((f) => (
            <button
              key={f.title}
              className="flex items-center gap-3.5 text-left active:opacity-70 transition-opacity"
              onClick={() => {
                if (f.nav === 'learn') onNavigateLearn()
                else if (f.nav === 'record') onNavigateTab('Record')
                else if (f.nav === 'trends') onNavigateTab('Trends')
                else onNavigateTab('Awards')
              }}
            >
              <div
                className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: f.iconBg }}
              >
                {f.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[19px] font-medium text-[#1C1C1A] leading-tight">{f.title}</p>
                <p className="text-[17px] text-[#56524F] mt-0.5 leading-tight">{f.subtitle}</p>
              </div>
              <Chevron />
            </button>
          ))}
        </div>
      </div>
      </div>

      {/* About modal */}
      {showAbout && (
        <div
          className="absolute inset-0 z-20 flex flex-col justify-end"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
          onClick={() => setShowAbout(false)}
        >
          <div
            className="bg-white rounded-t-3xl px-6 pt-7 pb-10 overflow-y-auto hide-scrollbar"
            style={{ maxHeight: '85%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-[#D8D4CF] mx-auto mb-6" />

            <h2 className="font-display text-[30px] text-[#1C1C1A] leading-tight mb-4">
              About this website
            </h2>

            <p className="text-[17px] text-[#1C1C1A] leading-relaxed mb-5">
              This website helps you understand your drinking as you get older.
            </p>

            <p className="text-[15px] font-bold uppercase tracking-widest text-[#647280] mb-3">
              You can
            </p>
            <div className="flex flex-col gap-3 mb-6">
              {[
                'Record what you drink',
                'Learn about standard drinks and Australian guidelines',
                'Review your drinking patterns over time',
                'Earn awards as you build awareness',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#1A5FCC] flex-shrink-0 mt-[7px]" />
                  <p className="text-[17px] text-[#1C1C1A] leading-snug">{item}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#F5F6F8] rounded-2xl p-4 mb-6">
              <p className="text-[16px] font-semibold text-[#1C1C1A] mb-1">Not sure where to start?</p>
              <p className="text-[16px] text-[#56524F] leading-snug">
                Try recording a drink or explore the Learn page.
              </p>
            </div>

            <p className="text-[14px] text-[#8A8682] leading-relaxed mb-7">
              This website provides general health information and does not replace personalised medical advice.
            </p>

            <button
              className="w-full h-[56px] rounded-2xl bg-[#1A5FCC] text-[17px] font-semibold text-white active:opacity-80 transition-opacity"
              onClick={() => setShowAbout(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
