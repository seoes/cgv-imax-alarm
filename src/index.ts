import express from "express";
import scrapMovieDatesAndTimes from "./libs/scrap";
import "dotenv/config";
import setDate from "./libs/sync";
import telegramBot from "./libs/telegram";
import { createMovieScheduleMessage } from "./utils/message";

let date = process.argv[2] || process.env.DATE;
const PORT = process.env.PORT;

const app = express();

telegramBot.startBot();

async function loopTask() {
    setInterval(async () => {
        const timestamp = new Date();
        console.log(`${timestamp.toLocaleString()} - Searching schedule after ${date}...`);

        const result = await scrapMovieDatesAndTimes(date);
        if (result.length === 0) {
            console.log(`${timestamp.toLocaleString()} - There's nothing new, Let's try again`);
            return;
        }

        result.forEach((data) => console.log(data));

        const message = createMovieScheduleMessage(result);

        try {
            telegramBot.sendAlarm(message);
            date = setDate(result);
        } catch (error) {
            console.error(`Failed to send alarm: ${error}`);
        }
    }, 10000);
}

loopTask();

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
});
