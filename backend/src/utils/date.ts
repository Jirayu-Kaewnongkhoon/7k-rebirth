export function getWeekday(dateStr: string) {
    const date = new Date(dateStr);
    const weekday = (date.getDay() + 6) % 7;
    return weekday;
}

export function getEndDate(startDateStr: string) {
    const [y, m, d] = startDateStr.split("-").map(Number);
    const start = new Date(Date.UTC(y, m - 1, d));
    const end = new Date(start);
    end.setUTCDate(start.getUTCDate() + 13);
    return {
        startDate: start,
        endDate: end,
    }
}