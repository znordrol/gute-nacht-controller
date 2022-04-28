import { add, intervalToDuration, isAfter, isWithinInterval } from 'date-fns';
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

export const isADayAfter = (dDay: Date) =>
  isWithinInterval(new Date(), {
    start: dDay,
    end: add(dDay, { days: 1 }),
  });

export const getAnnualCountdownDate = (d: Date) =>
  isAfter(new Date(), add(d, { days: 1 })) ? add(d, { years: 1 }) : d;

export const getMonthlyCountdownDate = (d: Date) =>
  isAfter(new Date(), add(d, { days: 1 })) ? add(d, { months: 1 }) : d;

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

  if (isADayAfter(endDate)) {
    return (
      <h2 className={clsxm('space-x-4 text-5xl', className)}>
        <span>0 Bulan</span>
        <span>0 Hari</span>
        <span>0 Jam</span>
        <span>0 Menit</span>
        <span>0 Detik</span>
      </h2>
    );
  }

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
