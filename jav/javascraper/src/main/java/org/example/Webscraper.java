package org.example;

import org.bson.Document;
import com.mongodb.ConnectionString;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.MongoCollection;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.util.ArrayList;
import java.util.List;

public class Webscraper {
    public static void main(String[] args) throws Exception {
        String url = "https://www.bbc.com/sport/football/";

        org.jsoup.nodes.Document htmlDocument = Jsoup.connect(url).get();

        Elements headlines = htmlDocument.select("h3.gs-c-promo-heading__title");

        List<Document> scrapedData = new ArrayList<>();

        for (Element headline : headlines) {
            String headlineText = headline.text();
            Document document = new Document("headline", headlineText);
            scrapedData.add(document);
        }

        String connectionString = "mongodb+srv://walid:Walidd_1@cluster00.xmzizuz.mongodb.net/test";
        MongoClientSettings settings = MongoClientSettings.builder()
                .applyConnectionString(new ConnectionString(connectionString))
                .build();

        try (MongoClient mongoClient = MongoClients.create(settings)) {
            MongoDatabase database = mongoClient.getDatabase("fifa");
            MongoCollection<Document> collection = database.getCollection("headlines");

            collection.insertMany(scrapedData);

            System.out.println("Scraped data inserted into MongoDB collection");
        } catch (Exception e) {
            System.err.println("Error inserting data into MongoDB: " + e.getMessage());
        }
    }
}