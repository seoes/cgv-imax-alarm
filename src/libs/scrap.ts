import puppeteer from "puppeteer";
import { stringToDate } from "../utils/date";

export type Schedule = {
    date: Date;
    info: { time: string; seats: string }[];
}[];

export default async function scrapMovieDatesAndTimes(targetDate: string): Promise<Schedule | []> {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36");
    await page.goto("http://www.cgv.co.kr/ticket/?MOVIE_CD=20033175&MOVIE_CD_GROUP=20033175&THEATER_CD=0013", { waitUntil: "networkidle0" });

    const frames = page.frames();
    const board = frames.find((frame) => frame.url().includes("Reservation.aspx"));

    await board.waitForSelector("#date_list > ul > div");

    const dateArray = await board.$$eval(
        "#date_list li",
        (lis, targetDate) =>
            lis
                .filter((li) => !li.className.includes("dimmed"))
                .map((li) => li.getAttribute("date"))
                .filter(Boolean)
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
                const time = li.getAttribute("play_start_tm");
                const seats = li.querySelector("span.count")?.textContent;
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

// 페이지의 동적인 변화를 기다림
// await page.waitForNavigation({ waitUntil: "networkidle0" });

// 2. 용산아이파크몰 버튼 클릭
// await page.click('div.section-theater div.theater-area-list li.selected li[theater_cd="0013"] > a');

// 페이지의 동적인 변화를 기다림
// await page.waitForNavigation({ waitUntil: "networkidle0" });

// 3. 오펜하이머 클릭
// await page.click('div.section-movie div.movie-list li[movie_idx="87175"] > a');

// 페이지의 동적인 변화를 기다림
// await page.waitForNavigation({ waitUntil: "networkidle0" });

// 4. 존재하는 날짜 리스트 확인
// const dateList = await page.$$eval("div.section-date div.date-list li", (elements) => elements.map((element) => element.getAttribute("date")));

// console.log(dateList); // 존재하는 날짜 리스트 출력

// 브라우저 닫기
// console.log(content);
//http://www.cgv.co.kr/ticket/?MOVIE_CD=20033058&MOVIE_CD_GROUP=20033058&PLAY_YMD=20230728&THEATER_CD=0056&PLAY_START_TM=2500&AREA_CD=13&SCREEN_CD=003
//http://www.cgv.co.kr/ticket/?MOVIE_CD=20033175&MOVIE_CD_GROUP=20033175&THEATER_CD=0013
//http://ticket.cgv.co.kr/Reservation/Reservation.aspx?MOVIE_CD=20033175&MOVIE_CD_GROUP=20033175&PLAY_YMD=&THEATER_CD=0013&PLAY_NUM=&PLAY_START_TM=&AREA_CD=&SCREEN_CD=&THIRD_ITEM=&SCREEN_RATING_CD=
// <li class="press selected" data-index="2" movie_cd_group="20033175" movie_idx="87175" selectedmovietype="ALL"><a href="#" onclick="return false;" title="오펜하이머" alt="오펜하이머"><i class="cgvIcon etc age15">15</i><span class="text">오펜하이머</span><span class="sreader"></span></a></li>
// div.section-theater div.theater-select a.menu3 클릭 (상단 특별관 버튼)
// div.section-theater div.theater-area-list li.selected li[theater_cd="0013"] > a 클릭 (용산아이파크몰 버튼)
// div.section-movie div.movie-list li[movie_idx="87175"] > a 클릭 (오펜하이머)

// div.section-date div.date-list li[date="20230818"] 날짜 확인
// 존재하는 날짜 리스트 리턴(이후 원하는 날짜 발견하면 nodemailer 발사)

// div.section-date div.date-list li[date="20230818"] > a 클릭 (날짜 결정)
// div.section-time div.time-list li[play_start_tm="1700이상 2300이하"] > a (시간 결정)
// div#ticket_tnb a#tnb_step_btn_right 클릭(다음단계)

// div.ft_layer_popup div.ft a.btn_ok 클릭(관람등급 팝업 확인버튼 클릭)
// div.section-seat div.section-numberofpeople div#nopContainer  div#nop_group_adult li[data-count="3"] > a (사람수 3명)
// div.theater_minimap div#seats_list div.row(9번째~12번째) notavail이 아닌 것
// while(true) 22 -> 23(+1) -> 21(-2) -> 24(+3) -> 20(-4) -> 25 무한반복
// div#ticket_tnb a#tnb_step_btn_right 클릭(다음단계)

//input#cphoneNo에 01050589592 입력
//button#send 클릭

//input#custNm에 서도원 입력
//input#custBirthday에 990812 입력
//input#custSex에 1 입력
//button#frugal 클릭
//modal#frugal ul.btn-list 첫번째li button 클랙
