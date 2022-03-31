import type { Transition } from 'framer-motion';
import { motion } from 'framer-motion';

export type AnimatedLProps = {
  stroke: string;
  d: string;
  transition?: Transition;
};

const AnimatedL = ({
  d,
  stroke = 'rgba(255, 255, 255, 0.69)',
  transition = { duration: 3, yoyo: Infinity, ease: 'easeInOut' },
}: AnimatedLProps) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 231.94 215.04'
      width={250}
      height={250}
    >
      <motion.path
        d={d}
        fill='transparent'
        strokeWidth='12'
        stroke={stroke}
        strokeLinecap='round'
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={transition}
        transform='translate(-72.03 -105.46)'
      />
    </svg>
  );
};

export default AnimatedL;
