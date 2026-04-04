import { BubbleBackground } from '@/components/animate-ui/components/backgrounds/bubble';

// Gold | White
const COLORS = {
  first:  '234,179,8',    // gold
  second: '255,255,255',  // white
  third:  '253,224,71',   // yellow-300
  fourth: '161,122,6',    // dark gold
  fifth:  '255,215,0',    // pure gold
  sixth:  '245,245,220',  // beige/white
};

export default function AppBackground() {
  return (
    <BubbleBackground
      interactive={true}
      colors={COLORS}
      className="fixed inset-0 bg-[#05050f]"
    />
  );
}
