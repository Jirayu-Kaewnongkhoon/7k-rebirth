export function getWeekday(date: Date) {
    const weekday = (date.getDay() + 6) % 7;
    return weekday;
}

export function getEndDate(startDate: Date) {
    const end = new Date(startDate);
    end.setUTCDate(startDate.getUTCDate() + 13);
    return end;
}