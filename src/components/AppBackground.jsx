import { BubbleBackground } from '@/components/animate-ui/components/backgrounds/bubble';

// Green 500: 34,197,94 | Blue 500: 59,130,246
const COLORS = {
  first:  '59,130,246',   // blue-500
  second: '34,197,94',    // green-500
  third:  '96,165,250',   // blue-400
  fourth: '74,222,128',   // green-400
  fifth:  '37,99,235',    // blue-600
  sixth:  '22,163,74',    // green-600
};

export default function AppBackground() {
  return (
    <BubbleBackground
      interactive={true}
      colors={COLORS}
      className="fixed inset-0 bg-[#030d0a]"
    />
  );
}
