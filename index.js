const path = require("path");
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const apiRouter = require('./api.js');
const Player = require('./models/player.model');
require('dotenv').config();

const connectionURL = process.env.CONNECTION_URL;

connectToDatabase();
async function connectToDatabase() {
  try {
    await mongoose.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true });

    console.log('Connected to the database. 😌');
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
  }
}

app.set('view-engine', 'ejs');

// Set the cache control headers for static assets
// app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' }));

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));  

app.use(express.static('public', { setHeaders: setCustomHeaders }));

function setCustomHeaders(res, path, stat) {
  if (path.endsWith('.js')) {
    res.setHeader('Content-Type', 'text/javascript');
  }
}
app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.use('/api', apiRouter);

app.get('/player/:playerId', async (req, res) => {
  try {
    const playerId = req.params.playerId;
    console.log('Player ID from URL:', playerId);
    const player = await Player.findOne({ playerId });

    if (!player) {
      console.log('Player not found');
      return res.status(404).send('Player not found');
    }

    res.render('player.ejs', { player });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/players-profile', async (req, res) => {
  try {
    const players = await Player.find({});
    res.render('players-profile.ejs', { players });
  } catch (err) {
    console.error(err);
    res.status(500).send('<h1>Server error, Add your IP in the DB</h1>');
  }
});
app.get('/news', async (req, res) => {
  try {
    const headlines = await fetchHeadlinesFromDatabase(); // Fetch headlines directly from the collection
    res.render('news.ejs', { headlines });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
app.get('/games', (req, res) => {
  // You can add any necessary logic here before rendering the template
  try{
    res.render('games.ejs');
    }catch(err){
      console.error(err);
      res.status(500).send('Server error');
}});

async function fetchHeadlinesFromDatabase() {
  const connectionString = "mongodb+srv://walid:Walidd_1@cluster00.xmzizuz.mongodb.net/fifa";
  const settings = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  const client = new MongoClient(connectionString, settings);

  try {
    await client.connect();

    const db = client.db("fifa");
    const collection = db.collection("headlines");

    const headlines = await collection.find({}, { projection: { headline: 1 } }).toArray();

    return headlines;
  } finally {
    client.close();
  }

}


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('http://localhost:3000'));
