export function getWeekRange(page: number) {
    const now = new Date();

    const day = now.getUTCDay();
    const diff = now.getUTCDate() - day + (day === 0 ? -6 : 1);

    const start = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        diff
    ));
    start.setUTCDate(start.getUTCDate() - (page - 1) * 7);

    const nextWeek = new Date(start);
    nextWeek.setUTCDate(start.getUTCDate() + 7);

    return { start, nextWeek };
}

export function getWeekday(dateStr: string) {
    const date = new Date(dateStr);
    const weekday = (date.getDay() + 6) % 7;
    return weekday;
}