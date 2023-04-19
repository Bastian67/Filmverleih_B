"use strict";

import Page from "../page.js";
import HtmlTemplate from "./page-edit.html";

/**
 * Klasse PageEdit: Stellt die Seite zum Anlegen oder Bearbeiten eines Films
 * zur Verfügung.
 */
export default class PageEditMovie extends Page {
    /**
     * Konstruktor.
     *
     * @param {App} app Instanz der App-Klasse
     * @param {Integer} editId ID des bearbeiteten Datensatzes
     */
    constructor(app, editId) {
        super(app, HtmlTemplate);

        // Bearbeiteter Datensatz
        this._editId = editId;

        this._dataset = {
            movieTitle: "",
            reggiseur: "",
            releaseDate: "",
            playtime: "",
        };

        // Eingabefelder
        this._movieTitleInput = null;
        this._reggiseurInput = null;
        this._releaseDateInput     = null;
        this._playtimeInput     = null;
    }

    /**
     * HTML-Inhalt und anzuzeigende Daten laden.
     *
     * HINWEIS: Durch die geerbte init()-Methode wird `this._mainElement` mit
     * dem <main>-Element aus der nachgeladenen HTML-Datei versorgt. Dieses
     * Element wird dann auch von der App-Klasse verwendet, um die Seite
     * anzuzeigen. Hier muss daher einfach mit dem üblichen DOM-Methoden
     * `this._mainElement` nachbearbeitet werden, um die angezeigten Inhalte
     * zu beeinflussen.
     *
     * HINWEIS: In dieser Version der App wird mit dem üblichen DOM-Methoden
     * gearbeitet, um den finalen HTML-Code der Seite zu generieren. In größeren
     * Apps würde man ggf. eine Template Engine wie z.B. Nunjucks integrieren
     * und den JavaScript-Code dadurch deutlich vereinfachen.
     */
    async init() {
        // HTML-Inhalt nachladen
        await super.init();

        // Bearbeiteten Datensatz laden
        if (this._editId) {
            this._url = `/movie/${this._editId}`;
            this._dataset = await this._app.backend.fetch("GET", this._url);
            this._title = `${this._dataset.movieTitle}`;
        } else {
            this._url = `/movie`;
            this._title = "Film hinzufügen";
        }

        // Platzhalter im HTML-Code ersetzen
        let html = this._mainElement.innerHTML;
        html = html.replace("$MOVIETITLE$", this._dataset.movieTitle);
        html = html.replace("$REGGISEUR$", this._dataset.reggiseur);
        html = html.replace("$RELEASEDATE$", this._dataset.releaseDate);
        html = html.replace("$PLAYTIME$", this._dataset.playtime);
        this._mainElement.innerHTML = html;

        // Event Listener registrieren
        let saveButton = this._mainElement.querySelector(".action.save");
        saveButton.addEventListener("click", () => this._saveAndExit());

        // Eingabefelder zur späteren Verwendung merken
        this._movieTitleInput = this._mainElement.querySelector("input.movieTitle");
        this._reggiseurInput = this.mainElement.querySelector("input.reggiseur");
        this._releaseDateInput     = this._mainElement.querySelector("input.releaseDate");
        this._playtimeInput     = this._mainElement.querySelector("input.playtime");
    }

    /**
     * Speichert den aktuell bearbeiteten Datensatz und kehrt dann wieder
     * in die Listenübersicht zurück.
     */
    async _saveAndExit() {
        // Eingegebene Werte prüfen
        this._dataset._id           = this._editId;
        this._dataset.movieTitle    = this._movieTitleInput.value.trim();
        this._dataset.reggiseur     = this._reggiseurInput.value.trim();
        this._dataset.releaseDate   = this._releaseDateInput.value.trim();
        this._dataset.playtime      = this._playtimeInput.value.trim();

        if (!this._dataset.movieTitle) {
            alert("Geben Sie erst ein Filmtitel ein.");
            return;
        }
        // Datensatz speichern
        try {
            if (this._editId) {
                await this._app.backend.fetch("PUT", this._url, {body: this._dataset});
            } else {
                await this._app.backend.fetch("POST", this._url, {body: this._dataset});
            }
        } catch (ex) {
            this._app.showException(ex);
            return;
        }

        // Zurück zur Übersicht
        location.hash = "#/";
    }
};
