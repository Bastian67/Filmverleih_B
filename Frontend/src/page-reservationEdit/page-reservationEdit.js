"use strict";

import Page from "../page.js";
import HtmlTemplate from "./page-reservationEdit.html";

/**
 * Klasse PageEdit: Stellt die Seite zum Anlegen oder Bearbeiten einer Adresse
 * zur Verfügung.
 */
export default class PageEditReservation extends Page {
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
            firstName: "",
            secondName: "",
            email: "",
            movieTitle_reserv: "",
            date:"",
        };

        // Eingabefelder
        this._firstNameInput = null;
        this._secondNameInput = null;
        this._emailInput     = null;
        this._movieTitle_reservInput     = null;
        this._dateInput = null;
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
            this._url = `/reservation/${this._editId}`;
            this._dataset = await this._app.backend.fetch("GET", this._url);
            this._title = `${this._dataset.movieTitle}`;
        } else {
            this._url = `/reservation`;
            this._title = "Reservierung hinzufügen";
        }

        // Platzhalter im HTML-Code ersetzen
        let html = this._mainElement.innerHTML;
        html = html.replace("$FIRSTNAME$", this._dataset.firstName);
        html = html.replace("$SECONDNAME$", this._dataset.secondName);
        html = html.replace("$EMAIL$", this._dataset.email);
        html = html.replace("$MOVIETITLE_RESERV$", this._dataset.movieTitle_reserv);
        html = html.replace("$DATE$", this._dataset.date);
        this._mainElement.innerHTML = html;

        // Event Listener registrieren
        let saveButton = this._mainElement.querySelector(".action.save");
        saveButton.addEventListener("click", () => this._saveAndExit());

        // Eingabefelder zur späteren Verwendung merken
        this._firstNameInput                = this._mainElement.querySelector("input.firstName");
        this._secondNameInput               = this._mainElement.querySelector("input.secondName");
        this._emailInput                    = this._mainElement.querySelector("input.email");
        this._movieTitle_reservInput        = this._mainElement.querySelector("input.movieTitle_reserv");
        this._dateInput                     = this._mainElement.querySelector("input.date");
    }

   /**
 * Füllt die Eingabefelder mit den Werten aus dem aktuellen Datensatz.
 */
_fillInputs() {
    this._firstNameInput.value           = this._dataset.firstName || "";
    this._secondNameInput.value          = this._dataset.secondName || "";
    this._emailInput.value               = this._dataset.email || "";
    this._movieTitle_reservInput.value   = this._dataset.movieTitle_reserv || "";
    this._dateInput.value                = this._dataset.date || "";
}

/**
 * Speichert den aktuell bearbeiteten Datensatz und kehrt dann wieder
 * in die Listenübersicht zurück.
 */
async _saveAndExit() {
    // Eingegebene Werte prüfen
    this._dataset._id           = this._editId;
    this._dataset.firstName     = this._firstNameInput.value.trim();
    this._dataset.secondName    = this._secondNameInput.value.trim();
    this._dataset.email         = this._emailInput.value.trim();
}
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
        }

        // Zurück zur Übersicht
        location.hash = "#/reservation";
    

