const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");
const ejs = require("ejs");
const fs = require("fs");
const app = express();

const port = process.env.PORT || 4000;

app.get("/gen-pdf", async (req, res) => {
    console.log("inside rew");
    try {
        const templatePath = path.join(__dirname, "medication.ejs");
        fs.readFile(templatePath, "utf-8", async (err, template) => {
            if (err) {
                res.status(500).json({ message: "Error reading template" });
                return;
            }
            const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
            const filePath = path.join(__dirname, "Medication.pdf");
            console.log(filePath);
            const renderedHtml = ejs.render(template);
            const page = await browser.newPage();
            await page.setContent(renderedHtml, { waitUntil: "networkidle0" });
            await page.pdf({ path: filePath, format: "A4" });

            await browser.close();

            // Send the PDF to the client
            res.download(filePath, `Medication.pdf`, (err) => {
                if (err) {
                    res.status(500).json({ message: err });
                } else {
                    console.log("pdf generated", filePath);
                    fs.unlinkSync(filePath);
                }
            });
        });
    } catch (error) {
        res.json({ message: "Error generating PDF" });
    }
});
app.listen(port, console.log("localhost listening on port " + port));
