const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = PlayerSchema = new Schema({
    name: { type: String },
    score: { type: Number }
})