import { useEffect, useMemo, useRef, useState } from "react";
import "./text-animator.css";

const DEFAULT_RUNTIME = {
  tileSpeed: 0.72,
  tileHoldMs: 550,
  tileGapMs: 320,
  tileYTravel: 0.58,
};

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function cn(...classes) { return classes.filter(Boolean).join(" "); }

function getScrollParent(node) {
  let el = node?.parentElement ?? null;
  while (el && el !== document.body && el !== document.documentElement) {
    const oy = getComputedStyle(el).overflowY;
    if (oy === "auto" || oy === "scroll") return el;
    el = el.parentElement;
  }
  return null;
}

function splitTextByTarget(text, target) {
  if (target === "whole") return [{ text, animate: true }];
  if (target === "per-word") {
    const parts = [];
    for (const m of text.matchAll(/(\S+|\s+)/g)) parts.push({ text: m[0], animate: /\S/.test(m[0]) });
    return parts;
  }
  if (target === "per-line") return text.split("\n").map(line => ({ text: line, animate: true, block: true }));
  return [...text].map(c => ({ text: c, animate: true }));
}

function getStaggerRanks(count, mode = "normal") {
  const order = [];
  if (mode === "center-out") {
    const center = (count - 1) / 2;
    for (let i = 0; i < count; i++) order.push(i);
    order.sort((a, b) => Math.abs(a - center) - Math.abs(b - center) || a - b);
  } else if (mode === "edges-in") {
    let l = 0, r = count - 1;
    while (l <= r) { order.push(l); if (r !== l) order.push(r); l++; r--; }
  } else if (mode === "reverse") {
    for (let i = count - 1; i >= 0; i--) order.push(i);
  } else {
    for (let i = 0; i < count; i++) order.push(i);
  }
  const ranks = Array.from({ length: count }, () => 0);
  order.forEach((index, rank) => { ranks[index] = rank; });
  return ranks;
}

function toAnimationFrame(values, yTravel) {
  const f = values ?? {};
  const frame = {
    filter: `blur(${f.blurPx ?? 0}px)`,
    letterSpacingEm: f.letterSpacingEm ?? null,
    opacity: f.opacity ?? 1,
    transform: `translate3d(${f.xPx ?? 0}px,${(f.yPx ?? 0) * yTravel}px,${f.zPx ?? 0}px) rotateX(${f.rotateXDeg ?? 0}deg) rotateY(${f.rotateYDeg ?? 0}deg) rotate(${f.rotateDeg ?? 0}deg) scale(${f.scale ?? 1})`,
  };
  if (f.color) frame.color = f.color;
  return frame;
}

function materializeTileFrame(frame, unit, index, count, target) {
  const k = { filter: frame.filter, letterSpacing: "0em", marginLeft: "0em", marginRight: "0em", opacity: frame.opacity, transform: frame.transform };
  if (frame.color) k.color = frame.color;
  if (frame.letterSpacingEm == null) return k;
  if (target === "per-character") {
    const text = unit.textContent ?? "";
    const isGlyph = /\S/.test(text);
    const halfGap = `${frame.letterSpacingEm / 2}em`;
    k.marginLeft = isGlyph && index > 0 ? halfGap : "0em";
    k.marginRight = isGlyph && index < count - 1 ? halfGap : "0em";
    return k;
  }
  k.letterSpacing = `${frame.letterSpacingEm}em`;
  return k;
}

function makeTitle(doc, text, target, titleClassName) {
  const title = doc.createElement("h3");
  title.className = cn("text-animation-title", titleClassName);
  const units = [];
  splitTextByTarget(text, target).forEach(part => {
    const unit = doc.createElement("span");
    unit.className = `text-animation-unit${part.block ? " line" : ""}`;
    unit.textContent = part.text;
    title.appendChild(unit);
    if (part.animate) units.push(unit);
  });
  return { title, units };
}

function applyPhaseStart(units, phase, spec, stage, yTravel) {
  const baseFrame = toAnimationFrame(spec[phase].from, yTravel);
  units.forEach((unit, index) => {
    const kf = materializeTileFrame(baseFrame, unit, index, units.length, spec.target ?? "per-character");
    Object.assign(unit.style, kf);
  });
  stage.dataset.animationPhase = phase;
}

function animatePhase(controller, units, phase, spec) {
  const { tileSpeed, tileYTravel } = controller.runtime;
  const currentPhase = spec[phase];
  const fromFrame = toAnimationFrame(currentPhase.from, tileYTravel);
  const toFrame = toAnimationFrame(currentPhase.to, tileYTravel);
  const duration = Math.max(140, Math.round(currentPhase.durationMs * tileSpeed));
  const delayStep = Math.max(0, Math.round(currentPhase.staggerMs * tileSpeed));
  const ranks = getStaggerRanks(units.length, spec.staggerMode ?? "normal");
  units.forEach((unit, index) => {
    const fromK = materializeTileFrame(fromFrame, unit, index, units.length, spec.target ?? "per-character");
    const toK = materializeTileFrame(toFrame, unit, index, units.length, spec.target ?? "per-character");
    registerAnimation(controller, unit.animate([fromK, toK], { delay: ranks[index] * delayStep, duration, easing: currentPhase.easing, fill: "forwards" }));
  });
  return duration + Math.max(0, units.length - 1) * delayStep;
}

function createLoop(stage, runtime, titleClassName) {
  return { animations: new Set(), cancelled: false, stage, timers: new Set(), pendingResolvers: new Set(), runtime, titleClassName };
}

function cleanupLoop(c) {
  c.cancelled = true;
  c.timers.forEach(t => window.clearTimeout(t));
  c.timers.clear();
  c.animations.forEach(a => a.cancel());
  c.animations.clear();
  c.pendingResolvers.forEach(resolve => resolve());
  c.pendingResolvers.clear();
  clearStage(c.stage);
}

function registerAnimation(c, a) {
  c.animations.add(a);
  void a.finished.finally(() => c.animations.delete(a));
  return a;
}

function schedule(c, cb, delay) {
  if (c.cancelled) return;
  const t = window.setTimeout(() => { c.timers.delete(t); if (!c.cancelled) cb(); }, delay);
  c.timers.add(t);
}

function sleep(c, delay) {
  if (c.cancelled || delay <= 0) return Promise.resolve();
  return new Promise(resolve => {
    const wrapped = () => { c.pendingResolvers.delete(wrapped); resolve(); };
    c.pendingResolvers.add(wrapped);
    schedule(c, wrapped, delay);
  });
}

function waitForAnimations(animations) {
  return Promise.all(animations.map(a => a.finished.catch(() => undefined)));
}

function clearStage(stage) {
  while (stage.firstChild) stage.removeChild(stage.firstChild);
}

function mix(a, b, t) { return a + (b - a) * t; }

function setKineticPose(el, frame) {
  el.style.filter = frame.filter;
  el.style.opacity = `${frame.opacity}`;
  el.style.transform = frame.transform;
}

function buildKineticFrame(x, y, scale, blur, opacity) {
  return { filter: `blur(${blur}px)`, opacity, transform: `translate(-50%,-50%) translate3d(${x}px,${y}px,0) scale(${scale})` };
}

function titleFrame(values, yTravel) {
  const f = values ?? {};
  return { filter: `blur(${f.blurPx ?? 0}px)`, opacity: f.opacity ?? 1, transform: `translate3d(${f.xPx ?? 0}px,${(f.yPx ?? 0) * yTravel}px,0) scale(${f.scale ?? 1})` };
}

async function runGenericLoop(c, spec, samples) {
  const { stage, runtime } = c;
  const target = spec.target ?? "per-character";
  const overlap = spec.swap?.mode === "crossfade" ? (spec.swap?.overlapMs ?? 0) : 0;
  let currentIndex = 0, currentTitle = null, currentUnits = [];

  const enterSample = text => {
    const { title, units } = makeTitle(stage.ownerDocument, text, target, c.titleClassName);
    applyPhaseStart(units, "enter", spec, stage, runtime.tileYTravel);
    clearStage(stage);
    stage.appendChild(title);
    currentTitle = title; currentUnits = units;
    return animatePhase(c, units, "enter", spec);
  };

  const firstEnter = enterSample(samples[currentIndex]);
  await sleep(c, firstEnter + runtime.tileHoldMs);

  while (!c.cancelled) {
    const oldTitle = currentTitle;
    const exitTotal = currentUnits.length ? animatePhase(c, currentUnits, "exit", spec) : 0;
    if (overlap > 0 && oldTitle) {
      await sleep(c, Math.max(0, exitTotal - overlap));
      if (c.cancelled) break;
      currentIndex = (currentIndex + 1) % samples.length;
      const next = makeTitle(stage.ownerDocument, samples[currentIndex], target, c.titleClassName);
      applyPhaseStart(next.units, "enter", spec, stage, runtime.tileYTravel);
      stage.appendChild(next.title);
      const nextEnter = animatePhase(c, next.units, "enter", spec);
      schedule(c, () => oldTitle.remove(), overlap);
      currentTitle = next.title; currentUnits = next.units;
      await sleep(c, nextEnter + runtime.tileHoldMs);
    } else {
      const microDelay = spec.swap?.microDelayMs ?? 0;
      await sleep(c, exitTotal + microDelay);
      if (c.cancelled) break;
      currentIndex = (currentIndex + 1) % samples.length;
      const next = makeTitle(stage.ownerDocument, samples[currentIndex], target, c.titleClassName);
      applyPhaseStart(next.units, "enter", spec, stage, runtime.tileYTravel);
      clearStage(stage); stage.appendChild(next.title);
      currentTitle = next.title; currentUnits = next.units;
      await sleep(c, runtime.tileGapMs);
      if (c.cancelled) break;
      const nextEnter = animatePhase(c, next.units, "enter", spec);
      await sleep(c, nextEnter + runtime.tileHoldMs);
    }
  }
}

export default function TextAnimator({ spec, samples, phrases, className, stageClassName, titleClassName, speed, holdMs, gapMs, yTravel }) {
  const stageRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const samplesKey = useMemo(() => samples?.join("") ?? "", [samples]);
  const samplesRef = useRef(samples);
  samplesRef.current = samples;
  const effectiveSamples = samples?.length ? samples : ["Animation"];

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    setFailed(false);
    if (spec.id) stage.dataset.animationId = spec.id;
    const runtime = {
      tileSpeed: speed ?? DEFAULT_RUNTIME.tileSpeed,
      tileHoldMs: holdMs ?? DEFAULT_RUNTIME.tileHoldMs,
      tileGapMs: gapMs ?? DEFAULT_RUNTIME.tileGapMs,
      tileYTravel: yTravel ?? DEFAULT_RUNTIME.tileYTravel,
    };
    const controller = createLoop(stage, runtime, titleClassName);
    const liveSamples = samplesRef.current;
    const eff = liveSamples?.length ? liveSamples : ["Animation"];
    const launch = () => {
      const loop = runGenericLoop(controller, spec, eff);
      void loop.catch(error => {
        if (!controller.cancelled) { console.error("TextAnimator error", error); setFailed(true); cleanupLoop(controller); }
      });
    };
    schedule(controller, launch, Math.random() * 200);
    return () => cleanupLoop(controller);
  }, [spec, samplesKey, speed, holdMs, gapMs, yTravel, titleClassName]);

  return (
    <div className={cn("relative flex w-full items-center justify-center overflow-hidden", className)}>
      <div ref={stageRef} className={cn("text-animation-stage absolute inset-0", stageClassName)}>
        {failed && effectiveSamples[0] ? (
          <h3 className={cn("text-animation-title text-animation-fallback", titleClassName)}>{effectiveSamples[0]}</h3>
        ) : null}
      </div>
    </div>
  );
}
