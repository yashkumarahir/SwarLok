// Required packages 
const express = require("express");
const fetch = require("node-fetch");
const path = require("path");
require("dotenv").config();

// Create the express server 
const app = express();

// Server port number 
const PORT = process.env.PORT || 3000;

// Set template engine 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ Serve Static Files from Multiple Folders
app.use(express.static('public')); // For MP3 Downloader Page (style.css)
app.use(express.static(path.join(__dirname, 'css')));    // For SwarLok styles
app.use(express.static(path.join(__dirname, 'img')));    // For images like .svg/.png
app.use(express.static(path.join(__dirname, 'assets'))); // For background.jpg etc.
app.use(express.static(__dirname));                      // For script.js in root

// Needed to parse HTML form data for POST requests 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html")); // SwarLok Homepage
});

app.get("/signup", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/login.html");
});

app.get("/home", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/dashboard", (req, res) => {
    res.sendFile(__dirname + "/dashboard.html");
});


app.get("/mp3coverter&downloader-swarlok", (req, res) => {
    res.render("index"); // EJS MP3 Downloader Page
});


app.post("/ytconvert-mp3", async (req, res) => {
    const videoId = req.body.videoID;

    if (!videoId) {
        return res.render("index", { success: false, message: "Please enter a video ID" });
    }

    try {
        const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`, {
            method: "GET",
            headers: {
                "x-rapidapi-key": process.env.API_KEY,
                "x-rapidapi-host": process.env.API_HOST
            }
        });

        const fetchResponse = await fetchAPI.json();
        console.log(fetchResponse);

        if (fetchResponse.status === "ok") {
            return res.render("index", {
                success: true,
                song_title: fetchResponse.title,
                song_link: fetchResponse.link
            });
        } else {
            return res.render("index", { success: false, message: fetchResponse.msg });
        }

    } catch (err) {
        console.error(err);
        return res.render("index", { success: false, message: "Something went wrong!" });
    }
});

// Start the server 
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});