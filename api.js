const express = require('express');
const router = express.Router();
const Player = require('./models/player.model');

router.get('/players', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 20;
    const skip = (page - 1) * perPage;

    const players = await Player.find({}).skip(skip).limit(perPage);
    res.json(players);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/players-profile', async (req, res) => {
  try {
    const players = await Player.find({});
    res.render('players-profile.ejs', { players });
  } catch (err) {
    console.error(err);
    res.status(500).send('<h1>Server error, Add your IP in the DB</h1>');
  }
});






module.exports = router;
