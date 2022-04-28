import Confetti from 'react-confetti';
import { useScrollbarWidth, useWindowScroll, useWindowSize } from 'react-use';

const Confettia = () => {
  const { height, width } = useWindowSize();
  const { y } = useWindowScroll();
  const sbw = useScrollbarWidth();

  return (
    <Confetti
      width={width - (sbw ?? 0)}
      height={height + y}
      confettiSource={{ x: 0, y, w: width, h: 0 }}
    />
  );
};

export default Confettia;
