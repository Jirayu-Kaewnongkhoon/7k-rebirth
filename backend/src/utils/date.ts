export function getWeekday(date: Date) {
    const weekday = (date.getDay() + 6) % 7;
    return weekday;
}

export function getEndDate(startDate: Date) {
    const end = new Date(startDate);
    end.setUTCDate(startDate.getUTCDate() + 13);
    return end;
}

export function getCalendarRange(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);

    const start = new Date(firstDay);
    start.setDate(firstDay.getDate() - firstDay.getDay());

    // force 6 แถว = 42 วันเสมอ
    const end = new Date(start);
    end.setDate(start.getDate() + 41);

    return { start, end };
}