require("dotenv").config();
const upload = require("./routes/upload");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");
const connection = require("./db");
const express = require("express");
const app = express();
const Image = require("./models/images")

let gfs;
connection();

const conn = mongoose.connection;
conn.once("open", function () {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("images");
});

app.use("/api/v1/files", upload);

// media routes
app.get("/api/v1/files/:filename", async (req, res) => {
    try {
        const file = await gfs.files.findOne({ filename: req.params.filename });
        const readStream = gfs.createReadStream(file.filename);
        readStream.pipe(res);
    } catch (error) {
        res.send("not found");
    }
});

app.get("/api/v1/files/", async (req, res) => {
    try {
        const file = await gfs.files.find();
        const readStream = gfs.createReadStream(file);
        readStream.pipe(res);
    } catch (error) {
        res.send("not found");
    }
});

// app.get("/api/v1/files", async (req, res) => {
//     try {
//         const file = await gfs.files.find();
//         const readStream = gfs.createReadStream(file);
//         readStream.pipe(res);
//     } catch (error) {
//         res.send("not found");
//     }
// });

// app.get("/api/v1/files", (req, res) => {
//     Image.find()
//         .then(data => {
//             res.send(data);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occurred while retrieving files."
//             });
//         });
// })


app.delete("/api/v1/files/:filename", async (req, res) => {
    try {
        await gfs.files.deleteOne({ filename: req.params.filename });
        res.send("success");
    } catch (error) {
        console.log(error);
        res.send("An error occured.");
    }
});

const port = process.env.PORT || 8080;
app.listen(port);
