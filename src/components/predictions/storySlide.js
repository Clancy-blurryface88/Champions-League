// How a match card changes on the round page (stories). `custom` is the direction:
// 1 = going to the next match (it comes in from the left, the app is right-to-left), -1 = the previous one.
// Parallax: the new card slides in over the old one with a little spring, slightly larger then settling;
// the old card drifts a short way back, shrinks a touch and fades — it seems to stay behind.
// The demo harness can try other transitions by setting window.__storySlide = { variants, transition }.

export const STORY_SLIDE = {
  variants: {
    enter: (d) => ({ x: d > 0 ? -380 : 380, scale: 1.04, opacity: 1 }),
    center: { x: 0, scale: 1, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? 114 : -114, scale: 0.94, opacity: 0 }),
  },
  transition: { default: { type: 'spring', stiffness: 240, damping: 24 }, opacity: { duration: 0.3 } },
};

export const storySlide = () => (typeof window !== 'undefined' && window.__storySlide) || STORY_SLIDE;
