import fs from "fs";
import { Schedule } from "./scrap";
import { dateToString } from "../utils/date";

export default function setDate(result: Schedule) {
    result[result.length - 1].date.setDate(result[result.length - 1].date.getDate() + 1);
    const newDate = dateToString(result[result.length - 1].date);
    fs.readFile(".env", "utf8", function (err, data) {
        if (err) throw err;

        // 기존의 DATE 값을 찾아 새로운 값으로 변경합니다.
        const result = data.replace(/(DATE=)(.*)/, `$1${newDate}`);

        // 변경된 내용을 다시 .env 파일에 씁니다.
        fs.writeFile(".env", result, "utf8", function (err) {
            if (err) throw err;
            console.log("DATE value has been updated!");
        });
    });
    return String(newDate);
}
