
const Playroom = require('../models/playroom.models')

// Create and Save a new Room
exports.createSession = (req, res) => {
  const room = new Playroom({
    sessionId: req.body.sessionId,
    data: req.body.data,
    level: req.body.level,
    player1: {
      name: req.body.player1.name,
      score: req.body.player1.score
    },
    player2: {
      name: req.body.player2.name,
      score: req.body.player2.score
    }
  })
  room.save()
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Some error occured while creating the Room.'
      })
    })
}

exports.findSession = (req, res) => {
  Playroom.find({ 'sessionId': req.params.sessionId })
    .then(session => {
      res.send(session)
    })
    .catch(err => {
      if (err.king === 'ObjectId') {
        return res.status(404).send({
          message: 'Recipe not found with ID' + req.params.userName
        })
      }
      return res.status(500).send({
        message: 'Error retrieving Recipe with ID' + req.params.userName
      })
    })
}


exports.updateSession = (req, res) => {
  Playroom.updateMany(
    { 'sessionId': req.params.sessionId },
    { 
        "$set": {
            "data": req.body.data,
            "player1.score": req.body.player1.score,
            "player2.score": req.body.player2.score
        }
    }, { new: true },
    function(err,doc) {
        res.send(doc)
    }
)
}

exports.updateSecondPlayer = (req, res) => {
  Playroom.updateMany(
    { 'sessionId': req.params.sessionId },
    { 
        "$set": {
            "player2.name": req.body.player2.name
        }
    }, { new: true },
    function(err,doc) {
        res.send(doc)
    }
)
}