export const toMinutes = (hhmm: string) => {
  const [h, m] = (hhmm || "").split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

export const formatHM = (mins: number) => {
  const v = Math.max(0, mins);
  const h = Math.floor(v / 60), m = v % 60;
  return h > 0 ? `${h}h${m ? ` ${m}m` : ""}` : `${m}m`;
};

export function uncoveredForSlot({
  slot,
  shiftStart,
  shiftEnd,
  slotTime,
}: {
  slot: {
    operatorId?: string | null;
    startTime?: string | null;
    endTime?: string | null;
  };
  shiftStart: string;
  shiftEnd: string;
  slotTime?: { start?: string; end?: string };
}): number {
  if (!slot?.operatorId) return 0;
  const start = slotTime?.start ?? slot.startTime ?? shiftStart;
  const end   = slotTime?.end   ?? slot.endTime   ?? shiftEnd;
  const slotDur = Math.max(0, toMinutes(end) - toMinutes(start));
  const fullDur = Math.max(0, toMinutes(shiftEnd) - toMinutes(shiftStart));
  return Math.max(0, fullDur - slotDur);
}

export function totalUncoveredMinutes({
  shiftStart,
  shiftEnd,
  slots,
  slotTimes,
  slotKeyPrefix = "",
}: {
  shiftStart: string;
  shiftEnd: string;
  slots: Array<{
    operatorId?: string | null;
    startTime?: string | null;
    endTime?: string | null;
  }>;
  slotTimes?: Record<string, { start?: string; end?: string }>;
  slotKeyPrefix?: string;
}): number {
  return slots.reduce((total, slot, idx) => {
    const key = `${slotKeyPrefix}${idx}`;
    const uncovered = uncoveredForSlot({
      slot,
      shiftStart,
      shiftEnd,
      slotTime: slotTimes?.[key],
    });
    return total + uncovered;
  }, 0);
}