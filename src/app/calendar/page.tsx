import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

import { cn } from "@/lib/utils";

dayjs.extend(isoWeek);

/**
 *  Idea
 *   - Partial pre rendering to display calendar with current month
 *   - revalidate on new month
 *   - content of days is server rendered with suspense
 */
export default function CalendarPage() {
  // Creating moments are expensive, same for dayjs?
  const now = dayjs();
  const firstInMonth = now.startOf("month");
  const lastInMonth = now.endOf("month");

  const daysInMonth = [];

  // Pad start with end of previous month
  if (firstInMonth.isoWeekday() > 0) {
    for (let i = 1; i < firstInMonth.isoWeekday(); i++) {
      daysInMonth.push(firstInMonth.isoWeekday(i));
    }
  }

  const nDaysInMonth = firstInMonth.daysInMonth();
  for (let i = 0; i < nDaysInMonth; i++) {
    daysInMonth.push(firstInMonth.add(i, "day"));
  }

  // Pad end with start of next month
  if (lastInMonth.isoWeekday() < 7) {
    for (let i = lastInMonth.isoWeekday() + 1; i <= 7; i++) {
      daysInMonth.push(lastInMonth.isoWeekday(i));
    }
  }

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-8 sm:items-start">
        <div className="text-2xl font-bold">{now.format("MMMM")}</div>
        <div className="grid grid-cols-7">
          {daysInMonth.slice(0, 7).map((d) => {
            const weekday = d.format("ddd");
            return (
              <div key={weekday} className="p-4 font-bold text-gray-500">
                {weekday}
              </div>
            );
          })}
          {daysInMonth.map((d) => {
            const isDateInOtherMonth = d.month() !== now.month();
            const isToday = d.isSame(now, "date");

            const dateLabel = d.format("YYYY-MM-DD");
            return (
              <div
                key={dateLabel}
                className={cn(
                  `col-start-${d.isoWeekday()} col-end-${d.isoWeekday() + 1} p-4`,
                  {
                    "opacity-50": isDateInOtherMonth,
                    "text-blue-500": isToday,
                  },
                )}
              >
                {dateLabel}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
