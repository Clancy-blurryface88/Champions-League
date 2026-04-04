import { BubbleBackground } from '@/components/animate-ui/components/backgrounds/bubble';

// Gold | Green | White
const COLORS = {
  first:  '234,179,8',    // gold
  second: '34,197,94',    // green-500
  third:  '255,255,255',  // white
  fourth: '161,122,6',    // dark gold
  fifth:  '74,222,128',   // green-400
  sixth:  '253,224,71',   // yellow-300
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
