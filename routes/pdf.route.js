const express = require("express");
const path = require("path");
const puppeteer = require("puppeteer-core");
const chromium = require("chrome-aws-lambda");
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
    // const data = { data: "usama riaz " };

    // res.render("medication", data, async (err, html) => {
    //     if (err) {
    //         console.log(err);
    //         return res
    //             .status(400)
    //             .json({ message: "Error occurred in rendering ejs " });
    //     }
    // });
    const filePath = path.join(__dirname, "Medication.pdf");
    console.log(filePath);
    // const html = ejs.render(template);
    // browser = await chromium.puppeteer.launch({
    //     args: chromium.args,
    //     defaultViewport: chromium.defaultViewport,
    //     executablePath: await chromium.executablePath,
    //     headless: chromium.headless,
    //     ignoreHTTPSErrors: true,
    // });
    // const browser = await puppeteer.launch({ args: ["--no-sandbox"] });

    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    // await page.goto("http://localhost:4000/api/load", {
    //     waitUntil: "networkidle2",
    // });

    console.log(`${req.protocol}://${req.hostname}/api/load`);
    await page.goto(`${req.protocol}://${req.hostname}/api/load`, {
        waitUntil: "networkidle2",
    });

    // await page.setContent(html, { waitUntil: "networkidle0" });
    await page.pdf({ path: filePath, format: "A4" });

    await browser.close();

    // Send the PDF to the client
    res.download(filePath, `Medication.pdf`, (err) => {
        if (err) {
            return res.status(500).json({
                message: ` Error in downloading pdf:  ${err}`,
            });
        } else {
            console.log("pdf generated ", filePath);
            fs.unlinkSync(filePath);
        }
    });
    // res.render("medication", data, async (err, html) => {
    //     if (err) {
    //         console.log(err);
    //         return res
    //             .status(400)
    //             .json({ message: "Error occurred in rendering ejs " });
    //     }

    // });
});
module.exports = router;
