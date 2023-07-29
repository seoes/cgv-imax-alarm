import TelegramBot from "node-telegram-bot-api";
import fs from "fs";
import path from "path";

if (process.env.TELEGRAM_BOT_TOKEN === undefined) throw new Error("Environmental variable TELEGRAM_BOT_TOKEN is not defined");
const token: string = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const jsonPath = path.join(__dirname, "../../data/chatId.json");

function startBot() {
    bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;
        const username = msg.from?.username;

        console.log(chatId, username);

        fs.readFile(jsonPath, (err, data) => {
            if (err) throw err;
            const json = JSON.parse(data.toString());
            if (!json.some((user: { chatId: number }) => user.chatId === chatId)) {
                json.push({ chatId, username });
                fs.writeFile(jsonPath, JSON.stringify(json, null, 2), (err) => {
                    if (err) throw err;
                    console.log("The file has been saved!");
                });
            }
        });
    });
}

async function sendAlarm(msg: string) {
    const data = fs.readFileSync(jsonPath);
    const json = JSON.parse(data.toString());
    console.log("sending messages..");
    try {
        const promises = json.map((user: { chatId: number }) => {
            console.log(user);
            return bot.sendMessage(user.chatId, msg);
        });

        await Promise.all(promises);
    } catch (error) {
        console.error(`Failed to send alarm: ${error}`);
        fs.writeFile(jsonPath, JSON.stringify(json, null, 2), (err) => {
            if (err) throw err;
            console.log("The file has been saved!");
        });
    }
}

export default {
    startBot,
    sendAlarm,
};
