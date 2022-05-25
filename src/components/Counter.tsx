import { add, intervalToDuration, isAfter, isWithinInterval } from 'date-fns';
import { useEffect, useState } from 'react';

import clsxm from '@/lib/clsxm';

export type CounterType = {
  numberClassName?: string;
  colWrapperClassName?: string;
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

const Counter = ({
  className,
  endDate,
  numberClassName,
  colWrapperClassName,
}: CounterType) => {
  const [timeLeft, setTimeLeft] = useState<Duration>();

  useEffect(() => {
    setInterval(() => {
      setTimeLeft(calculateTimeLeft(endDate));
    }, 500);
  }, [endDate]);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft(endDate));
  }, [endDate]);

  return (
    <div
      className={clsxm(
        'grid grid-cols-5 divide-x divide-neutral-400',
        className
      )}
    >
      <div
        className={clsxm(
          'flex flex-col items-center justify-center px-4',
          colWrapperClassName
        )}
      >
        <h2 className={numberClassName}>
          {isADayAfter(endDate) ? 0 : timeLeft?.months}
        </h2>
        <p>Bulan</p>
      </div>
      <div>
        <h2 className={numberClassName}>
          {isADayAfter(endDate) ? 0 : timeLeft?.days}
        </h2>
        <p>Hari</p>
      </div>
      <div>
        <h2 className={numberClassName}>
          {isADayAfter(endDate) ? 0 : timeLeft?.hours}
        </h2>
        <p>Jam</p>
      </div>
      <div>
        <h2 className={numberClassName}>
          {isADayAfter(endDate) ? 0 : timeLeft?.minutes}
        </h2>
        <p>Menit</p>
      </div>
      <div>
        <h2 className={numberClassName}>
          {isADayAfter(endDate) ? 0 : timeLeft?.seconds}
        </h2>
        <p>Detik</p>
      </div>
    </div>
  );
};

export default Counter;
