import puppeteer from "puppeteer";
import { stringToDate } from "../utils/date";

export type Schedule = {
    date: Date;
    info: {
        time: string;
        seats: string;
    }[];
}[];

export default async function scrapMovieDatesAndTimes(targetDate: string): Promise<Schedule | []> {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36");
    await page.goto("http://www.cgv.co.kr/ticket/?MOVIE_CD=20033175&MOVIE_CD_GROUP=20033175&THEATER_CD=0013", { waitUntil: "networkidle0" });

    const frames = page.frames();
    const board = frames.find((frame) => frame.url().includes("Reservation.aspx"));

    if (board === undefined) return [];

    await board.waitForSelector("#date_list > ul > div");

    const dateArray = await board.$$eval(
        "#date_list li",
        (lis, targetDate) =>
            lis
                .filter((li) => !li.className.includes("dimmed"))
                .map((li) => li.getAttribute("date"))
                .filter((date): date is string => date !== null)
                .filter((date) => parseInt(date) >= parseInt(targetDate[0])),
        [targetDate]
    );

    const result: Schedule = [];

    for (const date of dateArray) {
        // 버튼 클릭
        await board.click(`#date_list > ul > div > li[date='${date}'] > a`);
        // 변화 대기
        await board.waitForSelector('div#ticket_loading[style="display: none;"]');

        const timeAndSeats = await board.$$eval("#ticket > div.steps > div.step.step1 > div.section.section-time > div.col-body > div.time-list > div.content > div > ul > li", (lis) =>
            lis.map((li) => {
                const time = li.getAttribute("play_start_tm")!;
                const seats = li.querySelector("span.count")?.textContent!;
                return { time, seats };
            })
        );

        result.push({
            date: stringToDate(date),
            info: timeAndSeats,
        });
    }

    browser.close();

    return result;
}
