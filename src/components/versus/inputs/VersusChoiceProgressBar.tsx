export default function VersusChoiceProgressBar({ percent = 0 }: { percent: number }) {
  return (
    <div
      className="flex justify-end w-full h-2 bg-linear-to-r from-rose-600 to-rose-400 rounded-full overflow-hidden"
      // role="progressbar"
      // aria-valuenow="50"
      // aria-valuemin="0"
      // aria-valuemax="100"
    >
      <div
        className="flex flex-col justify-center rounded-l-[-9999px] rounded-r-full overflow-hidden bg-stone-100 text-xs text-white text-center whitespace-nowrap transition duration-500"
        style={{ width: `${100 - percent}%` }}
      ></div>
    </div>
  );
}
