const express = require("express");
const puppeteer = require("puppeteer");
const app = express();

const port = process.env.PORT || 4000;

app.get("/gen-pdf", async (req, res) => {
    try {
        const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
        const page = await browser.newPage();
        await page.setContent("<h1>Hello World</h1>");
        await page.pdf({ path: "test.pdf", format: "A4" });
        await browser.close();

        res.json({ message: "Generating PDF" });
    } catch (error) {
        res.json({ message: "Error generating PDF" });
    }
});
app.listen(port, console.log("localhost listening on port " + port));
