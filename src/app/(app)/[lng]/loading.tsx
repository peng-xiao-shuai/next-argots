export default function LoadingRender() {
  return (
    <div
      className={`transition-all duration-300 h-full flex items-center justify-center`}
    >
      <div className="flex items-end font-bold">
        <span>Loading</span>
        <span className="loading loading-dots loading-xs ml-1 leading-9"></span>
      </div>
    </div>
  );
}
