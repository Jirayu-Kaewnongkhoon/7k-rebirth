export const dateFormat = (dateStr: string) => {
    return new Intl.DateTimeFormat("th-TH", {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(new Date(dateStr))
}