import { useEffect, useState } from 'react';

const BASE_TARGET_DATE = new Date('2026-07-24T00:00:00');

export type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTargetDate(extensionDays: number) {
  const extensionMs = extensionDays * 24 * 60 * 60 * 1000;
  return new Date(BASE_TARGET_DATE.getTime() + extensionMs);
}

function computeTimeLeft(now: number, extensionDays: number): TimeLeft {
  const distance = getTargetDate(extensionDays).getTime() - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));

  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  const minutes = Math.floor(
    (distance % (1000 * 60 * 60)) / (1000 * 60)
  );

  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

export function useCountdown(extensionDays = 0) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    computeTimeLeft(getTargetDate(extensionDays).getTime(), extensionDays)
  );

  useEffect(() => {
    setTimeLeft(computeTimeLeft(Date.now(), extensionDays));

    const timer = setInterval(() => {
      setTimeLeft(computeTimeLeft(Date.now(), extensionDays));
    }, 1000);

    return () => clearInterval(timer);
  }, [extensionDays]);

  return {
    timeLeft,
    baseTargetDate: BASE_TARGET_DATE,
    targetDate: getTargetDate(extensionDays),
    extensionDays,
  };
}
