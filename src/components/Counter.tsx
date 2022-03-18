import { intervalToDuration } from 'date-fns';
import { useEffect, useState } from 'react';

import clsxm from '@/lib/clsxm';

export type CounterType = {
  endDate: Date;
} & React.ComponentPropsWithoutRef<'h2'>;

const calculateTimeLeft = (endDate: Date) =>
  intervalToDuration({
    start: new Date(),
    end: endDate,
  });

const Counter = ({ className, endDate }: CounterType) => {
  const [timeLeft, setTimeLeft] = useState<Duration>(
    calculateTimeLeft(endDate)
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(endDate));
    }, 500);

    return () => clearTimeout(timer);
  });

  return (
    <h2 className={clsxm('space-x-4 text-5xl', className)}>
      {(timeLeft.months as number) > 0 && <span>{timeLeft.months} Bulan</span>}
      {(timeLeft.days as number) > 0 && <span>{timeLeft.days} Hari</span>}
      {(timeLeft.hours as number) > 0 && <span>{timeLeft.hours} Jam</span>}
      {(timeLeft.minutes as number) > 0 && (
        <span>{timeLeft.minutes} Menit</span>
      )}
      {(timeLeft.seconds as number) > 0 && (
        <span>{timeLeft.seconds} Detik</span>
      )}
    </h2>
  );
};

export default Counter;
