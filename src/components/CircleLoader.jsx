import { InlinePitchLoader } from './PitchLoader';

// The app's in-page loader: the pitch drawing itself in 3D (variant 13), shown only if loading takes more
// than 300ms. `size` is kept from the old five-orb loader; the pitch is a little wider than that.
export default function CircleLoader({ size = 50 }) {
  return <InlinePitchLoader width={Math.round(size * 1.4)} />;
}
