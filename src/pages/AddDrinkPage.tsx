import { useEffect, useRef, useState, type ReactNode } from 'react'
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

function IcoChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 6l4 4 4-4" stroke="#4A5260" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MinusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 10h12" stroke="#1A5FCC" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 4v12M4 10h12" stroke="#1A5FCC" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function TopNav({ onBack, label }: { onBack: () => void; label: string }) {
  return (
    <button
      type="button"
      className="responsive-form-inner flex-shrink-0 h-12 flex items-center gap-2 px-5 active:opacity-70 transition-opacity"
      onClick={onBack}
    >
      <BackArrow />
      <span className="text-[17px] font-medium text-[#1A5FCC]">{label}</span>
    </button>
  )
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <p className="text-[17px] font-semibold text-[#1C1C1A] mb-2">{children}</p>
}

// ── Drink details ──────────────────────────────────────────

export type DrinkDetailsData = {
  name: string
  type: string
  abv: string
  size: string
  container: string
}

const drinkTypes = ['Beer', 'Wine', 'Spirits', 'Cider', 'RTD', 'Other']
const servingTypes = ['Bottle', 'Can', 'Glass', 'Shot', 'Schooner', 'Pint', 'Other']

// Drink-type references are examples only. They update placeholder text
// without writing values into the form, so OCR and user-entered data are never overwritten.
const drinkTypeExamples: Record<string, { abv: string; size: string; container: string }> = {
  Beer: { abv: '4.5', size: '375', container: 'Can' },
  Wine: { abv: '13.5', size: '150', container: 'Glass' },
  Spirits: { abv: '40', size: '30', container: 'Shot' },
  Cider: { abv: '4.5', size: '375', container: 'Can' },
  RTD: { abv: '5', size: '375', container: 'Can' },
  Other: { abv: '5', size: '375', container: 'Bottle' },
}

const genericDrinkExamples = { abv: '13.5', size: '150', container: 'Glass' }

function examplesForDrinkType(type: string) {
  return drinkTypeExamples[type] ?? genericDrinkExamples
}

function normalizeDrinkDetails(data: DrinkDetailsData): Omit<DrinkDefinition, 'id'> {
  return {
    name: data.name.trim(),
    category: (drinkTypes.includes(data.type) ? data.type : 'Other') as DrinkCategory,
    abv: Number(data.abv),
    sizeMl: Number(data.size),
    containerType: data.container,
  }
}

function definitionToDrinkDetails(drink: DrinkDefinition): DrinkDetailsData {
  return {
    name: drink.name,
    type: drink.category,
    abv: String(drink.abv),
    size: String(drink.sizeMl),
    container: drink.containerType,
  }
}

function validateDrinkDetails(data: DrinkDetailsData): string | null {
  const abv = Number(data.abv)
  const size = Number(data.size)

  if (!data.name.trim()) return 'Drink name is required.'
  if (!data.type.trim()) return 'Drink type is required.'
  if (!data.abv.trim()) return 'Alcohol strength is required.'
  if (!Number.isFinite(abv) || abv <= 0 || abv > 100) {
    return 'Alcohol strength must be greater than 0 and no more than 100%.'
  }
  if (!data.container.trim()) return 'Serving / container type is required.'
  if (!data.size.trim()) return 'Serving / container size is required.'
  if (!Number.isFinite(size) || size <= 0) {
    return 'Serving / container size must be greater than 0 mL.'
  }
  return null
}

export function DrinkDetailsFields({
  data,
  onChange,
  useContextualExamples,
}: {
  data: DrinkDetailsData
  onChange: (nextData: DrinkDetailsData) => void
  useContextualExamples: boolean
}) {
  const update = (patch: Partial<DrinkDetailsData>) => onChange({ ...data, ...patch })
  const contextualExamples = useContextualExamples
    ? examplesForDrinkType(data.type)
    : genericDrinkExamples

  const handleTypeChange = (nextType: string) => {
    update({ type: nextType })
  }

  return (
    <>
      <div className="mb-4">
        <FieldLabel>Drink name</FieldLabel>
        <input
          className="w-full h-[52px] bg-[#F5F6F8] rounded-xl px-4 text-[18px] text-[#1C1C1A] placeholder:text-[#8A8682] outline-none focus:ring-2 focus:ring-[#1A5FCC]/30"
          placeholder="e.g. Jacob's Creek Shiraz"
          value={data.name}
          onChange={(event) => update({ name: event.target.value })}
        />
      </div>

      <div className="mb-4">
        <FieldLabel>Drink type</FieldLabel>
        <div className="relative">
          <select
            className={`contextual-select w-full h-[52px] bg-[#F5F6F8] rounded-xl px-4 pr-12 text-[18px] outline-none appearance-none focus:ring-2 focus:ring-[#1A5FCC]/30 ${data.type ? 'text-[#1C1C1A]' : 'text-transparent'}`}
            value={data.type}
            onChange={(event) => handleTypeChange(event.target.value)}
            aria-label="Drink type"
          >
            <option value="" disabled hidden aria-hidden="true"></option>
            {drinkTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
          {!data.type && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-[#8A8682] pointer-events-none">
              e.g. Wine
            </span>
          )}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <IcoChevronDown />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <FieldLabel>Alcohol strength</FieldLabel>
        <div className="flex items-center gap-3">
          <input
            className="flex-1 h-[52px] bg-[#F5F6F8] rounded-xl px-4 text-[18px] text-[#1C1C1A] placeholder:text-[#8A8682] outline-none focus:ring-2 focus:ring-[#1A5FCC]/30"
            type="number"
            inputMode="decimal"
            min="0"
            max="100"
            step="0.1"
            placeholder={`e.g. ${contextualExamples.abv}`}
            value={data.abv}
            onChange={(event) => update({ abv: event.target.value })}
          />
          <div className="h-[52px] px-4 bg-[#EEEDF3] rounded-xl flex items-center">
            <span className="text-[18px] font-medium text-[#4A5260]">% ABV</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <FieldLabel>Serving / container type</FieldLabel>
        <div className="relative">
          <select
            className={`contextual-select w-full h-[52px] bg-[#F5F6F8] rounded-xl px-4 pr-12 text-[18px] outline-none appearance-none focus:ring-2 focus:ring-[#1A5FCC]/30 ${data.container ? 'text-[#1C1C1A]' : 'text-transparent'}`}
            value={data.container}
            onChange={(event) => update({ container: event.target.value })}
            aria-label="Serving or container type"
          >
            <option value="" disabled hidden aria-hidden="true"></option>
            {servingTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
          {!data.container && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-[#8A8682] pointer-events-none">
              {`e.g. ${contextualExamples.container}`}
            </span>
          )}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <IcoChevronDown />
          </div>
        </div>
      </div>

      <div className="mb-3">
        <FieldLabel>Serving / container size</FieldLabel>
        <div className="flex items-center gap-3">
          <input
            className="flex-1 h-[52px] bg-[#F5F6F8] rounded-xl px-4 text-[18px] text-[#1C1C1A] placeholder:text-[#8A8682] outline-none focus:ring-2 focus:ring-[#1A5FCC]/30"
            type="number"
            inputMode="decimal"
            min="0"
            step="1"
            placeholder={`e.g. ${contextualExamples.size}`}
            value={data.size}
            onChange={(event) => update({ size: event.target.value })}
          />
          <div className="h-[52px] px-4 bg-[#EEEDF3] rounded-xl flex items-center">
            <span className="text-[18px] font-medium text-[#4A5260]">mL</span>
          </div>
        </div>
      </div>

      <p className="text-[16px] text-[#647280] leading-relaxed mb-7">
        This defines one serving for quick recording below, for example 1 glass = 150 mL or 1 can = 375 mL.
      </p>
    </>
  )
}

// ── Consumption controls ───────────────────────────────────

type AmountMode = 'serving' | 'ml'

function singularize(label: string) {
  return label.trim() || 'Serving'
}

function pluralize(label: string, quantity: number) {
  if (Math.abs(quantity - 1) < 0.0001) return singularize(label)
  const normalized = singularize(label)
  if (normalized.endsWith('s')) return normalized
  return `${normalized}s`
}

function AmountStepper({
  value,
  onChange,
  onDecrease,
  onIncrease,
  unit,
  inputMode = 'decimal',
}: {
  value: string
  onChange: (value: string) => void
  onDecrease: () => void
  onIncrease: () => void
  unit: string
  inputMode?: 'decimal' | 'numeric'
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <button
        type="button"
        className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center active:opacity-70 transition-opacity flex-shrink-0"
        onClick={onDecrease}
        aria-label={`Decrease ${unit}`}
      >
        <MinusIcon />
      </button>

      <div className="flex-1 min-w-0 flex flex-col items-center px-1">
        <input
          type="number"
          inputMode={inputMode}
          min="0"
          step="any"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="font-display text-[46px] text-[#1C1C1A] leading-none text-center w-full bg-transparent outline-none"
          aria-label={`Amount in ${unit}`}
        />
        <p className="text-[16px] text-[#56524F] mt-1 text-center">{unit}</p>
      </div>

      <button
        type="button"
        className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center active:opacity-70 transition-opacity flex-shrink-0"
        onClick={onIncrease}
        aria-label={`Increase ${unit}`}
      >
        <PlusIcon />
      </button>
    </div>
  )
}

function DrinkSummary({ drinkData }: { drinkData: DrinkDetailsData }) {
  return (
    <div className="bg-[#F5F6F8] rounded-2xl p-4 mb-6">
      <p className="text-[18px] font-semibold text-[#1C1C1A] leading-tight truncate">
        {drinkData.name || 'Drink'}
      </p>
      <p className="text-[15px] text-[#56524F] mt-1 leading-snug">
        {drinkData.type} · {drinkData.abv}% ABV · {drinkData.size} mL {drinkData.container.toLowerCase()}
      </p>
    </div>
  )
}

function openNativePicker(input: HTMLInputElement) {
  // Keep the real native input clickable for iOS/Android, while explicitly
  // opening the picker on desktop browsers that support showPicker().
  if (typeof input.showPicker === 'function') {
    try {
      input.showPicker()
    } catch {
      // Some browsers already open their native picker from the same click.
      // In that case, fall back to the browser's default input behaviour.
    }
  }
}

function ConsumptionSection({
  drinkData,
  drinkId,
  onRecord,
  allowSaveToMyDrinks,
  alreadySavedToMyDrinks = false,
  onValidationError,
}: {
  drinkData: DrinkDetailsData
  drinkId?: string
  onRecord: (payload: NewDrinkRecordPayload) => void
  allowSaveToMyDrinks: boolean
  alreadySavedToMyDrinks?: boolean
  onValidationError?: (message: string) => void
}) {
  const [mode, setMode] = useState<AmountMode>('serving')
  const [servingQty, setServingQty] = useState('1.0')
  const [mlValue, setMlValue] = useState(drinkData.size || '0')
  const mlEdited = useRef(false)
  const [saveToMyDrinks, setSaveToMyDrinks] = useState(false)

  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const [dateVal, setDateVal] = useState(todayStr)
  const [timeVal, setTimeVal] = useState(() => {
    const now = new Date()
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  })

  useEffect(() => {
    if (!mlEdited.current) setMlValue(drinkData.size || '0')
  }, [drinkData.size])

  const numericServingSize = Number(drinkData.size)
  const numericAbv = Number(drinkData.abv)
  const numericServingQty = Number(servingQty)
  const numericMl = Number(mlValue)
  const consumedMl = mode === 'serving'
    ? (Number.isFinite(numericServingSize) && Number.isFinite(numericServingQty) ? numericServingSize * numericServingQty : 0)
    : (Number.isFinite(numericMl) ? numericMl : 0)
  const standardDrinks = roundStandardDrinks(calculateStandardDrinks(consumedMl, numericAbv))
  const servingUnit = singularize(drinkData.container)

  const adjustServing = (delta: number) => {
    const current = Number(servingQty)
    const next = Math.max(0, Math.round(((Number.isFinite(current) ? current : 0) + delta) * 2) / 2)
    setServingQty(next.toFixed(1))
  }

  const adjustMl = (delta: number) => {
    mlEdited.current = true
    const current = Number(mlValue)
    const next = Math.max(0, Math.round((Number.isFinite(current) ? current : 0) + delta))
    setMlValue(String(next))
  }

  const formatDate = (value: string) => {
    if (value === todayStr) return 'Today'
    const [year, month, day] = value.split('-').map(Number)
    return new Date(year, month - 1, day).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatTime = (value: string) => {
    const [hours, minutes] = value.split(':').map(Number)
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const h12 = hours % 12 || 12
    return `${h12}:${String(minutes).padStart(2, '0')} ${ampm}`
  }

  const handleRecord = () => {
    const detailsError = validateDrinkDetails(drinkData)
    if (detailsError) {
      onValidationError?.(detailsError)
      return
    }

    if (mode === 'serving' && (!Number.isFinite(numericServingQty) || numericServingQty <= 0)) {
      onValidationError?.('Enter a serving amount greater than 0.')
      return
    }
    if (mode === 'ml' && (!Number.isFinite(numericMl) || numericMl <= 0)) {
      onValidationError?.('Enter an amount greater than 0 mL.')
      return
    }

    const drink = normalizeDrinkDetails(drinkData)
    onRecord({
      drinkId,
      saveToMyDrinks: allowSaveToMyDrinks && saveToMyDrinks,
      drink,
      consumption: {
        mode,
        consumedMl,
        quantity: mode === 'serving' ? numericServingQty : consumedMl,
        servingSizeMl: mode === 'serving' ? drink.sizeMl : undefined,
        servingLabel: mode === 'serving' ? servingUnit : undefined,
        date: dateVal,
        time: timeVal,
        standardDrinks,
      },
    })
  }

  return (
    <>
      <p className="text-[16px] font-bold uppercase tracking-widest text-[#647280] mb-4">
        How much did you drink?
      </p>

      <div className="mb-4">
        <div className="bg-[#F5F6F8] rounded-xl p-1 flex">
          <button
            type="button"
            className="flex-1 min-h-11 rounded-lg text-[17px] font-semibold transition-all duration-200"
            style={{
              backgroundColor: mode === 'serving' ? 'white' : 'transparent',
              color: mode === 'serving' ? '#1A5FCC' : '#4A5260',
              boxShadow: mode === 'serving' ? '0 1px 4px rgba(0,0,0,0.10)' : 'none',
            }}
            onClick={() => setMode('serving')}
          >
            By serving
          </button>
          <button
            type="button"
            className="flex-1 min-h-11 rounded-lg text-[17px] font-semibold transition-all duration-200"
            style={{
              backgroundColor: mode === 'ml' ? 'white' : 'transparent',
              color: mode === 'ml' ? '#1A5FCC' : '#4A5260',
              boxShadow: mode === 'ml' ? '0 1px 4px rgba(0,0,0,0.10)' : 'none',
            }}
            onClick={() => setMode('ml')}
          >
            By mL
          </button>
        </div>
      </div>

      <div className="bg-[#F5F6F8] rounded-2xl p-5 mb-6">
        {mode === 'serving' ? (
          <>
            <p className="text-[16px] text-[#647280] text-center mb-4">
              1 {servingUnit.toLowerCase()} = {drinkData.size || '0'} mL
            </p>
            <AmountStepper
              value={servingQty}
              onChange={setServingQty}
              onDecrease={() => adjustServing(-0.5)}
              onIncrease={() => adjustServing(0.5)}
              unit={pluralize(servingUnit, numericServingQty)}
            />
          </>
        ) : (
          <AmountStepper
            value={mlValue}
            onChange={(value) => {
              mlEdited.current = true
              setMlValue(value)
            }}
            onDecrease={() => adjustMl(-50)}
            onIncrease={() => adjustMl(50)}
            unit="mL"
            inputMode="numeric"
          />
        )}
      </div>

      <div className="rounded-2xl bg-[#EEF4FF] p-4 mb-6 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[17px] font-semibold text-[#1C1C1A]">Estimated standard drinks</p>
          <p className="text-[16px] text-[#56524F] mt-1 leading-snug">
            Based on {Math.round(consumedMl * 10) / 10} mL consumed and {drinkData.abv || '0'}% ABV.
          </p>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="font-display text-[32px] leading-none text-[#1A5FCC]">{standardDrinks.toFixed(1)}</p>
          <p className="text-[15px] text-[#647280] mt-1">standard drinks</p>
        </div>
      </div>

      <p className="text-[16px] font-bold uppercase tracking-widest text-[#647280] mb-3">
        When did you drink?
      </p>
      <div className="rounded-2xl overflow-hidden border border-[#E2DDD8] divide-y divide-[#E2DDD8] mb-6">
        <label className="relative block bg-white active:bg-[#F7F8FA] transition-colors cursor-pointer">
          <div className="w-full flex items-center gap-3.5 px-4 py-4 pointer-events-none">
            <IcoCalendar />
            <span className="text-[17px] text-[#1C1C1A] flex-1 text-left">Date</span>
            <span className="text-[17px] font-medium text-[#1A5FCC]">{formatDate(dateVal)}</span>
          </div>
          <input
            type="date"
            value={dateVal}
            max={todayStr}
            onClick={(event) => openNativePicker(event.currentTarget)}
            onChange={(event) => event.target.value && setDateVal(event.target.value)}
            className="absolute inset-0 z-10 h-full w-full opacity-0 cursor-pointer"
            aria-label="Date"
          />
        </label>
        <label className="relative block bg-white active:bg-[#F7F8FA] transition-colors cursor-pointer">
          <div className="w-full flex items-center gap-3.5 px-4 py-4 pointer-events-none">
            <IcoClock />
            <span className="text-[17px] text-[#1C1C1A] flex-1 text-left">Time</span>
            <span className="text-[17px] font-medium text-[#1A5FCC]">{formatTime(timeVal)}</span>
          </div>
          <input
            type="time"
            value={timeVal}
            onClick={(event) => openNativePicker(event.currentTarget)}
            onChange={(event) => event.target.value && setTimeVal(event.target.value)}
            className="absolute inset-0 z-10 h-full w-full opacity-0 cursor-pointer"
            aria-label="Time"
          />
        </label>
      </div>

      {allowSaveToMyDrinks && (
        <label className="flex items-start gap-3 rounded-2xl border border-[#D8E3F2] bg-[#F8FBFF] px-4 py-4 mb-6 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 w-5 h-5 accent-[#1A5FCC] flex-shrink-0"
            checked={saveToMyDrinks}
            onChange={(event) => setSaveToMyDrinks(event.target.checked)}
          />
          <span>
            <span className="block text-[17px] font-semibold text-[#1C1C1A]">Save this drink to My Drinks</span>
            <span className="block text-[16px] text-[#647280] leading-relaxed mt-0.5">Save these drink details so you can record it faster next time.</span>
          </span>
        </label>
      )}

      {alreadySavedToMyDrinks && (
        <div className="rounded-2xl bg-[#F5F6F8] px-4 py-3 mb-6">
          <p className="text-[16px] font-medium text-[#56524F]">This drink is already saved in My Drinks.</p>
        </div>
      )}

      <button
        type="button"
        className="w-full h-[56px] rounded-2xl bg-[#1A5FCC] text-[17px] font-semibold text-white active:opacity-80 transition-opacity mb-5 disabled:bg-[#D0D9E8] disabled:text-[#8A9AB8]"
        onClick={handleRecord}
        disabled={consumedMl <= 0 || numericAbv <= 0}
      >
        Record Drink
      </button>
    </>
  )
}

function ValidationToast({ message }: { message: string | null }) {
  return (
    <div
      className="absolute left-4 right-4 bottom-[96px] pointer-events-none z-20"
      style={{
        transition: 'opacity 0.25s, transform 0.25s',
        opacity: message ? 1 : 0,
        transform: message ? 'translateY(0)' : 'translateY(10px)',
      }}
    >
      <div className="flex items-start gap-3 bg-[#1C1C1A] rounded-2xl px-4 py-4 shadow-xl">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-0.5">
          <circle cx="10" cy="10" r="9" stroke="#FF6B6B" strokeWidth="1.6" />
          <path d="M10 6v5" stroke="#FF6B6B" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="10" cy="14" r="0.8" fill="#FF6B6B" />
        </svg>
        <p className="text-[15px] text-white leading-snug">{message}</p>
      </div>
    </div>
  )
}

// ── Existing database / My Drinks recording ──────────────

export function ExistingDrinkConsumptionPage({
  drink,
  onBack,
  onRecord,
  allowSaveToMyDrinks = false,
  alreadySavedToMyDrinks = false,
}: {
  drink: DrinkDefinition
  onBack: () => void
  onRecord: (payload: NewDrinkRecordPayload) => void
  allowSaveToMyDrinks?: boolean
  alreadySavedToMyDrinks?: boolean
}) {
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const showValidationError = (message: string) => {
    setToast(message)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3500)
  }

  const drinkData = definitionToDrinkDetails(drink)

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      <TopNav onBack={onBack} label="Back to Record" />

      <div className="flex-1 overflow-y-auto hide-scrollbar app-scroll-nav-clearance">
        <div className="responsive-form-inner px-5">
          <div className="pb-4">
            <h1 className="font-display text-[30px] text-[#1C1C1A] leading-tight">Record Consumption</h1>
            <p className="text-[15px] text-[#56524F] mt-1">Tell us how much you drank.</p>
          </div>
          <DrinkSummary drinkData={drinkData} />
          <ConsumptionSection
            drinkData={drinkData}
            drinkId={drink.id}
            onRecord={onRecord}
            allowSaveToMyDrinks={allowSaveToMyDrinks}
            alreadySavedToMyDrinks={alreadySavedToMyDrinks}
            onValidationError={showValidationError}
          />
        </div>
      </div>

      <ValidationToast message={toast} />
    </div>
  )
}

// ── My Drinks editor ───────────────────────────────────────

export function EditDrinkPage({
  drink,
  onBack,
  onSave,
}: {
  drink: DrinkDefinition
  onBack: () => void
  onSave: (drink: DrinkDefinition) => void
}) {
  const [data, setData] = useState<DrinkDetailsData>(() => definitionToDrinkDetails(drink))
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const save = () => {
    const error = validateDrinkDetails(data)
    if (error) {
      setToast(error)
      if (toastTimer.current) clearTimeout(toastTimer.current)
      toastTimer.current = setTimeout(() => setToast(null), 3500)
      return
    }
    onSave({ id: drink.id, ...normalizeDrinkDetails(data) })
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      <TopNav onBack={onBack} label="Back to My Drinks" />

      <div className="flex-1 overflow-y-auto hide-scrollbar app-scroll-nav-clearance">
        <div className="responsive-form-inner px-5">
          <div className="pb-4">
            <h1 className="font-display text-[30px] text-[#1C1C1A] leading-tight">Edit Drink</h1>
            <p className="text-[15px] text-[#56524F] mt-1">Update the reusable drink details saved in My Drinks.</p>
          </div>
          <p className="text-[15px] font-bold uppercase tracking-widest text-[#647280] mb-4">Drink Details</p>
          <DrinkDetailsFields data={data} onChange={setData} useContextualExamples={false} />
          <button
            type="button"
            className="w-full h-[56px] rounded-2xl bg-[#1A5FCC] text-[17px] font-semibold text-white active:opacity-80 transition-opacity mb-5"
            onClick={save}
          >
            Save Changes
          </button>
        </div>
      </div>

      <ValidationToast message={toast} />
    </div>
  )
}

// ── Manual recording page ──────────────────────────────────

export default function AddDrinkPage({
  onBack,
  onRecord,
}: {
  onBack: () => void
  onRecord: (payload: NewDrinkRecordPayload) => void
}) {
  const [drinkData, setDrinkData] = useState<DrinkDetailsData>({
    name: '',
    type: '',
    abv: '',
    size: '',
    container: '',
  })
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const labelImageInputRef = useRef<HTMLInputElement>(null)
  const labelScanTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [labelScanStatus, setLabelScanStatus] = useState<'idle' | 'reading' | 'success'>('idle')

  useEffect(() => () => {
    if (labelScanTimer.current) clearTimeout(labelScanTimer.current)
  }, [])

  const openLabelImagePicker = () => {
    if (labelScanStatus === 'reading') return
    labelImageInputRef.current?.click()
  }

  const handleLabelImageSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLabelScanStatus('reading')
    if (labelScanTimer.current) clearTimeout(labelScanTimer.current)

    // Prototype behaviour: simulate OCR after the user provides an image.
    // Production implementation will replace this timer with the OCR service.
    labelScanTimer.current = setTimeout(() => {
      setDrinkData({
        name: "Jacob's Creek Shiraz",
        type: 'Wine',
        abv: '13.5',
        size: '750',
        container: 'Bottle',
      })
      setLabelScanStatus('success')
      event.target.value = ''
    }, 1100)
  }

  const showValidationError = (message: string) => {
    setToast(message)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3500)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      <TopNav onBack={onBack} label="Back to Record" />

      <div className="flex-1 overflow-y-auto hide-scrollbar app-scroll-nav-clearance">
        <div className="responsive-form-inner px-5">
          <div className="pb-4">
            <h1 className="font-display text-[34px] text-[#1C1C1A] leading-tight">Record a Drink</h1>
            <p className="text-[17px] text-[#56524F] mt-1">Enter the drink details and how much you drank.</p>
          </div>

          <div className="bg-[#F5F6F8] rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M7 2H4a2 2 0 0 0-2 2v3M13 2h3a2 2 0 0 1 2 2v3M7 18H4a2 2 0 0 1-2-2v-3M13 18h3a2 2 0 0 0 2-2v-3" stroke="#647280" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="10" cy="10" r="2.5" stroke="#647280" strokeWidth="1.6" />
              </svg>
              <p className="text-[19px] font-semibold text-[#1C1C1A]">Scan drink label</p>
            </div>
            <p className="text-[17px] text-[#56524F] leading-relaxed mb-4">
              Take or upload a photo of the label to help fill in the drink details automatically.
            </p>

            <input
              ref={labelImageInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleLabelImageSelected}
              aria-label="Choose a drink label image"
            />

            <button
              type="button"
              className="w-full h-[52px] rounded-xl text-[17px] font-semibold border border-[#C9D7EB] text-[#1A5FCC] bg-white active:bg-[#F8FBFF] transition-colors disabled:text-[#6F7F95] disabled:bg-[#EEF2F7] disabled:cursor-wait flex items-center justify-center gap-2"
              onClick={openLabelImagePicker}
              disabled={labelScanStatus === 'reading'}
            >
              {labelScanStatus === 'reading' ? (
                <>
                  <span className="inline-block w-4 h-4 rounded-full border-2 border-[#9BB5DB] border-t-[#1A5FCC] animate-spin" aria-hidden="true" />
                  <span>Reading label…</span>
                </>
              ) : (
                <span>{labelScanStatus === 'success' ? 'Scan another label' : 'Scan Label'}</span>
              )}
            </button>

            {labelScanStatus === 'success' && (
              <div className="mt-3 min-h-[64px] rounded-xl bg-[#EAF7EF] px-4 py-4 flex items-center gap-3" role="status">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
                  <circle cx="10" cy="10" r="9" fill="#2D8A57" />
                  <path d="M6 10.2L8.7 13L14.2 7.4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-[16px] font-medium text-[#245D3D] leading-relaxed">
                  Label details added. Please check the details below before continuing.
                </p>
              </div>
            )}
          </div>

          <p className="text-[16px] font-bold uppercase tracking-widest text-[#647280] mb-4">Drink Details</p>
          <DrinkDetailsFields data={drinkData} onChange={setDrinkData} useContextualExamples />

          <div className="h-px bg-[#E8E4DF] mb-7" />

          <ConsumptionSection
            drinkData={drinkData}
            onRecord={onRecord}
            allowSaveToMyDrinks
            onValidationError={showValidationError}
          />
        </div>
      </div>

      <ValidationToast message={toast} />
    </div>
  )
}
