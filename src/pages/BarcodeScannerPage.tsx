import { useEffect, useRef, useState } from 'react'
import type { DrinkDefinition } from '@/types/alcohol'

type ScannerView = 'live' | 'match' | 'not-found' | 'photo-processing' | 'photo-unreadable'
type CameraStatus = 'requesting' | 'granted' | 'not-granted'

type BarcodeResultLike = { rawValue?: string }
type BarcodeDetectorLike = { detect: (source: CanvasImageSource) => Promise<BarcodeResultLike[]> }
type BarcodeDetectorCtor = new (options?: { formats?: string[] }) => BarcodeDetectorLike

const prototypeDrinkByBarcode: Record<string, DrinkDefinition> = {
  '000000000001': { id: 'd1', name: 'Carlton Draught', category: 'Beer', abv: 4.6, sizeMl: 375, containerType: 'Can' },
  '000000000002': { id: 'd7', name: "Jacob's Creek Shiraz", category: 'Wine', abv: 13.5, sizeMl: 750, containerType: 'Bottle' },
}

const prototypeMatchedDrink = prototypeDrinkByBarcode['000000000001']

function BackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PhotoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="9" cy="10" r="1.8" stroke="currentColor" strokeWidth="1.6" />
      <path d="m5.5 17 4.2-4.3 3.1 3 2.3-2.2 3.4 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CameraOffIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h3l1.2-2h4.6l1.2 2h3A1.5 1.5 0 0 1 20 8.5V18H7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function WarningIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 2.8 19h18.4L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 9v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="1" fill="currentColor" />
    </svg>
  )
}

function BarcodeIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M4 8V5a1 1 0 0 1 1-1h3M20 4h3a1 1 0 0 1 1 1v3M24 20v3a1 1 0 0 1-1 1h-3M8 24H5a1 1 0 0 1-1-1v-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 9v10M11 9v10M14.5 9v10M18 9v10M20 9v10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function DrinkCategoryIcon({ category }: { category: DrinkDefinition['category'] }) {
  const palette: Record<DrinkDefinition['category'], { bg: string; fg: string }> = {
    Beer: { bg: '#FEF3C7', fg: '#B45309' },
    Wine: { bg: '#FFE4E6', fg: '#BE123C' },
    Spirits: { bg: '#DDEEFF', fg: '#1B63D4' },
    Cider: { bg: '#DCFCE7', fg: '#15803D' },
    RTD: { bg: '#ECEAFF', fg: '#5B52DC' },
    Other: { bg: '#F3F4F6', fg: '#4A5260' },
  }
  const colours = palette[category]
  return (
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: colours.bg, color: colours.fg }}>
      <BarcodeIcon />
    </div>
  )
}

function TopBar({
  title,
  onBack,
  dark = false,
  backLabel,
}: {
  title: string
  onBack: () => void
  dark?: boolean
  backLabel: string
}) {
  return (
    <div className="barcode-topbar flex-shrink-0 px-4 h-[58px] flex items-center gap-3">
      <button
        type="button"
        className="w-11 h-11 rounded-full flex items-center justify-center active:opacity-65"
        style={{ color: dark ? '#FFFFFF' : '#1C1C1A', backgroundColor: dark ? 'rgba(255,255,255,0.12)' : '#F5F3EF' }}
        onClick={onBack}
        aria-label={backLabel}
      >
        <BackIcon />
      </button>
      <h1 className="font-display text-[28px] leading-tight" style={{ color: dark ? '#FFFFFF' : '#1C1C1A' }}>{title}</h1>
    </div>
  )
}

function ProcessingSpinner() {
  return <div className="barcode-spinner" aria-hidden="true" />
}

export default function BarcodeScannerPage({
  onBack,
  onUseDrink,
  onRecordManually,
}: {
  onBack: () => void
  onUseDrink: (drink: DrinkDefinition) => void
  onRecordManually: () => void
}) {
  const [view, setView] = useState<ScannerView>('live')
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('requesting')
  const [matchedDrink, setMatchedDrink] = useState<DrinkDefinition>(prototypeMatchedDrink)
  const [showGuidance, setShowGuidance] = useState(false)
  const [detectorAvailable, setDetectorAvailable] = useState(false)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const scanTimerRef = useRef<number | null>(null)
  const detectingRef = useRef(false)
  const photoProcessVersionRef = useRef(0)

  const stopCamera = () => {
    if (scanTimerRef.current !== null) {
      window.clearInterval(scanTimerRef.current)
      scanTimerRef.current = null
    }
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }

  const resolveBarcode = (rawValue: string) => {
    const value = rawValue.trim()
    if (!value) return

    const match = prototypeDrinkByBarcode[value]
    if (match) {
      setMatchedDrink(match)
      setView('match')
    } else {
      setView('not-found')
    }
  }

  useEffect(() => {
    if (view !== 'live') {
      stopCamera()
      return
    }

    let cancelled = false
    let guidanceTimer: number | undefined

    const start = async () => {
      setShowGuidance(false)
      setDetectorAvailable(false)
      setCameraStatus('requesting')

      if (!navigator.mediaDevices?.getUserMedia) {
        console.warn('Camera API unavailable in this context.')
        setCameraStatus('not-granted')
        return
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        })

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        streamRef.current = stream
        setCameraStatus('granted')
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play().catch(() => undefined)
        }

        guidanceTimer = window.setTimeout(() => setShowGuidance(true), 15000)

        const Detector = (window as typeof window & { BarcodeDetector?: BarcodeDetectorCtor }).BarcodeDetector
        setDetectorAvailable(Boolean(Detector))
        if (!Detector) return

        const detector = new Detector({
          formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'itf'],
        })

        scanTimerRef.current = window.setInterval(async () => {
          const video = videoRef.current
          if (!video || video.readyState < 2 || detectingRef.current) return
          detectingRef.current = true
          try {
            const results = await detector.detect(video)
            const value = results.find((result) => result.rawValue)?.rawValue
            if (value) resolveBarcode(value)
          } catch {
            // Keep scanning. A single unsuccessful detection attempt is not a user-facing failure state.
          } finally {
            detectingRef.current = false
          }
        }, 700)
      } catch (error) {
        if (cancelled) return
        const name = error instanceof DOMException ? error.name : 'UnknownError'
        console.warn(`Camera could not be started: ${name}`)
        setCameraStatus('not-granted')
      }
    }

    void start()

    return () => {
      cancelled = true
      if (guidanceTimer !== undefined) window.clearTimeout(guidanceTimer)
      stopCamera()
    }
  }, [view])

  const openPhotoPicker = () => fileInputRef.current?.click()

  const processPhoto = async (file: File) => {
    const processVersion = ++photoProcessVersionRef.current
    setView('photo-processing')

    const Detector = (window as typeof window & { BarcodeDetector?: BarcodeDetectorCtor }).BarcodeDetector
    if (!Detector) {
      window.setTimeout(() => {
        if (photoProcessVersionRef.current === processVersion) setView('photo-unreadable')
      }, 900)
      return
    }

    const imageUrl = URL.createObjectURL(file)
    try {
      const image = new Image()
      image.src = imageUrl
      await image.decode()
      if (photoProcessVersionRef.current !== processVersion) return

      const detector = new Detector({
        formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'itf'],
      })
      const results = await detector.detect(image)
      if (photoProcessVersionRef.current !== processVersion) return

      const value = results.find((result) => result.rawValue)?.rawValue
      if (value) {
        resolveBarcode(value)
      } else {
        setView('photo-unreadable')
      }
    } catch {
      if (photoProcessVersionRef.current === processVersion) setView('photo-unreadable')
    } finally {
      URL.revokeObjectURL(imageUrl)
    }
  }

  const resetToScanner = () => {
    photoProcessVersionRef.current += 1
    setShowGuidance(false)
    setView('live')
  }

  const showPrototypeMatch = () => {
    setMatchedDrink(prototypeMatchedDrink)
    setView('match')
  }

  const showPrototypeNotFound = () => {
    setView('not-found')
  }

  const renderPrototypeControls = () => (
    <details className="barcode-prototype-controls">
      <summary>Prototype controls</summary>
      <p>Use these only to preview scanner states locally.</p>
      <div className="barcode-prototype-actions">
        <button type="button" onClick={showPrototypeMatch}>Matching drink</button>
        <button type="button" onClick={showPrototypeNotFound}>Drink not found</button>
        <button type="button" onClick={() => setShowGuidance(true)}>15-second guidance</button>
        <button type="button" onClick={() => setView('photo-unreadable')}>Unreadable photo</button>
      </div>
    </details>
  )

  const photoInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(event) => {
        const file = event.target.files?.[0]
        event.currentTarget.value = ''
        if (file) void processPhoto(file)
      }}
    />
  )

  if (view === 'live') {
    const cameraNotGranted = cameraStatus === 'not-granted'

    return (
      <div className="barcode-page barcode-page--camera flex-1 flex flex-col overflow-hidden relative">
        {photoInput}
        <TopBar title="Scan Barcode" onBack={onBack} dark backLabel="Back to Record" />

        <div className="barcode-camera-stage flex-1 min-h-0 relative overflow-hidden">
          <video
            ref={videoRef}
            className={`barcode-camera-video${cameraStatus === 'granted' ? '' : ' barcode-camera-video--hidden'}`}
            autoPlay
            muted
            playsInline
            aria-label="Live camera preview"
          />
          <div className="barcode-camera-shade" />

          {cameraStatus === 'granted' && (
            <>
              <div className="barcode-scan-frame" aria-hidden="true">
                <span className="barcode-corner barcode-corner--tl" />
                <span className="barcode-corner barcode-corner--tr" />
                <span className="barcode-corner barcode-corner--bl" />
                <span className="barcode-corner barcode-corner--br" />
                <div className="barcode-example-lines" />
              </div>

              <div className="barcode-camera-copy">
                <p>Position the barcode fully inside the frame.</p>
              </div>
            </>
          )}

          {cameraStatus === 'requesting' && (
            <div className="barcode-camera-status" role="status">
              <div className="barcode-camera-status-spinner" aria-hidden="true" />
              <p className="barcode-camera-status-title">Preparing camera…</p>
            </div>
          )}

          {cameraNotGranted && (
            <div className="barcode-camera-status barcode-camera-status--unavailable" role="status">
              <div className="barcode-camera-off-icon"><CameraOffIcon /></div>
              <h2 className="barcode-camera-status-title">Camera access wasn’t granted</h2>
              <p className="barcode-camera-status-copy">
                Live barcode scanning needs camera access. You can choose a photo below.
              </p>
            </div>
          )}

          {cameraStatus === 'granted' && showGuidance && (
            <div className="barcode-guidance-card" role="status">
              <div className="barcode-guidance-icon"><WarningIcon /></div>
              <div>
                <p className="barcode-guidance-title">Having trouble scanning?</p>
                <p>Keep the barcode clear, fully visible and well lit. The scanner will keep trying automatically.</p>
              </div>
            </div>
          )}
        </div>

        <div className="barcode-camera-footer app-scroll-nav-clearance flex-shrink-0">
          <button type="button" className="barcode-photo-button" onClick={openPhotoPicker}>
            <PhotoIcon />
            <span>Choose Photo</span>
          </button>
          {!detectorAvailable && cameraStatus === 'granted' && (
            <p className="barcode-browser-note">Live preview is working. Automatic barcode detection depends on browser support in this prototype.</p>
          )}
          {renderPrototypeControls()}
        </div>
      </div>
    )
  }

  if (view === 'photo-processing') {
    return (
      <div className="barcode-page flex-1 flex flex-col overflow-y-auto hide-scrollbar bg-white">
        <TopBar title="Scan Barcode" onBack={resetToScanner} backLabel="Back to Barcode Scanner" />
        <div className="barcode-state-page flex-1 responsive-form-inner px-6 app-scroll-nav-clearance" role="status">
          <ProcessingSpinner />
          <h2 className="font-display text-[31px] text-[#1C1C1A] text-center leading-tight mt-6">Analysing image…</h2>
          <p className="text-[17px] text-[#56524F] text-center leading-relaxed mt-3">Looking for a readable barcode.</p>
        </div>
      </div>
    )
  }

  if (view === 'photo-unreadable') {
    return (
      <div className="barcode-page flex-1 flex flex-col overflow-y-auto hide-scrollbar bg-white">
        {photoInput}
        <TopBar title="Scan Barcode" onBack={resetToScanner} backLabel="Back to Barcode Scanner" />
        <div className="barcode-state-page flex-1 responsive-form-inner px-6 app-scroll-nav-clearance">
          <div className="barcode-state-icon barcode-state-icon--warning"><PhotoIcon /></div>
          <h2 className="font-display text-[31px] text-[#1C1C1A] text-center leading-tight mt-5">We couldn’t read the barcode</h2>
          <p className="text-[17px] text-[#56524F] text-center leading-relaxed mt-3 max-w-[430px]">
            Make sure the barcode is clear, fully visible and well lit, then choose another photo.
          </p>
          <button type="button" className="barcode-primary-button mt-8 max-w-[430px]" onClick={openPhotoPicker}>
            <PhotoIcon />
            <span>Choose Another Photo</span>
          </button>
          {renderPrototypeControls()}
        </div>
      </div>
    )
  }

  if (view === 'not-found') {
    return (
      <div className="barcode-page flex-1 flex flex-col overflow-y-auto hide-scrollbar bg-white">
        <TopBar title="Scan Barcode" onBack={resetToScanner} backLabel="Back to Barcode Scanner" />
        <div className="barcode-state-page flex-1 responsive-form-inner px-6 app-scroll-nav-clearance">
          <div className="barcode-state-icon barcode-state-icon--warning"><BarcodeIcon /></div>
          <h2 className="font-display text-[31px] text-[#1C1C1A] text-center leading-tight mt-5">Drink not found</h2>
          <p className="text-[17px] text-[#56524F] text-center leading-relaxed mt-3 max-w-[430px]">We couldn’t find a matching drink in our database.</p>

          <div className="w-full max-w-[430px] mt-8 space-y-3">
            <button type="button" className="barcode-primary-button" onClick={onRecordManually}>Add Drink Manually</button>
            <button type="button" className="barcode-secondary-button" onClick={resetToScanner}>Scan Another Barcode</button>
          </div>
          {renderPrototypeControls()}
        </div>
      </div>
    )
  }

  return (
    <div className="barcode-page flex-1 flex flex-col overflow-y-auto hide-scrollbar bg-white">
      <TopBar title="Scan Barcode" onBack={resetToScanner} backLabel="Back to Barcode Scanner" />
      <div className="barcode-state-page flex-1 responsive-form-inner px-6 app-scroll-nav-clearance">
        <div className="mt-4"><DrinkCategoryIcon category={matchedDrink.category} /></div>
        <h2 className="font-display text-[34px] text-[#1C1C1A] text-center leading-tight mt-5">{matchedDrink.name}</h2>
        <p className="text-[17px] text-[#56524F] text-center leading-relaxed mt-2">
          {matchedDrink.category} · {matchedDrink.abv}% ABV · {matchedDrink.sizeMl} mL {matchedDrink.containerType.toLowerCase()}
        </p>
        <p className="text-[15px] text-[#647280] text-center leading-relaxed mt-4 max-w-[420px]">Check that this is the drink you want to record before continuing.</p>

        <div className="w-full max-w-[430px] mt-8 space-y-3">
          <button type="button" className="barcode-primary-button" onClick={() => onUseDrink(matchedDrink)}>Use This Drink</button>
          <button type="button" className="barcode-secondary-button" onClick={resetToScanner}>Scan Again</button>
        </div>
        {renderPrototypeControls()}
      </div>
    </div>
  )
}
