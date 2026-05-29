const COUNTDOWN_START = new Date('2025-05-25T00:00:00').getTime();
const TARGET_DATE = new Date('2026-07-24T00:00:00').getTime();

export function getMarriageProbability(
  daysLeft: number,
  mitigation: number
): number {
  const totalMs = TARGET_DATE - COUNTDOWN_START;
  const remainingMs = Math.max(daysLeft, 0) * 24 * 60 * 60 * 1000;
  const raw = 100 - (remainingMs / totalMs) * 100;
  return Math.min(98, Math.max(8, Math.round(raw - mitigation)));
}

export function getProbabilityDescriptor(percent: number): string {
  if (percent >= 85) return 'Critical exposure';
  if (percent >= 65) return 'Elevated likelihood';
  if (percent >= 40) return 'Moderate probability';
  return 'Within operational tolerance';
}
