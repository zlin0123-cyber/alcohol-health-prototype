import { useState } from 'react'

// ── Topic list icons ───────────────────────────────────────

function IcoGlass({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M6 3H18L16.5 19H7.5L6 3Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <path d="M10 19H14M12 14V19" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IcoDoc({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="2" width="16" height="20" rx="2" stroke={color} strokeWidth="2" />
      <path d="M8 8h8M8 12h8M8 16h5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IcoPerson({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" />
      <path d="M5 21v-1a7 7 0 0 1 14 0v1" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M18 5h2.5M19.25 3.75v2.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IcoHeart({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 21C12 21 3 15 3 9C3 6 5.5 4 8 4C10 4 11.5 5 12 6.5C12.5 5 14 4 16 4C18.5 4 21 6 21 9C21 15 12 21 12 21Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

function IcoPill({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <g transform="rotate(-45 12 12)">
        <rect x="5" y="8.5" width="14" height="7" rx="3.5" stroke={color} strokeWidth="2" fill="none" />
        <line x1="12" y1="8.5" x2="12" y2="15.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      </g>
    </svg>
  )
}

function IcoCar({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M7 17H4a1 1 0 0 1-1-1v-4l2-6h14l2 6v4a1 1 0 0 1-1 1h-3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7.5" cy="17" r="2" stroke={color} strokeWidth="2" />
      <circle cx="16.5" cy="17" r="2" stroke={color} strokeWidth="2" />
      <path d="M3 12h18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// ── UI chrome icons ────────────────────────────────────────

function BackArrow() {
  return (
    <svg width="9" height="15" viewBox="0 0 9 15" fill="none">
      <path d="M7.5 1.5L1.5 7.5L7.5 13.5" stroke="#1A5FCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
      <path d="M1 1l5 5-5 5" stroke="#8A8682" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ShieldCheck() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L4 6V12C4 16.4 7.4 20.5 12 22C16.6 20.5 20 16.4 20 12V6L12 2Z" stroke="#1A5FCC" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="#1A5FCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ExternalLink() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5 2H2v10h10V9M8 2h4v4M12 2L6 8" stroke="#1A5FCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Stethoscope() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M6 3H3C3 7.5 4.5 10.5 8 12" stroke="#1A5FCC" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 3h3C21 7.5 19.5 10.5 16 12" stroke="#1A5FCC" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 3v9" stroke="#1A5FCC" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 12a4 4 0 0 0 4 4 4 4 0 0 0 4-4" stroke="#1A5FCC" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16.5" cy="17.5" r="2.5" stroke="#1A5FCC" strokeWidth="2" />
    </svg>
  )
}

function InfoCircle() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="7.5" stroke="#4A5260" strokeWidth="1.5" />
      <path d="M9 8v5" stroke="#4A5260" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9" cy="5.5" r="0.75" fill="#4A5260" />
    </svg>
  )
}

function LearnMoreArrow() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Data ───────────────────────────────────────────────────

type Topic = {
  id: string
  title: string
  subtitle: string
  iconColor: string
  iconBg: string
  icon: (color: string) => React.ReactElement
}

const topics: Topic[] = [
  { id: 'standard-drinks', title: 'Standard Drinks', subtitle: 'Understand what one standard drink means.', iconColor: '#1B63D4', iconBg: '#DDEEFF', icon: (c) => <IcoGlass color={c} /> },
  { id: 'alcohol-guidelines', title: 'Australian Alcohol Guidelines', subtitle: 'Know the recommended limits to reduce risk.', iconColor: '#0881CC', iconBg: '#D8EFFE', icon: (c) => <IcoDoc color={c} /> },
  { id: 'alcohol-ageing', title: 'Alcohol & Ageing', subtitle: 'Why alcohol may affect you differently as you age.', iconColor: '#5B52DC', iconBg: '#ECEAFF', icon: (c) => <IcoPerson color={c} /> },
  { id: 'alcohol-health', title: 'Alcohol & Health', subtitle: 'Understand how alcohol can affect your health.', iconColor: '#0A8EBA', iconBg: '#D8F2FB', icon: (c) => <IcoHeart color={c} /> },
  { id: 'alcohol-medicines', title: 'Alcohol & Medicines', subtitle: 'Learn why extra care may be needed with medicines.', iconColor: '#1B63D4', iconBg: '#DDEEFF', icon: (c) => <IcoPill color={c} /> },
  { id: 'alcohol-driving', title: 'Alcohol & Driving', subtitle: 'Alcohol and driving — what you need to know.', iconColor: '#5B52DC', iconBg: '#ECEAFF', icon: (c) => <IcoCar color={c} /> },
]

type KeyPoint = { title: string; body: string }
type TopicDetailData = {
  title: string
  subtitle: string
  image: string
  sectionTitle: string
  keyPoints: KeyPoint[]
  source: { name: string; description: string }
}

const topicDetails: Record<string, TopicDetailData> = {
  'standard-drinks': {
    title: 'Standard Drinks',
    subtitle: 'In Australia, a standard drink contains 10 grams of pure alcohol — knowing this helps you drink mindfully.',
    image: 'https://images.unsplash.com/photo-1783701481560-d5456a47189e?w=780&h=400&fit=crop&auto=format',
    sectionTitle: 'What you need to know about standard drinks',
    keyPoints: [
      { title: 'What is a standard drink?', body: 'In Australia, one standard drink contains exactly 10 grams of pure alcohol — regardless of the type of drink or container.' },
      { title: 'Common drink sizes vary', body: 'A full schooner of beer, a standard glass of wine, or a single spirit shot may each count as 1–2.5 standard drinks.' },
      { title: 'Labels tell you the count', body: 'Australian drinks are required to display how many standard drinks the container holds, making it easier to track your intake.' },
      { title: 'Why tracking matters', body: 'Keeping track of standard drinks helps you stay within Australian health guidelines and make more informed choices.' },
    ],
    source: { name: 'Healthdirect Australia', description: 'This information is from Healthdirect Australia, a government-funded service providing quality health information.' },
  },
  'alcohol-guidelines': {
    title: 'Australian Alcohol Guidelines',
    subtitle: 'The NHMRC guidelines are designed to reduce your risk of alcohol-related harm throughout your life.',
    image: 'https://images.unsplash.com/photo-1635573527034-887631f4d1fa?w=780&h=400&fit=crop&auto=format',
    sectionTitle: 'Understanding the Australian alcohol guidelines',
    keyPoints: [
      { title: 'No more than 10 drinks per week', body: 'The guidelines recommend no more than 10 standard drinks per week to reduce your lifetime risk of harm from alcohol.' },
      { title: 'No more than 4 in one day', body: 'To reduce the risk of injury and acute harm, no more than 4 standard drinks should be consumed on any single day.' },
      { title: 'Some people should drink less', body: 'If you are pregnant, breastfeeding, under 18, or taking certain medications, you should drink less — or not at all.' },
      { title: 'Older adults may need lower limits', body: 'As you age, your body processes alcohol less efficiently. Older adults may benefit from drinking well below the standard guidelines.' },
    ],
    source: { name: 'NHMRC', description: 'These guidelines are from the National Health and Medical Research Council (NHMRC), the leading Australian health research body.' },
  },
  'alcohol-ageing': {
    title: 'Alcohol & Ageing',
    subtitle: 'As you get older, alcohol may affect you differently even if your drinking habits stay the same.',
    image: 'https://images.unsplash.com/photo-1764173039543-f9f197744e1b?w=780&h=400&fit=crop&auto=format',
    sectionTitle: 'Why can alcohol affect you differently as you age?',
    keyPoints: [
      { title: 'Body water decreases', body: 'As you age, your body contains less water, so alcohol becomes more concentrated in your bloodstream, making its effects stronger and longer-lasting.' },
      { title: 'Slower liver processing', body: 'The liver metabolises alcohol more slowly as we age, meaning alcohol stays in your system for longer after drinking.' },
      { title: 'Medication interactions', body: 'Many medicines commonly used by older adults can interact with alcohol, sometimes causing dangerous or unexpected effects.' },
      { title: 'Greater risk of falls', body: 'Alcohol impairs balance and coordination. Combined with age-related physical changes, this significantly raises your risk of falls and serious injury.' },
    ],
    source: { name: 'Healthdirect Australia', description: 'This information is from Healthdirect Australia, a government-funded service providing quality health information.' },
  },
  'alcohol-health': {
    title: 'Alcohol & Health',
    subtitle: 'Even moderate drinking can have effects on your health. Understanding the risks helps you make better choices.',
    image: 'https://images.unsplash.com/photo-1611077094733-db54f4445a4e?w=780&h=400&fit=crop&auto=format',
    sectionTitle: 'How alcohol can affect your health',
    keyPoints: [
      { title: 'Short-term effects', body: 'Alcohol can cause dehydration, poor sleep quality, reduced coordination and impaired judgment — even after just a few drinks.' },
      { title: 'Long-term risks', body: 'Regular drinking increases the risk of liver disease, certain cancers, cardiovascular problems and high blood pressure over time.' },
      { title: 'Mental health impact', body: 'Alcohol can worsen anxiety and depression. While it may seem to help short-term, it disrupts the brain chemicals that regulate mood.' },
      { title: 'Sleep disruption', body: 'Although alcohol may help you fall asleep, it reduces sleep quality and prevents deep, restorative rest throughout the night.' },
    ],
    source: { name: 'Healthdirect Australia', description: 'This information is from Healthdirect Australia, a government-funded service providing quality health information.' },
  },
  'alcohol-medicines': {
    title: 'Alcohol & Medicines',
    subtitle: 'Many common medicines can interact with alcohol, sometimes in ways that are harmful or unexpected.',
    image: 'https://images.unsplash.com/photo-1603798125737-03c2ba557c16?w=780&h=400&fit=crop&auto=format',
    sectionTitle: 'Why extra care may be needed with medicines',
    keyPoints: [
      { title: 'Common medicines are affected', body: 'Painkillers, sleeping tablets, anti-anxiety medications and blood pressure medicines are among the many drugs that can interact with alcohol.' },
      { title: 'Effects can be amplified', body: 'Alcohol can increase the sedative effects of many medicines, making you more drowsy or unsteady than expected.' },
      { title: 'Some interactions are dangerous', body: 'Mixing alcohol with certain medications — such as blood thinners or diabetes medicines — can cause serious health complications.' },
      { title: 'Always ask your pharmacist', body: 'Check with your GP or pharmacist before drinking if you take any regular medications, including those bought over the counter.' },
    ],
    source: { name: 'Healthdirect Australia', description: 'This information is from Healthdirect Australia, a government-funded service providing quality health information.' },
  },
  'alcohol-driving': {
    title: 'Alcohol & Driving',
    subtitle: 'Alcohol affects your ability to drive safely — even at low levels. Understanding the risks can save lives.',
    image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=780&h=400&fit=crop&auto=format',
    sectionTitle: 'What you need to know about alcohol and driving',
    keyPoints: [
      { title: 'Blood alcohol limits apply', body: 'In Australia, the legal blood alcohol limit for most drivers is 0.05. For learner and provisional drivers, the limit is zero.' },
      { title: 'Impairment begins early', body: 'Even below the legal limit, alcohol can impair your reaction time, judgment and ability to concentrate on the road.' },
      { title: "Feeling fine doesn't mean you're safe", body: 'Alcohol can make you feel more confident while actually reducing your driving ability. Subjective feelings are not a reliable guide.' },
      { title: 'Older adults may be more affected', body: 'As you age, the same amount of alcohol can have a greater impact on your body, potentially affecting your driving more than you expect.' },
    ],
    source: { name: 'Alcohol and Drug Foundation', description: 'This information is from the Alcohol and Drug Foundation, an Australian non-profit providing evidence-based information.' },
  },
}

// ── Learn Hub ──────────────────────────────────────────────

function LearnHub({ onOpenTopic }: { onOpenTopic: (id: string) => void }) {
  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar app-scroll-nav-clearance">

      {/* Page header scrolls with the Learn hub content on the real web app. */}
      <div className="px-5 pt-2 pb-3">
        <h1 className="font-display text-[36px] text-[#1C1C1A] leading-tight">Learn</h1>
        <p className="text-[18px] text-[#56524F] mt-1 leading-relaxed">
          Clear, trusted information about alcohol,{'\n'}ageing and Australian guidelines.
        </p>
      </div>

      {/* Featured topic card */}
        <div className="px-5">
          <button
            className="w-full rounded-2xl overflow-hidden shadow-md text-left active:opacity-90 transition-opacity"
            onClick={() => onOpenTopic('alcohol-ageing')}
          >
            <div className="relative h-[190px]">
              <img
                src="https://images.unsplash.com/photo-1764173039543-f9f197744e1b?w=780&h=500&fit=crop&auto=format"
                alt="Three seniors talking and smiling"
                className="w-full h-full object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3A3080]/70 via-transparent to-transparent" />
              <span className="absolute top-3 left-3 text-[14px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#1A5FCC] text-white">
                Featured
              </span>
            </div>
            <div className="bg-[#ECEAFF] px-5 pt-4 pb-5">
              <p className="text-[15px] font-bold uppercase tracking-widest text-[#5B52DC]">Alcohol & Ageing</p>
              <p className="font-display text-[25px] text-[#1C1C1A] mt-1.5 leading-snug">
                As you get older, alcohol may affect you differently.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-[17px] font-semibold text-[#5B52DC]">
                Learn more <LearnMoreArrow />
              </span>
            </div>
          </button>
        </div>

        {/* Explore topics */}
        <div className="mt-7 px-5">
          <p className="text-[15px] font-bold uppercase tracking-widest text-[#647280] mb-3">
            Explore Topics
          </p>
          <div className="rounded-2xl overflow-hidden border border-[#E2DDD8] divide-y divide-[#E2DDD8]">
            {topics.map((topic) => (
              <button
                key={topic.id}
                className="w-full flex items-center gap-3.5 px-4 py-4 bg-white active:bg-[#F7F8FA] transition-colors text-left"
                onClick={() => onOpenTopic(topic.id)}
              >
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: topic.iconBg }}
                >
                  {topic.icon(topic.iconColor)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[19px] font-medium text-[#1C1C1A] leading-tight">{topic.title}</p>
                  <p className="text-[16px] text-[#56524F] mt-1 leading-tight">{topic.subtitle}</p>
                </div>
                <ChevronRight />
              </button>
            ))}
          </div>
        </div>

        {/* Trust banner */}
        <div className="mx-5 mt-6 mb-2 rounded-2xl bg-[#F0F4FF] p-4 flex items-center gap-3">
          <div className="flex-shrink-0"><ShieldCheck /></div>
          <p className="text-[17px] text-[#1C1C1A] leading-relaxed flex-1">
            All information on this site comes from trusted Australian health sources.
          </p>
        </div>

    </div>
  )
}

// ── Topic Detail ───────────────────────────────────────────

const resources = ['Healthdirect Australia', 'NHMRC Alcohol Guidelines', 'Alcohol and Drug Foundation']

function TopicDetail({ topicId, onBack }: { topicId: string; onBack: () => void }) {
  const detail = topicDetails[topicId] ?? topicDetails['alcohol-ageing']

  return (
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* Back nav */}
      <button
        className="flex-shrink-0 h-11 flex items-center gap-2 px-5 active:opacity-70 transition-opacity"
        onClick={onBack}
      >
        <BackArrow />
        <span className="text-[19px] font-medium text-[#1A5FCC]">Back to Learn</span>
      </button>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto hide-scrollbar app-scroll-nav-clearance">

        {/* Hero */}
        <div className="px-5 pt-1">
          <h1 className="font-display text-[32px] text-[#1C1C1A] leading-tight">{detail.title}</h1>
          <p className="text-[18px] text-[#56524F] mt-2 leading-relaxed">{detail.subtitle}</p>
        </div>
        <div className="mt-4">
          <img src={detail.image} alt={detail.title} className="w-full h-[196px] object-cover" draggable={false} />
        </div>

        {/* Key info */}
        <div className="px-5 mt-6">
          <h2 className="font-display text-[27px] text-[#1C1C1A] leading-tight">{detail.sectionTitle}</h2>
          <div className="mt-4 space-y-5">
            {detail.keyPoints.map((point, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1A5FCC] flex items-center justify-center mt-0.5">
                  <span className="text-white text-[16px] font-bold">{i + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-[19px] font-semibold text-[#1C1C1A]">{point.title}</p>
                  <p className="text-[17px] text-[#56524F] mt-1.5 leading-relaxed">{point.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Source */}
        <div className="mx-5 mt-6">
          <div className="rounded-2xl bg-[#F0F4FF] p-4">
            <p className="text-[15px] font-bold uppercase tracking-widest text-[#1A5FCC] mb-2">Source</p>
            <p className="text-[19px] font-semibold text-[#1C1C1A]">{detail.source.name}</p>
            <p className="text-[17px] text-[#56524F] mt-1.5 leading-relaxed">{detail.source.description}</p>
            <button className="mt-3 inline-flex items-center gap-1.5 text-[17px] font-semibold text-[#1A5FCC]">
              View source <ExternalLink />
            </button>
          </div>
        </div>

        {/* Need more information */}
        <div className="px-5 mt-6">
          <h2 className="font-display text-[27px] text-[#1C1C1A]">Need more information?</h2>
          <p className="text-[17px] text-[#56524F] mt-1.5 leading-relaxed">
            Our website provides general information to help you better understand alcohol and your drinking.
          </p>

          <p className="text-[15px] font-bold uppercase tracking-widest text-[#647280] mt-5 mb-2">
            Trusted Australian Resources
          </p>
          <div className="rounded-2xl overflow-hidden border border-[#EEEDF3]">
            {resources.map((name, i) => (
              <div key={name}>
                <button className="w-full flex items-center justify-between px-4 py-4 bg-white active:bg-[#F7F8FA] transition-colors">
                  <span className="text-[19px] font-medium text-[#1A5FCC]">{name}</span>
                  <ExternalLink />
                </button>
                {i < resources.length - 1 && <div className="h-px bg-[#EEEDF3]" />}
              </div>
            ))}
          </div>

          {/* Medical advice */}
          <div className="mt-4 rounded-2xl bg-[#EEF5F4] p-4 flex gap-3 items-start">
            <div className="flex-shrink-0 mt-0.5"><Stethoscope /></div>
            <div>
              <p className="text-[19px] font-semibold text-[#1C1C1A]">Advice about your health</p>
              <p className="text-[17px] text-[#4A5260] mt-1.5 leading-relaxed">
                For advice specific to your health, medical conditions or medicines, speak with your GP, pharmacist or another qualified health professional.
              </p>
            </div>
          </div>

          {/* General disclaimer */}
          <div className="mt-3 mb-2 rounded-xl bg-[#F5F6F8] p-4 flex gap-2.5 items-start">
            <div className="flex-shrink-0 mt-0.5"><InfoCircle /></div>
            <p className="text-[16px] text-[#4A5260] leading-relaxed">
              This information is general in nature and does not replace personalised medical advice.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

// ── Page root ──────────────────────────────────────────────

type LearnPageProps = {
  initialTopicId?: string | null
}

export default function LearnPage({ initialTopicId }: LearnPageProps) {
  const [view, setView] = useState<'hub' | 'detail'>(initialTopicId ? 'detail' : 'hub')
  const [topicId, setTopicId] = useState(initialTopicId ?? 'alcohol-ageing')

  const openTopic = (id: string) => { setTopicId(id); setView('detail') }

  if (view === 'detail') {
    return <TopicDetail topicId={topicId} onBack={() => setView('hub')} />
  }
  return <LearnHub onOpenTopic={openTopic} />
}
