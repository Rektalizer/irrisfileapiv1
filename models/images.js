const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Image = mongoose.model("Image", new Schema({filename: String, contentType: String, uploadDate: Date}), "fs.images");

module.exports = Image;