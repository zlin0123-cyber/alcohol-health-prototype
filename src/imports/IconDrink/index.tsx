export default function IconDrink({ className }: { className?: string }) {
  return (
    <div className={className || "relative size-[24px]"} data-name="__Icon/Drink">
      <div className="absolute inset-[16.67%_29.17%_33.33%_29.17%]" data-name="Vector">
        <div className="absolute inset-[-8.33%_-10%]">
          <svg className="block size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 12 14" width="12">
            <path d="M1 1H11L10 13H2L1 1Z" id="Vector" stroke="#68707C" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[37.5%_33.33%_16.67%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-9.09%_-12.5%]">
          <svg className="block size-full" fill="none" height="13" preserveAspectRatio="none" viewBox="0 0 10 13" width="10">
            <path d="M1 1H9M3 12H7M5 8V12" id="Vector" stroke="#68707C" strokeLinecap="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}