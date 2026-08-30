import svgPaths from "./svg-ef7j4t6qdn";

export default function IconTrophy({ className }: { className?: string }) {
  return (
    <div className={className || "relative size-[24px]"} data-name="__Icon/Trophy">
      <div className="absolute inset-[16.67%_33.33%_45.83%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-11.11%_-12.5%]">
          <svg className="block size-full" fill="none" height="11" preserveAspectRatio="none" viewBox="0 0 10 11" width="10">
            <path d={svgPaths.p1098ceb0} id="Vector" stroke="#68707C" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[16.67%] left-[16.67%] right-[16.67%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-7.14%_-6.25%]">
          <svg className="block size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 18 16" width="18">
            <path d={svgPaths.pfbf8000} id="Vector" stroke="#68707C" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}