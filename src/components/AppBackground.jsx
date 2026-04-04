import { BubbleBackground } from '@/components/animate-ui/components/backgrounds/bubble';

// Yellow | Black | Royal Blue
const COLORS = {
  first:  '65,105,225',   // royal blue
  second: '234,179,8',    // yellow-500
  third:  '29,78,216',    // blue-700
  fourth: '253,224,71',   // yellow-300
  fifth:  '99,132,255',   // blue-400 light
  sixth:  '161,122,6',    // gold dark
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
