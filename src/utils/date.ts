export function stringToDate(dateString: string): Date {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return new Date(`${year}-${month}-${day}`);
}

export function dateToString(date: Date): string {
    return String(date.getFullYear()) + "0" + String(date.getMonth() + 1) + String(date.getDate());
}

export function getDayOfWeek(day: number): string {
    return ["일", "월", "화", "수", "목", "금", "토"][day];
}
