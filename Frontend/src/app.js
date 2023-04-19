"use strict";

import Backend from "./backend.js";
import Router from "./router.js";
import "./app.css";

/**
 * Hauptklasse App: Steuert die gesamte Anwendung
 *
 * Diese Klasse erzeugt den Single Page Router zur Navigation innerhalb
 * der Anwendung und ein Datenbankobjekt zur Verwaltung der Filmliste.
 * Darüber hinaus beinhaltet sie verschiedene vom Single Page Router
 * aufgerufene Methoden, zum Umschalten der aktiven Seite.
 */
class App {
    /**
     * Konstruktor.
     */
    constructor() {
        // Datenbank-Klasse zur Verwaltung der Datensätze
        this.backend = new Backend();

        // Single Page Router zur Steuerung der sichtbaren Inhalte
        this.router = new Router([
            {
                url: "^/$",
                show: () => this._gotoList()
            },
            {
                url: "^/new/$",
                show: () => this._gotoNew()
            },
            {
                url: "^/edit/(.*)$",
                show: matches => this._gotoEdit(matches[1])
            },
            {
                url: "^/ratingList/$",
                show: () => this._gotoRatingList()
            },
            {
                url: "^/newRating/$",
                show: () => this._gotoNewRating()
            },
            {
                url: "^/editRating/(.*)$",
                show: matches => this._gotoEditRating(matches[1])
            },
            {
                url: "^/reservList/$",
                show: () => this._gotoReservList()
            },
            {
                url: "^/newReserv/$",
                show: () => this._gotoNewReserv()
            },
            {
                url: "^/editReserv/(.*)$",
                show: matches => this._gotoEditReserv(matches[1])
            },
            /*{
                url: ".*",
                show: () => this._gotoList()
            }*/
        ]);

        // Fenstertitel merken, um später den Name der aktuellen Seite anzuhängen
        this._documentTitle = document.title;

        // Von dieser Klasse benötigte HTML-Elemente
        this._pageCssElement = document.querySelector("#page-css");
        this._bodyElement = document.querySelector("body");
        this._menuElement = document.querySelector("#app-menu");
    }

    /**
     * Initialisierung der Anwendung beim Start. Im Gegensatz zum Konstruktor
     * der Klasse kann diese Methode mit der vereinfachten async/await-Syntax
     * auf die Fertigstellung von Hintergrundaktivitäten warten, ohne dabei
     * mit den zugrunde liegenden Promise-Objekten direkt hantieren zu müssen.
     */
    async init() {
        try {
            await this.backend.init();
            this.router.start();
        } catch (ex) {
            this.showException(ex);
        }
    }

    /**
     * Übersichtsseite anzeigen. Wird vom Single Page Router aufgerufen.
     */
    async _gotoList() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: PageList} = await import("./page-list/page-list.js");

            let page = new PageList(this);
            await page.init();
            this._showPage(page, "list");
        } catch (ex) {
            this.showException(ex);
        }
    }

    /**
     * Seite zum Anlegen eines neuen Filmes anzeigen.  Wird vom Single Page
     * Router aufgerufen.
     */
    async _gotoNew() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: PageEditMovie} = await import("./page-edit/page-edit.js");

            let page = new PageEditMovie(this);
            await page.init();
            this._showPage(page, "new");
        } catch (ex) {
            this.showException(ex);
        }
    }

    /**
     * Seite zum Bearbeiten eines Filmes anzeigen.  Wird vom Single Page
     * Router aufgerufen.
     *
     * @param {Number} id ID des zu bearbeitenden Films
     */
    async _gotoEdit(id) {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: PageEditMovie} = await import("./page-edit/page-edit.js");

            let page = new PageEditMovie(this, id);
            await page.init();
            this._showPage(page, "edit");
        } catch (ex) {
            this.showException(ex);
        }
    }


    /**
     * Übersichtsseite der verschiedenen Bewertungen anzeigen. Wird vom Single Page Router aufgerufen.
     */
    async _gotoRatingList() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: PageRatingList} = await import("./page-ratingList/page-ratingList.js");

            let page = new PageRatingList(this);
            await page.init();
            this._showPage(page, "ratingList");
        } catch (ex) {
            this.showException(ex);
        }
    }

    /**
     * Seite zum Anlegen einer neuen Bewertung anzeigen.  Wird vom Single Page
     * Router aufgerufen.
     */
    async _gotoNewRating() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: PageEditRate} = await import("./page-editRatingList/page-editRatingList.js");

            let page = new PageEditRate(this);
            await page.init();
            this._showPage(page, "rate");
        } catch (ex) {
            this.showException(ex);
        }
    }

    /**
     * Seite zum Bearbeiten einer Bewertung anzeigen.  Wird vom Single Page
     * Router aufgerufen.
     *
     * @param {Number} id ID der zu bearbeitenden Bewertung
     */
    async _gotoEditRating(id) {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: PageEditRate} = await import("./page-editRatingList/page-editRatingList.js");

            let page = new PageEditRate(this, id);
            await page.init();
            this._showPage(page, "editRate");
        } catch (ex) {
            this.showException(ex);
        }
    }

    /**
     * Übersichtsseite der verschiedenen Reservierungen anzeigen. Wird vom Single Page Router aufgerufen.
     */
    async _gotoReservList() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: PageReservation} = await import("./page-reservation/page-reservation.js");

            let page = new PageReservation(this);
            await page.init();
            this._showPage(page, "reservationList");
        } catch (ex) {
            this.showException(ex);
        }
    }

    /**
     * Seite zum Anlegen einer neuen Reservierung anzeigen.  Wird vom Single Page
     * Router aufgerufen.
     */
    async _gotoNewReserv() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: PageEditReservation} = await import("./page-reservationEdit/page-reservationEdit.js");

            let page = new PageEditReservation(this);
            await page.init();
            this._showPage(page, "reservation");
        } catch (ex) {
            this.showException(ex);
        }
    }

     /** Seite zum Bearbeiten einer Reservierung anzeigen.  Wird vom Single Page
     * Router aufgerufen.
     *
     * @param {Number} id ID der zu bearbeitenden Bewertung
     */
    async _gotoEditReserv(id) {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: PageEditReservation} = await import("./page-reservationEdit/page-reservationEdit.js");

            let page = new PageEditReservation(this, id);
            await page.init();
            this._showPage(page, "editReservation");
        } catch (ex) {
            this.showException(ex);
        }
    }

    /**
     * Interne Methode zum Umschalten der sichtbaren Seite.
     *
     * @param  {Page} page Objekt der anzuzeigenden Seiten
     * @param  {String} name Name zur Hervorhebung der Seite im Menü
     */
    _showPage(page, name) {
        // Fenstertitel aktualisieren
        document.title = `${this._documentTitle} – ${page.title}`;

        // Stylesheet der Seite einfügen
        this._pageCssElement.innerHTML = page.css;

        // Aktuelle Seite im Kopfbereich hervorheben
        this._menuElement.querySelectorAll("li").forEach(li => li.classList.remove("active"));
        this._menuElement.querySelectorAll(`li[data-page-name="${name}"]`).forEach(li => li.classList.add("active"));

        // Sichtbaren Hauptinhalt austauschen
        this._bodyElement.querySelector("main")?.remove();
        this._bodyElement.appendChild(page.mainElement);
    }

    /**
     * Hilfsmethode zur Anzeige eines Ausnahmefehlers. Der Fehler wird in der
     * Konsole protokolliert und als Popupmeldung angezeigt.
     *
     * @param {Object} ex Abgefangene Ausnahme
     */
    showException(ex) {
        console.error(ex);

        if (ex.message) {
            alert(ex.message)
        } else {
            alert(ex.toString());
        }
    }
}

/**
 * Anwendung starten
 */
window.addEventListener("load", async () => {
    let app = new App();
    await app.init();
});
