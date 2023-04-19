"use strict"

import { MongoClient } from "mongodb";

/**
 * Singleton-Klasse zum Zugriff auf das MongoDB-Datenbankobjekt, ohne dieses
 * ständig als Methodenparameter durchreichen zu müssen. Stattdessen kann
 * einfach das Singleton-Objekt dieser Klasse importiert und das Attribut
 * `mongodb` oder `database` ausgelesen werden.
 */
class DatabaseFactory {
    /**
     * Ersatz für den Konstruktor, damit aus dem Hauptprogramm heraus die
     * Verbindungs-URL der MongoDB übergeben werden kann. Hier wird dann
     * auch gleich die Verbindung hergestellt.
     *
     * @param {String} connectionUrl URL-String mit den Verbindungsdaten
     */
    async init(connectionUrl) {
        // Datenbankverbindung herstellen
        this.client = new MongoClient(connectionUrl);
        await this.client.connect();
        this.database = this.client.db("movie_library");

        await this._createDemoData();
    }

    /**
     * Hilfsmethode zum Anlegen von Demodaten. Würde man so in einer
     * Produktivanwendung natürlich nicht machen, aber so sehen wir
     * wenigstens gleich ein paar Daten.
     */
    async _createDemoData() {
        let movies = this.database.collection("movies");
        let ratings = this.database.collection("ratings");
        let reservations = this.database.collection("reservations");

        if (await movies.estimatedDocumentCount() === 0) {
            movies.insertMany([
                {
                    movieTitle: "Avatar 2",
                    reggiseur: "James Cameron",
                    releaseDate: "14. Dezember 2022",
                    playtime: "3:12",
                },
                {
                    movieTitle: "John Wick: Kapitel 4",
                    reggiseur: "Chad Stahelski",
                    releaseDate: "23. März 2023",
                    playtime: "2:49",
                },
            ]);
        }

        if (await ratings.estimatedDocumentCount() === 0) {
            ratings.insertMany([
                {
                    movieTitleRate: "Avatar 2",
                    rate: "Der Film ist echt gut",
                },
                {
                    movieTitleRate: "John Wick: Kapitel 4",
                    rate: "Sehr spannend und würde den Film nochmal schauen",
                }
            ]);
        }

        if (await reservations.estimatedDocumentCount() === 0) {
            reservations.insertMany([
                {
                    firstName: "Hans",
                    secondName: "Peter",
                    email: "hans.peter.de",
                    movieTitle_reserv: "Avatar 2",
                    date: "16.04.2023",
                }
            ]);
        }
    }

}

export default new DatabaseFactory();
