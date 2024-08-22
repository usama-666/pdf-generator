const express = require("express");
const path = require("path");

const app = express();
const pdfRoute = require("./routes/pdf.route");
const port = 4000 || 5000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
console.log(path.join(__dirname, "views"));

app.use("/api", pdfRoute);
app.get("/", (req, res) => {
    res.send("Serverer is running ");
});

app.listen(port, console.log("localhost listening on port " + port));
