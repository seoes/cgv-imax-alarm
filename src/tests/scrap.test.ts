import scrapMovieDatesAndTimes from "../libs/scrap";

describe("Scraping theater data", () => {
    it("Access and Scrap", async () => {
        const targetDate = "20230821";
        const result = await scrapMovieDatesAndTimes(targetDate);
        expect(result).toBeTruthy();
    }, 20000);
});
