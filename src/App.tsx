import { useEffect, useState } from 'react'
import HomePage from '@/pages/HomePage'
import LearnPage from '@/pages/LearnPage'
import RecordPage, { type RecordBrowseState, type RecordDrinkSource } from '@/pages/RecordPage'
import AddDrinkPage, { EditDrinkPage, ExistingDrinkConsumptionPage } from '@/pages/AddDrinkPage'
import RecordResultPage from '@/pages/RecordResultPage'
import BarcodeScannerPage from '@/pages/BarcodeScannerPage'
import HistoryTrendsPage from '@/pages/HistoryTrendsPage'
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

type RecordView = 'main' | 'barcode' | 'manual' | 'consume' | 'edit' | 'result'

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



function formatDateOnly(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function buildPrototypeHistory(): ConsumptionRecord[] {
  const today = new Date()
  const base = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const templates = [
    { daysAgo: 1, name: "Jacob's Creek Shiraz", category: 'Wine' as const, abv: 13.5, ml: 150, type: 'Glass', time: '19:30', source: 'database' as const },
    { daysAgo: 1, name: 'Corona Extra', category: 'Beer' as const, abv: 4.5, ml: 355, type: 'Bottle', time: '20:45', source: 'database' as const },
    { daysAgo: 3, name: 'Asahi Super Dry', category: 'Beer' as const, abv: 5, ml: 330, type: 'Bottle', time: '20:15', source: 'database' as const },
    { daysAgo: 5, name: 'Home Pour Whiskey', category: 'Spirits' as const, abv: 40, ml: 60, type: 'Glass', time: '21:10', source: 'manual' as const },
    { daysAgo: 7, name: 'Great Northern', category: 'Beer' as const, abv: 3.5, ml: 375, type: 'Can', time: '18:40' },
    { daysAgo: 9, name: 'Jacob\'s Creek Shiraz', category: 'Wine' as const, abv: 13.5, ml: 300, type: 'Glass', time: '19:50' },
    { daysAgo: 11, name: 'Carlton Dry', category: 'Beer' as const, abv: 4.5, ml: 375, type: 'Can', time: '20:20' },
    { daysAgo: 14, name: 'Jameson Whiskey', category: 'Spirits' as const, abv: 40, ml: 90, type: 'Glass', time: '21:30' },
    { daysAgo: 16, name: 'Corona Extra', category: 'Beer' as const, abv: 4.5, ml: 355, type: 'Bottle', time: '19:20' },
    { daysAgo: 18, name: 'Jacob\'s Creek Shiraz', category: 'Wine' as const, abv: 13.5, ml: 150, type: 'Glass', time: '20:05' },
    { daysAgo: 21, name: 'Asahi Super Dry', category: 'Beer' as const, abv: 5, ml: 660, type: 'Bottle', time: '20:40' },
    { daysAgo: 23, name: 'Great Northern', category: 'Beer' as const, abv: 3.5, ml: 375, type: 'Can', time: '18:55' },
    { daysAgo: 25, name: 'Jameson Whiskey', category: 'Spirits' as const, abv: 40, ml: 60, type: 'Glass', time: '21:15' },
    { daysAgo: 28, name: 'Jacob\'s Creek Shiraz', category: 'Wine' as const, abv: 13.5, ml: 300, type: 'Glass', time: '19:45' },
    { daysAgo: 31, name: 'Corona Extra', category: 'Beer' as const, abv: 4.5, ml: 710, type: 'Bottle', time: '20:10' },
    { daysAgo: 34, name: 'Carlton Dry', category: 'Beer' as const, abv: 4.5, ml: 375, type: 'Can', time: '19:35' },
    { daysAgo: 38, name: 'Jacob\'s Creek Shiraz', category: 'Wine' as const, abv: 13.5, ml: 150, type: 'Glass', time: '20:00' },
    { daysAgo: 42, name: 'Asahi Super Dry', category: 'Beer' as const, abv: 5, ml: 330, type: 'Bottle', time: '19:10' },
    { daysAgo: 48, name: 'Jameson Whiskey', category: 'Spirits' as const, abv: 40, ml: 60, type: 'Glass', time: '21:05' },
    { daysAgo: 52, name: 'Great Northern', category: 'Beer' as const, abv: 3.5, ml: 750, type: 'Can', time: '18:45' },
  ]

  return templates.map((item, index) => {
    const date = new Date(base)
    date.setDate(date.getDate() - item.daysAgo)
    const standardDrinks = Math.round((item.ml * (item.abv / 100) * 0.789 / 10) * 100) / 100
    return {
      id: `prototype-history-${index + 1}`,
      drinkId: `prototype-drink-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      drinkName: item.name,
      category: item.category,
      abv: item.abv,
      containerSizeMl: item.ml,
      containerType: item.type,
      mode: 'ml',
      consumedMl: item.ml,
      quantity: 1,
      date: formatDateOnly(date),
      time: item.time,
      standardDrinks,
      recordSource: 'source' in item ? item.source : 'database',
      createdAt: date.toISOString(),
    }
  })
}

function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}


function isSameDrinkProfile(left: Omit<DrinkDefinition, 'id'> | DrinkDefinition, right: Omit<DrinkDefinition, 'id'> | DrinkDefinition) {
  return left.name.trim().toLowerCase() === right.name.trim().toLowerCase()
    && left.category === right.category
    && left.abv === right.abv
    && left.sizeMl === right.sizeMl
    && left.containerType === right.containerType
}

export default function App() {
  const [activeNav, setActiveNav] = useState<NavTab>('Home')
  const [learnTarget, setLearnTarget] = useState<string | null>(null)
  const [learnPageKey, setLearnPageKey] = useState(0)

  const [recordView, setRecordView] = useState<RecordView>('main')
  const [recordPageKey, setRecordPageKey] = useState(0)
  const [recordBrowseState, setRecordBrowseState] = useState<RecordBrowseState>({ category: 'All', query: '' })
  const [selectedDrink, setSelectedDrink] = useState<DrinkDefinition | null>(null)
  const [selectedDrinkSource, setSelectedDrinkSource] = useState<RecordDrinkSource | null>(null)
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
    setSelectedDrinkSource(null)
    setEditingDrink(null)
    setLastRecordedId(null)
    setRecordBrowseState(browseState)
    setRecordPageKey((key) => key + 1)
  }

  const returnToRecordMain = () => {
    setRecordView('main')
    setSelectedDrink(null)
    setSelectedDrinkSource(null)
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

  const recordConsumption = (payload: NewDrinkRecordPayload) => {
    let drinkId = payload.drinkId
    let drink = payload.drink

    if (payload.saveToMyDrinks) {
      const existingDrink = myDrinks.find((candidate) => isSameDrinkProfile(candidate, payload.drink))

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
      recordSource: selectedDrinkSource === 'database' ? 'database' : 'manual',
      createdAt: new Date().toISOString(),
    }

    setConsumptionRecords((prev) => [consumption, ...prev])
    setLastRecordedId(consumption.id)
    setSelectedDrink(null)
    setSelectedDrinkSource(null)
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


  const updateConsumptionRecord = (updated: ConsumptionRecord) => {
    setConsumptionRecords((prev) => prev.map((record) => record.id === updated.id ? updated : record))
  }

  const deleteConsumptionRecord = (recordId: string) => {
    setConsumptionRecords((prev) => prev.filter((record) => record.id !== recordId))
  }

  const loadPrototypeHistory = () => {
    setConsumptionRecords(buildPrototypeHistory())
  }

  const lastRecorded = lastRecordedId
    ? consumptionRecords.find((record) => record.id === lastRecordedId) ?? null
    : null

  return (
    <div className="app-shell w-full bg-white flex flex-col overflow-hidden relative">
      <aside className="app-side-nav" aria-label="Primary navigation">
        <div className="app-side-nav-title">Menu</div>
        {navItems.map((label) => {
          const Icon = navIcons[label]
          const active = activeNav === label
          return (
            <button
              key={label}
              className="app-side-nav-button"
              data-active={active}
              onClick={() => navigateToTab(label)}
            >
              <Icon active={active} />
              <span className="app-side-nav-label">{label}</span>
            </button>
          )
        })}
      </aside>

      <main className="app-main">
        {activeNav === 'Home' && <HomePage onNavigateLearn={navigateToLearn} onNavigateTab={navigateToTab} />}
        {activeNav === 'Learn' && <LearnPage key={learnPageKey} initialTopicId={learnTarget} />}

        {activeNav === 'Record' && recordView === 'main' && (
          <RecordPage
            key={recordPageKey}
            onScanBarcode={() => setRecordView('barcode')}
            onRecordManually={() => setRecordView('manual')}
            onSelectDrink={(drink, source) => {
              setSelectedDrink(drink)
              setSelectedDrinkSource(source)
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

        {activeNav === 'Record' && recordView === 'barcode' && (
          <BarcodeScannerPage
            onBack={returnToRecordMain}
            onUseDrink={(drink) => {
              setSelectedDrink(drink)
              setSelectedDrinkSource('database')
              setRecordView('consume')
            }}
            onRecordManually={() => setRecordView('manual')}
          />
        )}

        {activeNav === 'Record' && recordView === 'manual' && (
          <AddDrinkPage
            onBack={returnToRecordMain}
            onRecord={recordConsumption}
          />
        )}

        {activeNav === 'Record' && recordView === 'consume' && selectedDrink && (
          <ExistingDrinkConsumptionPage
            drink={selectedDrink}
            onBack={returnToRecordMain}
            onRecord={recordConsumption}
            allowSaveToMyDrinks={
              selectedDrinkSource === 'database'
              && !myDrinks.some((savedDrink) => isSameDrinkProfile(savedDrink, selectedDrink))
            }
            alreadySavedToMyDrinks={
              selectedDrinkSource === 'my-drinks'
              || myDrinks.some((savedDrink) => isSameDrinkProfile(savedDrink, selectedDrink))
            }
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

        {activeNav === 'Trends' && (
          <HistoryTrendsPage
            records={consumptionRecords}
            onUpdateRecord={updateConsumptionRecord}
            onDeleteRecord={deleteConsumptionRecord}
            onLoadPrototypeData={loadPrototypeHistory}
          />
        )}
        {activeNav === 'Awards' && <PlaceholderPage label="Awards" />}
      </main>

      <div className="app-bottom-nav absolute bottom-0 left-0 right-0 bg-white border-t border-[#E8E4DF] flex items-center justify-center pt-1.5 z-10">
        {navItems.map((label) => {
          const Icon = navIcons[label]
          const active = activeNav === label
          return (
            <button
              key={label}
              className="flex-1 max-w-[88px] min-w-0 flex flex-col items-center gap-0 transition-opacity active:opacity-60"
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
