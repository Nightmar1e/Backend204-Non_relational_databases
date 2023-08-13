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
  height: String,
  weight: String,
  preferredFoot: String,
  birthDate: String,
  playerWorkRate: String,
  weakFoot: Number,
  skillMoves: Number,
  valueEuro: String,
  valueDollar: String,
  valuePound: String,
  wageEuro: String,
  wageDollar: String,
  wagePound: String,
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

        const playerDetailUrl = `https://www.fifaindex.com/player/${playerId}/${name.toLowerCase().replace(/\s/g, '-')}/fifa23/`;


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
          playerDetailUrl,
        });
      }
    });

for (const playerInfo of playersData) {
    const playerDocument = new Player(playerInfo);
    await playerDocument.save();

    try {
        const detailResponse = await axios.get(playerInfo.playerDetailUrl);
        const $detail = cheerio.load(detailResponse.data);

        const height = $detail('p:contains("Height") .data-units-metric').text();
        const weight = $detail('p:contains("Weight") .data-units-metric').text();
        const preferredFoot = $detail('p:contains("Preferred Foot") .float-right').text();
        const birthDate = $detail('p:contains("Birth Date") .float-right').text();
        const age = parseInt($detail('p:contains("Age") .float-right').text(), 10);
        const preferredPositions = $detail('p:contains("Preferred Positions") .badge.position').map((i, el) => $(el).text()).get();
        const playerWorkRate = $detail('p:contains("Player Work Rate") .float-right').text();
        const weakFoot = $detail('p:contains("Weak Foot") .star .fas.fa-star').length;
        const skillMoves = $detail('p:contains("Skill Moves") .star .fas.fa-star').length;
        const valueEuro = $detail('p.data-currency-euro:contains("Value") .float-right').text();
        const valueDollar = $detail('p.data-currency-dollar:contains("Value") .float-right').text();
        const valuePound = $detail('p.data-currency-pound:contains("Value") .float-right').text();
        const wageEuro = $detail('p.data-currency-euro:contains("Wage") .float-right').text();
        const wageDollar = $detail('p.data-currency-dollar:contains("Wage") .float-right').text();
        const wagePound = $detail('p.data-currency-pound:contains("Wage") .float-right').text();

        await Player.updateOne({ playerId: playerInfo.playerId }, {
            $set: {
                height,
                weight,
                preferredFoot,
                birthDate,
                age,
                preferredPositions,
                playerWorkRate,
                weakFoot,
                skillMoves,
                valueEuro,
                valueDollar,
                valuePound,
                wageEuro,
                wageDollar,
                wagePound,
            }
        });
    } catch (error) {
        console.error(`Error scraping player ${playerInfo.name}: ${error.message}`);
    }
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
