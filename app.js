const express = require("express");
const path = require("path");
require("dotenv").config();
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// Set view engine
app.set("view engine", "ejs");

// Static folders
app.use(express.static(path.join(__dirname))); // for css/, assets/, script.js, index.html
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Home page route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ MP3 Downloader page
app.get("/mp3converter&downloader", (req, res) => {
    res.render("index"); // this loads views/index.ejs
});

// ✅ MP3 convert POST route
app.post("/convert-mp3", async (req, res) => {
    const videoId = req.body.videoID;

    if (!videoId || videoId.trim() === "") {
        return res.render("index", {
            success: false,
            message: "Please enter a video ID",
        });
    }

    try {
        const response = await fetch(
            `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`,
            {
                method: "GET",
                headers: {
                    "x-rapidapi-key": process.env.API_KEY,
                    "x-rapidapi-host": process.env.API_HOST,
                },
            }
        );

        const data = await response.json();

        if (data.status === "ok") {
            return res.render("index", {
                success: true,
                song_title: data.title,
                song_link: data.link,
            });
        } else {
            return res.render("index", {
                success: false,
                message: data.msg,
            });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.render("index", {
            success: false,
            message: "Something went wrong",
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
