import type { ConsumptionRecord } from '@/types/alcohol'

/**
 * Approximate Australian standard drinks from volume and ABV.
 * One Australian standard drink contains 10 g of pure alcohol.
 * Ethanol density is approximated as 0.789 g/mL.
 */
export function calculateStandardDrinks(volumeMl: number, abvPercent: number): number {
  if (!Number.isFinite(volumeMl) || !Number.isFinite(abvPercent) || volumeMl <= 0 || abvPercent <= 0) {
    return 0
  }

  const gramsOfAlcohol = volumeMl * (abvPercent / 100) * 0.789
  return gramsOfAlcohol / 10
}

export function roundStandardDrinks(value: number, decimals = 2): number {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

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

/** Monday-to-Sunday week containing the supplied calendar date. */
export function getWeekBounds(dateValue: string) {
  const date = parseDateOnly(dateValue)
  const day = date.getDay()
  const daysSinceMonday = (day + 6) % 7

  const start = new Date(date)
  start.setDate(start.getDate() - daysSinceMonday)

  const end = new Date(start)
  end.setDate(end.getDate() + 6)

  return { start: formatDateOnly(start), end: formatDateOnly(end) }
}

export function getDailyStandardDrinkTotal(records: ConsumptionRecord[], dateValue: string) {
  return roundStandardDrinks(
    records
      .filter((record) => record.date === dateValue)
      .reduce((sum, record) => sum + record.standardDrinks, 0),
  )
}

export function getWeeklyStandardDrinkTotal(records: ConsumptionRecord[], dateValue: string) {
  const { start, end } = getWeekBounds(dateValue)
  return roundStandardDrinks(
    records
      .filter((record) => record.date >= start && record.date <= end)
      .reduce((sum, record) => sum + record.standardDrinks, 0),
  )
}
