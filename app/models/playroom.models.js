const Player = require('./player.models.js')

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PlayRoomSchema = new Schema({
    sessionId: {type: String},
    data: {type: String},
    layout: {type: String},
    flag: {type: String},
    level: {type: String},
    player1: Player,
    player2: Player
}, {
    timestamps: true
})

module.exports = mongoose.model('PlayRoom', PlayRoomSchema);