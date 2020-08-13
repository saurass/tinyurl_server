require("dotenv").config();
const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const tinyUrlRoutes = require("./routes/tinyurl");

// Boot
const app = express();
app.set('port', process.env.PORT || 4000);

// Database
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("bravo database connected ........")
})

// App config
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// Auth Routes
app.use("/api", authRoutes);
app.use("/api/tinyurl", tinyUrlRoutes);
app.use((req, res) => {
    return res.status(404).json({ error: "Not Found" })
});

// Start server
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    console.log("running server...", port);
});