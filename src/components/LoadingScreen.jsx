import CircleLoader from "./CircleLoader";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#020817] z-[9999]">
      <CircleLoader size={80} />
    </div>
  );
}
