import { getDayOfWeek } from "./date";
import { Schedule } from "../libs/scrap";

export function createMovieScheduleMessage(result: Schedule) {
    let str = "";

    str += "오펜하이머 용산 아이맥스 예매오픈\n\n\n";

    result.forEach((day) => {
        str += `${day.date.getFullYear()}/`;
        str += `${day.date.getMonth() + 1}/`;
        str += `${day.date.getDate()} `;
        str += `(${getDayOfWeek(day.date.getDay())})\n\n`;

        day.info.forEach((play) => {
            str += `${play.time.substring(0, 2)}:`;
            str += `${play.time.substring(2, 4)} `;
            str += `(잔여: ${play.seats})\n`;
        });

        str += "\n";
    });

    return str;
}
