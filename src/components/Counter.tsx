import { add, intervalToDuration, isAfter, isWithinInterval } from 'date-fns';
import { useEffect, useState } from 'react';

import clsxm from '@/lib/clsxm';

export type CounterType = {
  numberClassName?: string;
  colWrapperClassName?: string;
  endDate: Date;
} & React.ComponentPropsWithoutRef<'h2'>;

const calculateTimeLeft = (endDate: Date) => {
  const now = new Date();
  if (now > endDate) return;
  return intervalToDuration({
    start: new Date(),
    end: endDate,
  });
};

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

  if (isADayAfter(endDate)) {
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
          <h2 className={numberClassName}>0</h2>
          <p>Bulan</p>
        </div>
        <div>
          <h2 className={numberClassName}>0</h2>
          <p>Hari</p>
        </div>
        <div>
          <h2 className={numberClassName}>0</h2>
          <p>Jam</p>
        </div>
        <div>
          <h2 className={numberClassName}>0</h2>
          <p>Menit</p>
        </div>
        <div>
          <h2 className={numberClassName}>0</h2>
          <p>Detik</p>
        </div>
      </div>
    );
  }

  const timeLefts = [
    ...(timeLeft?.months ? [{ t: timeLeft.months, label: 'Bulan' }] : []),
    ...(timeLeft?.days ? [{ t: timeLeft.days, label: 'Hari' }] : []),
    ...(timeLeft?.hours ? [{ t: timeLeft.hours, label: 'Jam' }] : []),
    ...(timeLeft?.minutes ? [{ t: timeLeft.minutes, label: 'Menit' }] : []),
    ...(timeLeft?.seconds ? [{ t: timeLeft.seconds, label: 'Detik' }] : []),
  ];

  return (
    <div
      className={clsxm(
        'grid divide-x divide-neutral-400',
        timeLefts.length === 1 && 'grid-cols-1',
        timeLefts.length === 2 && 'grid-cols-2',
        timeLefts.length === 3 && 'grid-cols-3',
        timeLefts.length === 4 && 'grid-cols-4',
        timeLefts.length === 5 && 'grid-cols-5',
        className
      )}
    >
      {timeLefts.map(({ t, label }) => (
        <div
          className={clsxm(
            'flex flex-col items-center justify-center px-4',
            colWrapperClassName
          )}
          key={label}
        >
          <h2 className={numberClassName}>{t}</h2>
          <p>{label}</p>
        </div>
      ))}
    </div>
  );
};

export default Counter;
