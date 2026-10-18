import React, { useEffect, useState } from "react";
import { supabase } from "@/api/supabase";

// Who is subscribed to pushes: every participant with their OneSignal push
// subscriptions, matched by external_id (= Supabase user id, set on login).
// Devices that subscribed before login linking existed show up here only
// after the participant opens the app again.

const box = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" };

const fmtDate = (iso) => iso
  ? new Intl.DateTimeFormat("he-IL", { timeZone: "Asia/Jerusalem", day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(iso))
  : "";

const statusOf = (u) => {
  if (u.error) return { label: "שגיאה", cls: "text-amber-300" };
  if (u.subscriptions.some((s) => s.enabled)) return { label: "רשום ✅", cls: "text-emerald-300" };
  if (u.subscriptions.length) return { label: "חסם התראות", cls: "text-red-300" };
  return { label: "לא רשום", cls: "text-slate-500" };
};

// What OneSignal knows on the device the admin is using right now, plus a
// button that links it by hand and shows the error if linking fails.
function ThisDevice() {
  const [state, setState] = useState(null);
  const [msg, setMsg] = useState(null);

  const read = () => new Promise((resolve) => {
    if (!window.OneSignalDeferred) return resolve({ sdk: false });
    const timer = setTimeout(() => resolve({ sdk: false }), 5000);
    window.OneSignalDeferred.push((OneSignal) => {
      clearTimeout(timer);
      resolve({
        sdk: true,
        permission: OneSignal.Notifications?.permission,
        optedIn: OneSignal.User?.PushSubscription?.optedIn,
        subscriptionId: OneSignal.User?.PushSubscription?.id,
        onesignalId: OneSignal.User?.onesignalId,
        externalId: OneSignal.User?.externalId,
      });
    });
  });

  const refresh = async () => setState(await read());
  useEffect(() => { refresh(); }, []);

  const link = async () => {
    setMsg("מקשר...");
    try {
      const { data } = await supabase.auth.getSession();
      const id = data.session?.user?.id;
      if (!id) throw new Error("לא מחובר");
      await new Promise((resolve, reject) => window.OneSignalDeferred.push((OneSignal) => OneSignal.login(id).then(resolve, reject)));
      setMsg("קושר ✅");
    } catch (e) {
      setMsg(`הקישור נכשל: ${e?.message || e}`);
    }
    refresh();
  };

  const row = (label, value) => (
    <p className="text-[11px] text-slate-400">{label}: <span className="font-mono text-slate-200 break-all" dir="ltr">{String(value ?? "—")}</span></p>
  );

  return (
    <div className="rounded-2xl p-3 space-y-1" style={box}>
      <p className="text-sm font-bold text-white mb-1">📱 המכשיר הזה</p>
      {!state ? <p className="text-[11px] text-slate-500">בודק...</p> : !state.sdk ? (
        <p className="text-[11px] text-red-300">OneSignal לא נטען במכשיר הזה</p>
      ) : (
        <>
          {row("הרשאת התראות", state.permission)}
          {row("רשום להתראות", state.optedIn)}
          {row("מזהה מנוי", state.subscriptionId)}
          {row("מזהה OneSignal", state.onesignalId)}
          {row("מקושר למשתמש", state.externalId)}
        </>
      )}
      <button type="button" onClick={link} className="mt-1 text-xs px-3 py-1.5 rounded-lg border border-sky-400/50 text-sky-200">קשר את המכשיר הזה אליי</button>
      {msg && <p className="text-[11px] text-slate-300">{msg}</p>}
    </div>
  );
}

export default function AdminPushSubscribers() {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await supabase.auth.getSession();
      const r = await fetch("/api/football?source=admin-subscribers", {
        headers: { Authorization: `Bearer ${data.session?.access_token || ""}` },
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || r.status);
      setUsers(j.users);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const subscribed = users?.filter((u) => u.subscriptions.some((s) => s.enabled)).length ?? 0;
  // Subscribed first, then blocked, then not subscribed.
  const rank = (u) => (u.subscriptions.some((s) => s.enabled) ? 0 : u.subscriptions.length ? 1 : 2);
  const sorted = users ? [...users].sort((a, b) => rank(a) - rank(b)) : [];

  return (
    <div dir="rtl" className="space-y-3 max-w-xl">
      <div className="flex items-end justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">🔔 מי רשום להתראות</h2>
          {users && <p className="text-slate-400 text-sm">{subscribed} מתוך {users.length} משתתפים רשומים</p>}
        </div>
        <button type="button" onClick={load} disabled={loading}
          className="text-xs px-3 py-1.5 rounded-lg border border-white/15 text-slate-300 disabled:opacity-40">
          {loading ? "טוען..." : "רענון"}
        </button>
      </div>
      <p className="text-[11px] text-slate-500">משתתף שנרשם לפני העדכון יופיע כרשום רק אחרי שייכנס שוב לאפליקציה.</p>

      <ThisDevice />

      {error && <p className="text-sm text-red-300">הטעינה נכשלה: {error}</p>}

      {users && (
        <div className="rounded-2xl divide-y divide-white/5" style={box}>
          {sorted.map((u) => {
            const st = statusOf(u);
            return (
              <div key={u.id} className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-white truncate">{u.name}</p>
                  <span className={`text-xs shrink-0 ${st.cls}`}>{st.label}</span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono break-all" dir="ltr">{u.id}</p>
                {u.subscriptions.map((s) => (
                  <p key={s.id} className="text-[11px] text-slate-400 mt-0.5" dir="ltr">
                    {s.enabled ? "🟢" : "🔴"} {s.device || s.type} · <span className="font-mono">{s.id}</span>
                    {s.lastActive && ` · ${fmtDate(s.lastActive)}`}
                  </p>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
