import { useEffect, useMemo, useState } from 'react'
import type { ConsumptionRecord, DrinkCategory } from '@/types/alcohol'
import { DrinkDetailsFields, TopNav, type DrinkDetailsData } from '@/pages/AddDrinkPage'
import { calculateStandardDrinks, roundStandardDrinks } from '@/utils/alcohol'

type HistoryTrendsTab = 'history' | 'trends' | 'report'
type TrendPeriod = '7d' | '4w'

type Props = {
  records: ConsumptionRecord[]
  onUpdateRecord: (record: ConsumptionRecord) => void
  onDeleteRecord: (recordId: string) => void
  onLoadPrototypeData?: () => void
}

type DailyTotal = {
  date: string
  total: number
}

const DAY_MS = 24 * 60 * 60 * 1000
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function parseDateOnly(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function formatDateOnly(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addDays(date: Date, days: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function startOfToday() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

function formatMonthLabel(year: number, month: number) {
  return `${MONTH_NAMES[month]} ${year}`
}

function formatHistoryDate(dateValue: string) {
  return parseDateOnly(dateValue).toLocaleDateString('en-AU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

function formatReportDate(dateValue: string) {
  return parseDateOnly(dateValue).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatTime(time: string) {
  if (!/^\d{2}:\d{2}$/.test(time)) return time
  const [hour, minute] = time.split(':').map(Number)
  const date = new Date(2000, 0, 1, hour, minute)
  return date.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' })
}

function getDailyTotals(records: ConsumptionRecord[]) {
  const totals = new Map<string, number>()
  records.forEach((record) => {
    totals.set(record.date, (totals.get(record.date) ?? 0) + record.standardDrinks)
  })
  return Array.from(totals.entries())
    .map(([date, total]) => ({ date, total: roundStandardDrinks(total, 1) }))
    .sort((a, b) => b.date.localeCompare(a.date))
}

function getRecordsInRange(records: ConsumptionRecord[], start: Date, end: Date) {
  const startValue = formatDateOnly(start)
  const endValue = formatDateOnly(end)
  return records.filter((record) => record.date >= startValue && record.date <= endValue)
}

function getPeriodLabel(period: TrendPeriod) {
  return period === '7d' ? 'Past 7 days' : 'Past 4 weeks'
}

function percentChange(current: number, previous: number) {
  if (previous <= 0) return null
  return ((current - previous) / previous) * 100
}

function comparisonCopy(change: number | null, period: TrendPeriod) {
  const previousLabel = period === '7d' ? 'previous 7 days' : 'previous 4 weeks'
  if (change === null) return `Not enough earlier data to compare with the ${previousLabel}.`
  if (Math.abs(change) < 5) return `About the same as the ${previousLabel}.`
  const rounded = Math.round(Math.abs(change))
  return change < 0
    ? `${rounded}% lower than the ${previousLabel}.`
    : `${rounded}% higher than the ${previousLabel}.`
}

function mostCommonDay(records: ConsumptionRecord[]) {
  if (records.length === 0) return 'Not enough data'
  const totals = new Map<number, number>()
  records.forEach((record) => {
    const day = parseDateOnly(record.date).getDay()
    totals.set(day, (totals.get(day) ?? 0) + 1)
  })
  const winner = Array.from(totals.entries()).sort((a, b) => b[1] - a[1])[0]?.[0]
  if (winner === undefined) return 'Not enough data'
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][winner]
}

function mostCommonTime(records: ConsumptionRecord[]) {
  const buckets = new Map<number, number>()
  records.forEach((record) => {
    if (!/^\d{2}:\d{2}$/.test(record.time)) return
    const [hour, minute] = record.time.split(':').map(Number)
    const roundedMinutes = Math.round((hour * 60 + minute) / 30) * 30
    buckets.set(roundedMinutes, (buckets.get(roundedMinutes) ?? 0) + 1)
  })
  const winner = Array.from(buckets.entries()).sort((a, b) => b[1] - a[1])[0]?.[0]
  if (winner === undefined) return 'Not enough data'
  const minutesInDay = winner % (24 * 60)
  const hour = Math.floor(minutesInDay / 60)
  const minute = minutesInDay % 60
  const date = new Date(2000, 0, 1, hour, minute)
  return `Around ${date.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' })}`
}

function buildFourWeekBuckets(records: ConsumptionRecord[], end: Date) {
  const reportStart = addDays(end, -27)
  const values = Array.from({ length: 4 }, (_, index) => {
    const start = addDays(reportStart, index * 7)
    const weekEnd = addDays(start, 6)
    const weekRecords = getRecordsInRange(records, start, weekEnd)
    return {
      label: `W${index + 1}`,
      total: roundStandardDrinks(weekRecords.reduce((sum, record) => sum + record.standardDrinks, 0), 1),
    }
  })
  return { start: reportStart, end, values }
}

function recordToDrinkDetails(record: ConsumptionRecord): DrinkDetailsData {
  return {
    name: record.drinkName,
    type: record.category,
    abv: String(record.abv),
    size: String(record.containerSizeMl),
    container: record.containerType,
  }
}

function singularizeServing(label: string) {
  return label.trim() || 'Serving'
}

function pluralizeServing(label: string, quantity: number) {
  if (Math.abs(quantity - 1) < 0.0001) return singularizeServing(label)
  const normalized = singularizeServing(label)
  return normalized.endsWith('s') ? normalized : `${normalized}s`
}

function openNativePicker(input: HTMLInputElement) {
  if (typeof input.showPicker === 'function') {
    try {
      input.showPicker()
    } catch {
      // The native control may already be opening from the same click.
    }
  }
}

function EditMinusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10h12" stroke="#1A5FCC" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function EditPlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 4v12M4 10h12" stroke="#1A5FCC" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function EditCalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3" y="4.5" width="14" height="12.5" rx="2" stroke="#647280" strokeWidth="1.6" />
      <path d="M6 2.5v4M14 2.5v4M3 8h14" stroke="#647280" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function EditClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7" stroke="#647280" strokeWidth="1.6" />
      <path d="M10 6v4l2.8 1.8" stroke="#647280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function EditAmountStepper({
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
        <EditMinusIcon />
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
        <EditPlusIcon />
      </button>
    </div>
  )
}

function EditHistoryRecordPage({
  record,
  onBack,
  onSave,
}: {
  record: ConsumptionRecord
  onBack: () => void
  onSave: (record: ConsumptionRecord) => void
}) {
  const isDatabaseRecord = record.recordSource === 'database'
  const [drinkData, setDrinkData] = useState<DrinkDetailsData>(() => recordToDrinkDetails(record))
  const [mode, setMode] = useState<'serving' | 'ml'>(record.mode === 'ml' ? 'ml' : 'serving')
  const initialServingSize = record.servingSizeMl ?? record.containerSizeMl
  const initialServingQty = record.mode !== 'ml'
    ? record.quantity
    : (initialServingSize > 0 ? record.consumedMl / initialServingSize : 1)
  const [servingQty, setServingQty] = useState(String(Math.round(initialServingQty * 2) / 2))
  const [mlValue, setMlValue] = useState(String(record.consumedMl))
  const [dateVal, setDateVal] = useState(record.date)
  const [timeVal, setTimeVal] = useState(record.time)
  const [error, setError] = useState<string | null>(null)

  const numericAbv = Number(drinkData.abv)
  const servingSize = Number(drinkData.size)
  const numericServingQty = Number(servingQty)
  const numericMl = Number(mlValue)
  const consumedMl = mode === 'serving'
    ? (Number.isFinite(servingSize) && Number.isFinite(numericServingQty) ? servingSize * numericServingQty : 0)
    : (Number.isFinite(numericMl) ? numericMl : 0)
  const standardDrinks = roundStandardDrinks(calculateStandardDrinks(consumedMl, numericAbv), 2)
  const servingUnit = singularizeServing(drinkData.container)

  const adjustServing = (delta: number) => {
    const current = Number(servingQty)
    const next = Math.max(0, Math.round(((Number.isFinite(current) ? current : 0) + delta) * 2) / 2)
    setServingQty(String(next))
  }

  const adjustMl = (delta: number) => {
    const current = Number(mlValue)
    const next = Math.max(0, Math.round((Number.isFinite(current) ? current : 0) + delta))
    setMlValue(String(next))
  }

  const formatDateLabel = (value: string) => {
    const today = startOfToday()
    if (value === formatDateOnly(today)) return 'Today'
    return parseDateOnly(value).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const save = () => {
    if (!isDatabaseRecord) {
      if (!drinkData.name.trim()) return setError('Enter a drink name.')
      if (!drinkData.type) return setError('Select a drink type.')
      if (!Number.isFinite(numericAbv) || numericAbv <= 0 || numericAbv > 100) return setError('Enter a valid alcohol strength.')
      if (!drinkData.container) return setError('Select a serving or container type.')
      if (!Number.isFinite(servingSize) || servingSize <= 0) return setError('Enter a valid serving or container size.')
    }
    if (consumedMl <= 0) return setError('Enter an amount greater than 0.')

    onSave({
      ...record,
      drinkName: isDatabaseRecord ? record.drinkName : drinkData.name.trim(),
      category: isDatabaseRecord ? record.category : (drinkData.type as DrinkCategory),
      abv: isDatabaseRecord ? record.abv : numericAbv,
      containerSizeMl: isDatabaseRecord ? record.containerSizeMl : servingSize,
      containerType: isDatabaseRecord ? record.containerType : drinkData.container,
      mode,
      consumedMl,
      quantity: mode === 'serving' ? numericServingQty : consumedMl,
      servingSizeMl: mode === 'serving' ? (isDatabaseRecord ? record.containerSizeMl : servingSize) : undefined,
      servingLabel: mode === 'serving' ? (isDatabaseRecord ? record.containerType : servingUnit) : undefined,
      date: dateVal,
      time: timeVal,
      standardDrinks,
    })
  }

  const todayValue = formatDateOnly(startOfToday())

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative bg-white">
      <TopNav onBack={onBack} label="Back to History" />
      <div className="flex-1 overflow-y-auto hide-scrollbar app-scroll-nav-clearance">
        <div className="responsive-form-inner px-5">
          <div className="pb-4">
            <h1 className="font-display text-[34px] text-[#1C1C1A] leading-tight">Edit Record</h1>
            <p className="text-[17px] text-[#56524F] mt-1">Update this drinking record.</p>
          </div>

          {isDatabaseRecord ? (
            <div className="bg-[#F5F6F8] rounded-2xl p-4 mb-6">
              <p className="text-[18px] font-semibold text-[#1C1C1A] leading-tight">{record.drinkName}</p>
              <p className="text-[15px] text-[#56524F] mt-1 leading-snug">
                {record.category} · {record.abv}% ABV · {record.containerSizeMl} mL {record.containerType.toLowerCase()}
              </p>
            </div>
          ) : (
            <>
              <p className="text-[16px] font-bold uppercase tracking-widest text-[#647280] mb-4">Drink Details</p>
              <DrinkDetailsFields data={drinkData} onChange={setDrinkData} useContextualExamples />
            </>
          )}

          <p className="text-[16px] font-bold uppercase tracking-widest text-[#647280] mb-4">How much did you drink?</p>
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
                  1 {servingUnit.toLowerCase()} = {isDatabaseRecord ? record.containerSizeMl : (drinkData.size || '0')} mL
                </p>
                <EditAmountStepper
                  value={servingQty}
                  onChange={setServingQty}
                  onDecrease={() => adjustServing(-0.5)}
                  onIncrease={() => adjustServing(0.5)}
                  unit={pluralizeServing(servingUnit, numericServingQty)}
                />
              </>
            ) : (
              <EditAmountStepper
                value={mlValue}
                onChange={setMlValue}
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
                Based on {Math.round(consumedMl * 10) / 10} mL consumed and {Number.isFinite(numericAbv) ? numericAbv : 0}% ABV.
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="font-display text-[32px] leading-none text-[#1A5FCC]">{standardDrinks.toFixed(1)}</p>
              <p className="text-[15px] text-[#647280] mt-1">standard drinks</p>
            </div>
          </div>

          <p className="text-[16px] font-bold uppercase tracking-widest text-[#647280] mb-3">When did you drink?</p>
          <div className="rounded-2xl overflow-hidden border border-[#E2DDD8] divide-y divide-[#E2DDD8] mb-6">
            <label className="relative block bg-white active:bg-[#F7F8FA] transition-colors cursor-pointer">
              <div className="w-full flex items-center gap-3.5 px-4 py-4 pointer-events-none">
                <EditCalendarIcon />
                <span className="text-[17px] text-[#1C1C1A] flex-1 text-left">Date</span>
                <span className="text-[17px] font-medium text-[#1A5FCC]">{formatDateLabel(dateVal)}</span>
              </div>
              <input
                type="date"
                value={dateVal}
                max={todayValue}
                onClick={(event) => openNativePicker(event.currentTarget)}
                onChange={(event) => event.target.value && setDateVal(event.target.value)}
                className="absolute inset-0 z-10 h-full w-full opacity-0 cursor-pointer"
                aria-label="Date"
              />
            </label>
            <label className="relative block bg-white active:bg-[#F7F8FA] transition-colors cursor-pointer">
              <div className="w-full flex items-center gap-3.5 px-4 py-4 pointer-events-none">
                <EditClockIcon />
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

          {error && <p className="rounded-xl bg-[#FFF3F1] px-4 py-3 text-[16px] text-[#A83B35] mb-4">{error}</p>}
          <button
            type="button"
            className="w-full h-[56px] rounded-2xl bg-[#1A5FCC] text-[17px] font-semibold text-white active:opacity-80 transition-opacity mb-5"
            onClick={save}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

type HistoryTabProps = Props & {
  onEditRecord: (record: ConsumptionRecord) => void
}

function HistoryTab({
  records,
  onDeleteRecord,
  onLoadPrototypeData,
  onEditRecord,
}: HistoryTabProps) {
  const latestRecordDate = records.length > 0
    ? parseDateOnly([...records].sort((a, b) => b.date.localeCompare(a.date))[0].date)
    : startOfToday()
  const [viewYear, setViewYear] = useState(latestRecordDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(latestRecordDate.getMonth())
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [draftYear, setDraftYear] = useState(viewYear)
  const [draftMonth, setDraftMonth] = useState(viewMonth)
  const [openActionsId, setOpenActionsId] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<ConsumptionRecord | null>(null)

  useEffect(() => {
    setDraftYear(viewYear)
    setDraftMonth(viewMonth)
  }, [viewMonth, viewYear])

  const monthRecords = useMemo(() => {
    return records
      .filter((record) => {
        const date = parseDateOnly(record.date)
        return date.getFullYear() === viewYear && date.getMonth() === viewMonth
      })
      .sort((a, b) => {
        if (a.date !== b.date) return b.date.localeCompare(a.date)
        return b.time.localeCompare(a.time)
      })
  }, [records, viewMonth, viewYear])

  const groupedRecords = useMemo(() => {
    const groups = new Map<string, ConsumptionRecord[]>()
    monthRecords.forEach((record) => {
      const list = groups.get(record.date) ?? []
      list.push(record)
      groups.set(record.date, list)
    })
    return Array.from(groups.entries())
  }, [monthRecords])

  const years = useMemo(() => {
    const current = new Date().getFullYear()
    const recordYears = records.map((record) => parseDateOnly(record.date).getFullYear())
    const min = Math.min(current - 5, ...recordYears)
    const max = Math.max(current, ...recordYears)
    return Array.from({ length: max - min + 1 }, (_, index) => max - index)
  }, [records])

  const moveMonth = (offset: number) => {
    const next = new Date(viewYear, viewMonth + offset, 1)
    setViewYear(next.getFullYear())
    setViewMonth(next.getMonth())
    setShowMonthPicker(false)
  }

  const applyMonth = () => {
    setViewYear(draftYear)
    setViewMonth(draftMonth)
    setShowMonthPicker(false)
  }

  return (
    <section className="ht-section" aria-labelledby="history-heading">
      <div className="ht-section-heading-row">
        <h2 id="history-heading" className="ht-section-title">Your drinking records</h2>
      </div>

      <div className="history-month-nav" aria-label="History month navigation">
        <button className="history-month-arrow" onClick={() => moveMonth(-1)} aria-label="Previous month">‹</button>
        <button
          className="history-month-label"
          onClick={() => setShowMonthPicker((value) => !value)}
          aria-expanded={showMonthPicker}
        >
          {formatMonthLabel(viewYear, viewMonth)}
          <span aria-hidden="true">⌄</span>
        </button>
        <button className="history-month-arrow" onClick={() => moveMonth(1)} aria-label="Next month">›</button>
      </div>

      {showMonthPicker && (
        <div className="history-month-picker">
          <label>
            <span>Year</span>
            <select value={draftYear} onChange={(event) => setDraftYear(Number(event.target.value))}>
              {years.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>
          </label>
          <label>
            <span>Month</span>
            <select value={draftMonth} onChange={(event) => setDraftMonth(Number(event.target.value))}>
              {MONTH_NAMES.map((month, index) => <option key={month} value={index}>{month}</option>)}
            </select>
          </label>
          <button className="ht-primary-button" onClick={applyMonth}>Apply</button>
        </div>
      )}

      {groupedRecords.length === 0 ? (
        <div className="ht-empty-card">
          <h3>No drinking records for {MONTH_NAMES[viewMonth]}.</h3>
          <p>Records you add will appear here.</p>
          { onLoadPrototypeData && records.length === 0 && (
            <button className="ht-secondary-button" onClick={onLoadPrototypeData}>Load sample history</button>
          )}
        </div>
      ) : (
        <div className="history-list">
          {groupedRecords.map(([date, dayRecords]) => {
            const dailyTotal = roundStandardDrinks(dayRecords.reduce((sum, record) => sum + record.standardDrinks, 0), 1)
            return (
              <article className="history-day" key={date}>
                <header className="history-day-header">
                  <h3>{formatHistoryDate(date)}</h3>
                  <div className="history-day-total">
                    <span className="history-day-total-number">{dailyTotal.toFixed(1)}</span>
                    <span className="history-day-total-unit">standard drinks</span>
                  </div>
                </header>
                <div className="history-day-records">
                  {dayRecords.map((record) => (
                    <div className="history-record" key={record.id}>
                      <div className="history-record-main">
                        <strong>{record.drinkName}</strong>
                        <span>{formatTime(record.time)}</span>
                      </div>
                      <div className="history-record-standard-drinks">
                        <span className="history-record-standard-number">{record.standardDrinks.toFixed(1)}</span>
                      </div>
                      <button
                        className="history-record-menu"
                        aria-label={`Actions for ${record.drinkName}`}
                        onClick={() => setOpenActionsId((id) => id === record.id ? null : record.id)}
                      >
                        ⋯
                      </button>
                      {openActionsId === record.id && (
                        <div className="history-record-actions">
                          <button onClick={() => { onEditRecord(record); setOpenActionsId(null) }}>Edit</button>
                          <button className="danger" onClick={() => { setPendingDelete(record); setOpenActionsId(null) }}>Delete</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      )}

      {pendingDelete && (
        <div className="ht-modal-backdrop" role="presentation" onClick={() => setPendingDelete(null)}>
          <div className="ht-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-record-title" onClick={(event) => event.stopPropagation()}>
            <h3 id="delete-record-title">Delete this record?</h3>
            <p className="ht-modal-subtitle">This drinking record will be removed from History, Trends, and Report.</p>
            <div className="ht-modal-actions">
              <button className="ht-secondary-button" onClick={() => setPendingDelete(null)}>Cancel</button>
              <button
                className="ht-danger-button"
                onClick={() => { onDeleteRecord(pendingDelete.id); setPendingDelete(null) }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function TrendBars({
  values,
  guideline,
  valueSuffix = '',
}: {
  values: { label: string; total: number }[]
  guideline: number
  valueSuffix?: string
}) {
  const maxValue = Math.max(guideline, ...values.map((item) => item.total), 1) * 1.18
  const guidelineBottom = `${Math.min(96, (guideline / maxValue) * 100)}%`

  return (
    <div className="trend-chart" aria-label="Alcohol consumption bar chart">
      <div className="trend-guideline" style={{ bottom: guidelineBottom }}>
        <span>{guideline} standard drinks guideline</span>
      </div>
      <div className="trend-bars">
        {values.map((item) => {
          const barHeight = Math.max(item.total > 0 ? 7 : 0, (item.total / maxValue) * 100)
          return (
            <div className="trend-bar-column" key={item.label}>
              <div className="trend-bar-track">
                {item.total > 0 && (
                  <div className="trend-bar-value" style={{ bottom: `calc(${barHeight}% + 7px)` }}>
                    {`${item.total.toFixed(1)}${valueSuffix}`}
                  </div>
                )}
                <div className="trend-bar-fill" style={{ height: `${barHeight}%` }} />
              </div>
              <span>{item.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TrendsTab({ records, onLoadPrototypeData }: Pick<Props, 'records' | 'onLoadPrototypeData'>) {
  const [period, setPeriod] = useState<TrendPeriod>('4w')
  const today = startOfToday()

  const data = useMemo(() => {
    const days = period === '7d' ? 7 : 28
    const start = addDays(today, -(days - 1))
    const previousEnd = addDays(start, -1)
    const previousStart = addDays(previousEnd, -(days - 1))
    const current = getRecordsInRange(records, start, today)
    const previous = getRecordsInRange(records, previousStart, previousEnd)
    const currentTotal = roundStandardDrinks(current.reduce((sum, record) => sum + record.standardDrinks, 0), 1)
    const previousTotal = roundStandardDrinks(previous.reduce((sum, record) => sum + record.standardDrinks, 0), 1)
    const currentDays = new Set(current.map((record) => record.date)).size
    const dailyTotals = getDailyTotals(current)

    let chartValues: { label: string; total: number }[]
    let guideline: number
    if (period === '7d') {
      chartValues = Array.from({ length: 7 }, (_, index) => {
        const date = addDays(start, index)
        const dateValue = formatDateOnly(date)
        const total = current
          .filter((record) => record.date === dateValue)
          .reduce((sum, record) => sum + record.standardDrinks, 0)
        return {
          label: date.toLocaleDateString('en-AU', { weekday: 'short' }).slice(0, 3),
          total: roundStandardDrinks(total, 1),
        }
      })
      guideline = 4
    } else {
      chartValues = Array.from({ length: 4 }, (_, index) => {
        const weekStart = addDays(start, index * 7)
        const weekEnd = addDays(weekStart, 6)
        const weekRecords = getRecordsInRange(current, weekStart, weekEnd)
        return {
          label: `W${index + 1}`,
          total: roundStandardDrinks(weekRecords.reduce((sum, record) => sum + record.standardDrinks, 0), 1),
        }
      })
      guideline = 10
    }

    return {
      current,
      currentTotal,
      currentDays,
      currentAvgStandardDrinks: period === '4w' ? roundStandardDrinks(currentTotal / 4, 1) : currentTotal,
      currentAvgDrinkingDays: period === '4w' ? Math.round((currentDays / 4) * 10) / 10 : currentDays,
      comparison: comparisonCopy(percentChange(currentTotal, previousTotal), period),
      chartValues,
      guideline,
      mostCommonDay: mostCommonDay(current),
      mostCommonTime: mostCommonTime(current),
      highestDay: dailyTotals.length > 0 ? Math.max(...dailyTotals.map((day) => day.total)) : 0,
      daysAboveFour: dailyTotals.filter((day) => day.total > 4).length,
    }
  }, [period, records])

  return (
    <section className="ht-section" aria-labelledby="trends-heading">
      <div className="ht-section-heading-row trend-heading-row">
        <div>
          <h2 id="trends-heading" className="ht-section-title">Your drinking dashboard</h2>
        </div>
        <label className="trend-period-select">
          <span className="sr-only">Trend period</span>
          <select value={period} onChange={(event) => setPeriod(event.target.value as TrendPeriod)}>
            <option value="7d">Past 7 days</option>
            <option value="4w">Past 4 weeks</option>
          </select>
        </label>
      </div>

      {records.length === 0 ? (
        <div className="ht-empty-card">
          <h3>No trend data yet.</h3>
          <p>Record drinks to build your personal drinking trends.</p>
          { onLoadPrototypeData && (
            <button className="ht-secondary-button" onClick={onLoadPrototypeData}>Load sample history</button>
          )}
        </div>
      ) : (
        <>
          <div className="trend-kpi-grid">
            <article className="trend-kpi-card">
              <span>{period === '4w' ? 'Avg. standard drinks / week' : 'Recorded standard drinks'}</span>
              <strong>{data.currentAvgStandardDrinks.toFixed(1)}</strong>
              <small>{getPeriodLabel(period)}</small>
            </article>
            <article className="trend-kpi-card">
              <span>{period === '4w' ? 'Avg. drinking days / week' : 'Recorded drinking days'}</span>
              <strong>{data.currentAvgDrinkingDays.toFixed(period === '4w' ? 1 : 0)}</strong>
              <small>{getPeriodLabel(period)}</small>
            </article>
          </div>

          <article className="ht-card">
            <div className="ht-card-heading">
              <div>
                <p className="ht-card-kicker">Consumption trend</p>
                <h3>{period === '7d' ? 'Daily standard drinks' : 'Weekly standard drinks'}</h3>
              </div>
              <span className="ht-benchmark-chip">NHMRC reference</span>
            </div>
            <TrendBars values={data.chartValues} guideline={data.guideline} />
            <div className="trend-comparison">
              <span className="trend-comparison-icon" aria-hidden="true">↕</span>
              <p>{data.comparison}</p>
            </div>
          </article>

          <article className="ht-card">
            <div className="ht-card-heading">
              <div>
                <p className="ht-card-kicker">Drinking patterns</p>
                <h3>When your recorded drinking most often occurs</h3>
              </div>
            </div>
            <div className="trend-pattern-grid">
              <div>
                <span>Most common drinking day</span>
                <strong>{data.mostCommonDay}</strong>
              </div>
              <div>
                <span>Most common drinking time</span>
                <strong>{data.mostCommonTime}</strong>
              </div>
            </div>
          </article>

          <article className="trend-insight-card">
            <div>
              <span>Highest recorded day</span>
              <strong>{data.highestDay.toFixed(1)} standard drinks</strong>
            </div>
            <div>
              <span>Recorded days above 4 standard drinks</span>
              <strong>{data.daysAboveFour}</strong>
            </div>
          </article>
        </>
      )}
    </section>
  )
}

function ReportTab({ records, onLoadPrototypeData }: Pick<Props, 'records' | 'onLoadPrototypeData'>) {
  const today = startOfToday()
  const earliestRecord = records.length > 0
    ? [...records].sort((a, b) => a.date.localeCompare(b.date))[0]
    : null
  const historySpanDays = earliestRecord
    ? Math.floor((today.getTime() - parseDateOnly(earliestRecord.date).getTime()) / DAY_MS)
    : 0
  const canGenerate = historySpanDays >= 28

  const report = useMemo(() => {
    const { start, end, values } = buildFourWeekBuckets(records, today)
    const reportRecords = getRecordsInRange(records, start, end)
    const dailyTotals = getDailyTotals(reportRecords)
    const total = roundStandardDrinks(reportRecords.reduce((sum, record) => sum + record.standardDrinks, 0), 1)
    const recordedDays = dailyTotals.length
    const avgPerWeek = roundStandardDrinks(total / 4, 1)
    const avgDrinkingDaysPerWeek = Math.round((recordedDays / 4) * 10) / 10
    const avgPerDrinkingDay = recordedDays > 0 ? roundStandardDrinks(total / recordedDays, 1) : 0
    const highestDay = dailyTotals.length > 0 ? Math.max(...dailyTotals.map((day) => day.total)) : 0
    const daysAboveFour = dailyTotals.filter((day) => day.total > 4).length
    const weeksAboveTen = values.filter((week) => week.total > 10).length

    return {
      start,
      end,
      values,
      dailyTotals,
      total,
      recordedDays,
      avgPerWeek,
      avgDrinkingDaysPerWeek,
      avgPerDrinkingDay,
      highestDay,
      daysAboveFour,
      weeksAboveTen,
    }
  }, [records])

  const exportPdf = () => {
    window.print()
  }

  return (
    <section className="ht-section report-section" aria-labelledby="report-heading">
      <div className="ht-section-heading-row report-screen-only">
        <div>
          <h2 id="report-heading" className="ht-section-title">Four-week drinking report</h2>
        </div>
      </div>

      {!canGenerate ? (
        <div className="ht-empty-card report-screen-only">
          <h3>Not enough history yet</h3>
          <p>Your health report will be available after you have at least 4 weeks of recorded drinking history.</p>
          <div className="report-progress" aria-label={`${Math.min(historySpanDays, 28)} of 28 days of history available`}>
            <div style={{ width: `${Math.min(100, (historySpanDays / 28) * 100)}%` }} />
          </div>
          <small>{Math.min(historySpanDays, 28)} of 28 days</small>
          { onLoadPrototypeData && (
            <button className="ht-secondary-button" onClick={onLoadPrototypeData}>Load 4-week sample history</button>
          )}
        </div>
      ) : (
        <div className="report-print-area">
          <header className="report-title-block">
            <div>
              <h2>SipAware Drinking Report</h2>
              <p>A clear summary of your recorded drinking history and trends to help your GP or another healthcare professional understand your drinking patterns more quickly.</p>
            </div>
            <button className="ht-primary-button report-export-button report-screen-only" onClick={exportPdf}>Export PDF</button>
          </header>

          <div className="report-meta-grid">
            <div>
              <span>Reporting period</span>
              <strong>{formatReportDate(formatDateOnly(report.start))} – {formatReportDate(formatDateOnly(report.end))}</strong>
            </div>
            <div>
              <span>Generated</span>
              <strong>{new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
            </div>
            <div>
              <span>Recorded drinking days</span>
              <strong>{report.recordedDays}</strong>
            </div>
          </div>

          <section className="report-block">
            <div className="report-block-heading">
              <p className="ht-card-kicker">Key drinking summary</p>
              <h3>Four-week overview</h3>
            </div>
            <div className="report-metric-grid">
              <div><span>Avg. recorded standard drinks / week</span><strong>{report.avgPerWeek.toFixed(1)}</strong></div>
              <div><span>Avg. recorded drinking days / week</span><strong>{report.avgDrinkingDaysPerWeek.toFixed(1)}</strong></div>
              <div><span>Avg. standard drinks / recorded drinking day</span><strong>{report.avgPerDrinkingDay.toFixed(1)}</strong></div>
              <div><span>Highest recorded daily total</span><strong>{report.highestDay.toFixed(1)}</strong></div>
              <div><span>Total recorded standard drinks</span><strong>{report.total.toFixed(1)}</strong></div>
            </div>
          </section>

          <section className="report-block report-guideline-block">
            <div className="report-block-heading">
              <p className="ht-card-kicker">Guideline-related summary</p>
              <h3>Recorded consumption above guideline reference amounts</h3>
            </div>
            <div className="report-guideline-grid">
              <div>
                <strong>{report.daysAboveFour}</strong>
                <span>Recorded days above 4 standard drinks</span>
              </div>
              <div>
                <strong>{report.weeksAboveTen} of 4</strong>
                <span>Recorded weeks above 10 standard drinks</span>
              </div>
            </div>
          </section>

          <section className="report-block">
            <div className="report-block-heading">
              <p className="ht-card-kicker">Four-week consumption trend</p>
              <h3>Weekly standard drinks</h3>
            </div>
            <TrendBars values={report.values} guideline={10} />
          </section>

          <section className="report-block">
            <div className="report-block-heading">
              <p className="ht-card-kicker">Recorded drinking history</p>
              <h3>Daily standard-drink totals</h3>
            </div>
            <div className="report-history-list">
              {report.dailyTotals.map((day) => (
                <div key={day.date}>
                  <span>{formatReportDate(day.date)}</span>
                  <span className="report-history-total">{day.total.toFixed(1)} standard drinks</span>
                </div>
              ))}
            </div>
          </section>

          <aside className="report-disclaimer">
            <strong>About this report</strong>
            <p>This report is based on alcohol consumption recorded by the user in SipAware. It may not represent all alcohol consumed and is not a medical diagnosis.</p>
          </aside>
        </div>
      )}
    </section>
  )
}

export default function HistoryTrendsPage(props: Props) {
  const [activeTab, setActiveTab] = useState<HistoryTrendsTab>('history')
  const [editingRecord, setEditingRecord] = useState<ConsumptionRecord | null>(null)

  if (editingRecord) {
    return (
      <EditHistoryRecordPage
        record={editingRecord}
        onBack={() => setEditingRecord(null)}
        onSave={(updated) => {
          props.onUpdateRecord(updated)
          setEditingRecord(null)
          setActiveTab('history')
        }}
      />
    )
  }

  return (
    <div className="history-trends-page app-scroll-nav-clearance flex-1 overflow-y-auto hide-scrollbar">
      <div className="history-trends-inner">
        <header className="history-trends-header">
          <h1 className="font-display">History & Trends</h1>
        </header>

        <nav className="history-trends-tabs" aria-label="History and trends sections">
          {([
            ['history', 'History'],
            ['trends', 'Trends'],
            ['report', 'Report'],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              className={activeTab === value ? 'active' : ''}
              onClick={() => setActiveTab(value)}
              aria-current={activeTab === value ? 'page' : undefined}
            >
              {label}
            </button>
          ))}
        </nav>

        {activeTab === 'history' && (
          <HistoryTab {...props} onEditRecord={setEditingRecord} />
        )}
        {activeTab === 'trends' && <TrendsTab records={props.records} onLoadPrototypeData={props.onLoadPrototypeData} />}
        {activeTab === 'report' && <ReportTab records={props.records} onLoadPrototypeData={props.onLoadPrototypeData} />}
      </div>
    </div>
  )
}
