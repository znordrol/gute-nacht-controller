import Confetti from 'react-confetti';
import { useScrollbarWidth, useWindowScroll, useWindowSize } from 'react-use';

const drawHeart = (ctx: CanvasRenderingContext2D) => {
  const w = 12,
    h = 12;
  const d = Math.min(w, h);
  const k = 0;
  ctx.beginPath();
  ctx.moveTo(k, k + d / 4);
  ctx.quadraticCurveTo(k, k, k + d / 4, k);
  ctx.quadraticCurveTo(k + d / 2, k, k + d / 2, k + d / 4);
  ctx.quadraticCurveTo(k + d / 2, k, k + (d * 3) / 4, k);
  ctx.quadraticCurveTo(k + d, k, k + d, k + d / 4);
  ctx.quadraticCurveTo(k + d, k + d / 2, k + (d * 3) / 4, k + (d * 3) / 4);
  ctx.lineTo(k + d / 2, k + d);
  ctx.lineTo(k + d / 4, k + (d * 3) / 4);
  ctx.quadraticCurveTo(k, k + d / 2, k, k + d / 4);
  ctx.stroke();
  ctx.fill();
  ctx.closePath();
};

const Confettia = () => {
  const { height, width } = useWindowSize();
  const { y } = useWindowScroll();
  const sbw = useScrollbarWidth();

  return (
    <Confetti
      width={width - (sbw ?? 0)}
      height={height + y}
      confettiSource={{ x: 0, y, w: width, h: 0 }}
      drawShape={drawHeart}
      numberOfPieces={100}
    />
  );
};

export default Confettia;
