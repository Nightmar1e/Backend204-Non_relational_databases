const cheerio = require("cheerio");
const axios = require("axios");
const mongoose = require("mongoose");
require("dotenv").config();

const connectionURL = process.env.CONNECTION_URL;

mongoose.connect(connectionURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const playerSchema = new mongoose.Schema({
  playerId: String,
  playerImg: String,
  name: String,
  nationality: String,
  nationalityImg: String,
  overallRating: String,
  potentialRating: String,
  preferredPositions: [String],
  age: Number,
  team: String,
  teamImg: String,
});

const Player = mongoose.model("Player", playerSchema, "players"); 

async function scrapePlayersData(url, pagesLeft) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const playerElements = $("tbody tr");
    const playersData = [];

    playerElements.each(function () {
      const playerId = $(this).attr("data-playerid");

      if (playerId) {
        const playerImg = $(this).find("a.link-player img").attr('src');
        const name = $(this).find("a.link-player").text();
        const nationality = $(this).find(".link-nation").attr("title");
        const nationalityImg = $(this).find(".link-nation img").attr("src");
        const overallRating = $(this).find(".badge.badge-dark.rating.r1, .badge.badge-dark.rating.r2, .badge.badge-dark.rating.r3, .badge.badge-dark.rating.r4").eq(0).text();
        const potentialRating = $(this).find(".badge.badge-dark.rating.r1, .badge.badge-dark.rating.r2, .badge.badge-dark.rating.r3, .badge.badge-dark.rating.r4").eq(1).text();
        const preferredPositions = $(this).find(".badge.position").map((i, el) => $(el).text()).get();
        const age = parseInt($(this).find('[data-title="Age"]').text().trim(), 10);
        const team = $(this).find('img.team').attr('alt').replace(" FIFA 23", "");
        const teamImg = $(this).find('.link-team img').attr('src');

        playersData.push({
          playerId,
          playerImg,
          name,
          nationality,
          nationalityImg,
          overallRating,
          potentialRating,
          preferredPositions,
          age,
          team,
          teamImg,
        });
      }
    });

    for (const playerInfo of playersData) {
      const playerDocument = new Player(playerInfo);
      await playerDocument.save();
    }

    const nextLink = $(".ml-auto a");
    if (pagesLeft > 1 && nextLink.length > 0) {
      const nextPageUrl = new URL(nextLink.attr("href"), url).toString();
      await scrapePlayersData(nextPageUrl, pagesLeft - 1);
    } else {
      console.log("Data saved to MongoDB Atlas successfully!");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

const totalPagesToScrape = 30;
const url = "https://www.fifaindex.com/players/";

(async () => {
  try {
    await scrapePlayersData(url, totalPagesToScrape);
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    mongoose.connection.close();
  }
})();