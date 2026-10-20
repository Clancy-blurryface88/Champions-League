import { createContext, useContext } from 'react';

// True once the opening intro video (App.jsx) has finished. The app renders
// underneath the video while it plays, so anything that pops up on its own at
// startup (auto-closing intros, the onboarding video, the push invite) waits
// for this instead of firing unseen behind the video. Defaults to true so
// screens rendered without App (demo harness) aren't held back.
export const AppIntroContext = createContext(true);
export const useAppIntroDone = () => useContext(AppIntroContext);
