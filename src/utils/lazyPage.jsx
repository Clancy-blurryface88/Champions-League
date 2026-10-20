import React, { lazy } from "react";
import CircleLoader from "@/components/CircleLoader";

// Pages that load on demand live in their own hashed file, and every deploy
// replaces those files. An app opened before a deploy then asks for a file that
// no longer exists — so reload once to pick up the new build. A short guard
// stops a reload loop if the file is missing for some other reason.
const RELOAD_KEY = "chunk-reload-at";
export function reloadOnceForNewBuild() {
  let last = 0;
  try { last = Number(sessionStorage.getItem(RELOAD_KEY)) || 0; } catch {}
  if (Date.now() - last < 30000) return false;
  try { sessionStorage.setItem(RELOAD_KEY, String(Date.now())); } catch {}
  window.location.reload();
  return true;
}

// React.lazy that reloads into the new build when its file is gone (and keeps
// showing the loader while the page reloads, instead of crashing the app)
export const lazyPage = (load) => lazy(() => load().catch((err) => {
  if (reloadOnceForNewBuild()) return new Promise(() => {});
  throw err;
}));

// Shown inside the layout (header and menus stay usable) while such a page loads
export function PageLoader() {
  return (
    <div className="flex items-center justify-center" style={{ minHeight: "60vh" }}>
      <CircleLoader size={64} />
    </div>
  );
}

// If the page still can't load, say so in the content area — the rest of the app keeps working
export class PageErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="flex flex-col items-center justify-center gap-3 text-center px-6" style={{ minHeight: "60vh" }} dir="rtl">
        <p className="text-white text-base font-semibold">לא הצלחנו לטעון את העמוד</p>
        <button onClick={() => window.location.reload()} className="px-5 py-2 rounded-full bg-white text-slate-900 font-bold text-sm">רענון</button>
      </div>
    );
  }
}
