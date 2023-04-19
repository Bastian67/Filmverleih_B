"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung von Reservierungen. Diese Klasse implementiert die
 * eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
 * Die Reservierungen werden der Einfachheit halber in einer MongoDB abgelegt.
 */
export default class AddReservation {
    /**
     * Konstruktor.
     */
    constructor() {
        this._reservations = DatabaseFactory.database.collection("reservations");
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
        let cursor = this._reservations.find(query, {
            sort: {
                movieTitle_reserv: 1,
            }
        });

        return cursor.toArray();
    }

    /**
     * Speichern einer neuen Reservierung.
     *
     * @param {Object} reserv Zu speichernde Reservierugnsdaten
     * @return {Promise} Gespeicherte Reservierungsdaten
     */
    async create(reserv) {
        reserv = reserv || {};

        let newReserv = {
            firstName:          reserv.firstName            || "",
            secondName:         reserv.secondName           || "",
            email:              reserv.email                || "",
            movieTitle_reserv:  reserv.movieTitle_reserv    || "",
            date:               reserv.date                 || "",
        };

        let result = await this._reservations.insertOne(newReserv);
        return await this._reservations.findOne({_id: result.insertedId});
    }

    /**
     * Auslesen einer vorhandenen Reservierung anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Reservierung
     * @return {Promise} Gefundene Reservierungsdaten
     */
    async read(id) {
        let result = await this._reservations.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Aktualisierung einer Reservierung, durch Überschreiben einzelner Felder
     * oder des gesamten Reservierungsobjekts (ohne die ID).
     *
     * @param {String} id ID der gesuchten Reservierung
     * @param {[type]} reserv Zu speichernde Reservierungsdaten
     * @return {Promise} Gespeicherte Reservierungsdaten oder undefined
     */
    async update(id, reserv) {
        let oldReserv = await this._reservations.findOne({_id: new ObjectId(id)});
        if (!oldReserv) return;

        let updateDoc = {
            $set: {},
        }

        if (reserv.firstName)           updateDoc.$set.firstName            = reserv.firstName;
        if (reserv.secondName)          updateDoc.$set.secondName           = reserv.secondName;
        if (reserv.email)               updateDoc.$set.email                = reserv.email;
        if (reserv.movieTitle_reserv)   updateDoc.$set.movieTitle_reserv    = reserv.movieTitle_reserv;
        if (reserv.date)                updateDoc.$set.date                 = reserv.date;

        await this._reservations.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._reservations.findOne({_id: new ObjectId(id)});
    }

    /**
     * Löschen einer Reservierung anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Reservierung
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async delete(id) {
        let result = await this._reservations.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}
