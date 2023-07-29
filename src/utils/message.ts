import { getDayOfWeek } from "./date";
import { Schedule } from "../libs/scrap";

export function createMovieScheduleMessage(result: Schedule): string {
    let str = "";

    str += "오펜하이머 용아맥 오픈\n\n\n";

    result.forEach((day) => {
        str += `${day.date.getFullYear()}/`;
        str += `${day.date.getMonth() + 1}/`;
        str += `${day.date.getDate()} `;
        str += `(${getDayOfWeek(day.date.getDay())})\n\n`;

        day.info.forEach((info) => {
            str += `${info.time.substring(0, 2)}:`;
            str += `${info.time.substring(2, 4)} `;
            str += `(잔여: ${info.seats})\n`;
        });

        str += "\n";
    });

    return str;
}
