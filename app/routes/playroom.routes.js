module.exports = (app) => {
    const Playroom = require('../controllers/playroom.controller')
    app.post('/jodo', Playroom.createSession)
    app.get('/jodo/room/:sessionId', Playroom.findSession)
    app.put('/jodo/:sessionId', Playroom.updateSession)
    app.put('/jodo/player/:sessionId', Playroom.updateSecondPlayer)
}