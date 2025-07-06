export default function ChoiceRateBar({ percentage }: { percentage: number }) {
  return (
    <div className="relative w-full h-full rounded-[28px] overflow-hidden">
      <div
        className="absolute w-full h-full bg-indigo-700 transition-transform duration-1000"
        style={{ translate: `-${100 - percentage}% 0` }}
      ></div>
    </div>
  );
}
