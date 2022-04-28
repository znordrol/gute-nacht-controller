import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const Confettia = () => {
  const { width, height } = useWindowSize();
  return <Confetti width={width} height={height} />;
};

export default Confettia;
