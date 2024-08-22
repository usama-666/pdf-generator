const express = require("express");
const path = require("path");
const puppeteer = require("puppeteer");
const router = express.Router();
const fs = require("fs");

router.route("/load").get(async (req, res) => {
    try {
        const data = { data: "usama riaz fnkjsanfjksdfjnsdkj " };
        res.render("medication", data);
    } catch (error) {
        console.log(error);
    }
});

router.route("/gen-pdf").get(async function (req, res) {
    const filePath = path.join(__dirname, "Medication.pdf");
    console.log(filePath);

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
            executablePath:
                process.env.CHROME_EXECUTABLE_PATH ||
                "/usr/bin/chromium-browser", // Update this path if necessary
        });

        let urlLocal = `${req.protocol}://${req.hostname}/api/load`;
        const page = await browser.newPage();
        await page.goto(urlLocal, { waitUntil: "networkidle2" });
        const pdf = await page.pdf({ format: "A4" });
        await browser.close();

        // Send the PDF to the client
        res.contentType("application/pdf");
        res.send(pdf);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: `Error in generating PDF: ${error}`,
        });
    }
});

module.exports = router;
