import svgPaths from "./svg-nz1pqxbt8f";

export default function IconBook({ className }: { className?: string }) {
  return (
    <div className={className || "relative size-[24px]"} data-name="__Icon/Book">
      <div className="absolute bottom-[17.92%] left-[14.58%] right-1/2 top-[20.1%]" data-name="Vector">
        <div className="absolute inset-[-6.72%_-11.76%]">
          <svg className="block size-full" fill="none" height="16.875" preserveAspectRatio="none" viewBox="0 0 10.5 16.875" width="10.5">
            <path d={svgPaths.p216ff900} id="Vector" stroke="#68707C" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[17.92%] left-1/2 right-[14.58%] top-[20.1%]" data-name="Vector">
        <div className="absolute inset-[-6.72%_-11.76%]">
          <svg className="block size-full" fill="none" height="16.875" preserveAspectRatio="none" viewBox="0 0 10.5 16.875" width="10.5">
            <path d={svgPaths.p385c4d80} id="Vector" stroke="#68707C" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}