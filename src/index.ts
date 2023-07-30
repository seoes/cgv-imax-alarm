import express from "express";
import scrapMovieDatesAndTimes from "./libs/scrap";
import "dotenv/config";
import setDate from "./libs/sync";
import telegramBot from "./libs/telegram";
import { createMovieScheduleMessage } from "./utils/message";

if (process.argv[2] === undefined && process.env.DATE === undefined) throw new Error("There's no date value");
let date: string = process.argv[2] || process.env.DATE!;

if (process.env.INTERVAL_TIME === undefined) throw new Error("There's no INTERVAL TIME value");
const INTERVAL_TIME = parseInt(process.env.INTERVAL_TIME);
const PORT = process.env.PORT;

const app = express();

telegramBot.startBot();

task();

setInterval(task, INTERVAL_TIME);

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
});

async function task() {
    const timestamp = new Date();
    console.log(`${timestamp.toLocaleString()} - Searching schedule after ${date}...`);

    const result = await scrapMovieDatesAndTimes(date);

    if (result.length === 0) {
        console.log(`${timestamp.toLocaleString()} - There's nothing new, Let's try again`);
        return;
    }

    result.forEach((data) => console.log(data));

    const message: string = createMovieScheduleMessage(result);

    try {
        telegramBot.sendAlarm(message);
        date = setDate(result);
    } catch (error) {
        console.error(`Failed to send alarm: ${error}`);
    }
}
