// v2
import { useState, useRef } from 'react'
import type { DrinkCategory, DrinkDefinition, NewDrinkRecordPayload } from '@/types/alcohol'
import { calculateStandardDrinks, roundStandardDrinks } from '@/utils/alcohol'

// ── Icons ──────────────────────────────────────────────────

function BackArrow() {
  return (
    <svg width="9" height="15" viewBox="0 0 9 15" fill="none">
      <path d="M7.5 1.5L1.5 7.5L7.5 13.5" stroke="#1A5FCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IcoInfo() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8.5" stroke="#1A5FCC" strokeWidth="1.5" />
      <path d="M10 9v5" stroke="#1A5FCC" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="6.5" r="0.8" fill="#1A5FCC" />
    </svg>
  )
}

function IcoCalendar() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2.5" y="3.5" width="15" height="14" rx="2" stroke="#1A5FCC" strokeWidth="1.5" />
      <path d="M2.5 8h15" stroke="#1A5FCC" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6.5 2v3M13.5 2v3" stroke="#1A5FCC" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IcoClock() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7.5" stroke="#1A5FCC" strokeWidth="1.5" />
      <path d="M10 6v4l2.5 2.5" stroke="#1A5FCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IcoBottle() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M12 4h8v5l3 5v12a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V14l3-5V4Z" stroke="#1A5FCC" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 19h14" stroke="#1A5FCC" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M13 4h6" stroke="#1A5FCC" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IcoChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 6l4 4 4-4" stroke="#4A5260" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Progress indicator ─────────────────────────────────────

function ProgressBar({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center px-8 py-4">
      {/* Step 1 circle */}
      <div className="flex flex-col items-center gap-1.5">
        <div className="w-9 h-9 rounded-full bg-[#1A5FCC] flex items-center justify-center">
          {step > 1 ? <CheckIcon /> : <span className="text-white text-[15px] font-bold">1</span>}
        </div>
        <span className="text-[13px] font-semibold" style={{ color: step === 1 ? '#1A5FCC' : '#4A5260' }}>
          Details
        </span>
      </div>

      {/* Connecting line */}
      <div className="flex-1 h-[2px] mx-3 mb-5 overflow-hidden rounded-full bg-[#E2DDD8]">
        <div
          className="h-full bg-[#1A5FCC] transition-all duration-500"
          style={{ width: step > 1 ? '100%' : '0%' }}
        />
      </div>

      {/* Step 2 circle */}
      <div className="flex flex-col items-center gap-1.5">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300"
          style={{ backgroundColor: step >= 2 ? '#1A5FCC' : '#E2DDD8' }}
        >
          <span className="text-[15px] font-bold" style={{ color: step >= 2 ? 'white' : '#8A8682' }}>2</span>
        </div>
        <span className="text-[13px] font-semibold" style={{ color: step === 2 ? '#1A5FCC' : '#8A8682' }}>
          Consumption
        </span>
      </div>
    </div>
  )
}

// ── Shared: top nav ────────────────────────────────────────

function TopNav({ onBack, label }: { onBack: () => void; label: string }) {
  return (
    <button
      className="flex-shrink-0 h-12 flex items-center gap-2 px-5 active:opacity-70 transition-opacity"
      onClick={onBack}
    >
      <BackArrow />
      <span className="text-[17px] font-medium text-[#1A5FCC]">{label}</span>
    </button>
  )
}

// ── Shared: field label ────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[15px] font-semibold text-[#1C1C1A] mb-2">{children}</p>
}

// ── Step 1 ─────────────────────────────────────────────────

export type Step1Data = {
  name: string
  type: string
  abv: string
  size: string
  container: string
}

const drinkTypes = ['Beer', 'Wine', 'Spirits', 'Cider', 'RTD', 'Other']
const containerTypes = ['Bottle', 'Can', 'Glass', 'Schooner', 'Pint', 'Other']

const drinkTypeDefaults: Record<string, { abv: string; size: string; container: string }> = {
  Beer:    { abv: '4.5', size: '375', container: 'Can' },
  Wine:    { abv: '13.5', size: '750', container: 'Bottle' },
  Spirits: { abv: '40', size: '700', container: 'Bottle' },
  Cider:   { abv: '4.5', size: '375', container: 'Can' },
  RTD:     { abv: '5', size: '375', container: 'Can' },
  Other:   { abv: '', size: '', container: 'Other' },
}

function defaultsForDrinkType(type: string) {
  return drinkTypeDefaults[type] ?? drinkTypeDefaults.Other
}

function Step1({
  initialData,
  onBack,
  onContinue,
  mode = 'add',
}: {
  initialData: Step1Data
  onBack: () => void
  onContinue: (data: Step1Data) => void
  mode?: 'add' | 'edit'
}) {
  const [name, setName] = useState(initialData.name)
  const [type, setType] = useState(initialData.type)
  const [abv, setAbv] = useState(initialData.abv)
  const [size, setSize] = useState(initialData.size)
  const [container, setContainer] = useState(initialData.container)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const initialDefaults = defaultsForDrinkType(initialData.type)
  const abvEdited = useRef(mode === 'edit' || initialData.abv !== initialDefaults.abv)
  const sizeEdited = useRef(mode === 'edit' || initialData.size !== initialDefaults.size)
  const containerEdited = useRef(mode === 'edit' || initialData.container !== initialDefaults.container)

  const handleTypeChange = (nextType: string) => {
    setType(nextType)
    if (mode !== 'add') return

    const defaults = defaultsForDrinkType(nextType)
    if (!abvEdited.current) setAbv(defaults.abv)
    if (!sizeEdited.current) setSize(defaults.size)
    if (!containerEdited.current) setContainer(defaults.container)
  }

  const abvNumber = Number(abv)
  const sizeNumber = Number(size)
  const canContinue = name.trim().length > 0
    && Number.isFinite(abvNumber) && abvNumber > 0 && abvNumber <= 100
    && Number.isFinite(sizeNumber) && sizeNumber > 0

  const handleSubmit = () => {
    if (canContinue) {
      onContinue({ name: name.trim(), type, abv, size, container })
      return
    }

    const missing: string[] = []
    if (!name.trim()) missing.push('Drink name')
    if (!abv.trim()) missing.push('Alcohol strength')
    if (!size.trim()) missing.push('Container size')

    let msg: string
    if (missing.length > 0) {
      msg = missing.length === 1
        ? `${missing[0]} is required to continue.`
        : `Please fill in: ${missing.join(' and ')}.`
    } else if (!Number.isFinite(abvNumber) || abvNumber <= 0 || abvNumber > 100) {
      msg = 'Alcohol strength must be greater than 0 and no more than 100%.'
    } else {
      msg = 'Container size must be greater than 0 mL.'
    }

    setToast(msg)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3500)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      <TopNav onBack={onBack} label={mode === 'edit' ? 'Back to My Drinks' : 'Back to Record'} />

      {/* Header */}
      <div className="flex-shrink-0 px-5 pb-1">
        <h1 className="font-display text-[30px] text-[#1C1C1A] leading-tight">{mode === 'edit' ? 'Edit Drink' : 'Add a Drink'}</h1>
        <p className="text-[15px] text-[#56524F] mt-1">
          {mode === 'edit' ? 'Update your saved drink details' : 'Step 1 of 2 · Save a drink to My Drinks'}
        </p>
      </div>

      {mode === 'add' && <ProgressBar step={1} />}

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto hide-scrollbar app-scroll-nav-clearance">
        <div className="px-5">

          {/* Scan label card */}
          {mode === 'add' && (
            <div className="bg-[#F5F6F8] rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M7 2H4a2 2 0 0 0-2 2v3M13 2h3a2 2 0 0 1 2 2v3M7 18H4a2 2 0 0 1-2-2v-3M13 18h3a2 2 0 0 0 2-2v-3" stroke="#647280" strokeWidth="1.6" strokeLinecap="round" />
                  <circle cx="10" cy="10" r="2.5" stroke="#647280" strokeWidth="1.6" />
                </svg>
                <p className="text-[17px] font-semibold text-[#1C1C1A]">Scan drink label</p>
              </div>
              <p className="text-[15px] text-[#56524F] leading-relaxed mb-4">
                Take or upload a photo of the label to fill in drink details automatically.
              </p>
              <button
                className="w-full h-[44px] rounded-xl text-[15px] font-semibold border border-[#D0D9E8] text-[#8A9AB8] bg-white cursor-not-allowed"
                disabled
              >
                Scan Label — Coming Soon
              </button>
            </div>
          )}

          {/* Form */}
          <p className="text-[13px] font-bold uppercase tracking-widest text-[#647280] mb-4">
            Drink Details
          </p>

          {/* Drink name */}
          <div className="mb-4">
            <FieldLabel>Drink name</FieldLabel>
            <input
              className="w-full h-13 bg-[#F5F6F8] rounded-xl px-4 text-[17px] text-[#1C1C1A] placeholder:text-[#8A8682] outline-none focus:ring-2 focus:ring-[#1A5FCC]/30"
              style={{ height: '52px' }}
              placeholder="e.g. Jacob's Creek Shiraz"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Drink type */}
          <div className="mb-4">
            <FieldLabel>Drink type</FieldLabel>
            <div className="relative">
              <select
                className="w-full h-[52px] bg-[#F5F6F8] rounded-xl px-4 text-[17px] text-[#1C1C1A] outline-none appearance-none focus:ring-2 focus:ring-[#1A5FCC]/30"
                value={type}
                onChange={(e) => handleTypeChange(e.target.value)}
              >
                {drinkTypes.map((t) => <option key={t}>{t}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <IcoChevronDown />
              </div>
            </div>
          </div>

          {/* Alcohol strength */}
          <div className="mb-4">
            <FieldLabel>Alcohol strength</FieldLabel>
            <div className="flex items-center gap-3">
              <input
                className="flex-1 h-[52px] bg-[#F5F6F8] rounded-xl px-4 text-[17px] text-[#1C1C1A] outline-none focus:ring-2 focus:ring-[#1A5FCC]/30"
                type="number"
                inputMode="decimal"
                placeholder="0.0"
                value={abv}
                onChange={(e) => {
                  abvEdited.current = true
                  setAbv(e.target.value)
                }}
              />
              <div className="h-[52px] px-4 bg-[#EEEDF3] rounded-xl flex items-center">
                <span className="text-[17px] font-medium text-[#4A5260]">% ABV</span>
              </div>
            </div>
          </div>

          {/* Container size */}
          <div className="mb-4">
            <FieldLabel>Container size</FieldLabel>
            <div className="flex items-center gap-3">
              <input
                className="flex-1 h-[52px] bg-[#F5F6F8] rounded-xl px-4 text-[17px] text-[#1C1C1A] outline-none focus:ring-2 focus:ring-[#1A5FCC]/30"
                type="number"
                inputMode="numeric"
                placeholder="750"
                value={size}
                onChange={(e) => {
                  sizeEdited.current = true
                  setSize(e.target.value)
                }}
              />
              <div className="h-[52px] px-4 bg-[#EEEDF3] rounded-xl flex items-center">
                <span className="text-[17px] font-medium text-[#4A5260]">mL</span>
              </div>
            </div>
          </div>

          {/* Container type */}
          <div className="mb-8">
            <FieldLabel>Container type</FieldLabel>
            <div className="relative">
              <select
                className="w-full h-[52px] bg-[#F5F6F8] rounded-xl px-4 text-[17px] text-[#1C1C1A] outline-none appearance-none focus:ring-2 focus:ring-[#1A5FCC]/30"
                value={container}
                onChange={(e) => {
                  containerEdited.current = true
                  setContainer(e.target.value)
                }}
              >
                {containerTypes.map((c) => <option key={c}>{c}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <IcoChevronDown />
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            className="w-full h-[56px] rounded-2xl text-[17px] font-semibold transition-all active:opacity-80 mb-5"
            style={{
              backgroundColor: canContinue ? '#1A5FCC' : '#D0D9E8',
              color: canContinue ? 'white' : '#8A9AB8',
            }}
            onClick={handleSubmit}
          >
            {mode === 'edit' ? 'Save Changes' : 'Save & Continue'}
          </button>

        </div>
      </div>

      {/* Toast notification */}
      <div
        className="absolute left-4 right-4 bottom-[96px] pointer-events-none"
        style={{
          transition: 'opacity 0.25s, transform 0.25s',
          opacity: toast ? 1 : 0,
          transform: toast ? 'translateY(0)' : 'translateY(10px)',
        }}
      >
        <div className="flex items-start gap-3 bg-[#1C1C1A] rounded-2xl px-4 py-4 shadow-xl">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-0.5">
            <circle cx="10" cy="10" r="9" stroke="#FF6B6B" strokeWidth="1.6" />
            <path d="M10 6v5" stroke="#FF6B6B" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="10" cy="14" r="0.8" fill="#FF6B6B" />
          </svg>
          <p className="text-[15px] text-white leading-snug">{toast}</p>
        </div>
      </div>
    </div>
  )
}

// ── Step 2 ─────────────────────────────────────────────────

const servingSizesByType: Record<string, { label: string; ml: number }[]> = {
  Beer:    [
    { label: 'Middy / Pot (285 mL)', ml: 285 },
    { label: 'Schooner (425 mL)', ml: 425 },
    { label: 'Pint (570 mL)', ml: 570 },
  ],
  Wine:    [
    { label: 'Small glass (100 mL)', ml: 100 },
    { label: 'Standard glass (150 mL)', ml: 150 },
    { label: 'Large glass (250 mL)', ml: 250 },
  ],
  Spirits: [
    { label: 'Shot (30 mL)', ml: 30 },
    { label: 'Standard serve (45 mL)', ml: 45 },
    { label: 'Double shot (60 mL)', ml: 60 },
  ],
  Cider:   [
    { label: 'Half pint (285 mL)', ml: 285 },
    { label: 'Pint (568 mL)', ml: 568 },
  ],
  RTD:     [
    { label: 'Small can (250 mL)', ml: 250 },
    { label: 'Standard (375 mL)', ml: 375 },
  ],
  Other:   [
    { label: 'Shot (30 mL)', ml: 30 },
    { label: 'Glass (150 mL)', ml: 150 },
    { label: 'Standard serve (60 mL)', ml: 60 },
  ],
}

const servingUnitByType: Record<string, string> = {
  Beer:    'Serve',
  Wine:    'Glass',
  Spirits: 'Shot',
  Cider:   'Glass',
  RTD:     'Serve',
  Other:   'Glass',
}

const catStyle: Record<string, { bg: string; color: string }> = {
  Beer:    { bg: '#FEF3C7', color: '#B45309' },
  Wine:    { bg: '#FFE4E6', color: '#BE123C' },
  Spirits: { bg: '#DDEEFF', color: '#1B63D4' },
  Cider:   { bg: '#DCFCE7', color: '#15803D' },
  RTD:     { bg: '#ECEAFF', color: '#5B52DC' },
  Other:   { bg: '#F3F4F6', color: '#4A5260' },
}

function DrinkTypeThumb({ type }: { type: string }) {
  const s = catStyle[type] ?? catStyle.Other
  return (
    <div
      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: s.bg }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9 2h6v5l3 5v10a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V12l3-5V2Z" stroke={s.color} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M6 15h12" stroke={s.color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function Step2({
  drinkData,
  onBack,
  onRecord,
  drinkId,
  saveToMyDrinks = false,
  showProgress = true,
  backLabel = 'Back to Details',
}: {
  drinkData: Step1Data
  onBack: () => void
  onRecord: (payload: NewDrinkRecordPayload) => void
  drinkId?: string
  saveToMyDrinks?: boolean
  showProgress?: boolean
  backLabel?: string
}) {
  const sizes = servingSizesByType[drinkData.type] ?? servingSizesByType.Other
  const servingUnit = servingUnitByType[drinkData.type] ?? 'Glass'
  const containerLabel = drinkData.container

  const modes = Array.from(new Set(['mL', servingUnit, containerLabel]))

  const [servingIdx, setServingIdx] = useState(0)
  const [mlValue, setMlValue] = useState('375')
  const [servingQty, setServingQty] = useState(1.0)
  const [containerQty, setContainerQty] = useState(1.0)
  const [mode, setMode] = useState(servingUnit)
  const todayStr = new Date().toISOString().split('T')[0]
  const [dateVal, setDateVal] = useState(todayStr)
  const [timeVal, setTimeVal] = useState(() => {
    const now = new Date()
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  })
  const dateRef = useRef<HTMLInputElement>(null)
  const timeRef = useRef<HTMLInputElement>(null)

  const formatDate = (v: string) => {
    if (v === todayStr) return 'Today'
    const [y, m, d] = v.split('-').map(Number)
    return new Date(y, m - 1, d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
  }
  const formatTime = (v: string) => {
    const [h, m] = v.split(':').map(Number)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
  }
  const openPicker = (ref: React.RefObject<HTMLInputElement | null>) => {
    const el = ref.current
    if (!el) return
    if (typeof el.showPicker === 'function') el.showPicker()
    else el.click()
  }

  const isServingMode = mode === servingUnit
  const isMlMode = mode === 'mL'
  const isContainerMode = !isServingMode && !isMlMode

  const adjustServing = (delta: number) => {
    setServingQty((q) => Math.max(0.5, Math.round((q + delta) * 2) / 2))
  }
  const adjustContainer = (delta: number) => {
    setContainerQty((q) => Math.max(0.5, Math.round((q + delta) * 2) / 2))
  }
  const adjustMl = (delta: number) => {
    setMlValue((v) => String(Math.max(0, (parseInt(v) || 0) + delta)))
  }

  const servingUnitLabel = sizes[servingIdx].label.split(' (')[0]
  const numericAbv = parseFloat(drinkData.abv) || 0
  const numericContainerSize = parseInt(drinkData.size) || 0
  const consumedMl = isMlMode
    ? Math.max(0, parseInt(mlValue) || 0)
    : isServingMode
      ? sizes[servingIdx].ml * servingQty
      : numericContainerSize * containerQty
  const standardDrinks = roundStandardDrinks(calculateStandardDrinks(consumedMl, numericAbv))

  const handleRecord = () => {
    if (consumedMl <= 0 || numericAbv <= 0) return

    const category = (drinkTypes.includes(drinkData.type) ? drinkData.type : 'Other') as DrinkCategory
    const mode = isMlMode ? 'ml' : isServingMode ? 'serving' : 'container'
    const quantity = isMlMode ? consumedMl : isServingMode ? servingQty : containerQty

    onRecord({
      drinkId,
      saveToMyDrinks,
      drink: {
        name: drinkData.name.trim(),
        category,
        abv: numericAbv,
        sizeMl: numericContainerSize,
        containerType: drinkData.container,
      },
      consumption: {
        mode,
        consumedMl,
        quantity,
        servingSizeMl: isServingMode ? sizes[servingIdx].ml : undefined,
        servingLabel: isServingMode ? servingUnitLabel : undefined,
        date: dateVal,
        time: timeVal,
        standardDrinks,
      },
    })
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <TopNav onBack={onBack} label={backLabel} />

      {/* Header */}
      <div className="flex-shrink-0 px-5 pb-1">
        <h1 className="font-display text-[30px] text-[#1C1C1A] leading-tight">Record Consumption</h1>
        <p className="text-[15px] text-[#56524F] mt-1">
          {showProgress ? 'Step 2 of 2 · Tell us how much you drank' : 'Tell us how much you drank'}
        </p>
      </div>

      {showProgress && <ProgressBar step={2} />}

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto hide-scrollbar app-scroll-nav-clearance">
        <div className="px-5">

          {/* Drink summary card */}
          <div className="bg-[#F5F6F8] rounded-2xl p-4 flex items-center gap-4 mb-6">
            <DrinkTypeThumb type={drinkData.type} />
            <div className="flex-1 min-w-0">
              <p className="text-[17px] font-semibold text-[#1C1C1A] leading-tight truncate">
                {drinkData.name || 'My Drink'}
              </p>
              <p className="text-[14px] text-[#56524F] mt-0.5">
                {drinkData.type} · {drinkData.abv}% ABV · {drinkData.size} mL {drinkData.container.toLowerCase()}
              </p>
            </div>
          </div>

          {/* How much section */}
          <p className="text-[13px] font-bold uppercase tracking-widest text-[#647280] mb-4">
            How much did you drink?
          </p>

          {/* Mode toggle */}
          <div className="mb-4">
            <div className="bg-[#F5F6F8] rounded-xl p-1 flex">
              {modes.map((m) => (
                <button
                  key={m}
                  className="flex-1 h-10 rounded-lg text-[15px] font-semibold transition-all duration-200"
                  style={{
                    backgroundColor: mode === m ? 'white' : 'transparent',
                    color: mode === m ? '#1A5FCC' : '#4A5260',
                    boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.10)' : 'none',
                  }}
                  onClick={() => setMode(m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Combined serving size + quantity card */}
          <div className="bg-[#F5F6F8] rounded-2xl p-5 mb-6">

            {/* Serving size selector — only in serving mode */}
            {isServingMode && (
              <>
                <p className="text-[15px] font-semibold text-[#1C1C1A] mb-2">Serving size</p>
                <div className="relative mb-4">
                  <select
                    className="w-full h-[52px] bg-white rounded-xl px-4 text-[17px] text-[#1C1C1A] outline-none appearance-none focus:ring-2 focus:ring-[#1A5FCC]/30"
                    value={servingIdx}
                    onChange={(e) => setServingIdx(Number(e.target.value))}
                  >
                    {sizes.map((s, i) => <option key={s.label} value={i}>{s.label}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <IcoChevronDown />
                  </div>
                </div>
                <div className="h-px bg-[#E2DDD8] mb-4" />
              </>
            )}

            {/* mL mode: keyboard input + coarse ± buttons */}
            {isMlMode && (
              <div className="flex items-center justify-between">
                <button
                  className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center active:opacity-70 transition-opacity"
                  onClick={() => adjustMl(-50)}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10h12" stroke="#1A5FCC" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
                <div className="flex-1 flex flex-col items-center px-2">
                  <input
                    type="number"
                    inputMode="numeric"
                    value={mlValue}
                    onChange={(e) => setMlValue(e.target.value.replace(/[^0-9]/g, ''))}
                    className="font-display text-[48px] text-[#1C1C1A] leading-none text-center w-full bg-transparent outline-none"
                  />
                  <p className="text-[14px] text-[#56524F] mt-1">mL</p>
                </div>
                <button
                  className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center active:opacity-70 transition-opacity"
                  onClick={() => adjustMl(50)}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 4v12M4 10h12" stroke="#1A5FCC" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            )}

            {/* Serving / Container mode: stepper only */}
            {!isMlMode && (
              <div className="flex items-center justify-between">
                <button
                  className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center active:opacity-70 transition-opacity"
                  onClick={() => isServingMode ? adjustServing(-0.5) : adjustContainer(-0.5)}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10h12" stroke="#1A5FCC" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
                <div className="text-center">
                  <span className="font-display text-[48px] text-[#1C1C1A] leading-none">
                    {(isServingMode ? servingQty : containerQty).toFixed(1)}
                  </span>
                  <p className="text-[14px] text-[#56524F] mt-1">
                    {isContainerMode ? containerLabel : servingUnitLabel}
                  </p>
                </div>
                <button
                  className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center active:opacity-70 transition-opacity"
                  onClick={() => isServingMode ? adjustServing(0.5) : adjustContainer(0.5)}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 4v12M4 10h12" stroke="#1A5FCC" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            )}

          </div>

          {/* Standard drink estimate */}
          <div className="rounded-2xl bg-[#EEF4FF] p-4 mb-6 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[15px] font-semibold text-[#1C1C1A]">Estimated standard drinks</p>
              <p className="text-[13px] text-[#56524F] mt-1 leading-snug">
                Based on the amount selected and {drinkData.abv}% ABV.
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="font-display text-[32px] leading-none text-[#1A5FCC]">{standardDrinks.toFixed(1)}</p>
              <p className="text-[12px] text-[#647280] mt-1">standard drinks</p>
            </div>
          </div>

          {/* Date & Time */}
          <p className="text-[13px] font-bold uppercase tracking-widest text-[#647280] mb-3">
            When did you drink?
          </p>
          <div className="rounded-2xl overflow-hidden border border-[#E2DDD8] divide-y divide-[#E2DDD8] mb-6">
            <div className="relative">
              <button
                className="w-full flex items-center gap-3.5 px-4 py-4 bg-white active:bg-[#F7F8FA] transition-colors"
                onClick={() => openPicker(dateRef)}
              >
                <IcoCalendar />
                <span className="text-[17px] text-[#1C1C1A] flex-1 text-left">Date</span>
                <span className="text-[17px] font-medium text-[#1A5FCC]">{formatDate(dateVal)}</span>
              </button>
              <input
                ref={dateRef}
                type="date"
                value={dateVal}
                max={todayStr}
                onChange={(e) => e.target.value && setDateVal(e.target.value)}
                className="sr-only"
              />
            </div>
            <div className="relative">
              <button
                className="w-full flex items-center gap-3.5 px-4 py-4 bg-white active:bg-[#F7F8FA] transition-colors"
                onClick={() => openPicker(timeRef)}
              >
                <IcoClock />
                <span className="text-[17px] text-[#1C1C1A] flex-1 text-left">Time</span>
                <span className="text-[17px] font-medium text-[#1A5FCC]">{formatTime(timeVal)}</span>
              </button>
              <input
                ref={timeRef}
                type="time"
                value={timeVal}
                onChange={(e) => e.target.value && setTimeVal(e.target.value)}
                className="sr-only"
              />
            </div>
          </div>

          {/* CTA */}
          <button
            className="w-full h-[56px] rounded-2xl bg-[#1A5FCC] text-[17px] font-semibold text-white active:opacity-80 transition-opacity mb-5"
            onClick={handleRecord}
            disabled={consumedMl <= 0 || numericAbv <= 0}
          >
            Record Drink
          </button>

        </div>
      </div>
    </div>
  )
}

// ── Page root ──────────────────────────────────────────────

function step1ToDefinition(data: Step1Data): Omit<DrinkDefinition, 'id'> {
  return {
    name: data.name.trim(),
    category: (drinkTypes.includes(data.type) ? data.type : 'Other') as DrinkCategory,
    abv: Number(data.abv),
    sizeMl: Number(data.size),
    containerType: data.container,
  }
}

function definitionToStep1(drink: DrinkDefinition): Step1Data {
  return {
    name: drink.name,
    type: drink.category,
    abv: String(drink.abv),
    size: String(drink.sizeMl),
    container: drink.containerType,
  }
}

export function ExistingDrinkConsumptionPage({
  drink,
  onBack,
  onRecord,
}: {
  drink: DrinkDefinition
  onBack: () => void
  onRecord: (payload: NewDrinkRecordPayload) => void
}) {
  return (
    <Step2
      drinkData={definitionToStep1(drink)}
      drinkId={drink.id}
      saveToMyDrinks={false}
      showProgress={false}
      backLabel="Back to Record"
      onBack={onBack}
      onRecord={onRecord}
    />
  )
}

export function EditDrinkPage({
  drink,
  onBack,
  onSave,
}: {
  drink: DrinkDefinition
  onBack: () => void
  onSave: (drink: DrinkDefinition) => void
}) {
  return (
    <Step1
      mode="edit"
      initialData={definitionToStep1(drink)}
      onBack={onBack}
      onContinue={(data) => onSave({ id: drink.id, ...step1ToDefinition(data) })}
    />
  )
}

export default function AddDrinkPage({
  onBack,
  onSaveDrink,
  onRecord,
}: {
  onBack: () => void
  onSaveDrink: (drink: Omit<DrinkDefinition, 'id'>, existingId?: string) => DrinkDefinition
  onRecord: (payload: NewDrinkRecordPayload) => void
}) {
  const [step, setStep] = useState<1 | 2>(1)
  const [step1Data, setStep1Data] = useState<Step1Data>({
    name: '', type: 'Wine', abv: '13.5', size: '750', container: 'Bottle',
  })
  const [savedDrink, setSavedDrink] = useState<DrinkDefinition | null>(null)

  if (step === 2) {
    return (
      <Step2
        drinkData={step1Data}
        drinkId={savedDrink?.id}
        saveToMyDrinks={false}
        onBack={() => setStep(1)}
        onRecord={onRecord}
      />
    )
  }

  return (
    <Step1
      initialData={step1Data}
      onBack={onBack}
      onContinue={(data) => {
        const saved = onSaveDrink(step1ToDefinition(data), savedDrink?.id)
        setSavedDrink(saved)
        setStep1Data(data)
        setStep(2)
      }}
    />
  )
}
