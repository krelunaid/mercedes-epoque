import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { it } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function MonthCalendar({
  month,
  onMonth,
  start,
  end,
  onPick,
}: {
  month: Date;
  onMonth: (d: Date) => void;
  start: Date | null;
  end: Date | null;
  onPick: (d: Date) => void;
}) {
  const begin = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const finish = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: begin, end: finish });

  return (
    <div className="rounded-2xl bg-elevated p-4 shadow-[var(--shadow-card)]">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          className="grid size-10 place-items-center rounded-full hover:bg-cream/5"
          onClick={() => onMonth(addMonths(month, -1))}
          aria-label="Mese precedente"
        >
          <ChevronLeft className="size-4" />
        </button>
        <p className="font-display text-xl">{format(month, "MMMM yyyy", { locale: it })}</p>
        <button
          type="button"
          className="grid size-10 place-items-center rounded-full hover:bg-cream/5"
          onClick={() => onMonth(addMonths(month, 1))}
          aria-label="Mese successivo"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center text-[0.65rem] uppercase tracking-[0.16em] text-muted">
        {["L", "M", "M", "G", "V", "S", "D"].map((d, i) => (
          <div key={`${d}-${i}`} className="py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-y-1">
        {days.map((day) => {
          const inMonth = isSameMonth(day, month);
          const isStart = start && isSameDay(day, start);
          const isEnd = end && isSameDay(day, end);
          const inRange =
            start && end && isWithinInterval(day, { start, end }) && !isStart && !isEnd;
          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onPick(day)}
              className={cn(
                "relative mx-auto flex size-10 items-center justify-center rounded-full text-sm tabular-nums",
                !inMonth && "text-muted/35",
                inRange && "bg-gold/15 text-cream",
                (isStart || isEnd) && "bg-gold text-bg",
                inMonth && !isStart && !isEnd && !inRange && "text-cream hover:bg-cream/5",
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
