export type DrinkCategory = 'Beer' | 'Wine' | 'Spirits' | 'Cider' | 'RTD' | 'Other'

export type DrinkDefinition = {
  id: string
  name: string
  category: DrinkCategory
  abv: number
  sizeMl: number
  containerType: string
}

// 'container' is retained for compatibility with records created by older prototype versions.
// New Record flows use only 'serving' or 'ml'.
export type ConsumptionMode = 'ml' | 'serving' | 'container'

export type ConsumptionRecord = {
  id: string
  drinkId: string
  drinkName: string
  category: DrinkCategory
  abv: number
  containerSizeMl: number
  containerType: string
  mode: ConsumptionMode
  consumedMl: number
  quantity: number
  servingSizeMl?: number
  servingLabel?: string
  date: string
  time: string
  standardDrinks: number
  /** Source of the drink profile used for this record. Older records may omit this field. */
  recordSource?: 'database' | 'manual'
  createdAt: string
}

export type NewDrinkRecordPayload = {
  drink: Omit<DrinkDefinition, 'id'>
  /** Existing database/My Drinks ID. Omit for a manually entered drink that is not yet saved. */
  drinkId?: string
  /** When true, save/reuse this drink profile in My Drinks while recording the consumption. */
  saveToMyDrinks?: boolean
  consumption: Omit<ConsumptionRecord, 'id' | 'drinkId' | 'drinkName' | 'category' | 'abv' | 'containerSizeMl' | 'containerType' | 'createdAt'>
}
