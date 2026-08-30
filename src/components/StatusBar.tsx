function SignalIcon() {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="#1C1C1A">
      <rect x="0" y="8" width="3" height="4" rx="0.8" />
      <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.8" />
      <rect x="9" y="3" width="3" height="9" rx="0.8" />
      <rect x="13.5" y="0" width="3" height="12" rx="0.8" />
    </svg>
  )
}

function WifiIcon() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="#1C1C1A">
      <path d="M8 9.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
      <path d="M4.9 7.1a4.4 4.4 0 0 1 6.2 0" stroke="#1C1C1A" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M2.3 4.4a7.5 7.5 0 0 1 11.4 0" stroke="#1C1C1A" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M0 1.8A10.7 10.7 0 0 1 16 1.8" stroke="#1C1C1A" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function BatteryIcon() {
  return (
    <svg width="25" height="13" viewBox="0 0 25 13" fill="none">
      <rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="#1C1C1A" strokeOpacity="0.35" />
      <rect x="2" y="2" width="17" height="9" rx="2" fill="#1C1C1A" />
      <path d="M23 4.5v4a2 2 0 0 0 0-4Z" fill="#1C1C1A" fillOpacity="0.4" />
    </svg>
  )
}

export default function StatusBar() {
  return (
    <div className="flex-shrink-0 h-11 flex items-center justify-between px-6">
      <span className="text-[15px] font-semibold tracking-tight text-[#1C1C1A]">9:41</span>
      <div className="flex items-center gap-1.5">
        <SignalIcon />
        <WifiIcon />
        <BatteryIcon />
      </div>
    </div>
  )
}
