import dayjs from "dayjs";

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
  if (firstInMonth.day() > 0) {
    for (let i = 0; i < firstInMonth.day(); i++) {
      daysInMonth.push(firstInMonth.day(i));
    }
  }

  const nDaysInMonth = firstInMonth.daysInMonth();
  for (let i = 0; i < nDaysInMonth; i++) {
    daysInMonth.push(firstInMonth.add(i, "day"));
  }

  // Pad end with start of next month
  if (lastInMonth.day() < 6) {
    for (let i = 0; i < 6 - lastInMonth.day(); i++) {
      daysInMonth.push(lastInMonth.day(i));
    }
  }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="grid grid-cols-7">
          {daysInMonth.map((d) => (
            <div
              className={`col-start-${d.day() + 1} col-end-${d.day() + 2} p-4`}
            >
              {d.format("YYYY-MM-DD")}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
