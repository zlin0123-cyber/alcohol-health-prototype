export type DrinkCategory = 'Beer' | 'Wine' | 'Spirits' | 'Cider' | 'RTD' | 'Other'

export type DrinkDefinition = {
  id: string
  name: string
  category: DrinkCategory
  abv: number
  sizeMl: number
  containerType: string
}

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
  createdAt: string
}

export type NewDrinkRecordPayload = {
  drink: Omit<DrinkDefinition, 'id'>
  /** Existing library/My Drinks ID. Omit when creating a new custom drink. */
  drinkId?: string
  /** True only when this flow creates a new custom drink that should be kept in My Drinks. */
  saveToMyDrinks?: boolean
  consumption: Omit<ConsumptionRecord, 'id' | 'drinkId' | 'drinkName' | 'category' | 'abv' | 'containerSizeMl' | 'containerType' | 'createdAt'>
}
