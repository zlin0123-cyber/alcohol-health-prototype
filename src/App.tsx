import { useEffect, useState } from 'react'
import HomePage from '@/pages/HomePage'
import LearnPage from '@/pages/LearnPage'
import RecordPage, { type RecordBrowseState } from '@/pages/RecordPage'
import AddDrinkPage, { EditDrinkPage, ExistingDrinkConsumptionPage } from '@/pages/AddDrinkPage'
import RecordResultPage from '@/pages/RecordResultPage'
import type { ConsumptionRecord, DrinkDefinition, NewDrinkRecordPayload } from '@/types/alcohol'

// ── Bottom nav icons ───────────────────────────────────────

function NavHome({ active }: { active: boolean }) {
  const c = active ? '#1A5FCC' : '#687888'
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 12L12 3L21 12" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10.5V20a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-9.5" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function NavLearn({ active }: { active: boolean }) {
  const c = active ? '#1A5FCC' : '#687888'
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 5C9.2 3.8 6.5 4.2 3 6.2V19.2C6.5 17.2 9.2 17.6 12 18.8C14.8 17.6 17.5 17.2 21 19.2V6.2C17.5 4.2 14.8 3.8 12 5Z" stroke={c} strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 5V18.8" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function NavRecord({ active }: { active: boolean }) {
  const c = active ? '#1A5FCC' : '#687888'
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="2" />
      <path d="M12 8v8M8 12h8" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function NavTrends({ active }: { active: boolean }) {
  const c = active ? '#1A5FCC' : '#687888'
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="13" width="3.5" height="7" rx="1" stroke={c} strokeWidth="2" strokeLinejoin="round" />
      <rect x="9.5" y="9" width="3.5" height="11" rx="1" stroke={c} strokeWidth="2" strokeLinejoin="round" />
      <rect x="16" y="4" width="3.5" height="16" rx="1" stroke={c} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

function NavAwards({ active }: { active: boolean }) {
  const c = active ? '#1A5FCC' : '#687888'
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M6 4H4C4 8 5.5 11 8.5 11M18 4H20C20 8 18.5 11 15.5 11M12 13V17M8 20H16M7 4H17V9C17 12 14.8 13 12 13C9.2 13 7 12 7 9V4Z" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const navItems = ['Home', 'Learn', 'Record', 'Trends', 'Awards'] as const
type NavTab = typeof navItems[number]

const navIcons: Record<NavTab, React.ComponentType<{ active: boolean }>> = {
  Home: NavHome,
  Learn: NavLearn,
  Record: NavRecord,
  Trends: NavTrends,
  Awards: NavAwards,
}

// ── Placeholder page ───────────────────────────────────────

function PlaceholderPage({ label }: { label: string }) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center gap-3 pb-[68px]">
        <p className="font-display text-[28px] text-[#1C1C1A]">{label}</p>
        <p className="text-[14px] text-[#647280]">Coming soon</p>
      </div>
    </div>
  )
}

// ── App shell ──────────────────────────────────────────────

const MY_DRINKS_STORAGE_KEY = 'alcohol-health.my-drinks.v1'
const CONSUMPTION_STORAGE_KEY = 'alcohol-health.consumption-records.v1'

type RecordView = 'main' | 'add' | 'consume' | 'edit' | 'result'

function loadStoredArray<T>(key: string): T[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed as T[] : []
  } catch {
    return []
  }
}

function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export default function App() {
  const [activeNav, setActiveNav] = useState<NavTab>('Home')
  const [learnTarget, setLearnTarget] = useState<string | null>(null)
  const [learnPageKey, setLearnPageKey] = useState(0)

  const [recordView, setRecordView] = useState<RecordView>('main')
  const [recordPageKey, setRecordPageKey] = useState(0)
  const [recordBrowseState, setRecordBrowseState] = useState<RecordBrowseState>({ category: 'All', query: '' })
  const [selectedDrink, setSelectedDrink] = useState<DrinkDefinition | null>(null)
  const [editingDrink, setEditingDrink] = useState<DrinkDefinition | null>(null)
  const [lastRecordedId, setLastRecordedId] = useState<string | null>(null)

  const [myDrinks, setMyDrinks] = useState<DrinkDefinition[]>(() => loadStoredArray<DrinkDefinition>(MY_DRINKS_STORAGE_KEY))
  const [consumptionRecords, setConsumptionRecords] = useState<ConsumptionRecord[]>(() => loadStoredArray<ConsumptionRecord>(CONSUMPTION_STORAGE_KEY))

  useEffect(() => {
    window.localStorage.setItem(MY_DRINKS_STORAGE_KEY, JSON.stringify(myDrinks))
  }, [myDrinks])

  useEffect(() => {
    window.localStorage.setItem(CONSUMPTION_STORAGE_KEY, JSON.stringify(consumptionRecords))
  }, [consumptionRecords])

  const resetRecordToMain = (browseState: RecordBrowseState = { category: 'All', query: '' }) => {
    setRecordView('main')
    setSelectedDrink(null)
    setEditingDrink(null)
    setLastRecordedId(null)
    setRecordBrowseState(browseState)
    setRecordPageKey((key) => key + 1)
  }

  const returnToRecordMain = () => {
    setRecordView('main')
    setSelectedDrink(null)
    setEditingDrink(null)
    setLastRecordedId(null)
    setRecordPageKey((key) => key + 1)
  }

  const navigateToTab = (tab: NavTab) => {
    if (tab === 'Learn') {
      setLearnTarget(null)
      setLearnPageKey((key) => key + 1)
    }

    if (tab === 'Record') {
      resetRecordToMain()
    }

    setActiveNav(tab)
  }

  const navigateToLearn = (topicId?: string) => {
    setLearnTarget(topicId ?? null)
    setLearnPageKey((key) => key + 1)
    setActiveNav('Learn')
  }

  const saveNewDrink = (draft: Omit<DrinkDefinition, 'id'>, existingId?: string) => {
    if (existingId) {
      const updated: DrinkDefinition = { ...draft, id: existingId }
      setMyDrinks((prev) => prev.map((drink) => drink.id === existingId ? updated : drink))
      return updated
    }

    const duplicate = myDrinks.find((drink) =>
      drink.name.trim().toLowerCase() === draft.name.trim().toLowerCase()
      && drink.category === draft.category
      && drink.abv === draft.abv
      && drink.sizeMl === draft.sizeMl
      && drink.containerType === draft.containerType
    )
    if (duplicate) return duplicate

    const created: DrinkDefinition = { ...draft, id: createId('drink') }
    setMyDrinks((prev) => [...prev, created])
    return created
  }

  const recordConsumption = (payload: NewDrinkRecordPayload) => {
    let drinkId = payload.drinkId
    let drink = payload.drink

    if (payload.saveToMyDrinks) {
      const existingDrink = myDrinks.find((candidate) =>
        candidate.name.trim().toLowerCase() === payload.drink.name.trim().toLowerCase()
        && candidate.category === payload.drink.category
        && candidate.abv === payload.drink.abv
        && candidate.sizeMl === payload.drink.sizeMl
        && candidate.containerType === payload.drink.containerType
      )

      if (existingDrink) {
        drinkId = existingDrink.id
        drink = existingDrink
      } else {
        drinkId = createId('drink')
        const newDrink: DrinkDefinition = { ...payload.drink, id: drinkId }
        drink = newDrink
        setMyDrinks((prev) => [...prev, newDrink])
      }
    }

    if (!drinkId) drinkId = createId('library-drink')

    const consumption: ConsumptionRecord = {
      ...payload.consumption,
      id: createId('consumption'),
      drinkId,
      drinkName: drink.name,
      category: drink.category,
      abv: drink.abv,
      containerSizeMl: drink.sizeMl,
      containerType: drink.containerType,
      createdAt: new Date().toISOString(),
    }

    setConsumptionRecords((prev) => [consumption, ...prev])
    setLastRecordedId(consumption.id)
    setSelectedDrink(null)
    setEditingDrink(null)
    setRecordView('result')
    setActiveNav('Record')
  }

  const updateMyDrink = (updated: DrinkDefinition) => {
    setMyDrinks((prev) => prev.map((drink) => drink.id === updated.id ? updated : drink))
    setEditingDrink(null)
    resetRecordToMain({ category: 'My Drinks', query: '' })
  }

  const deleteMyDrink = (drinkId: string) => {
    setMyDrinks((prev) => prev.filter((drink) => drink.id !== drinkId))
  }

  const lastRecorded = lastRecordedId
    ? consumptionRecords.find((record) => record.id === lastRecordedId) ?? null
    : null

  return (
    <div className="app-shell w-full bg-white flex flex-col overflow-hidden max-w-[390px] mx-auto relative">
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeNav === 'Home' && <HomePage onNavigateLearn={navigateToLearn} onNavigateTab={navigateToTab} />}
        {activeNav === 'Learn' && <LearnPage key={learnPageKey} initialTopicId={learnTarget} />}

        {activeNav === 'Record' && recordView === 'main' && (
          <RecordPage
            key={recordPageKey}
            onAddManually={() => setRecordView('add')}
            onSelectDrink={(drink) => {
              setSelectedDrink(drink)
              setRecordView('consume')
            }}
            onEditDrink={(drink) => {
              setEditingDrink(drink)
              setRecordView('edit')
            }}
            onDeleteDrink={deleteMyDrink}
            myDrinks={myDrinks}
            initialCategory={recordBrowseState.category}
            initialQuery={recordBrowseState.query}
            onBrowseStateChange={setRecordBrowseState}
          />
        )}

        {activeNav === 'Record' && recordView === 'add' && (
          <AddDrinkPage
            onBack={returnToRecordMain}
            onSaveDrink={saveNewDrink}
            onRecord={recordConsumption}
          />
        )}

        {activeNav === 'Record' && recordView === 'consume' && selectedDrink && (
          <ExistingDrinkConsumptionPage
            drink={selectedDrink}
            onBack={returnToRecordMain}
            onRecord={recordConsumption}
          />
        )}

        {activeNav === 'Record' && recordView === 'edit' && editingDrink && (
          <EditDrinkPage
            drink={editingDrink}
            onBack={() => resetRecordToMain({ category: 'My Drinks', query: '' })}
            onSave={updateMyDrink}
          />
        )}

        {activeNav === 'Record' && recordView === 'result' && lastRecorded && (
          <RecordResultPage
            record={lastRecorded}
            allRecords={consumptionRecords}
            onDone={() => resetRecordToMain()}
            onNavigateLearn={navigateToLearn}
          />
        )}

        {activeNav === 'Trends' && <PlaceholderPage label="Trends" />}
        {activeNav === 'Awards' && <PlaceholderPage label="Awards" />}
      </div>

      <div className="app-bottom-nav absolute bottom-0 left-0 right-0 bg-white border-t border-[#E8E4DF] flex items-center justify-center pt-1.5 z-10">
        {navItems.map((label) => {
          const Icon = navIcons[label]
          const active = activeNav === label
          return (
            <button
              key={label}
              className="w-[72px] flex flex-col items-center gap-0 transition-opacity active:opacity-60"
              onClick={() => navigateToTab(label)}
            >
              <div
                className="flex items-center justify-center w-14 h-8 rounded-full transition-colors duration-200"
                style={{ backgroundColor: active ? '#E0EEFF' : 'transparent' }}
              >
                <Icon active={active} />
              </div>
              <span
                className="text-[15px] tracking-wide transition-colors duration-200"
                style={{ color: active ? '#1A5FCC' : '#687888', fontWeight: active ? 700 : 400 }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
