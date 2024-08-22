const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");
const router = express.Router();
const fs = require("fs");
router.get("/gen-pdf", async function (req, res) {
    const data = { data: "usama riaz " };
    res.render("medication", data, async (err, html) => {
        if (err) {
            console.log(err);
            return res
                .status(400)
                .json({ message: "Error occurred in rendering ejs " });
        }
        const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
        const filePath = path.join(__dirname, "Medication.pdf");
        console.log(filePath);
        // const html = ejs.render(template);
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });
        await page.pdf({ path: filePath, format: "A4" });

        await browser.close();

        // Send the PDF to the client
        res.sendFile(filePath, `Medication.pdf`, (err) => {
            if (err) {
                return res.status(500).json({
                    message: ` Error in downloading pdf:  ${err}`,
                });
            } else {
                console.log("pdf generated ", filePath);
                fs.unlinkSync(filePath);
            }
        });
    });
});
module.exports = router;
