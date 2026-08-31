import { useState } from 'react'
import type { DrinkCategory, DrinkDefinition } from '@/types/alcohol'

// ── Library data ───────────────────────────────────────────

const drinks: DrinkDefinition[] = [
  { id: 'd1',  name: 'Carlton Draught',          category: 'Beer',    abv: 4.6,  sizeMl: 375, containerType: 'Can' },
  { id: 'd2',  name: 'Victoria Bitter',          category: 'Beer',    abv: 4.9,  sizeMl: 375, containerType: 'Can' },
  { id: 'd3',  name: 'Crown Lager',              category: 'Beer',    abv: 4.9,  sizeMl: 375, containerType: 'Can' },
  { id: 'd4',  name: 'XXXX Gold',                category: 'Beer',    abv: 3.5,  sizeMl: 375, containerType: 'Can' },
  { id: 'd5',  name: 'Tooheys New',              category: 'Beer',    abv: 4.6,  sizeMl: 375, containerType: 'Can' },
  { id: 'd6',  name: 'Coopers Pale Ale',         category: 'Beer',    abv: 4.5,  sizeMl: 375, containerType: 'Can' },
  { id: 'd7',  name: "Jacob's Creek Shiraz",    category: 'Wine',    abv: 13.5, sizeMl: 750, containerType: 'Bottle' },
  { id: 'd8',  name: 'Penfolds Koonunga Hill',   category: 'Wine',    abv: 14.0, sizeMl: 750, containerType: 'Bottle' },
  { id: 'd9',  name: 'Yellow Tail Chardonnay',   category: 'Wine',    abv: 13.0, sizeMl: 750, containerType: 'Bottle' },
  { id: 'd10', name: "d'Arenberg The Footbolt", category: 'Wine',    abv: 14.5, sizeMl: 750, containerType: 'Bottle' },
  { id: 'd11', name: 'Jim Beam Bourbon',         category: 'Spirits', abv: 40.0, sizeMl: 700, containerType: 'Bottle' },
  { id: 'd12', name: 'Bundaberg Rum',            category: 'Spirits', abv: 37.0, sizeMl: 700, containerType: 'Bottle' },
  { id: 'd13', name: 'Tanqueray Gin',            category: 'Spirits', abv: 43.1, sizeMl: 700, containerType: 'Bottle' },
  { id: 'd14', name: 'Johnnie Walker Red',       category: 'Spirits', abv: 40.0, sizeMl: 700, containerType: 'Bottle' },
  { id: 'd15', name: 'Strongbow Original',       category: 'Cider',   abv: 4.5,  sizeMl: 375, containerType: 'Can' },
  { id: 'd16', name: 'Mercury Hard Cider',       category: 'Cider',   abv: 4.5,  sizeMl: 375, containerType: 'Can' },
  { id: 'd17', name: 'Woodstock Bourbon & Cola', category: 'RTD',     abv: 5.0,  sizeMl: 375, containerType: 'Can' },
  { id: 'd18', name: 'Smirnoff Ice Double Black',category: 'RTD',     abv: 6.5,  sizeMl: 300, containerType: 'Can' },
  { id: 'd19', name: 'UDL Vodka Lemon',          category: 'RTD',     abv: 4.8,  sizeMl: 375, containerType: 'Can' },
  { id: 'd20', name: 'Aperol Spritz RTD',        category: 'Other',   abv: 5.1,  sizeMl: 200, containerType: 'Can' },
  { id: 'd21', name: 'Baileys Irish Cream',      category: 'Other',   abv: 17.0, sizeMl: 200, containerType: 'Bottle' },
]

const sideCategories = ['All', 'Beer', 'Wine', 'Spirits', 'Cider', 'RTD', 'Other'] as const
export type RecordCategory = typeof sideCategories[number] | 'My Drinks'
export type RecordBrowseState = { category: RecordCategory; query: string }

// ── Category thumbnail icons ───────────────────────────────

function IcoBeer() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 4h11l1.5 14H3.5L5 4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M17.5 8H20a2 2 0 0 1 0 4h-2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M8 4V2M12 4V2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
}
function IcoWine() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M8 3h8L14 12a2 2 0 0 1-4 0L8 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M12 14v7M8 21h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
}
function IcoSpirits() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 2h6v4l2 4v10a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V10l2-4V2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M7 14h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
}
function IcoCider() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3C9 3 7 5 7 8s2 5 5 5 5-2 5-5-2-5-5-5Z" stroke="currentColor" strokeWidth="1.8" /><path d="M12 13v8M9 21h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M12 3s0-2 2-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
}
function IcoRTD() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="7" y="2" width="10" height="20" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M10 6h4M10 18h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M9 10h6v4H9z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>
}
function IcoOther() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 3h12L16.5 19h-9L6 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M9 19h6M12 14v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
}

const catStyle: Record<DrinkCategory, { bg: string; color: string; icon: React.ReactElement }> = {
  Beer:    { bg: '#FEF3C7', color: '#B45309', icon: <IcoBeer /> },
  Wine:    { bg: '#FFE4E6', color: '#BE123C', icon: <IcoWine /> },
  Spirits: { bg: '#DDEEFF', color: '#1B63D4', icon: <IcoSpirits /> },
  Cider:   { bg: '#DCFCE7', color: '#15803D', icon: <IcoCider /> },
  RTD:     { bg: '#ECEAFF', color: '#5B52DC', icon: <IcoRTD /> },
  Other:   { bg: '#F3F4F6', color: '#4A5260', icon: <IcoOther /> },
}

// ── UI icons ───────────────────────────────────────────────

function IcoSearch() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5.5" stroke="#647280" strokeWidth="1.5" /><path d="M12 12L16 16" stroke="#647280" strokeWidth="1.5" strokeLinecap="round" /></svg>
}
function IcoBarcode() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 4v2M2 12v2M16 4v2M16 12v2" stroke="#1A5FCC" strokeWidth="1.5" strokeLinecap="round" /><path d="M2 4h2M14 4h2M2 14h2M14 14h2" stroke="#1A5FCC" strokeWidth="1.5" strokeLinecap="round" /><path d="M5 5v8M7.5 5v8M10 5v8M12.5 5v8" stroke="#1A5FCC" strokeWidth="1.2" strokeLinecap="round" /></svg>
}
function IcoPlus() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 4v10M4 9h10" stroke="#1A5FCC" strokeWidth="1.5" strokeLinecap="round" /></svg>
}
function IcoChevron() {
  return <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M1 1l5 5-5 5" stroke="#8A8682" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}
function IcoStar() {
  return <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M7 1l1.6 4H13L9.5 7.8 10.8 12 7 9.5 3.2 12l1.3-4.2L1 5h4.4L7 1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>
}
function HelpIcon() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="#4A5260" strokeWidth="1.6" /><path d="M7.8 7.2a2.35 2.35 0 0 1 4.55.8c0 1.7-2.35 2-2.35 3.5" stroke="#4A5260" strokeWidth="1.6" strokeLinecap="round" /><circle cx="10" cy="14.6" r="0.9" fill="#4A5260" /></svg>
}

function DrinkThumb({ category }: { category: DrinkCategory }) {
  const s = catStyle[category]
  return <div className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.bg, color: s.color }}>{s.icon}</div>
}

function DrinkItem({
  drink,
  isCustom,
  onSelect,
  onEdit,
  onDelete,
}: {
  drink: DrinkDefinition
  isCustom: boolean
  onSelect: () => void
  onEdit?: () => void
  onDelete?: () => void
}) {
  return (
    <div className="record-drink-card bg-white">
      <button
        className="w-full flex items-center gap-3.5 px-3 py-4 active:bg-[#F7F8FA] transition-colors text-left"
        onClick={onSelect}
      >
        <DrinkThumb category={drink.category} />
        <div className="flex-1 min-w-0">
          <p className="text-[19px] font-medium text-[#1C1C1A] leading-snug truncate">{drink.name}</p>
          <p className="text-[16px] text-[#56524F] mt-1 leading-tight">
            {drink.category} · {drink.abv}% ABV · {drink.sizeMl} mL
          </p>
        </div>
        <IcoChevron />
      </button>
      {isCustom && (
        <div className="flex justify-end gap-2 px-3 pb-3 -mt-1">
          <button
            className="min-h-11 px-4 rounded-xl bg-[#EEF4FF] text-[15px] font-semibold text-[#1A5FCC] active:opacity-70"
            onClick={onEdit}
          >
            Edit
          </button>
          <button
            className="min-h-11 px-4 rounded-xl bg-[#FFF1F1] text-[15px] font-semibold text-[#B42318] active:opacity-70"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

function EmptyMyDrinks() {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 gap-3">
      <div className="w-14 h-14 rounded-full bg-[#E0EEFF] flex items-center justify-center"><IcoStar /></div>
      <p className="text-[19px] font-semibold text-[#1C1C1A] text-center">No custom drinks yet</p>
      <p className="text-[17px] text-[#56524F] text-center leading-relaxed">Tap &quot;Add Manually&quot; above to save your own drinks here.</p>
    </div>
  )
}

function EmptySearch({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 gap-2">
      <p className="text-[19px] font-semibold text-[#1C1C1A] text-center">No results for &quot;{query}&quot;</p>
      <p className="text-[17px] text-[#56524F] text-center">Try a different name or add it manually.</p>
    </div>
  )
}

function RecordHelp({ onClose }: { onClose: () => void }) {
  const items = [
    ['Search', 'Use the search bar above to enter a drink name, brand, or product and find a matching drink.'],
    ['Scan a barcode', 'Tap Scan Barcode to scan the bottle or can and look for a matching product.'],
    ['Browse', 'Browse by category, such as Beer, Wine, Spirits, Cider, RTD, or Other, then select the drink you want to record.'],
    ['My Drinks', 'Find drinks you have added before for quicker recording.'],
  ] as const

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }} onClick={onClose}>
      <div className="bg-white rounded-t-3xl px-6 pt-7 pb-10 overflow-y-auto hide-scrollbar" style={{ maxHeight: '88%' }} onClick={(e) => e.stopPropagation()}>
        <div className="w-10 h-1 rounded-full bg-[#D8D4CF] mx-auto mb-6" />
        <h2 className="font-display text-[30px] text-[#1C1C1A] leading-tight mb-5">How to record a drink</h2>
        <div className="space-y-4">
          {items.map(([title, body]) => (
            <div key={title}>
              <p className="text-[17px] font-semibold text-[#1C1C1A] mb-1">{title}</p>
              <p className="text-[16px] text-[#56524F] leading-relaxed">{body}</p>
            </div>
          ))}
          <div>
            <p className="text-[17px] font-semibold text-[#1C1C1A] mb-1">Can&apos;t find your drink?</p>
            <p className="text-[16px] text-[#56524F] leading-relaxed">
              Select <strong>Add Manually</strong>. You can <strong>Scan Label</strong> to help fill in details such as ABV and container size, or enter the information yourself. The drink will be saved to <strong>My Drinks</strong> for next time.
            </p>
          </div>
          <p className="text-[16px] text-[#56524F] leading-relaxed">After selecting a drink, enter how much you drank and tap <strong>Record Drink</strong>.</p>
        </div>
        <button className="w-full h-[56px] rounded-2xl bg-[#1A5FCC] text-[17px] font-semibold text-white active:opacity-80 mt-7" onClick={onClose}>Got it</button>
      </div>
    </div>
  )
}

export default function RecordPage({
  onAddManually,
  onSelectDrink,
  onEditDrink,
  onDeleteDrink,
  myDrinks = [],
  initialCategory = 'All',
  initialQuery = '',
  onBrowseStateChange,
}: {
  onAddManually: () => void
  onSelectDrink: (drink: DrinkDefinition) => void
  onEditDrink: (drink: DrinkDefinition) => void
  onDeleteDrink: (drinkId: string) => void
  myDrinks?: DrinkDefinition[]
  initialCategory?: RecordCategory
  initialQuery?: string
  onBrowseStateChange?: (state: RecordBrowseState) => void
}) {
  const [activeCategory, setActiveCategory] = useState<RecordCategory>(initialCategory)
  const [query, setQuery] = useState(initialQuery)
  const [showHelp, setShowHelp] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<DrinkDefinition | null>(null)

  const updateCategory = (category: RecordCategory) => {
    setActiveCategory(category)
    onBrowseStateChange?.({ category, query })
  }

  const updateQuery = (nextQuery: string) => {
    setQuery(nextQuery)
    onBrowseStateChange?.({ category: activeCategory, query: nextQuery })
  }

  const listTitle = activeCategory === 'My Drinks' ? 'My Drinks' : activeCategory === 'All' ? 'All Drinks' : activeCategory
  const normalizedQuery = query.trim().toLowerCase()
  const filteredDrinks = activeCategory === 'My Drinks'
    ? myDrinks.filter((drink) => normalizedQuery === '' || drink.name.toLowerCase().includes(normalizedQuery))
    : drinks.filter((drink) => {
        const matchCategory = activeCategory === 'All' || drink.category === activeCategory
        const matchQuery = normalizedQuery === '' || drink.name.toLowerCase().includes(normalizedQuery)
        return matchCategory && matchQuery
      })

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">

      <div className="record-page-top flex-shrink-0 px-5 pt-2 pb-2 flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-[34px] text-[#1C1C1A] leading-tight">Record a Drink</h1>
        </div>
        <button
          className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F5F3EF] active:opacity-70 flex-shrink-0"
          onClick={() => setShowHelp(true)}
          aria-label="How to record a drink"
        >
          <HelpIcon />
        </button>
      </div>

      <div className="record-controls flex-shrink-0 px-4 pb-3 space-y-2">
        <div className="flex items-center gap-2 bg-[#F5F6F8] rounded-xl px-3 h-10">
          <IcoSearch />
          <input
            className="flex-1 bg-transparent text-[17px] text-[#1C1C1A] placeholder:text-[#647280] outline-none"
            placeholder="Search for a drink..."
            value={query}
            onChange={(e) => updateQuery(e.target.value)}
          />
          {query !== '' && <button className="text-[#647280] text-[18px] leading-none min-w-8 min-h-8" onClick={() => updateQuery('')}>×</button>}
        </div>
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 h-14 rounded-xl bg-[#EEF4FF] active:opacity-75 transition-opacity" aria-label="Scan Barcode">
            <IcoBarcode />
            <span className="text-[17px] font-semibold text-[#1A5FCC]">Scan Barcode</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 h-14 rounded-xl bg-[#EEF4FF] active:opacity-75 transition-opacity" onClick={onAddManually}>
            <IcoPlus />
            <span className="text-[17px] font-semibold text-[#1A5FCC]">Add Manually</span>
          </button>
        </div>
      </div>

      <div className="record-workspace flex-1 flex overflow-hidden border-t border-[#EEEDF3]">
        <div className="record-category-rail app-scroll-nav-clearance flex-shrink-0 overflow-y-auto hide-scrollbar border-r border-[#EEEDF3] bg-[#FAFAFA]">
          {(['My Drinks', ...sideCategories] as RecordCategory[]).map((cat, index) => {
            const active = activeCategory === cat
            return (
              <div key={cat}>
                <button className="w-full flex items-center px-3 py-2 text-left transition-colors" onClick={() => updateCategory(cat)}>
                  <div className="w-full px-2 py-2 rounded-lg transition-colors" style={{ backgroundColor: active ? '#E0EEFF' : 'transparent' }}>
                    <span className="text-[19px] leading-snug block" style={{ color: active ? '#1A5FCC' : '#4A5260', fontWeight: active ? 700 : 400 }}>{cat}</span>
                  </div>
                </button>
                {index === 0 && <div className="h-px bg-[#EEEDF3] mx-3 my-1" />}
              </div>
            )
          })}
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar app-scroll-nav-clearance">
          <div className="record-results-header px-3 pt-3 pb-2 flex items-center justify-between">
            <p className="text-[14px] font-bold uppercase tracking-widest text-[#647280]">{listTitle}</p>
            <p className="text-[14px] text-[#647280]">{filteredDrinks.length} {filteredDrinks.length === 1 ? 'drink' : 'drinks'}</p>
          </div>

          {filteredDrinks.length === 0 && activeCategory === 'My Drinks' && normalizedQuery === '' ? (
            <EmptyMyDrinks />
          ) : filteredDrinks.length === 0 && normalizedQuery !== '' ? (
            <EmptySearch query={query} />
          ) : (
            <div className="record-drink-grid divide-y divide-[#F0F0F0] md:divide-y-0">
              {filteredDrinks.map((drink) => {
                const isCustom = activeCategory === 'My Drinks'
                return (
                  <DrinkItem
                    key={drink.id}
                    drink={drink}
                    isCustom={isCustom}
                    onSelect={() => onSelectDrink(drink)}
                    onEdit={isCustom ? () => onEditDrink(drink) : undefined}
                    onDelete={isCustom ? () => setPendingDelete(drink) : undefined}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>

      {showHelp && <RecordHelp onClose={() => setShowHelp(false)} />}

      {pendingDelete && (
        <div className="absolute inset-0 z-30 flex items-end" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }} onClick={() => setPendingDelete(null)}>
          <div className="w-full bg-white rounded-t-3xl px-6 pt-7 pb-10" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full bg-[#D8D4CF] mx-auto mb-6" />
            <h2 className="font-display text-[28px] text-[#1C1C1A]">Delete this drink?</h2>
            <p className="text-[17px] text-[#56524F] leading-relaxed mt-3">
              {pendingDelete.name} will be removed from My Drinks. Your previous drinking records will be kept.
            </p>
            <div className="flex gap-3 mt-7">
              <button className="flex-1 h-[52px] rounded-2xl bg-[#F5F6F8] text-[17px] font-semibold text-[#1C1C1A]" onClick={() => setPendingDelete(null)}>Cancel</button>
              <button
                className="flex-1 h-[52px] rounded-2xl bg-[#B42318] text-[17px] font-semibold text-white"
                onClick={() => {
                  onDeleteDrink(pendingDelete.id)
                  setPendingDelete(null)
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
