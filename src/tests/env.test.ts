import "dotenv/config";

describe("Environmental variables", () => {
    it("should have Date defined", () => expect(process.env.DATE).toBeDefined());
    it("should have TELEGRAM_BOT_TOKEN defiend", () => expect(process.env.TELEGRAM_BOT_TOKEN).toBeDefined());
    it("should have PORT defined", () => expect(process.env.PORT).toBeDefined());
    it("should have INTERVAL_TIME defined", () => expect(process.env.INTERVAL_TIME).toBeDefined());
});
