import StatusBar from '@/components/StatusBar'
import type { ConsumptionRecord } from '@/types/alcohol'
import { getDailyStandardDrinkTotal, getWeeklyStandardDrinkTotal } from '@/utils/alcohol'

const DAILY_GUIDELINE = 4
const WEEKLY_GUIDELINE = 10

function CheckBadge() {
  return (
    <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M5 12.5l4.2 4L19 7" stroke="#15803D" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function ArrowIcon() {
  return <svg width="8" height="13" viewBox="0 0 8 13" fill="none"><path d="M1 1l6 5.5L1 12" stroke="#1A5FCC" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function statusFor(total: number, guideline: number) {
  if (total > guideline) return { label: 'Above the guideline reference', color: '#B42318', bg: '#FFF1F1' }
  if (Math.abs(total - guideline) < 0.05) return { label: 'At the guideline reference', color: '#B45309', bg: '#FFF7E6' }
  if (total >= guideline * 0.75) return { label: 'Approaching the guideline reference', color: '#B45309', bg: '#FFF7E6' }
  return { label: 'Below the guideline reference', color: '#1A5FCC', bg: '#EEF4FF' }
}

function GuidelineCard({
  label,
  total,
  guideline,
  description,
}: {
  label: string
  total: number
  guideline: number
  description: string
}) {
  const status = statusFor(total, guideline)
  const width = Math.min(100, (total / guideline) * 100)

  return (
    <div className="rounded-2xl border border-[#E2DDD8] p-4 bg-white">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[13px] font-bold uppercase tracking-widest text-[#647280]">{label}</p>
          <p className="font-display text-[34px] text-[#1C1C1A] leading-none mt-2">
            {total.toFixed(1)} <span className="text-[20px] text-[#647280]">/ {guideline}</span>
          </p>
        </div>
        <p className="text-[12px] text-[#647280] text-right mb-1">standard drinks</p>
      </div>
      <div className="h-2.5 bg-[#EEF0F3] rounded-full overflow-hidden mt-4">
        <div className="h-full bg-[#1A5FCC] rounded-full" style={{ width: `${width}%` }} />
      </div>
      <div className="rounded-xl px-3 py-2.5 mt-3" style={{ backgroundColor: status.bg }}>
        <p className="text-[14px] font-semibold" style={{ color: status.color }}>{status.label}</p>
      </div>
      <p className="text-[13px] text-[#647280] leading-relaxed mt-3">{description}</p>
    </div>
  )
}

function formatRecordedDate(dateValue: string) {
  const today = new Date()
  const todayValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  if (dateValue === todayValue) return 'TODAY'

  const [year, month, day] = dateValue.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' }).toUpperCase()
}

export default function RecordResultPage({
  record,
  allRecords,
  onDone,
  onNavigateLearn,
}: {
  record: ConsumptionRecord
  allRecords: ConsumptionRecord[]
  onDone: () => void
  onNavigateLearn: (topicId: string) => void
}) {
  const dailyTotal = getDailyStandardDrinkTotal(allRecords, record.date)
  const weeklyTotal = getWeeklyStandardDrinkTotal(allRecords, record.date)
  const dayLabel = formatRecordedDate(record.date)

  const learnLinks = [
    ['Alcohol & Driving', 'alcohol-driving'],
    ['Alcohol & Ageing', 'alcohol-ageing'],
    ['Standard Drinks', 'standard-drinks'],
    ['Australian Alcohol Guidelines', 'alcohol-guidelines'],
  ] as const

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <StatusBar />
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-[88px]">
        <div className="px-5 pt-5">
          <div className="flex items-center gap-4 mb-7">
            <CheckBadge />
            <div>
              <h1 className="font-display text-[31px] text-[#1C1C1A] leading-tight">Drink recorded</h1>
              <p className="text-[15px] text-[#56524F] mt-1">Here&apos;s what this record means.</p>
            </div>
          </div>

          <div className="rounded-3xl bg-[#EEF4FF] p-5 text-center mb-5">
            <p className="text-[13px] font-bold uppercase tracking-widest text-[#647280]">This drink</p>
            <p className="font-display text-[58px] text-[#1A5FCC] leading-none mt-3">{record.standardDrinks.toFixed(1)}</p>
            <p className="text-[17px] font-semibold text-[#1C1C1A] mt-2">standard drinks</p>
            <p className="text-[14px] text-[#56524F] mt-2">{record.drinkName} · {record.consumedMl} mL recorded</p>
          </div>

          <div className="space-y-4 mb-5">
            <GuidelineCard
              label={dayLabel}
              total={dailyTotal}
              guideline={DAILY_GUIDELINE}
              description="Australian guideline reference: no more than 4 standard drinks on any one day."
            />
            <GuidelineCard
              label="This week"
              total={weeklyTotal}
              guideline={WEEKLY_GUIDELINE}
              description="Australian guideline reference: no more than 10 standard drinks a week."
            />
          </div>

          <div className="bg-[#F5F6F8] rounded-2xl p-4 mb-5">
            <p className="text-[16px] font-semibold text-[#1C1C1A]">The less you drink, the lower your risk of harm.</p>
          </div>

          <div className="rounded-2xl border border-[#E2DDD8] overflow-hidden mb-5">
            <div className="p-4 bg-white">
              <p className="text-[18px] font-semibold text-[#1C1C1A]">Drinking and driving</p>
              <p className="text-[15px] text-[#56524F] leading-relaxed mt-1.5">Alcohol can affect your ability to drive safely. If you have been drinking, do not assume you are safe to drive based only on how you feel.</p>
            </div>
            <button className="w-full flex items-center justify-between px-4 py-4 border-t border-[#E2DDD8] text-left" onClick={() => onNavigateLearn('alcohol-driving')}>
              <span className="text-[16px] font-semibold text-[#1A5FCC]">Learn about Alcohol & Driving</span>
              <ArrowIcon />
            </button>
          </div>

          <p className="text-[13px] font-bold uppercase tracking-widest text-[#647280] mb-3">Learn more</p>
          <div className="rounded-2xl border border-[#E2DDD8] overflow-hidden mb-6 divide-y divide-[#E2DDD8]">
            {learnLinks.map(([label, topicId]) => (
              <button key={topicId} className="w-full min-h-14 flex items-center justify-between px-4 py-3.5 bg-white active:bg-[#F7F8FA] text-left" onClick={() => onNavigateLearn(topicId)}>
                <span className="text-[16px] font-medium text-[#1C1C1A]">{label}</span>
                <ArrowIcon />
              </button>
            ))}
          </div>

          <button className="w-full h-[56px] rounded-2xl bg-[#1A5FCC] text-[17px] font-semibold text-white active:opacity-80 mb-5" onClick={onDone}>Done</button>
        </div>
      </div>
    </div>
  )
}
