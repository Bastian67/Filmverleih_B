"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung von Bewertungen. Diese Klasse implementiert die
 * eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
 * Die Bewertungen werden der Einfachheit halber in einer MongoDB abgelegt.
 */
export default class AddRatingService {
    /**
     * Konstruktor.
     */
    constructor() {
        this._ratings = DatabaseFactory.database.collection("ratings");
    }

    /**
     * Bewertungen suchen. Unterstützt wird lediglich eine ganz einfache Suche,
     * bei der einzelne Felder auf exakte Übereinstimmung geprüft werden.
     * Zwar unterstützt MongoDB prinzipiell beliebig komplexe Suchanfragen.
     * Um das Beispiel klein zu halten, wird dies hier aber nicht unterstützt.
     *
     * @param {Object} query Optionale Suchparameter
     * @return {Promise} Liste der gefundenen Bewertungen
     */
    async search(query) {
        let cursor = this._ratings.find(query, {
            sort: {
                movieTitleRate: 1,
            }
        });

        return cursor.toArray();
    }

    /**
     * Speichern einer neuen Bewertung.
     *
     * @param {Object} rating Zu speichernde Bewertungsdaten
     * @return {Promise} Gespeicherte Bewertungsdaten
     */
    async create(rating) {
        rating = rating || {};

        let newRating = {
            movieTitleRate: rating.movieTitleRate || "",
            rate:  rating.rate  || "",
        };

        let result = await this._ratings.insertOne(newRating);
        return await this._ratings.findOne({_id: result.insertedId});
    }

    /**
     * Auslesen einer vorhandenen Bewertungen anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Bewertung
     * @return {Promise} Gefundene Bewertungsdaten
     */
    async read(id) {
        let result = await this._ratings.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Aktualisierung einer Bewertung, durch Überschreiben einzelner Felder
     * oder des gesamten Bewertungsobjekts (ohne die ID).
     *
     * @param {String} id ID der gesuchten Bewertung
     * @param {[type]} rate Zu speichernde Bewertungsdaten
     * @return {Promise} Gespeicherte Bewertungsdaten oder undefined
     */
    async update(id, rating) {
        let oldRating = await this._ratings.findOne({_id: new ObjectId(id)});
        if (!oldRating) return;

        let updateDoc = {
            $set: {},
        }

        if (rating.movieTitleRate) updateDoc.$set.movieTitleRate = rating.movieTitleRate;
        if (rating.rate)  updateDoc.$set.rate  = rating.rate;

        await this._ratings.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._ratings.findOne({_id: new ObjectId(id)});
    }

    /**
     * Löschen einer Bewertung anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Bewertung
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async delete(id) {
        let result = await this._ratings.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}
