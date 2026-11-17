// How a match card slides in and out on the round page (stories). `custom` is the direction:
// 1 = going to the next match (it comes in from the left, the old card leaves to the right — the app is
// right-to-left), -1 = to the previous one.
// The demo harness can try other transitions by setting window.__storySlide = { variants, transition }.

export const STORY_SLIDE = {
  variants: {
    enter: (d) => ({ x: d > 0 ? -380 : 380, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? 380 : -380, opacity: 0 }),
  },
  transition: { x: { type: 'spring', stiffness: 260, damping: 30 }, opacity: { duration: 0.2 } },
};

export const storySlide = () => (typeof window !== 'undefined' && window.__storySlide) || STORY_SLIDE;
