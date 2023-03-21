export const Spinner = () => {
  return (
    <div className="flex flex-col items-center justify-center fixed top-0 z-50 left-0 w-full h-full bg-white bg-opacity-60">
      <div className="animate-spin h-10 w-10 border-4 border-[#10a37f] rounded-full border-t-transparent"></div>
    </div>
  );
}
