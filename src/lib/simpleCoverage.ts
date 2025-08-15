export const toMinutes = (hhmm: string) => {
  const [h, m] = (hhmm || "").split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

export const formatHM = (mins: number) => {
  const v = Math.max(0, mins);
  const h = Math.floor(v / 60), m = v % 60;
  return h > 0 ? `${h}h${m ? ` ${m}m` : ""}` : `${m}m`;
};

/**
 * Calcolo semplice "ore-uomo":
 * uncovered = (durataTurno * requiredOperators) - somma(durataSlot assegnati)
 */
export function computeUncoveredSimple(params: {
  shiftStart: string;
  shiftEnd: string;
  requiredOperators: number;
  slots: Array<{
    operatorId?: string | null;
    startTime?: string | null;
    endTime?: string | null;
  }>;
  slotTimes?: Record<string, { start?: string; end?: string }>;
  slotKeyPrefix?: string;
}) {
  const { shiftStart, shiftEnd, requiredOperators, slots, slotTimes, slotKeyPrefix = "" } = params;

  const shiftDur = Math.max(0, toMinutes(shiftEnd) - toMinutes(shiftStart));
  const totalRequired = shiftDur * Math.max(1, requiredOperators);
  const totalAssigned = slots.reduce((sum, slot, idx) => {
    if (!slot?.operatorId) return sum;
    const key = `${slotKeyPrefix}${idx}`;
    const start = slotTimes?.[key]?.start ?? slot.startTime ?? shiftStart;
    const end   = slotTimes?.[key]?.end   ?? slot.endTime   ?? shiftEnd;
    const dur = Math.max(0, toMinutes(end) - toMinutes(start));
    return sum + dur;
  }, 0);

  const uncoveredMin = Math.max(0, totalRequired - totalAssigned);
  return { uncoveredMin, totalRequired, totalAssigned, shiftDur };
}